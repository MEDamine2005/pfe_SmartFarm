<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_token_for_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'farmer@smartfarm.local',
            'password' => Hash::make('1234'),
            'role' => 'agriculteur',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'farmer@smartfarm.local',
            'password' => '1234',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure(['token', 'token_type', 'user' => ['id', 'email', 'role']]);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'farmer@smartfarm.local',
            'password' => Hash::make('1234'),
            'role' => 'agriculteur',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'farmer@smartfarm.local',
            'password' => 'wrong',
        ])->assertStatus(422);
    }

    public function test_protected_route_requires_token(): void
    {
        $this->getJson('/api/sensors')->assertUnauthorized();
    }

    public function test_authenticated_user_can_access_sensors(): void
    {
        $this->actingAsApiUser()
            ->getJson('/api/sensors')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }
}
