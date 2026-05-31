<?php

namespace Tests;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Str;

abstract class TestCase extends BaseTestCase
{
    protected function bearerTokenFor(User $user): string
    {
        $plain = Str::random(80);

        ApiToken::create([
            'user_id' => $user->id,
            'name' => 'test',
            'token_hash' => hash('sha256', $plain),
            'expires_at' => now()->addDay(),
        ]);

        return $plain;
    }

    protected function actingAsApiUser(?User $user = null): static
    {
        $user ??= User::factory()->create(['role' => 'agriculteur']);

        return $this->withToken($this->bearerTokenFor($user));
    }
}
