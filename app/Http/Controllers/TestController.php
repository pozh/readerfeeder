<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\SDocument;
use Feeds;
use View;

class TestController extends Controller
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

    public function rss()
    {
        $feed = Feeds::make('http://evo-lutio.livejournal.com/data/rss', true);
        $data = array(
            'title'     => $feed->get_title(),
            'permalink' => $feed->get_permalink(),
            'items'     => $feed->get_items(),
        );
        return View::make('feed', $data);
    }
}
