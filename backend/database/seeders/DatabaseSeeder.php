<?php

namespace Database\Seeders;

use App\Models\Administrateur;
use App\Models\Agriculteur;
use App\Models\Alerte;
use App\Models\Capteur;
use App\Models\DonnerMeteo;
use App\Models\Pompe;
use App\Models\ReglerIrrigation;
use App\Models\Repport;
use App\Models\SystemeIoT;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $agriculteur = User::updateOrCreate(
            ['email' => 'farmer@smartfarm.local'],
            ['role' => 'agriculteur', 'password' => Hash::make('1234')]
        );

        Agriculteur::updateOrCreate(
            ['id' => $agriculteur->id],
            ['phone' => '0600000000', 'ferme_id' => 1]
        );

        $administrateur = User::updateOrCreate(
            ['email' => 'admin@smartfarm.local'],
            ['role' => 'administrateur', 'password' => Hash::make('1234')]
        );

        Administrateur::updateOrCreate(['id' => $administrateur->id]);

        collect([
            ['temperature', 27.5, 'C'],
            ['humidite_sol', 42.3, '%'],
            ['luminosite', 650, 'lux'],
        ])->each(fn ($capteur) => Capteur::create([
            'type' => $capteur[0],
            'valeur' => $capteur[1],
            'unite' => $capteur[2],
            'timestamp' => now(),
        ]));

        DonnerMeteo::create([
            'temperature' => 30,
            'himidite' => 55,
            'precipitation' => 5,
            'timestamp' => now(),
        ]);

        ReglerIrrigation::create([
            'seuil_humidite' => 40,
            'dueree' => 15,
            'active' => true,
        ]);

        Pompe::create([
            'etat' => false,
            'dabit' => 0,
        ]);

        Alerte::create([
            'type' => 'warning',
            'message' => 'Soil moisture dropped near the warning threshold.',
            'timestamp' => now(),
            'lue' => false,
        ]);

        Alerte::create([
            'type' => 'info',
            'message' => 'Light rain is expected soon. Consider postponing irrigation.',
            'timestamp' => now(),
            'lue' => true,
        ]);

        SystemeIoT::create([
            'device_id' => 'ESP-12E-8266',
            'module' => 'ESP-12E 8266',
            'etat' => 'online',
        ]);

        Repport::create([
            'type' => 'irrigation',
            'date_debut' => now()->subDay(),
            'date_fin' => now(),
        ]);
    }
}
