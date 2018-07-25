<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserTableSeeder::class);
        $this->call(RoleTableSeeder::class);
        $this->call(UserRoleSeeder::class);
        $this->call(FeedSeeder::class);
        $this->call(CategorySeeder::class);
    }
}
