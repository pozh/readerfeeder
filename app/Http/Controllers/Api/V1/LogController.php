<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Resources\Log as LogResource;
use Auth;
use Spatie\Activitylog\Models\Activity;


class LogController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $logs = Activity::paginate(50);
        return LogResource::collection($logs);
    }
}
