<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Administrateur;
use App\Models\Agriculteur;
use App\Models\Alerte;
use App\Models\Capteur;
use App\Models\Pompe;
use App\Models\Repport;
use App\Models\SystemeIoT;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function reports()
    {
        return response()->json([
            'data' => [
                'users' => User::count(),
                'agriculteurs' => Agriculteur::count(),
                'administrateurs' => Administrateur::count(),
                'alertes_non_lues' => Alerte::where('lue', false)->count(),
                'capteurs' => Capteur::count(),
                'pompes_actives' => Pompe::where('etat', true)->count(),
                'repports' => Repport::count(),
                'dernier_capteur' => Capteur::latest('timestamp')->first(),
            ],
        ]);
    }

    public function users()
    {
        return response()->json(['data' => User::with(['agriculteur', 'administrateur'])->get()]);
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'role' => ['required', 'in:agriculteur,administrateur'],
            'phone' => ['required_if:role,agriculteur', 'string', 'max:50'],
            'ferme_id' => ['required_if:role,agriculteur', 'integer', 'min:1'],
        ]);

        $user = User::create([
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
        ]);

        if ($data['role'] === 'agriculteur') {
            Agriculteur::create([
                'id' => $user->id,
                'phone' => $data['phone'],
                'ferme_id' => $data['ferme_id'],
            ]);
        } else {
            Administrateur::create(['id' => $user->id]);
        }

        return response()->json(['data' => $user], 201);
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'email' => ['sometimes', 'email', 'unique:users,email,'.$user->id],
            'password' => ['sometimes', 'string', 'min:4'],
            'role' => ['sometimes', 'in:agriculteur,administrateur'],
            'phone' => ['sometimes', 'string', 'max:50'],
            'ferme_id' => ['sometimes', 'integer', 'min:1'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update(collect($data)->only(['email', 'password', 'role'])->all());

        if ($user->role === 'agriculteur' && (isset($data['phone']) || isset($data['ferme_id']))) {
            Agriculteur::updateOrCreate(
                ['id' => $user->id],
                [
                    'phone' => $data['phone'] ?? $user->agriculteur?->phone ?? '',
                    'ferme_id' => $data['ferme_id'] ?? $user->agriculteur?->ferme_id ?? 1,
                ],
            );
        }

        return response()->json(['data' => $user]);
    }

    public function devices()
    {
        return response()->json(['data' => SystemeIoT::all()]);
    }

    public function updateDevice(Request $request, SystemeIoT $device)
    {
        $data = $request->validate([
            'arduino_id' => ['sometimes', 'string', 'max:255'],
            'esp8266_id' => ['sometimes', 'string', 'max:255'],
            'etat' => ['sometimes', 'string', 'max:255'],
        ]);

        $device->update($data);

        return response()->json(['data' => $device]);
    }
}
