<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donnerMeteo', function (Blueprint $table) {
            $table->id();
            $table->float('temperature');
            $table->float('himidite');
            $table->float('precipitation');
            $table->dateTime('timestamp')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donnerMeteo');
    }
};
