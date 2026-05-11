<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Capteur;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function latest()
    {
        $readings = Capteur::query()
            ->orderByDesc('timestamp')
            ->get()
            ->unique('type')
            ->values();

        $byType = $readings->keyBy('type');

        return response()->json([
            'data' => [
                'capteurs' => $readings,
                'temperature' => $byType->get('temperature')?->valeur,
                'humidite_air' => $byType->get('humidite_air')?->valeur,
                'humidite_sol' => $byType->get('humidite_sol')?->valeur,
                'luminosite' => $byType->get('luminosite')?->valeur,
                'niveau_eau' => $byType->get('niveau_eau')?->valeur,
            ],
        ]);
    }

    public function history(Request $request)
    {
        $range = $request->query('range', '24h');
        $hours = $range === '7d' ? 168 : ($range === '30d' ? 720 : 24);

        return response()->json([
            'data' => Capteur::where('timestamp', '>=', now()->subHours($hours))
                ->orderBy('timestamp')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'valeur' => ['required', 'numeric'],
            'unite' => ['required', 'string', 'max:50'],
            'timestamp' => ['nullable', 'date'],
        ]);

        $reading = Capteur::create($data + ['timestamp' => $data['timestamp'] ?? now()]);

        return response()->json(['data' => $reading], 201);
    }
}
