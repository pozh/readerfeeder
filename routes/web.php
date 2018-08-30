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

Route::get('/', 'TestController@index');
Route::get('/rss', 'TestController@rss');
Route::get('/subs/{feed_id}', 'TestController@subscribers');
Route::get('/send/{feed_id}', 'TestController@sendfeed');

Route::get('/redirect/{social}','Api\V1\Auth\LoginController@socialLogin')->where('social','twitter|facebook|linkedin|google');

