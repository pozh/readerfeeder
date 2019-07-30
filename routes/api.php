<?php

use Illuminate\Http\Request;

Route::namespace('Api\V1')->group(function () {

    Route::group(['prefix'=> 'auth'],function(){
        Route::post('/register','Auth\RegisterController@register');
        Route::post("/login",'Auth\AuthController@login');
        Route::get('/login/{social}/callback','Auth\AuthController@handleProviderCallback')->where('social','twitter|facebook|linkedin|google|');
    });

    Route::group(['middleware' => 'jwt.auth'], function(){
        Route::get('auth/check', 'Auth\AuthController@checkToken');

        Route::get('log', 'LogController@index');

        Route::get('user', 'UserController@index');
        Route::get('user/{id}', 'UserController@show');
        Route::post('user/{id}', 'UserController@update');
        Route::delete('user/{id}', 'UserController@destroy');

        Route::get('subscription', 'SubController@index');
        Route::get('subscription/{id}', 'SubController@show');
        Route::post('subscription', 'SubController@store');
        Route::put('subscription/{id}', 'SubController@update');
        Route::delete('subscription/{id}', 'SubController@destroy');
    });

    Route::get('feed', 'FeedController@index');
    Route::get('feed/{id}', 'FeedController@show');
    Route::get('feed/byslug/{slug}', 'FeedController@showBySlug');
    Route::get('item/byslug/{slug}', 'FeedController@getFeedItems');
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
