<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FeedTypesStatuses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('feeds', function (Blueprint $table) {
            $statuses = array_keys(config('enums.status'));
            $statuses_str = implode('", "', $statuses);
            DB::statement('ALTER TABLE `feeds` CHANGE `status` `status` ENUM("' .
                $statuses_str . '") NOT NULL DEFAULT "' .
                config('enums.status.paused') . '"');

            $types = array_keys(config('enums.type'));
            $types_str = implode('","', $types);
            DB::statement('ALTER TABLE `feeds` CHANGE `type` `type` ENUM("' .
                $types_str . '") NOT NULL DEFAULT "' .
                config('enums.type.draft') . '"');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('feeds', function (Blueprint $table) {
            DB::statement('ALTER TABLE `feeds` CHANGE `status` `status` VARCHAR(120) DEFAULT "paused"');
            DB::statement('ALTER TABLE `feeds` CHANGE `type` `type` VARCHAR(120) DEFAULT "draft"');
        });
    }
}
