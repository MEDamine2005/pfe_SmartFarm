<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerte;
use App\Models\Capteur;
use App\Models\Pompe;
use App\Models\ReglerIrrigation;
use App\Models\SystemeIoT;
use Illuminate\Http\Request;

class IotController extends Controller
{
    public function storeReadings(Request $request)
    {
        $this->authorizeDevice($request);

        $data = $request->validate([
            'device_id' => ['nullable', 'string', 'max:255'],
            'temperature' => ['required', 'numeric'],
            'humidite_air' => ['required', 'numeric'],
            'humidite_sol' => ['required', 'numeric'],
            'luminosite' => ['required', 'numeric'],
            'niveau_eau' => ['required', 'numeric'],
            'pompe_etat' => ['nullable', 'boolean'],
        ]);

        SystemeIoT::updateOrCreate(
            ['device_id' => $data['device_id'] ?? 'ESP-12E-8266'],
            ['module' => 'ESP-12E 8266', 'etat' => 'online'],
        );

        $timestamp = now();
        $capteurs = [
            ['type' => 'temperature', 'valeur' => $data['temperature'], 'unite' => 'C'],
            ['type' => 'humidite_air', 'valeur' => $data['humidite_air'], 'unite' => '%'],
            ['type' => 'humidite_sol', 'valeur' => $data['humidite_sol'], 'unite' => '%'],
            ['type' => 'luminosite', 'valeur' => $data['luminosite'], 'unite' => '%'],
            ['type' => 'niveau_eau', 'valeur' => $data['niveau_eau'], 'unite' => '%'],
        ];

        foreach ($capteurs as $capteur) {
            Capteur::create($capteur + ['timestamp' => $timestamp]);
        }

        $regle = ReglerIrrigation::firstOrCreate([], [
            'seuil_humidite' => 40,
            'dueree' => 15,
            'active' => false,
        ]);

        $pompe = Pompe::firstOrCreate([], [
            'etat' => false,
            'dabit' => 0,
        ]);

        if ($data['niveau_eau'] < 15) {
            $pompe->update(['etat' => false]);

            Alerte::create([
                'type' => 'danger',
                'message' => 'Niveau eau faible.',
                'timestamp' => $timestamp,
                'lue' => false,
            ]);
        }

        if ($data['humidite_sol'] < $regle->seuil_humidite) {
            Alerte::create([
                'type' => 'warning',
                'message' => 'Humidite du sol inferieure au seuil irrigation.',
                'timestamp' => $timestamp,
                'lue' => false,
            ]);
        }

        if ($data['niveau_eau'] >= 15 && $regle->active) {
            $pompe->update(['etat' => $data['humidite_sol'] < $regle->seuil_humidite]);
        } elseif (array_key_exists('pompe_etat', $data)) {
            $pompe->update(['etat' => $data['pompe_etat']]);
        }

        return response()->json([
            'message' => 'readings_saved',
            'pompe_etat' => $pompe->fresh()->etat,
            'reglerIrrigation' => $regle,
        ], 201);
    }

    public function command(Request $request)
    {
        $this->authorizeDevice($request);

        $regle = ReglerIrrigation::firstOrCreate([], [
            'seuil_humidite' => 40,
            'dueree' => 15,
            'active' => false,
        ]);

        $pompe = Pompe::firstOrCreate([], [
            'etat' => false,
            'dabit' => 0,
        ]);

        return response()->json([
            'pompe_etat' => $pompe->etat,
            'seuil_humidite' => $regle->seuil_humidite,
            'dueree' => $regle->dueree,
            'active' => $regle->active,
        ]);
    }

    private function authorizeDevice(Request $request): void
    {
        $configuredKey = (string) config('iot.device_key');
        $deviceKey = (string) $request->header('X-IOT-KEY', $request->input('iot_key', ''));

        if ($deviceKey === '' && config('app.env') === 'local') {
            return;
        }

        abort_unless($configuredKey !== '' && hash_equals($configuredKey, $deviceKey), 401, 'Invalid IoT key.');
    }
}
