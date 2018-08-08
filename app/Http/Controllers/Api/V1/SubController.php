<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Http\Resources\Subscription as SubscriptionResource;
use Auth;

class SubController extends BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        if (!$user = Auth::user()) return response()->json(['user_not_found'], 404);
        $subs = $user->subscriptions();
        return SubscriptionResource::collection($subs);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     */
    public function show($id)
    {
        $sub = Subscription::findOrFail($id);
        if (!$sub) return response()->json(['subscription_not_found'], 404);
        else return new SubscriptionResource($sub);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        if (!$user = Auth::user()) {
            return response()->errorForbidden(trans('auth.incorrect'));
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
     * @param  Request $request
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $sub = $this->sub->findOrFail($id);
        if (!$sub) {
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
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $sub = $this->sub->findOrFail($id);
        if (!$sub) {
            return $this->response->errorNotFound();
        }

        if (!$sub->delete()) {
            return $this->response->errorInternal();
        }

        return $this->response->noContent();
    }

}
