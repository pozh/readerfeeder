<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

    protected $fillable = [
        'title'
    ];

    public function feeds() {
        return $this->hasMany( 'App\Models\Feed' );
    }

}
