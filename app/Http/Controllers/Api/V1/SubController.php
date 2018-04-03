<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Transformers\SubTransformer;
use Tymon\JWTAuth\Facades\JWTAuth;


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
        if (!$user = JWTAuth::parseToken()->toUser()) {
            $this->response->errorForbidden(trans('auth.incorrect'));
        }
        $subs = $user->subscriptions();
//        return $this->response->array(array('data' => array_flatten($subs->toArray())));
        return $this->response->collection($subs, new SubTransformer());
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
        if (!$user = JWTAuth::parseToken()->toUser()) {
            $this->response->errorForbidden(trans('auth.incorrect'));
        }

        $validator = \Validator::make($request->input(), [
            'feed_id' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->errorBadRequest($validator->messages());
        }

        $attributes = [
            'user_id' => $user->id,
            'feed_id' => $request->get('feed_id'),
        ];
        $newSub = $this->sub->create($attributes);

        return $this->response->item($newSub, new SubTransformer);
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
