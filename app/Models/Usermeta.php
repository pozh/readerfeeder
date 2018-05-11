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
}
