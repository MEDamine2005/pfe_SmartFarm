<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerte;

class AlertController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Alerte::orderByDesc('timestamp')->get()]);
    }

    public function markRead(Alerte $alert)
    {
        $alert->update(['lue' => true]);

        return response()->json(['data' => $alert]);
    }

    public function destroy(Alerte $alert)
    {
        $alert->delete();

        return response()->json(status: 204);
    }
}
