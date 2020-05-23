<?php

use Illuminate\Routing\Router;

Admin::routes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
    'as'            => config('admin.route.prefix') . '.',
], function (Router $router) {

    $router->get('/', 'HomeController@index')->name('admin.home');
    $router->get('/charts', 'ChartjsController@index')->name('admin.charts');
    $router->resource('users', UserController::class);
    $router->resource('feeds', FeedController::class);
    $router->resource('categories', CategoryController::class);
});
