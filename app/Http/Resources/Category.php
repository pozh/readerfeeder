<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Category extends JsonResource
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
            'description' => $this->description,
            'slug' => $this->slug,
            'small_image' => empty($this->small_image) ? '' : asset('storage/' . $this->small_image),
            'large_image' => empty($this->large_image) ? '' : asset('storage/' . $this->large_image),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
