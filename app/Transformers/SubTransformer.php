<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Subscription;

class SubTransformer extends TransformerAbstract
{
    /**
     * @return  array
     */
    public function transform(Subscription $sub)
    {
        return $sub->attributesToArray();
//        return [$sub->feed_id];
    }
}
