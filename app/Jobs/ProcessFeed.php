<?php

namespace App\Jobs;

use App\Models\Feed;
use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Feeds;
use App\SDocument;
use App\Sender;
use App\Models\Item;

class ProcessFeed implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $feed;

    /**
     * Create a new job instance.
     *
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
        $doc = new SDocument(0);
        $doc->keep_images = true;

        $result_doc = new SDocument(0, 'periodical');
        $result_doc->send_as_book = false;
        $result_doc->setTitle($this->feed->title);
        $result_doc->keep_images = true;

        $sources = $this->feed->sources();
        $source_errors = 0;                    // if equal to the number of sources, Periodical is considered as failed
        $warnings = [];                        // placeholder for all warning messages
        $total_items_added = 0;                // count items in the whole job. If zero, don't send MOBI, nothing to send.

        foreach ($sources as $i => $source) {
            $feed = Feeds::make($source->url, true);

            if ($feed->error()) {
                $source_errors++;
                $warnings[] = 'Failed to read RSS at ' . $source->url;
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

            foreach ($articles as $i => $article) {

                // take care of "&amp;" substrings in the feed items' urls
                $article_url = html_entity_decode($article->get_permalink());

                // make sure this item was not processed previously. Skip if it was.
                $item_sent = Item::where('url', $article_url)->first();
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
                    'source_id' => $source->id,
                    'url' => $article_url,
                    'title' => $article->get_title()
                ];

                // Add new page after each entry except the last one (we'll place the periodical's footer there instead)
                if ($i < count($articles) - 1) {
                    $result_doc->addHtml('<div style="page-break-after:always"></div>');
                }
                Log::debug('item added.', ['title' => $doc->title]);
            }

            $total_items_added += $items_in_source;

            // clear up memory
            unset($articles);
            $feed->__destruct();
            unset($feed);
        }

        if (count($sources) <= $source_errors) {
            Log::error('Too many errors in the feed ' . $this->feed->title);
            exit(1);
        }

        // Write mobi file
        $result_doc->addHtml(env('FEED_FOOTER_HTML') . '</body></html>');
        if (!$result_doc->writeTempHtml(false, false)) {
            Log::error("Can\'t write temp file", ['feed' => $this->feed->title]);
            exit(2);
        }
        $mobi_filename = $result_doc->saveMobi();
        $result_doc->deleteTempFiles();
        if ($mobi_filename === false) {
            Log::error("saveMobi returned false", ['feed' => $this->feed->title]);
            exit(3);
        } else Log::info('Mibi file is ready', ['filename' => $mobi_filename]);

        $sender = new Sender();
        $file_added = $sender->addFile($mobi_filename);
        if (!$file_added) {
            Log::error($sender->getLastError(), ['feed' => $this->feed->title]);
            exit(4);
        }

        $subs = Subscription::where('feed_id', $this->feed->id)->where('status', Subscription::ACTIVE)->get();
        foreach ($subs as $sub) {
            $sender->send($sub->user_id);
        }

        // Finally, update the 'last_sent' value
        $dt = new DateTime;
        $this->feed->last_sent = $dt->format('m-d-y H:i:s');
        $this->feed->save();

        // save articles delivered to subscribers in DB Items
        foreach ($sent_items_array as $item_sent) {
            $item = new Item;
            $item->title = $item_sent['title'];
            $item->source_id = $item_sent['source_id'];
            $item->url = $item_sent['url'];
            $item->save();
        }

    }
}
