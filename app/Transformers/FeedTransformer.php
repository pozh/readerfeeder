<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Feed;

class FeedTransformer extends TransformerAbstract
{
    /**
     * @return  array
     */
    public function transform(Feed $feed)
    {
        $sources = $feed->sources();
        $result = $feed->attributesToArray();
        $result['sources'] = [];
        if (count($sources) > 0) {
            foreach ($sources as $source) {
                $result['sources'][] = $source->attributesToArray();
            }
        }

        return $result;
    }
}
