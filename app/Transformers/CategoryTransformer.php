<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Category;

class CategoryTransformer extends TransformerAbstract
{
    /**
     * @return  array
     */
    public function transform(Category $product)
    {
        return $product->attributesToArray();
    }
}
