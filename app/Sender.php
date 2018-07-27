<?php

namespace App;

use Illuminate\Support\Facades\Log;
use App\Models\User;

class Sender
{
    protected $user_id = null;
    protected $files = [];
    protected $error_msg = '';


    /**
     * Constructor
     * @param $user_id int User ID @default 0
     */
    function __construct($user_id = 0)
    {
        $this->user_id = $user_id;
    }

    function getLastError()
    {
        return $this->error_msg;
    }

    /**
     * Add a file which we need to send out.
     * @param $filename string Filename of the file to send.
     * @return TRUE on success, FALSE otherwise.
     */
    function addFile($filename)
    {
        // make sure the file is not HUGE
        $file_size = filesize($filename);
        if ($file_size > env('MAX_FILESIZE')) {
            $this->error_msg = 'The file is too large, filesize = ' . floor($file_size / 1048576);
            return false;
        }
        $this->files[] = $filename;
        return true;
    }


    /**
     * send - Send the already attached files to the specified user.
     * @param $user_id int User ID @default 0
     * @param $subject string Email subject @default 'Delivery from ReaderFeeder'
     * @return true on success, false otherwise.
     **/
    function send($user_id = 0, $subject = 'Delivery from ReaderFeeder')
    {
        // by default send the doc to its owner ($this->user_id)
        if ($user_id == 0) $user_id = $this->user_id;
        $user = User::find($user_id);
        $user_meta = $user->meta();

        $headers = 'From: ' . env('SENDER_FROM_EMAIL', 'kindle@readerfeeder.com') . PHP_EOL;
        $to = $user_meta ($user_id, 'kindle_email', true);

        // return error if there is no address to send to (nor primary kindle, no "send copy to")
        if (!$to && (empty($copy_to) || !$is_premium)) {
            sender_log('* ERROR: no kindle_email for user ' . $user_id);
            $this->error_msg = "No Kindle email specified in user settings.";
            return false;
        }

        if (!empty($to) && (strpos($to, '---') === false)) {
            $to .= (get_user_meta($user_id, 'delivery_addr', true) == 'paid') ? '@kindle.com' : '@free.kindle.com';
            if (wp_mail($to, $subject, 'Yet another text to read', $headers, $this->files) != true) {
                sender_log('* ERROR: The file ' . implode(', ', $this->files) . ' was not sent to ' . $to);
                $this->error_msg = "Mailing has failed.";
                return false;
            }
            sender_log('* The file ' . implode(', ', $this->files) . ' is(are) sent to ' . $to);
        }

        // now send the same file to the "copy to" emails
        // send only to premium users' lists of "copy to" emails.
        // If it's periodical and user don't want to send its copy, don't do that
        if (empty($copy_to) || ($is_periodical && !$copy_periodicals))
            return true;

        // send the copies
        foreach ($copy_to_emails as $to_email) {
            if (wp_mail($to_email, $subject, 'Yet another text to read', $headers, $this->files) != true) {
                sender_log('* ERROR (send copy): The file ' . implode(', ', $this->files) . ' was not sent to ' . $to_email);
            }
        }
        return true;
    }
}
