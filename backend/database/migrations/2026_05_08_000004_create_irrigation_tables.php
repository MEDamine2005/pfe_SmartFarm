<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reglerIrrigation', function (Blueprint $table) {
            $table->id();
            $table->float('seuil_humidite');
            $table->integer('dueree');
            $table->boolean('active');
        });

        Schema::create('pompe', function (Blueprint $table) {
            $table->id();
            $table->boolean('etat');
            $table->float('dabit');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pompe');
        Schema::dropIfExists('reglerIrrigation');
    }
};
