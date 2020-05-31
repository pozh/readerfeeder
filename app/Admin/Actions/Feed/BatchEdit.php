<?php

namespace App\Admin\Actions\Feed;

use Encore\Admin\Actions\BatchAction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;


class BatchEdit extends BatchAction
{
    public $name = 'Edit selected';

    public function handle(Collection $collection, Request $request)
    {
        foreach ($collection as $model) {
            if (!empty($request->get('type'))) $model->type = $request->get('type');
            if (!empty($request->get('status'))) $model->status = $request->get('status');
            if (!empty($request->get('type')) || !empty($request->get('status'))) $model->save();
        }
        return $this->response()->success('Done')->refresh();
    }

    public function form()
    {
        $types = config('enums.type');
        $statuses = config('enums.status');

        $this->select('status', 'Status')->options($statuses);
        $this->select('type', 'Type')->options($types);
    }
}
