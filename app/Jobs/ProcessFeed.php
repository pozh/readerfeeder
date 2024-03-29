<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Spatie\Activitylog\Models\Activity;
use Feeds;

use App\Models\Feed;
use App\Models\Item as FeedItem;
use App\SDocument;


class ProcessFeed implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $feed;

    /**
     * Create a new job instance.
     *
     * @param App\Models\Feed $feed
     * @return void
     */
    public function __construct(Feed $feed)
    {
        $this->feed = $feed;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->feed->status = Feed::PROCESSING;
        $this->feed->save();

        activity('processing')
            ->on($this->feed)
            ->log('Started');

        $doc = new SDocument(0);
        $doc->keep_images = true;

        $result_doc = new SDocument(0,'periodical');
        $result_doc->send_as_book = false;
        $result_doc->setTitle($this->feed->title);
        $result_doc->keep_images = true;

        $sources = $this->feed->sources()->get();
        $source_errors = 0;                    // if equal to the number of sources, Periodical is considered as failed
        $warnings = [];                        // placeholder for all warning messages
        $total_items_added = 0;                // count items in the whole job. If zero, don't send MOBI, nothing to send.
        $sent_items_array = [];                // Articles processed

        foreach ($sources as $i => $source) {
            $feed = Feeds::make($source->url, true);

            if ($feed->error()) {
                $source_errors++;
                $warnings[] = 'Failed to read RSS at ' . $source->url;
                activity('processing')
                    ->on($source)
                    ->by($this->feed)
                    ->withProperties(['url' => $source->url])
                    ->log('Source error');
                continue;
            }
            $articles = $feed->get_items(0, $source->count);
            if (!(count($articles) > 0)) {
                $source_errors++;
                $warnings[] = 'Empty RSS at' . $source->url;
                continue;
            }

            $lang = $feed->get_language();
            if ($lang && $lang != 'en') $result_doc->language = $lang;

            $items_in_source = 0;

            // don't initialize section until you're sure there is at least 1 item in the source.
            $feed_title_placed = false;

            foreach ($articles as $j => $article) {

                // take care of "&amp;" substrings in the feed items' urls
                $article_url = html_entity_decode($article->get_permalink());

                // make sure this item was not processed previously. Skip if it was.
                $item_sent = FeedItem::where('url', $article_url)->first();
                if ($item_sent) continue;

                $doc->setTitle($article->get_title());
                if (!$doc->setUrl($article_url)) {
                    Log::debug("Can't set url", ['url' => $article_url]);
                    continue;
                }
                if (!$doc->grabHtml()) {
                    Log::debug("Can't grab html", ['url' => $article_url]);
                    continue;
                }

                // Check for "Stop Words" preventing sending of trial reminders some sites may have (paywall)
                if (strpos($doc->getHtml(), '-day allowance') > 0) {
                    Log::debug("Paywall or trial", ['url' => $article_url]);
                    continue;
                }

                if (!$feed_title_placed) {
                    // source title -> section title in the result doc
                    $feed_title = $feed->get_title();
                    if (strpos($feed_title, 'The Economist: ') !== FALSE)
                        $feed_title = str_replace('The Economist: ', '', $feed_title);
                    $result_doc->addEntry($feed_title);
                    $feed_title_placed = true;
                }

                $doc->prepareHtml(true, true);
                $result_doc->addEntry($doc->title, $doc->getHtml(), $article_url);
                $items_in_source++;

                /**
                 * save item url in the log to prevent its processing in the next delivery
                 * Here we'll only save it in an array.
                 * Save to DB at the very end of the processing routine, once everything else is done.
                 * */
                $sent_items_array[] = [
                    'feed_id' => $this->feed->id,
                    'url' => $article_url,
                    'title' => $article->get_title()
                ];

                // Add new page after each entry except the last one (we'll place the periodical's footer there instead)
                if ($j < count($articles) - 1) {
                    $result_doc->addHtml('<div style="page-break-after:always"></div>');
                }
                Log::debug('item added.', ['title' => $doc->title]);
            }

            $total_items_added += $items_in_source;

            // clear up memory
            unset($articles);
            unset($feed);
        }

        if (count($sources) <= $source_errors) {
            // TODO: save the following report somewhere in the DB,
            // So admin can see what happened witht the failed fee.
            Log::debug('Too many errors in the feed ' . $this->feed->title, [
                'source count' => count($sources),
                'errors' => $source_errors,
                'warnings' => $warnings
            ]);
            $this->failed(new \Exception('Too many errors in the feed'));
        }

        // Generate mobi file only if there is at least one subscriber for this feed
        if ($this->feed->subscribers()->count() > 0) {
            // Write mobi file
            $result_doc->addHtml(env('FEED_FOOTER_HTML') . '</body></html>');
            if (!$result_doc->writeTempHtml(false, false)) {
                $this->failed(new \Exception('Can not write temp file'));
            }
            $mobi_filename = $result_doc->saveMobi();
            $result_doc->deleteTempFiles();
            if ($mobi_filename === false) {
                $this->failed(new \Exception('saveMobi returned false'));
            } else Log::info('Mobi file is ready', ['filename' => $mobi_filename]);

            $file_size = filesize($mobi_filename);
            if ($file_size > env('MAX_FILESIZE')) {
                $this->failed(new \Exception(
                    sprintf('Mobi file %s is too large (%sM)',
                        $mobi_filename, floor($file_size / 1048576))
                ));
            }

            // Send mobi to subscribers
            activity('sender')
                ->on($this->feed)
                ->withProperties(['file' => $mobi_filename])
                ->log('Send Job dispatched');
            dispatch(new SendFeed($this->feed, $mobi_filename));
        }

        // Save processed articles in our DB to ignore them during the next delivery
        foreach ($sent_items_array as $item_info) {
            $item = new FeedItem;
            $item->title = $item_info['title'];
            $item->feed_id = $item_info['feed_id'];
            $item->url = $item_info['url'];
            $item->save();
        }

        activity('processing')
            ->performedOn($this->feed)
            ->withProperties(['items' => count($sent_items_array)])
            ->log('Finished successfully');
    }

    public function failed($exception)
    {
        $msg = $exception->getMessage();
        activity('processing')
            ->on($this->feed)
            ->log('Process failed. ' . $msg);
    }
}
