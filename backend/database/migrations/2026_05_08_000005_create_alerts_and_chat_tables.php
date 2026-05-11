<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerte', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->text('message');
            $table->dateTime('timestamp');
            $table->boolean('lue');
        });

        Schema::create('ChatIA', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('reponse');
            $table->dateTime('timestamp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ChatIA');
        Schema::dropIfExists('alerte');
    }
};
