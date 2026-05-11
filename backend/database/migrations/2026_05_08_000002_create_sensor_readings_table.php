<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capteurs', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->float('valeur');
            $table->string('unite');
            $table->dateTime('timestamp')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capteurs');
    }
};
