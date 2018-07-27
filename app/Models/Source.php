<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

/**
 * Class Source
 * @package App\Models
 * @author Sergey Pozhilov <pozhilov@gmail.com>
 */
class Source extends Model implements Sortable
{
    use SortableTrait;

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

    /**
     * Get the sources for the feed.
     */
    public function itemsSent()
    {
        return $this->hasMany('App\Models\Item')->get();
    }

}
