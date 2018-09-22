<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Delivery extends Mailable
{
    use Queueable, SerializesModels;

    protected $attachement;

    /**
     * Create a new message instance.
     *
     * @param string $attachement Filename of the .mobi file to send.
     * @return void
     */
    public function __construct($attachement)
    {
        $this->attachement = $attachement;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.delivery')
            ->attach($this->attachement);
    }
}
