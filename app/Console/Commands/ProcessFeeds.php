<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

use SDocument;

class ProcessFeeds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'process:feeds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process the feeds';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // skip 0 or more records processed by previously runned instance of this script
        $skip_jobs = get_user_meta(1, 'cron_periodicals_skip', true);
        $skip_jobs = ($skip_jobs > 0) ? $skip_jobs : 0;
        update_user_meta(1, 'cron_periodicals_skip', $skip_jobs + $jobs_per_run);

        // Find all periodicals that must be shipped soon
        $query = 'SELECT p.*, m.meta_value as plan FROM sender_periodicals as p
          LEFT JOIN wp_usermeta as m ON m.user_id=p.user_id
          WHERE p.active=1 AND m.meta_key="plan" AND m.meta_value="premium"
          ORDER BY p.p_id LIMIT ' . $skip_jobs . ', ' . $jobs_per_run;

        $jobs = $wpdb->get_results($query, OBJECT);


        // if we've reached the end of the periodicals table, start over
        if (!is_array($jobs) || !count($jobs) > 0) {
            // write non-zero "skip" number because we don't exit here, but
            update_user_meta(1, 'cron_periodicals_skip', $jobs_per_run);
            echo 'No active periodicals found, start over! ' . PHP_EOL;

            // Find all periodicals that must be shipped soon
            $query = 'SELECT p.*, m.meta_value as plan FROM sender_periodicals as p
			  LEFT JOIN wp_usermeta as m ON m.user_id=p.user_id
			  WHERE p.active=1 AND m.meta_key="plan" AND m.meta_value="premium"
              ORDER BY p.p_id ASC LIMIT 0, ' . $jobs_per_run;

            $jobs = $wpdb->get_results($query, OBJECT);
        }


        echo PHP_EOL . PHP_EOL . '<pre>[' . date('F j, Y, g:i a') . '] Starting new cron. ' . count($jobs) . ' jobs' . PHP_EOL;
        echo '------------------------------------------------' . PHP_EOL;
        //echo 'Query: ' . $query . PHP_EOL;

        // rss source texts processor
        $doc = new SDocument($job->user_id);

        $skipped_jobs = array();
        $run_jobs = array();


        // Process all periodicals, one by one.
        foreach ($jobs as $job) {
            if (strpos($job->settings, 'send_as_book') === false)
                $send_as_book = false;
            else $send_as_book = true;


            // Set timezone for all date functions used below.
            $user_timezone = get_user_meta($job->user_id, 'timezone', true);
            if ($user_timezone == '')
                $user_timezone = sprintf('%d', SENDER_USER_TIMEZONE);
            date_default_timezone_set(zone_name($user_timezone));

            $user_time = time();

            $job_start_time = $user_time;
            $info_str = '----------------------------------- ' . PHP_EOL .
                'Processing ' . $job->title . ' job (' . $job->period . ') for user ' . $job->user_id . PHP_EOL;
            $info_str .= sprintf('Time zone: %s. Time: %s' . PHP_EOL, $user_timezone, date('F j, G:i'));

            // Find out the timestamps for current month, week, day. GMT
            $day_start = strtotime('today, midnight');
            $week_start = strtotime('sunday, midnight');
            if (date('w') > 0) $week_start -= 86400 * 7;
            $month_start = mktime(0, 0, 0, date('m'), 1, date('Y'));


            //////////////////////////////////////////////
            // so, is it time to process this job yet?
            //////////////////////////////////////////////
            $run_this = false;
            $user_hours = (int)date('G');
            $user_weekday = (int)date('w');
            $user_day = (int)date('j');

            $last_sent_time = 0;    // save this variable because we'll save in database day_start or week_start or month_start time, depending on job->period

            if ($job->last_sent > 0)
                $info_str .= 'Last sent: ' . date('F j, Y', $job->last_sent) . PHP_EOL;
            else
                $info_str .= 'Never sent' . PHP_EOL;
            $info_str .= 'User time: ' . date('F j, Y, G:i') . ', ';

            switch ($job->period) {
                case 'daily':
                    $info_str .= 'schedule: ' . $job->schedule_time . PHP_EOL;
                    if (($user_hours - $job->schedule_time >= 0) && ($user_hours - $job->schedule_time < 2))
                        $run_this = true;
                    // don't run the job if it was executed today
                    if ($job->last_sent == $day_start)
                        $run_this = false;
                    $last_sent_time = $day_start;

                    // for digest type
                    $digest_timelimit = $user_time - 86400;
                    break;
                case 'weekly':
                    $info_str .= 'schedule: ' . $job->schedule_day . 'th day - ' . $job->schedule_time . ' hour' . PHP_EOL;
                    if (($user_weekday == $job->schedule_day) && ($user_hours - $job->schedule_time >= 0) && ($user_hours - $job->schedule_time < 2))
                        $run_this = true;
                    // don't run the job if it was ran less than 4 days ago.
                    if ($job->last_sent == $week_start)
                        $run_this = false;
                    $last_sent_time = $week_start;

                    // for digest type
                    $digest_timelimit = $user_time - 86400 * 7;
                    break;
                case 'monthly':
                    $the_day = ($job->schedule_day > date('t') - 1) ? date('t') - 1 : $job->schedule_day; // jobs scheduled for 31 of Feb must be processed on Feb, 28th.
                    $info_str .= 'schedule: ' . $the_day . 'th day, ' . $job->schedule_time . ' hour' . PHP_EOL;
                    if (($user_day == $the_day) && ($user_hours - $job->schedule_time >= 0) && ($user_hours - $job->schedule_time < 2))
                        $run_this = true;
                    if ($job->last_sent == $month_start)
                        $run_this = false;
                    $last_sent_time = $month_start;

                    // for digest type
                    $digest_timelimit = $user_time - 86400 * 31;
                    break;
                default:
                    break;
            }

            // @TODO: remove me. Testing new periodicals subsystem
            // if( $job->user_id == 1 )
            // 	$run_this = false;

            if ($run_this) {
                $run_jobs[] = $job->p_id;
                echo $info_str . PHP_EOL;
            } else {
                sender_log('Job "' . $job->p_id . ' - ' . $job->title . '" for user ' . $job->user_id . ' skipped. User_hours = ' . $user_hours . ', Schedule = ' . $job->schedule_time);
                $skipped_jobs[] = $job->p_id;
                continue;
            }


            //////////////////////////////////////////////
            //              RUN THE JOB                 //
            //////////////////////////////////////////////

            sender_log('* Process Periodical # ' . $job->p_id . ' for user ' . $job->user_id);
            sender_log('* Title: ' . $job->title);

            $result_doc = new SDocument($job->user_id, 'periodical');   // result text (which we'll send to reader) receiver
            $result_doc->setBookFormat((strpos($job->settings, 'send_as_book') === false) ? false : true);
            $result_doc->setTitle($job->title);
            $doc->keep_images = (strpos($job->settings, 'noimages') === false) ? true : false; // yes, we'll get rid of them in $doc

            $result_doc_free = new SDocument($job->user_id, 'periodical');   // result text (which we'll send to reader) receiver
            $result_doc_free->setBookFormat((strpos($job->settings, 'send_as_book') === false) ? false : true);
            $result_doc_free->setTitle($job->title, ' - Free');


            // process the job (RSS TYPE)
            if ($job->type == 'rss') {

                // extract "emergency" language (2-symbol) from the periodical's title
                if (preg_match("/\(([a-zA-Z][a-zA-Z])\)/", $job->title, $matches) == 1) {
                    $backup_language = strtolower($matches[1]);
                } else {
                    $backup_language = 'en';
                }

                // prepare the list of source feed URLS
                $sources = explode(PHP_EOL, $job->sources);
                $source_errors = 0;       // if this number will be equal to the number of sources, I should consider the Periodical as not sent.
                $warnings = '';        // collect warning messages for sources in this var. We;ll save it in DB for informing the user.
                $job_items_count = 0;  // count items in the whole job. If there will be no items, don't send MOBI, report (not as error) to user on his page.

                // limit the total number of items in periodical.
                $max_feed_items = 10000; // no limit until total number of items in periodical is resonable.
                $desired_total_items = 0;

                foreach ($sources as $i => $source) {
                    echo "Checking $source for number of items" . PHP_EOL;
                    $source_limit = PERIODICAL_RSS_ITEMS;
                    preg_match("/([^\[]+)(\[([0-9]+)\])? *(\[([a-zA-Z\, ]+)\])?/", $source, $matches);
                    if ((int)$matches[3] > 0)
                        $source_limit = (int)$matches[3];
                    $desired_total_items += $source_limit;
                }

                // New limit for each feed = PERIODICAL_MAX_ITEMS / number of rss feeds in periodical.
                if ($desired_total_items > PERIODICAL_MAX_ITEMS) {
                    $sources_number = $i + 1;
                    $max_feed_items = floor(PERIODICAL_MAX_ITEMS / $sources_number);
                }

                // Process all sources in the periodical
                foreach ($sources as $i => $source) {

                    // Kill cron job if out of time.
                    if (time() - $script_start_time > PERIODICAL_MAX_EXECUTION_TIME) {
                        wp_mail('pozhilov@gmail.com', 'Error in Periodical', 'Jobs: ' . implode(', ', $run_jobs));
                        exit;
                    }

                    // create simplePie parser object
                    $feed = new SimplePie();
                    $feed->enable_cache(false);

                    echo "Processing $source" . '' . PHP_EOL;

                    //extract the feed's post number limit
                    $source_limit = PERIODICAL_RSS_ITEMS;

                    //preg_match("/([^\[]+)(\[([0-9]+)\])?/", $source, $matches);
                    preg_match("/([^\[]+)(\[([0-9]+)\])? *(\[([a-zA-Z\, ]+)\])?/", $source, $matches);
                    $source = $matches[1];

                    // if user have set a limit for a feed, use it if it's not too large
                    // (i.e. if the total number of items in the periodical is less than PERIODICAL_MAX_ITEMS)
                    if ((int)$matches[3] > 0)
                        $source_limit = (int)$matches[3];
                    if ($source_limit > $max_feed_items)
                        $source_limit = $max_feed_items;
                    echo "<br> Limit is $source_limit; url: $source <br>" . PHP_EOL;

                    // extract the 'find "print" link' option.
                    $find_print = strpos($matches[5], 'print') !== FALSE;
                    echo "Find print is $find_print" . PHP_EOL;
                    $all_articles = strpos($matches[5], 'all') !== FALSE;
                    echo "Send all articles: $all_articles" . PHP_EOL;

                    // now we have feed URL and posts limit to process (0 if no limitation), so it's time to get the posts
                    $source = trim($source);
                    $feed->set_feed_url($source);
                    $success = $feed->init();
                    $feed->handle_content_type();

                    // if there was a problem or the source is empty, skip it
                    if ($feed->error()) {
                        $source_errors++;
                        echo htmlspecialchars($feed->error()) . ' Skip this feed.' . '' . PHP_EOL;
                        $warnings .= '<span class="warning">Warning: failed to read RSS feed ' . trim($source) . '. Please make sure the URL is correct and links to an RSS feed.</span><br />';
                        continue;
                    }

                    sender_log('* Feed named ' . $feed->get_title() . ' has items: ' . count($feed->get_items()), 'periodicals');
                    echo 'Feed named ' . $feed->get_title() . ' has items: ' . count($feed->get_items());

                    if (!(count($feed->get_items()) > 0)) {
                        $source_errors++;
                        echo 'No items. Skip this feed' . '' . PHP_EOL;
                        $warnings .= '<span>RSS feed ' . trim($source) . ' is empty.</span><br />';
                        continue;
                    }

                    // and source language
                    $feed_language = $feed->get_language();
                    if (!$feed_language || (strlen($feed_language) < 2))
                        $feed_language = $backup_language;
                    $result_doc->setLanguage($feed_language);
                    $result_doc_free->setLanguage($feed_language);

                    // get items and process them
                    $feed_items_count = 0;

                    $feed_items = $feed->get_items(0, $source_limit);
                    echo "Have got " . count($feed_items) . " items" . PHP_EOL;

                    // we don't initialise a section in the result doc until we are sure there is at least 1 item in the feed.
                    $feed_title_placed = false;

                    // process feed items. Don't send those already sent.
                    foreach ($feed_items as $i => $item) {
                        // without the following line S2R can't grab URLs with &amp; string inside them
                        // for example this one: http://www.elsalvador.com/mwedh/nota/nota_completa.asp?idCat=47861&amp;idArt=6727407
                        $item_url = html_entity_decode($item->get_permalink());

                        // first of all make sure this item was not sent during previous delivery
                        // if it was, skip it.
                        if (!$all_articles) {
                            $query = $wpdb->prepare('SELECT COUNT(*) FROM sender_periodicals_log WHERE p_id=%d AND item_hash=%d LIMIT 1', $job->p_id, crc32($item_url));
                            if ($wpdb->get_var($query) == 1)
                                continue;
                        }
                        $feed_items_count++;

                        $doc->setTitle($item->get_title());
                        sender_log('* Read URL: ' . $item_url, 'periodicals');
                        if (!$doc->setUrl($item_url)) {
                            echo "ERROR: Can't set url: " . $item_url . PHP_EOL;
                            continue;
                        }

                        if (!$doc->grabHtml(true, $find_print)) {
                            echo "ERROR: Can't grab html for url: " . $item_url . PHP_EOL;
                            continue;
                        }

                        // HACK - using the following "Stop Words" array prevent S2R from sending the source' trial reminders instead of actual content
                        // It'll be better to just skip the article.
                        if (strpos($doc->getHtml(), '30-day allowance') > 0) {
                            echo "ERROR: Got Trial reminder instead of text. URL: " . $item_url . PHP_EOL;
                            continue;
                        }


                        if (!$feed_title_placed) {
                            // source title -> section title in the result doc
                            echo("Channel Title: " . $feed->get_title() . '' . PHP_EOL);
                            // HACK: The Economist - remove that from title
                            $feed_title = $feed->get_title();
                            if (strpos($feed_title, 'The Economist:') !== FALSE)
                                $feed_title = str_replace('The Economist: ', '', $feed_title);
                            $result_doc->addEntry($feed_title);
                            $result_doc_free->addEntry($feed_title);
                            if ($send_as_book && count($sources) > 1) {
                                $result_doc->addHtml('<h2 style="text-align:center;">' . $feed_title . '</h2> <p style="text-align:center;>***</p><br />' . PHP_EOL);
                                $result_doc_free->addHtml('<h2 style="text-align:center;">' . $feed_title . '</h2> <p style="text-align:center;>***</p><br />' . PHP_EOL);
                            }
                            $feed_title_placed = true;
                        }


                        // @TODO: if does not work for any title, remove. Titles taken by readability are already set by this line.
                        $doc->setTitle($item->get_title());

                        $doc->prepareHtml(true, true); //strip tables; strip head/body/html tags

                        $result_doc->addEntry($doc->getTitle(), $doc->getHtml(), $item_url);

                        // In the free version, add first few items with full text, others - my "free trial ended" message
                        if (($job_items_count + $feed_items_count) < $free_items)
                            $result_doc_free->addEntry($doc->getTitle(), $doc->getHtml(), $item_url);
                        else
                            $result_doc_free->addEntry($doc->getTitle(), $free_item_html);

                        // save item url in the log to prevent its processing in the next delivery
                        // Here we'll only save it in an array. Save to DB at the very end of the processing routine,
                        // once everything else is done.
                        $sent_items_array[] = array(
                            'p_id' => $job->p_id,
                            'source' => $source,
                            'item_url' => $item_url,
                            'crc32' => crc32($item_url),
                            'title' => $item->get_title(),
                            'day_start' => $day_start
                        );

                        // Add new page after each entry except the last one (we'll place the periodical's footer there instead)
                        if ($i < count($feed_items) - 1) {
                            $result_doc->addHtml('<div style="page-break-after:always"></div>');
                            $result_doc_free->addHtml('<div style="page-break-after:always"></div>');
                        }
                        echo 'item added. Title: ' . $doc->getTitle() . '<br>' . PHP_EOL;
                    }
                    $job_items_count += $feed_items_count;

                    // clear up memory
                    unset($feed_items);
                    $feed->__destruct();
                    unset($feed);
                } // for each source

            } // if RSS Job

            //  Digest
            //------------------------------------------------------------
            elseif ($job->type == 'digest') {
                $source_errors = 0;       // if this number will be equal to the number of sources, I should consider the Periodical as not sent.
                $warnings = '';        // collect warning messages for sources in this var. We;ll save it in DB for informing the user.
                echo "Processing $source" . '' . PHP_EOL;

                // get the items we should send from the history
                $digest_lastsent_id = (int)get_user_meta($job->user_id, "digest$job->p_id", true);
                if (!$digest_lastsent_id)
                    $digest_lastsent_id = 0;

                // fileter by tag (if not all)
                if ($job->sources == '~all~') {
                    $items = $wpdb->get_results($wpdb->prepare('SELECT * FROM sender_history WHERE type="single" AND user_id=%d AND h_id > %d
										  AND timestamp > %d ORDER BY h_id DESC',
                        $job->user_id, $digest_lastsent_id, $digest_timelimit));
                    printf('SELECT * FROM sender_history WHERE type="single" AND user_id=%d AND h_id > %d
										  AND timestamp > %d ORDER BY h_id DESC' . PHP_EOL,
                        $job->user_id, $digest_lastsent_id, $digest_timelimit);
                } else {
                    $query = $wpdb->prepare('SELECT h.*, t.tag FROM sender_history AS h
			                              INNER JOIN (SELECT item_id, tag FROM sender_tags WHERE user_id = %d AND tag=%s) AS t ON h.h_id=t.item_id
			                              WHERE type="single" AND user_id=%d AND h_id > %d
										  AND timestamp > %d ORDER BY h_id DESC',
                        $job->user_id, trim($job->sources), $job->user_id, $digest_lastsent_id, $digest_timelimit);
                    sender_log('* DIGEST SQL: ' . $query, 'periodicals');
                    $items = $wpdb->get_results($query);
                }

                // count items in the whole job. If there will be no items, don't send MOBI, report (not as error) to user on his page.
                $job_items_count = count($items);
                echo 'Have got ' . $job_items_count . ' items for this periodical' . PHP_EOL;

                // save the new "last sent" item id
                $digest_lastsent_id = $items[0]->h_id;

                // process feed items. Don't send those already sent.
                if (is_array($items) && ($job_items_count > 0)) {
                    // we do nned at least one section in the doc's table of contents
                    $result_doc->addEntry($job->title);

                    // iterate through all items we'll need to add to the digest
                    foreach ($items as $i => $item) {
                        // Add article to the digest
                        $htmlFileName = USERSDATA_PATH . "/$job->user_id/html/$item->h_id.html";
                        if (file_exists($htmlFileName))
                            $html = file_get_contents($htmlFileName);
                        else {
                            $temp_doc = new SDocument($job->user_id);
                            if ($temp_doc->remakeFile($item->h_id)) {
                                $html = $temp_doc->getHtml();
                            } else {
                                $html = "Article was not found";
                            }
                        }
                        $result_doc->addEntry($item->title, $html, $item->url);

                        // Add new page after each entry except the last one (we'll place the periodical's footer there instead)
                        if ($i < count($items) - 1)
                            $result_doc->addHtml('<div style="page-break-after:always"></div>');
                        echo 'item added. Title: ' . $item->title . PHP_EOL;
                    }
                }
            } // if Digest job

            // Now write mobi file
            if (((count($sources) > $source_errors) || ($job->type == 'digest')) && ($job_items_count > 0)) {
                $result_doc->addHtml('<center><br />***<br />Assembled and sent to your Kindle via <a href="http://sendtoreader.com">Sendtoreader Periodicals</a></center>	</body></html>');
                $result_doc_free->addHtml('<center><br />***<br /> Assembled and sent to your Kindle via <a href="http://sendtoreader.com">Sendtoreader Periodicals</a></center> </body></html>');

                if (!$result_doc->writeTempHtml(false, false)) {
                    echo 'ERROR: Can\'t write temp file' . '' . PHP_EOL;
                    exit;
                }

                $result_doc->setTime($user_time);
                $mobi_filename = $result_doc->saveMobi();

                if (!$result_doc_free->writeTempHtml(false, false)) {
                    echo 'ERROR: Can\'t write temp file for free users' . '' . PHP_EOL;
                    exit;
                }
                $result_doc_free->setTime($user_time);
                $mobi_filename_free = $result_doc_free->saveMobi();

                echo 'Filename: ' . $mobi_filename . PHP_EOL;
                echo 'Filename free: ' . $mobi_filename_free . PHP_EOL;

                // delete temp files in any case
                $result_doc->deleteTempFiles();
                $result_doc_free->deleteTempFiles();

                $log_sent = false;

                // we need sender no matter what are the delivery settings for this user.
                // Maybe someone is subscribed to this periodical, therefore sender is required.
                $sender = new Sender($job->user_id);
                $file_added = $sender->addFile($mobi_filename);
                if (!$file_added) {
                    echo 'ERROR: Can\'t send mobi file for Periodical ' . $job->p_id . ' to user ' . $job->user_id . ' because of the error: ' . $sender->myLastError() . ' <br>' . PHP_EOL;
                    $warnings .= '<span class="warning">Warning: The system was not able to send Periodical to your Kindle. Error: ' . $sender->myLastError();
                }

                // Another sender to serve free subscribers.
                // No need to check addFile result, we will not send out free copies anyway if main file can't be sent.
                $sender_free = new Sender($job->user_id);
                $sender_free->addFile($mobi_filename_free);

                // Send the mobi file to user
                // if user wants instant delivery, send the file
                if ($file_added && strpos($job->settings, 'no_delivery') === false) {
                    echo 'Sending' . '<br>' . PHP_EOL;
                    if ($sender->send(0, $job->title . ' (' . date('F jS, Y', $user_time) . ')'))
                        $log_sent = true;
                    else {
                        echo 'ERROR: Can\'t send mobi file for Periodical ' . $job->p_id . ' to user ' . $job->user_id . '<br>' . PHP_EOL;
                        $warnings .= '<span class="warning">Warning: The system was not able to send Periodical to your Kindle. Please make sure all settings <a href="/user/settings/">here</a> are correct.</span> ';
                    }
                }

                // now send the same document to all subscribers (if the doc is public and has subscribers)
                if ($file_added && $job->access == 'all') {

                    $subscribtions = $wpdb->get_results(
                        'SELECT s.*, l.timestamp AS subscribed FROM sender_subscriptions AS s
				 LEFT JOIN sender_log AS l ON l.item_id=' . $job->p_id . ' AND l.id =
				       ( SELECT MIN(id) FROM sender_log z WHERE z.item_id = ' . $job->p_id . ' AND z.user_id = s.user_id AND event="subscribe" )
				 WHERE s.item_id=' . $job->p_id . ' AND type="periodical"');

                    if (count($subscribtions) > 0) {

                        //Send the document to other users
                        $sent_count = 0;
                        foreach ($subscribtions as $subscription) {

                            // Get the information about user subscription type - basic or premium, date of subscription to this
                            // TODO: rewrite using SPricing object
                            $subscriber_id = $subscription->user_id;
                            $subscriber_plan = get_user_meta($subscriber_id, 'plan', true);
                            $subscriber_is_premium = ($subscriber_plan == 'premium') || ($subscriber_plan == 'reader');

                            // Find out when the user has subscribed for the first time.
                            if (!empty($subscription->subscribed) && ($subscription->subscribed < $subscription->date))
                                $subscribtion_age = (time() - $subscription->subscribed) / 86400;
                            else
                                $subscribtion_age = (time() - $subscription->date) / 86400;

                            // Send a copy
                            if ($subscriber_is_premium) {
                                $copy_sent = $sender->send($subscriber_id, $job->title . date('F jS, Y', $user_time));
                                $sent_title = $result_doc->getTitle();
                                $sent_filename = $result_doc->getFilenamebase() . '.mobi';
                                echo 'Sent premium to ' . $subscriber_id . PHP_EOL;
                            } else {
                                $copy_sent = $sender_free->send($subscriber_id, $job->title . date('F jS, Y', $user_time));
                                $sent_title = $result_doc_free->getTitle();
                                $sent_filename = $result_doc_free->getFilenamebase() . '.mobi';
                                echo 'Sent free to ' . $subscriber_id . PHP_EOL;
                            }

                            if ($copy_sent)
                                $sent_count++;

                            // add this document to the user's "previously sent items" list
                            $unique_id = uniqid(rand(), 1);
                            $file_hash = base_convert(crc32($unique_id), 10, 36);
                            $wpdb->insert('sender_history', array(
                                'timestamp' => time(),
                                'user_id' => $subscription->user_id,
                                'url' => '',
                                'title' => $sent_title,
                                'filename' => $sent_filename,
                                'html' => '',
                                'delivered' => $copy_sent,
                                'hash' => $file_hash,
                                'type' => 'periodical',
                                'source_id' => $job->p_id),
                                array('%d', '%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%d'));
                        }
                    }
                } // if access == 'all'

                // The document is successfully sent to user's kindle, show the SUCCESS message
                // and write a new record in the history log
                $unique_id = uniqid(rand(), 1);
                $file_hash = base_convert(crc32($unique_id), 10, 36);
                $wpdb->insert('sender_history', array(
                    'timestamp' => time(),
                    'user_id' => $job->user_id,
                    'url' => '',
                    'title' => $result_doc->getTitle(),
                    'filename' => $result_doc->getFilenamebase() . '.mobi',
                    'html' => '',
                    'delivered' => $log_sent,
                    'hash' => $file_hash,
                    'type' => 'periodical',
                    'source_id' => $job->p_id),
                    array('%d', '%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%d'));

                // adjust the message to user about this attempt to send his periodical
                $last_result = ($warnings == '') ? '<span class="success">Sent successfully ' . date('F j, G:i', $user_time) . '.</span> ' : $warnings . '<span class="warning">Periodical was processed with WARNINGS!</span>';
            } else {
                if ($job_items_count == 0) {
                    // not an error, just nothing to send this time
                    echo 'All items was sent previously. Nothing to send.' . '<br>' . PHP_EOL;
                    $last_result = $warnings . 'There were no new articles in this Periodical, so nothing to send yet.';
                } else {
                    // error
                    echo 'All sources in this job were problematic, nothing to send to user' . '<br>' . PHP_EOL;
                    $last_result = $warnings . '<span class="warning">Kindle file was not generated because of warnings.</span>';
                }
            }

            $wpdb->query($wpdb->prepare('UPDATE sender_periodicals SET last_result=%s WHERE p_id=%d LIMIT 1', $last_result, $job->p_id));

            // Finally, update the 'last_sent' param by the cur. time
            echo 'Job "' . $job->p_id . ' - ' . $job->title . '" for user ' . $job->user_id . ': set "last_sent" time: ' . $last_sent_time;
            $wpdb->query($wpdb->prepare('UPDATE sender_periodicals SET last_sent=%d WHERE p_id=%d LIMIT 1',
                $last_sent_time, $job->p_id));

            if ($job->type == 'digest')
                update_user_meta($job->user_id, "digest$job->p_id", $digest_lastsent_id);

            echo 'The job is done, time spent: ' . (time() - $job_start_time) . ' seconds' . '' . PHP_EOL . PHP_EOL;
        } // foreach job


        // Now save temp data about the URL sent to periodical's owner.
        if (count($sent_items_array) > 0) {
            foreach ($sent_items_array as $item) {
                $wpdb->query($wpdb->prepare('INSERT INTO sender_periodicals_log SET p_id=%d, source=%s, item_url=%s, item_hash=%d, item_title=%s, date=%d',
                    $item['p_id'], $item['source'], $item['item_url'], $item['crc32'], $item['title'], $item['day_start']));
            }
        }

        $time_taken = time() - $script_start_time;
        printf('DONE. Memory taken: %d; Time taken: %d; Jobs skipped: %d.' . PHP_EOL,
            memory_get_peak_usage(true) - $memory_usage, $time_taken, count($skipped_jobs));

        $time_taken_saved = intval(get_option('sendperiodicals-maxtime', '0'));
        $time_taken_saved_at = intval(get_option('sendperiodicals-maxtime-at', '0'));
        if (($time_taken > $time_taken_saved) || (time() > $time_taken_saved_at + 3600 * 24)) {
            update_option('sendperiodicals-maxtime', $time_taken);
            update_option('sendperiodicals-maxtime-at', time());
            update_option('sendperiodicals-longest', implode(', ', $run_jobs));
        }

        if (count($run_jobs) > 0)
            printf('Jobs executed: %s' . PHP_EOL, implode(', ', $run_jobs));
        else
            echo 'No jobs executed.' . PHP_EOL;

    }
}
