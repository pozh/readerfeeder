<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

use App\Models\Feed;


class SendFeed implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $feed;
    protected $filename;

    /**
     * Create a new job instance.
     *
     * @param Feed $feed The Feed model which mobi file we are about to send
     * @param string $filename Filename of the .mobi file we will be sending
     * @return void
     */
    public function __construct($feed, $filename)
    {
        $this->filename = $filename;
        $this->feed = $feed;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {


        $subscribers = $this->feed->subscribers()->get();
        if($subscribers->count() == 0) return;

        foreach($subscribers as $subscriber) {
            // TODO: send!
        }

        $dt = new \DateTime;
        $this->feed->last_sent = $dt->format('m-d-y H:i:s');
        $this->feed->save();


    }
}
