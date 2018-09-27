<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Models\Feed;
use App\Mail\Delivery;


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
        $kindleEmails = $this->feed->subscribers()
            ->whereNotNull('kindle_email')
            ->pluck('kindle_email')
            ->toArray();

        // Do nothing if there's no subscriber with kindle_email specified
        if (count($kindleEmails) === 0) return;
        Mail::to($kindleEmails)->queue(new Delivery($this->filename));
        activity('sender')
            ->on($this->feed)
            ->withProperties(['file' => $this->filename, 'subscribers_count' => count($kindleEmails)])
            ->log('Sent');

        $dt = new \DateTime;
        $this->feed->last_sent = $dt->format('m-d-y H:i:s');
        $this->feed->save();
    }

    public function failed($exception)
    {
        $msg = $exception->getMessage();
        activity('sender')
            ->on($this->feed)
            ->withProperties(['file'=>$this->filename])
            ->log('Send Failed. ' . $msg);
    }
}
