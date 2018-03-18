<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon as Carbon;

class FeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path = storage_path() . "/json/db2.json";
        $json = json_decode(file_get_contents($path), true);
        $feeds = [];
        $sources = [];
        foreach ($json['feeds'] as $feed) {
            $feeds[] = [
                'id' => $feed['id'],
                'title' => $feed['title'],
                'user_id' => 1,
                'status' => 'active',
                'period' => $feed['period'],
                'schedule_day' => $feed['schedule_day'],
                'schedule_time' => $feed['schedule_time'],
                'type' => $feed['type'],
                'category_id' => !empty($feed['category']) ? $feed['category'] + 12 : 0,
                'description' => !empty($feed['description']) ? $feed['description'] : '',
                'slug' => $feed['slug'],
                'subscribers' => $feed['subscribers'],
                'created_at' => Carbon::now()
            ];
            if (!empty($feed['sources'])) {
                foreach ($feed['sources'] as $source){
                    $sources[] = [
                        'feed_id' => $feed['id'],
                        'title' => '',
                        'url' => $source['url'],
                        'count' => $source['count'],
                        'created_at' => Carbon::now(),
                        'order' => 0
                    ];
                }
            }
        }
        DB::table('feeds')->insert($feeds);
        DB::table('sources')->insert($sources);
    }
}
