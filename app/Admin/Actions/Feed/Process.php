<?php

namespace App\Admin\Actions\Feed;

use Encore\Admin\Actions\RowAction;
use Illuminate\Database\Eloquent\Model;
use App\Jobs\ProcessFeed;

class Process extends RowAction
{
    public $name = 'process';

    public function handle(Model $model)
    {
        ProcessFeed::dispatchNow($model);
        return $this->response()->success('Successfully executed. ')->refresh();
    }

}
