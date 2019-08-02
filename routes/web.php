<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () { return view('home'); });
Route::get('/terms', function () { return view('terms'); });
Route::get('/privacy', function () { return view('privacy'); });

Route::group(['prefix'=> 'feeds'], function(){
  Route::get('/{category}/{slug}', 'FeedsController@feed')->name('feed');
  Route::get('/{slug}', 'FeedsController@category')->name('category');
  Route::get('/', 'FeedsController@index');
});

Route::group(['prefix'=> 'tests'], function(){
    Route::get('/', 'TestController@index');
    Route::get('/rss', 'TestController@rss');
    Route::get('/subs', 'TestController@feedsWithSubscribers');
    Route::get('/subs/{feed_id}', 'TestController@subscribers');
    Route::get('/send/{feed_id}', 'TestController@sendfeed');
    Route::get('/process', 'TestController@process');
    Route::get('/logs', 'TestController@logs');
});

// Everything else is handled in Frontend app
Route::view('{path}', 'app')->where('path', '(.*)');

