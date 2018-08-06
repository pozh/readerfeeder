<?php

use Illuminate\Http\Request;

Route::group(['middleware' => 'auth:api'], function($api){
    $api->get('auth/check', 'AuthController@checkToken');

    $api->get('user', 'UserController@index');
    $api->get('user/me', 'UserController@me');
    $api->get('user/{id}', 'UserController@show');
    $api->put('user/{id}', 'UserController@update');
    $api->delete('user/{id}', 'UserController@destroy');

    $api->get('subscription', 'SubController@index');
    $api->get('subscription/{id}', 'SubController@show');
    $api->post('subscription', 'SubController@store');
    $api->put('subscription/{id}', 'SubController@update');
    $api->delete('subscription/{id}', 'SubController@destroy');
});

Route::get('feed', 'Api\V1\FeedController@index');
Route::get('feed/{id}', 'Api\V1\FeedController@show');
Route::get('feed/byslug/{slug}', 'Api\V1\FeedController@showBySlug');
Route::post('feed', 'Api\V1\FeedController@store');
Route::put('feed/{id}', 'Api\V1\FeedController@update');
Route::delete('feed/{id}', 'Api\V1\FeedController@destroy');

Route::get('category', 'Api\V1\CategoryController@index');
Route::get('category/{id}', 'Api\V1\CategoryController@show');
Route::get('category/byslug/{slug}', 'Api\V1\CategoryController@showBySlug');
Route::post('category', 'Api\V1\CategoryController@store');
Route::put('category/{id}', 'Api\V1\CategoryController@update');
Route::delete('category/{id}', 'Api\V1\CategoryController@destroy');
