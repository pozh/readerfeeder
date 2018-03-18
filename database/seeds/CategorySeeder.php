<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon as Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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

        DB::table('categories')->insert($categories);
    }
}
