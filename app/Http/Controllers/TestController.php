<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\SDocument;
use App\Models\Subscription;
use App\Models\Feed;
use Feeds;
use View;
use App\Jobs\ProcessFeed;

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
        var_dump($feed->get_language());
//
//        $data = array(
//            'title'     => $feed->get_title(),
//            'permalink' => $feed->get_permalink(),
//            'items'     => $feed->get_items(),
//        );
//        return View::make('feed', $data);
    }

    public function subscribers($feed_id)
    {
        $subs = Subscription::where('feed_id', $feed_id)->get();
        if (!empty($subs)) {
            foreach ($subs as $sub) {
                echo $sub->user_id;
            }
        } else echo 'Nothing found';
    }

    public function sendfeed($feed_id)
    {
        $feed = Feed::find($feed_id);
        ProcessFeed::dispatch($feed);
    }
}
