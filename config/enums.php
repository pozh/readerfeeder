<?php
/**
 * My enums.
 * To access use: config('enums.status')
 */

return [
    'status' => [
        'queue' => 'queue',             // added to the queue for processing
        'processing' => "processing",   // the feed is in processing right now
        'sending' => 'sending',         // prepared and waiting for sending
        'paused' => "paused",           // out of any processing, i.e. on pause
        'ready' => "ready",             // ready to be processed, i.e. waiting for scheduled time
    ],

    'type' => [
        'draft' => 'draft',             // Not published, maybe just imported from a feedly opml or from another source and waiting for finetuning
        'public' => 'public',           // Normal feed for our collection
        'private' => 'private'          // User's feed
    ]
];
