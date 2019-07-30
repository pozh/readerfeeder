<?php

namespace App\Http\Controllers\API\V1\Auth;

//use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
//use JWTAuth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use Socialite;


class AuthController extends BaseController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

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

    public function socialLogin($social)
    {
        if ($social == "facebook" || $social == "google" || $social == "linkedin") {
            return Socialite::driver($social)->stateless()->redirect();
        } else {
            return Socialite::driver($social)->redirect();
        }
    }

    public function handleProviderCallback($social)
    {
        if ($social == "facebook" || $social == "google" || $social == "linkedin") {
            $userSocial = Socialite::driver($social)->stateless()->user();
        } else {
            $userSocial = Socialite::driver($social)->user();
        }

        $token = $userSocial->token;

        $user = User::firstOrNew(['email' => $userSocial->getEmail()]);

        if (!$user->id) {
            $user->fill(["first_name" => $userSocial->getName(), "password" => bcrypt(str_random(6))]);
            $user->save();
        }

        return response()->json([
            'user' => [$user],
            'userSocial' => $userSocial,
            'token' => $token,
        ], 200);
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
