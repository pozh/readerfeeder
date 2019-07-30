<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\User as UserResource;
use Auth;
use Validator;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::paginate(50);
        return UserResource::collection($users);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        if (!$user) return response()->json(["message" => "User not found"], 404);
        else return new UserResource($user);
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
        $validator =  Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'kindle_email' => 'required|string|email|max:255',
        ]);

        if($validator->fails()){
            return response()->json([
                "message" => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::find($id);
            $user->first_name = $request->first_name;
            $user->settings = json_encode(['kindle_email' => $request->kindle_email]);
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                "message" => "Unable to update user"
            ], 400);
        }
        return response()->json([
            'user' => $user,
        ], 200);
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
        if (!$user) {
            return response()->json(["message" => "User not found"], 404);
        }

        if( !$user->delete() ) {
            return response()->json(["message" => "Internal error"], 500);
        }

        return response()->json(["message" => "Deleted"], 200);
    }


}
