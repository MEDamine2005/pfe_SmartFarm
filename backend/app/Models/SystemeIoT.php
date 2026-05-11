<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemeIoT extends Model
{
    protected $table = 'SystemeIoT';

    public $timestamps = false;

    protected $fillable = ['arduino_id', 'esp8266_id', 'etat'];
}
