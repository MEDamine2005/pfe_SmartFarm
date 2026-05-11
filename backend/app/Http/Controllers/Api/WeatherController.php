<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonnerMeteo;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function latest()
    {
        return response()->json(['data' => DonnerMeteo::latest('timestamp')->first()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'temperature' => ['required', 'numeric'],
            'himidite' => ['required', 'numeric'],
            'precipitation' => ['required', 'numeric'],
            'timestamp' => ['nullable', 'date'],
        ]);

        $weather = DonnerMeteo::create($data + ['timestamp' => $data['timestamp'] ?? now()]);

        return response()->json(['data' => $weather], 201);
    }
}
