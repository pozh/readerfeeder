<?php
namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use App\SDocument;

class TestController extends BaseController
{
    public function index()
    {
        $doc = new SDocument(0);
        $doc->setUrl('https://evo-lutio.livejournal.com/685275.html');
        if ($doc->grabHtml() === false) {
            if ($doc->grabHtml(true, 3) === false) {
                if ($doc->grabHtml(true, 1) === false) {
                    if ($doc->grabHtml(false, 0) === false) {
                        return 'cannot grab html';
                    }
                }
            }
        }
        $doc->prepareHtml();
        return $doc->getHtml();
    }
}
