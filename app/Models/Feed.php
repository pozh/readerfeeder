<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Feed
 *
 * @package App\Models
 * @author  Sergey Pozhilov <pozhilov@gmail.com>
 */
class Feed extends Model
{
  public const ACTIVE = 'active';
  public const INACTIVE = 'inactive';
  public const PROCESSING = 'processing';
  public const DAILY = 'daily';
  public const WEEKLY = 'weekly';

  protected $table = 'feeds';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable
    = [
      'title',
      'status',
      'period',
      'schedule_day',
      'schedule_time',
      'type',
      'description'
    ];

  /**
   * Get the sources for the feed.
   */
  public function sources() {
    return $this->hasMany('App\Models\Source');
  }

  public function items() {
    return $this->hasMany('App\Models\Item');
  }

  public function subscribers() {
    return $this->belongsToMany('App\Models\User', 'subscriptions', 'feed_id', 'user_id');
  }

  public function category() {
    return $this->belongsTo('App\Models\Category')->first();
  }

  public function location() {
    return $this->belongsTo('App\Models\Location')->first();
  }
}
