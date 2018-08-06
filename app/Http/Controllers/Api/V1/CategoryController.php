<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\Category as CategoryResource;
use App\Transformers\CategoryTransformer;


class CategoryController extends BaseController
{
    protected $cat;

    public function __construct(Category $cat)
    {
        $this->cat = $cat;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return CategoryResource::collection(Category::all());
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {

        $cat = $this->cat->findOrFail($id);
        if (! $cat) {
            return $this->response->errorNotFound();
        }

        return $this->response->item($cat, new CategoryTransformer);
    }


    /**
     * Display the specified resource.
     *
     * @param string $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function showBySlug($slug)
    {

        $cat = $this->cat->where('slug', $slug)->firstOrFail();
        if (! $cat) {
            return $this->response->errorNotFound();
        }

        return $this->response->item($cat, new CategoryTransformer);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->input(), [
            'title' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->errorBadRequest($validator->messages());
        }

        $attributes = [
            'code' =>  $request->get('code'),
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'status' => $request->get('status'),
            'created_by' => 1,
        ];
        $this->feed->create($attributes);

        return $this->response->created();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $cat = $this->cat->findOrFail($id);
        if (! $cat) {
            return $this->response->errorNotFound();
        }

        $validator = \Validator::make($request->input(), [
            'code' => 'required',
            'name' => 'required',
            //'description' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->errorBadRequest($validator->messages());
        }

        $cat->title = $request->get('title');
        $cat->name = $request->get('name');
        $cat->status = $request->get('status');
        $cat->update();

        return $this->response->noContent();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cat = $this->cat->findOrFail($id);
        if (! $cat) {
            return $this->response->errorNotFound();
        }

        if( !$cat->delete() ) {
            return $this->response->errorInternal();
        }

        return $this->response->noContent();
    }


}
