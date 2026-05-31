<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pompe;
use App\Models\ReglerIrrigation;
use App\Models\Repport;
use Illuminate\Http\Request;

class IrrigationController extends Controller
{
    public function show()
    {
        return response()->json(['data' => [
            'reglerIrrigation' => $this->regle(),
            'pompe' => $this->pompe(),
        ]]);
    }

    public function control(Request $request)
    {
        $data = $request->validate([
            'action' => ['required', 'in:activer,dasactiver,evaluer,executer'],
            'seuil_humidite' => ['nullable', 'numeric'],
            'dueree' => ['nullable', 'integer', 'min:1', 'max:240'],
            'dabit' => ['nullable', 'numeric', 'min:0'],
        ]);

        $regle = $this->regle();
        $pompe = $this->pompe();

        $regle->update([
            'seuil_humidite' => $data['seuil_humidite'] ?? $regle->seuil_humidite,
            'dueree' => $data['dueree'] ?? $regle->dueree,
            'active' => in_array($data['action'], ['activer', 'executer'], true),
        ]);

        $pompe->update([
            'etat' => in_array($data['action'], ['activer', 'executer'], true),
            'dabit' => $data['dabit'] ?? $pompe->dabit,
        ]);

        return response()->json(['data' => [
            'reglerIrrigation' => $regle->fresh(),
            'pompe' => $pompe->fresh(),
        ]]);
    }

    public function events()
    {
        return response()->json([
            'data' => Repport::orderByDesc('date_fin')->limit(20)->get(),
        ]);
    }

    private function regle(): ReglerIrrigation
    {
        return ReglerIrrigation::firstOrCreate([], [
            'seuil_humidite' => 40,
            'dueree' => 15,
            'active' => false,
        ]);
    }

    private function pompe(): Pompe
    {
        return Pompe::firstOrCreate([], [
            'etat' => false,
            'dabit' => 0,
        ]);
    }
}
