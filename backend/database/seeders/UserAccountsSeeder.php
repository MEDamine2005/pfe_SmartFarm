<?php

namespace Database\Seeders;

use App\Models\Administrateur;
use App\Models\Agriculteur;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $farmer = User::updateOrCreate(
            ['email' => 'farmer@smartfarm.local'],
            ['role' => 'agriculteur', 'password' => Hash::make('1234')]
        );

        Agriculteur::updateOrCreate(
            ['id' => $farmer->id],
            ['phone' => '0600000000', 'ferme_id' => 1]
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@smartfarm.local'],
            ['role' => 'administrateur', 'password' => Hash::make('1234')]
        );

        Administrateur::updateOrCreate(['id' => $admin->id]);
    }
}
