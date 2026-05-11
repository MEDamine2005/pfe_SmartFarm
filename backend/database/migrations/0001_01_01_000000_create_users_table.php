<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role');
        });

        Schema::create('agriculteur', function (Blueprint $table) {
            $table->foreignId('id')->primary()->constrained('users')->cascadeOnDelete();
            $table->string('phone');
            $table->unsignedBigInteger('ferme_id');
        });

        Schema::create('administrateur', function (Blueprint $table) {
            $table->foreignId('id')->primary()->constrained('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('administrateur');
        Schema::dropIfExists('agriculteur');
        Schema::dropIfExists('users');
    }
};
