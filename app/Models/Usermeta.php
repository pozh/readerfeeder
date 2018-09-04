<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Usermeta
 * @package App\Models
 * @author Sergey Pozhilov <pozhilov@gmail.com>
 */
class Usermeta extends Model
{
    protected $table = 'user_meta';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'key', 'value'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'user_id', 'created_at', 'updated_at'
    ];
}
