<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use Encore\Admin\Layout\Content;
use Encore\Admin\Widgets\Box;

class ChartjsController extends Controller
{
    /**
     * Title for current resource.
     *
     * @var string
     */
  protected $title = 'Example controller';

  public function index(Content $content)
  {
      return $content
          ->header('Chartjs')
          ->body(new Box('Bar chart', view('admin.chartjs')));
  }
}
