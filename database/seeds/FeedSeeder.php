<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon as Carbon;

use App\Models\Feed;
use App\Models\Source;
use App\Models\Category;

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

        $categories = [
            ['title' => 'News - World', 'slug' => 'news-world', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Religion', 'slug' => 'religion', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Science', 'slug' => 'science', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Deutschland News', 'slug' => 'deutschland', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'News and Politics', 'slug' => 'news-and-politics', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'General Reading', 'slug' => 'reading', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Tech', 'slug' => 'tech', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Lifestyle & Entertainment', 'slug' => 'lifestyle', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Noticias de España', 'slug' => 'espana', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'News - US', 'slug' => 'us', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Nouvelles en France', 'slug' => 'france', 'description' => '', 'created_at' => Carbon::now()],
            ['title' => 'Business & Economy', 'slug' => 'business', 'description' => '', 'created_at' => Carbon::now()]
        ];

        foreach ($categories as $catIdx => $cat) {
            $catID = Category::create($cat)->id;
            foreach ($json['feeds'] as $feed) {
                $feedCategoryID = empty($feed['category']) ? 1 : $feed['category'];
                if ($feedCategoryID != $catIdx + 1) continue;
                $data = [
                    'title' => $feed['title'],
                    'user_id' => 1,
                    'status' => 'active',
                    'period' => $feed['period'],
                    'schedule_day' => $feed['schedule_day'],
                    'schedule_time' => $feed['schedule_time'],
                    'type' => $feed['type'],
                    'category_id' => $feedCategoryID,
                    'description' => empty($feed['description']) ? '' : $feed['description'],
                    'slug' => $feed['slug'],
                    'subscribers' => 0,
                    'created_at' => Carbon::now()
                ];
                $feedID = Feed::create($data)->id;

                if (!empty($feed['sources'])) {
                    foreach ($feed['sources'] as $source) {
                        $data = [
                            'feed_id' => $feedID,
                            'title' => '',
                            'url' => $source['url'],
                            'count' => $source['count'],
                            'created_at' => Carbon::now(),
                            'order' => 0
                        ];
                        Source::create($data);
                    }
                }
            }
        }

    }
}
