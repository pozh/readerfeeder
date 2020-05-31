<?php

namespace App\Admin\Actions\Feed;

use Encore\Admin\Actions\Action;
use Illuminate\Http\Request;

class ImportOpml extends Action
{
    protected $selector = '.import-opml';

    public function handle(Request $request)
    {
        $content = $request->file('file');
        //var_dump($content); die();


        return $this->response()->success('Success message...')->refresh();
    }

    public function form()
    {
        $this->file('file', 'Please select file');
    }


    public function html()
    {
        return '<a class="btn btn-sm btn-default import-feedly">Import OPML</a>';
    }
}
