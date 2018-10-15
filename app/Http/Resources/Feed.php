<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Feed extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'user_id' => $this->user_id,
            'last_sent' => $this->last_sent,
            'status' => $this->status,
            'period' => $this->period,
            'schedule_day' => $this->schedule_day,
            'schedule_time' => $this->schedule_time,
            'type' => $this->type,
            'category_id' => $this->category_id,
            'description' => $this->description,
            'sources' => $this->sources()->get(),
            'items' => $this->items()->orderBy('id', 'desc')->take(20)->get(),
            'slug' => $this->slug,
            'subscribers' => $this->subscribers,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
