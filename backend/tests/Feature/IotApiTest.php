<?php

namespace Tests\Feature;

use App\Models\Capteur;
use App\Models\Pompe;
use App\Models\SystemeIoT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IotApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_esp12e_can_store_readings_and_receive_pump_command(): void
    {
        config(['iot.device_key' => 'smart-farm-iot-2026']);

        $response = $this
            ->withHeader('X-IOT-KEY', 'smart-farm-iot-2026')
            ->postJson('/api/iot/readings', [
                'temperature' => 27.4,
                'humidite_air' => 58,
                'humidite_sol' => 36,
                'luminosite' => 70,
                'niveau_eau' => 80,
                'pompe_etat' => false,
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('message', 'readings_saved');

        $this->assertSame(5, Capteur::count());
        $this->assertTrue(SystemeIoT::where('device_id', 'ESP-12E-8266')->where('etat', 'online')->exists());

        Pompe::first()->update(['etat' => true]);

        $this
            ->withHeader('X-IOT-KEY', 'smart-farm-iot-2026')
            ->getJson('/api/iot/command')
            ->assertOk()
            ->assertJsonPath('pompe_etat', true);
    }

    public function test_esp12e_local_payload_works_without_device_key_header(): void
    {
        config(['app.env' => 'local', 'iot.device_key' => 'smart-farm-iot-2026']);

        $this
            ->postJson('/api/iot/readings', [
                'temperature' => 25.2,
                'humidite_air' => 62,
                'humidite_sol' => 44,
                'luminosite' => 1,
                'niveau_eau' => 1,
            ])
            ->assertCreated()
            ->assertJsonPath('message', 'readings_saved');

        $this->assertSame(5, Capteur::count());
    }

    public function test_iot_api_rejects_invalid_device_key(): void
    {
        config(['iot.device_key' => 'smart-farm-iot-2026']);

        $this
            ->withHeader('X-IOT-KEY', 'wrong-key')
            ->getJson('/api/iot/command')
            ->assertUnauthorized();
    }
}
