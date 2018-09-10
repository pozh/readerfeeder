<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\User as UserResource;
use Auth;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = $this->user->paginate(25);
        return $this->response->paginator($users, new UserTransformer);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {

        $user = $this->user->findOrFail($id);
        if (! $user) {
            return $this->response->errorNotFound();
        }

        return $this->response->item($user, new UserTransformer);
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
      return true;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if (! $user) {
            return $this->response->errorNotFound();
        }

        if( !$user->delete() ) {
            return $this->response->errorInternal();
        }

        return $this->response->noContent();
    }


}
