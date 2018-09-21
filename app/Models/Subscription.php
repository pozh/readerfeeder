<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Subscription
 * @package App\Models\Subscription
 */
class Subscription extends Model
{
    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'subscriptions';

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];

    public function feed()
    {
        return $this->belongsTo('App\Models\Feed');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
