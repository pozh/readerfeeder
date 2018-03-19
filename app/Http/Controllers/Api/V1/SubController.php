<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Transformers\SubTransformer;


class SubController extends BaseController
{
    protected $sub;

    public function __construct(Subscription $sub)
    {
        $this->sub = $sub;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $subs =  $this->sub->all(); //paginate(25);
        return $this->response->collection($subs, new SubTransformer()); // paginator($subs, new SubTransformer());
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $sub = $this->sub->findOrFail($id);
        if (! $sub) {
            return $this->response->errorNotFound();
        }

        return $this->response->item($sub, new SubTransformer);
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
            'user_id' => 'required',
            'feed_id' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->errorBadRequest($validator->messages());
        }

        $attributes = [
            'user_id' =>  $request->get('user'),
            'feed_id' => $request->get('feed'),
        ];
        $this->sub->create($attributes);

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
        $sub = $this->sub->findOrFail($id);
        if (! $sub) {
            return $this->response->errorNotFound();
        }

        $validator = \Validator::make($request->input(), [
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->errorBadRequest($validator->messages());
        }

        $sub->status = $request->get('status');
        $sub->update();

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
        $sub = $this->sub->findOrFail($id);
        if (! $sub) {
            return $this->response->errorNotFound();
        }

        if( !$sub->delete() ) {
            return $this->response->errorInternal();
        }

        return $this->response->noContent();
    }

}
