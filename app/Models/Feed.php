<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Feed
 * @package App\Models
 * @author Sergey Pozhilov <pozhilov@gmail.com>
 */
class Feed extends Model
{
	protected $table = 'feeds';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'title','status', 'period', 'schedule_day', 'schedule_time', 'type', 'description'
	];

    /**
     * Get the sources for the feed.
     */
    public function sources()
    {
        return $this->hasMany('App\Models\Source')->get();
    }
}
