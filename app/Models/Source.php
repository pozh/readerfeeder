<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Source
 * @package App\Models
 * @author Sergey Pozhilov <pozhilov@gmail.com>
 */
class Source extends Model
{
    protected $table = 'sources';
    public $timestamps = false;

    /**
     * @link https://github.com/spatie/eloquent-sortable
     * @var array
     */
    public $sortable = [
        'order_column_name' => 'order',
        'sort_when_creating' => true,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'feed_id', 'title', 'url', 'count'
    ];

}
