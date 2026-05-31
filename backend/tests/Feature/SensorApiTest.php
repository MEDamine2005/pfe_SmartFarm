<?php

namespace Tests\Feature;

use App\Models\Capteur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SensorApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_latest_sensors_returns_most_recent_values_by_type(): void
    {
        Capteur::create([
            'type' => 'temperature',
            'valeur' => 25,
            'unite' => 'C',
            'timestamp' => now()->subHour(),
        ]);
        Capteur::create([
            'type' => 'temperature',
            'valeur' => 28,
            'unite' => 'C',
            'timestamp' => now(),
        ]);
        Capteur::create([
            'type' => 'humidite_sol',
            'valeur' => 42,
            'unite' => '%',
            'timestamp' => now(),
        ]);

        $response = $this->actingAsApiUser()->getJson('/api/sensors');

        $response
            ->assertOk()
            ->assertJsonPath('data.temperature', 28)
            ->assertJsonPath('data.humidite_sol', 42);
    }

    public function test_sensor_history_filters_by_range(): void
    {
        Capteur::create([
            'type' => 'humidite_air',
            'valeur' => 60,
            'unite' => '%',
            'timestamp' => now()->subHours(2),
        ]);

        $this->actingAsApiUser()
            ->getJson('/api/sensors/history?range=24h')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }
}
