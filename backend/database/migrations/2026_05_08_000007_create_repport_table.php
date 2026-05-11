<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Repport', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Repport');
    }
};
