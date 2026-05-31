<?php

namespace Tests\Feature;

use App\Models\Pompe;
use App\Models\ReglerIrrigation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IrrigationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_irrigation_can_be_activated_and_deactivated(): void
    {
        ReglerIrrigation::create(['seuil_humidite' => 40, 'dueree' => 15, 'active' => false]);
        Pompe::create(['etat' => false, 'dabit' => 0]);

        $this->actingAsApiUser()
            ->postJson('/api/irrigation', ['action' => 'executer'])
            ->assertOk()
            ->assertJsonPath('data.pompe.etat', true);

        $this->actingAsApiUser()
            ->postJson('/api/irrigation', ['action' => 'dasactiver'])
            ->assertOk()
            ->assertJsonPath('data.pompe.etat', false);
    }

    public function test_iot_triggers_pump_when_soil_below_threshold_in_auto_mode(): void
    {
        config(['iot.device_key' => 'smart-farm-iot-2026']);

        ReglerIrrigation::create(['seuil_humidite' => 40, 'dueree' => 15, 'active' => true]);
        Pompe::create(['etat' => false, 'dabit' => 0]);

        $this
            ->withHeader('X-IOT-KEY', 'smart-farm-iot-2026')
            ->postJson('/api/iot/readings', [
                'temperature' => 26,
                'humidite_air' => 55,
                'humidite_sol' => 25,
                'luminosite' => 70,
                'niveau_eau' => 80,
            ])
            ->assertCreated()
            ->assertJsonPath('pompe_etat', true);
    }
}
