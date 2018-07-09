<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', 'TestController@index');

//$app->get('/', function () use ($app) {
//    return $app->version();
//});

//$app->get('/', function () {
//    return view('dashboard');
//});

$api = app('Dingo\Api\Routing\Router');

// v1 version API
// choose version add this in header    Accept:application/vnd.lumen.v1+json
$api->version('v1', ['namespace' => 'App\Http\Controllers\Api\V1'], function ($api) {
    // login
    $api->post('auth/login', 'AuthController@login');
    // signup
    $api->post('user', 'UserController@store');
    // refresh jwt token
    $api->post('auth/login/refresh', 'AuthController@refreshToken');

    // Feed
    $api->get('feed', 'FeedController@index');
    $api->get('feed/{id}', 'FeedController@show');
    $api->get('feed/byslug/{slug}', 'FeedController@showBySlug');
    $api->post('feed', 'FeedController@store');
    $api->put('feed/{id}', 'FeedController@update');
    $api->delete('feed/{id}', 'FeedController@destroy');

    // Category
    $api->get('category', 'CategoryController@index');
    $api->get('category/{id}', 'CategoryController@show');
    $api->get('category/byslug/{slug}', 'CategoryController@showBySlug');
    $api->post('category', 'CategoryController@store');
    $api->put('category/{id}', 'CategoryController@update');
    $api->delete('category/{id}', 'CategoryController@destroy');

    // need authentication
    $api->group(['middleware' => 'api.auth'], function ($api) {
        $api->get('auth/check', 'AuthController@checkToken');

        // User
        $api->get('user', 'UserController@index');
        $api->get('user/me', 'UserController@me');
        $api->get('user/{id}', 'UserController@show');
        $api->put('user/{id}', 'UserController@update');
        $api->delete('user/{id}', 'UserController@destroy');

        // Subscription
        $api->get('subscription', 'SubController@index');
        $api->get('subscription/{id}', 'SubController@show');
        $api->post('subscription', 'SubController@store');
        $api->put('subscription/{id}', 'SubController@update');
        $api->delete('subscription/{id}', 'SubController@destroy');
    });
});
