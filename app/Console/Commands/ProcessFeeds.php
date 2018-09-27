<?php

namespace App\Console\Commands;

use App\Jobs\ProcessFeed;
use Illuminate\Console\Command;
use App\Models\Feed;
use Illuminate\Support\Facades\Log;

/**
 * Class processFeeds
 * @package App\Console\Commands
 *
 * Run this command once an hour, not oftener!
 * Otherwise we'll get multiple delivery of the feeds
 */
class processFeeds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'feeds:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process all feeds in the database';

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
        $feeds = Feed::where('status', Feed::ACTIVE)->get();
        Log::debug('Run handle in ProcessFeeds', ['feeds_count' => $feeds->count()]);
        foreach ($feeds as $feed) {
            // If already sent today, skip
            if ($feed->last_sent && date('d') === date("d", strtotime($feed->last_sent))) continue;

            // It's not time yet, skip
            if ($feed->period == Feed::DAILY) {
                if ($feed->schedule_time !== date('G')) continue;
            } else if ($feed->period == Feed::WEEKLY) {
                if ($feed->schedule_day !== date('w') || $feed->schedule_time !== date('G')) continue;
            }

            Log::debug('Time to process feed ' . $feed->title);
            $feed->status = Feed::PROCESSING;
            $feed->save();
            ProcessFeed::dispatch($feed);
        }
    }
}
