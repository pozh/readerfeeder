<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 *
 * @package App\Models
 * @author  Sergey Pozhilov <pozhilov@gmail.com>
 */
class Category extends Model {
  protected $table = 'categories';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable
    = [
      'title',
      'slug',
      'description'
    ];

  public function feeds() {
    return $this->hasMany( 'App\Models\Feed' );
  }

}
