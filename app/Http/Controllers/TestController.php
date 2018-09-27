<?php
namespace App\Http\Controllers;

use App\SDocument;
use App\Models\Feed;
use Feeds;
use App\Jobs\ProcessFeed;
use Mail;
use App\Mail\Delivery;
use Spatie\Activitylog\Models\Activity;
use App\Http\Resources\Log as LogResource;


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

//        var_dump($feed->subscribers()->count());
//        die();

        $subs = $feed->subscribers()->whereNotNull('kindle_email')->pluck('kindle_email')->toArray();
        var_dump($subs);
        echo ('<hr>');
//        foreach($feed->subscribers as $user) {
//            echo $user->first_name . '<br>';
//        }
    }

    public function feedsWithSubscribers()
    {
        $feeds = Feed::has('subscribers')->get();
        foreach($feeds as $val) {
            echo $val->id . '<br>';
        }
    }

    /**
     * test feeds processing
     */
    public function process() {
        $feeds = Feed::where('status', Feed::ACTIVE)->get();
        foreach ($feeds as $feed) {
            if ($feed->period == Feed::DAILY) {
                if( $feed->schedule_time == date('G')+2 ) {
                    echo 'Processing ' . $feed->title;
//                    $feed->status = Feed::PROCESSING;
//                    $feed->save();
                    echo $feed->title;
                    ProcessFeed::dispatch($feed);
                    echo '<br>';
                }
            } else if ($feed->period == Feed::WEEKLY) {
//                if ($feed->schedule_day == date('w') && $feed->schedule_time == date('G')) {
//                    $feed->status = Feed::PROCESSING;
//                    $feed->save();
//                    ProcessFeed::dispatch($feed);
//                }
            }
        }
    }

    public function sendfeed($feed_id)
    {
        $kindleEmails = ['pozhilov@gmail.com'];

        // Do nothing if there's no subscriber with kindle_email specified
        if (count($kindleEmails) === 0) return;
        $filename = storage_path('data');
        $filename .=  DIRECTORY_SEPARATOR . '0' . DIRECTORY_SEPARATOR . 'el-pas-spain.mobi';
        $result = Mail::to($kindleEmails)->send(new Delivery($filename));
        echo '<pre>';
        var_dump($result);

//        $feed = Feed::findOrFail($feed_id);
//        dispatch(new ProcessFeed($feed));
    }

    public function logs() {
        $logs = Activity::paginate(50);
        echo '<pre>';
        var_dump(LogResource::collection($logs));
    }
}
