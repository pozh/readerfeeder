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
        var_dump($feed->get_title());
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
        $feed = Feed::findOrFail($feed_id);

        var_dump($feed->subscribers()->count());
        die();

        $subs = $feed->subscribers;
        foreach($feed->subscribers as $user) {
            echo $user->first_name . '<br>';
        }
    }

    public function feedsWithSubscribers()
    {
        $feeds = Feed::has('subscribers')->get();
        foreach($feeds as $val) {
            echo $val->id . '<br>';
        }
    }


    public function sendfeed($feed_id)
    {
        $feed = Feed::findOrFail($feed_id);
        dispatch(new ProcessFeed($feed));
    }
}
