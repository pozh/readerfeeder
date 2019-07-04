<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\Feed;
use Feeds;
use Response;
use App\Http\Resources\Feed as FeedResource;


class FeedController extends BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return FeedResource::collection(Feed::all());
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $feed = Feed::findOrFail($id);
        if (!$feed) abort(404);
        else return new FeedResource($feed);
    }

    /**
     * Display the specified resource.
     *
     * @param string $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function showBySlug($slug)
    {
        $feed = Feed::where('slug', $slug)->firstOrFail();
        if (!$feed) abort(404);
        else return new FeedResource($feed);
    }

    public function getFeedItems($slug)
    {
        $feed = Feed::where('slug', $slug)->firstOrFail();
        if (!$feed) abort(404);
        else {
            $items = [];
            foreach ( $feed->sources as $src ) {
                \Log::debug($src->title);
                $sp_feed   = Feeds::make( $src->url, true );
                $src_items = array_slice($sp_feed->get_items(), 0, $src->count);
                foreach ($src_items as $item) {
                    $record = [
                        'url' => $item->get_permalink(),
                        'title' => $item->get_title(),
                        'timestamp' => $item->get_date('U')
                    ];
                    $items[] = $record;
                }
            }
            return Response::json(['data'=>$items]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->input(), [
            'title' => 'required',
            'type' => 'required',
            'description' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->errorBadRequest($validator->messages());
        }

        $attributes = [
            'code' => $request->get('code'),
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
     * @param  Request $request
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $feed = $this->feed->findOrFail($id);
        if (!$feed) {
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

        $feed->code = $request->get('code');
        $feed->name = $request->get('name');
        $feed->description = $request->get('description');
        $feed->status = $request->get('status');
        $feed->update();

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
        $feed = $this->feed->findOrFail($id);
        if (!$feed) {
            return $this->response->errorNotFound();
        }

        if (!$feed->delete()) {
            return $this->response->errorInternal();
        }

        return $this->response->noContent();
    }


}
