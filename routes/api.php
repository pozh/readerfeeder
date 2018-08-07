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

Route::namespace('Api\V1')->group(function () {
    Route::post('user', 'UserController@store');

    Route::get('feed', 'FeedController@index');
    Route::get('feed/{id}', 'FeedController@show');
    Route::get('feed/byslug/{slug}', 'FeedController@showBySlug');
    Route::post('feed', 'FeedController@store');
    Route::put('feed/{id}', 'FeedController@update');
    Route::delete('feed/{id}', 'FeedController@destroy');

    Route::get('category', 'CategoryController@index');
    Route::get('category/{id}', 'CategoryController@show');
    Route::get('category/byslug/{slug}', 'CategoryController@showBySlug');
    Route::post('category', 'CategoryController@store');
    Route::put('category/{id}', 'CategoryController@update');
    Route::delete('category/{id}', 'CategoryController@destroy');
});
