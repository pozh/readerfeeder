<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Mockery\Exception;
use Socialite;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
//        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function register(Request $request)
    {
        \Log::debug('register', $request->toArray());
        $validator =  Validator::make($request->all(),[
            'first_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
            return response()->json([
                "message" => $validator->errors(),
            ], 422);
        }

        $request->merge(['password' => Hash::make($request->password)]);
        try {
            $user = User::create($request->all());
            return response()->json([
                'user' => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Unable to register user"
            ], 400);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        \Log::debug('login attempt', $credentials);

        try {
            // attempt to verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    "error" => "invalid_credentials",
                    "message" => "The user credentials were incorrect. "
                ], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json([
                "error" => "could_not_create_token",
                "message" => "Enable to process request."
            ], 422);
        }

        // all good so return the token
        $user = User::where('email', $request->get('email'))->first();
        return response()->json([
            'user' => $user,
            'usermeta' => $user->meta(),
            'token' => $token,
        ], 200);

    }

    public function handleSocial(Request $request)
    {
        $credentials = $request->only('provider', 'token', 'name', 'email');
        \Log::debug('social login: ' . $request->get('provider'), $credentials);

        try {
            $user = User::firstOrNew(['email' => $request->get('email')]);
            if (!$user->id) {
                $user->fill([
                    "first_name" => $request->get('name'),
                    "password" => bcrypt(str_random(6))
                ]);
                $user->save();
            }
            $token = JWTAuth::fromUser($user);
            \Log::debug('jwt token', [$token]);
            return response()->json([
                'user' => $user,
                'usermeta' => $user->meta(),
                'token' => $token,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => __('auth.socialfailed')
            ], 400);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refreshToken()
    {
        return $this->response->respondWithToken(auth()->refresh());
    }

    public function checkToken()
    {
        if (!$user = JWTAuth::parseToken()->toUser())
        {
            $this->response->errorForbidden(trans('auth.incorrect'));
        }
        else
        {
            return $this->response->array(compact('token'));
        }
    }
}
