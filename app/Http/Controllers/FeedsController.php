<?php

namespace App\Http\Controllers;

use App\Models\Feed;
use Feeds;
use App\Models\Category;
use Spatie\Activitylog\Models\Activity;
use App\Http\Resources\Log as LogResource;


class FeedsController extends Controller {

  public function index() {
    $data = array(
      'categories' => Category::all(),
      'feeds'      => Feed::all(),
    );

    return view( 'feeds', $data );
  }

  public function category( $slug ) {
    $category = Category::where( 'slug', $slug )->first();
    if ( ! $category ) {
      abort( 404 );
    }
    $data = array(
      'category' => $category,
      'feeds'    => $category->feeds,
    );

    return view( 'category', $data );
  }

  public function feed( $category, $slug ) {
    $feed = Feed::where( 'slug', $slug )->first();
    if ( ! $feed ) {
      abort( 404 );
    }
    $content = [];
    foreach ( $feed->sources as $src ) {
      $sp_feed   = Feeds::make( $src->url, true );
      $content[] = [
        'title'     => $sp_feed->get_title(),
        'permalink' => $sp_feed->get_permalink(),
        'items'     => array_slice($sp_feed->get_items(), 0, $src->count)
      ];
    }
    $data = array(
      'feed'    => $feed,
      'content' => $content
    );

    return view( 'feed', $data );
  }
}
