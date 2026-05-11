<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerte extends Model
{
    protected $table = 'alerte';

    public $timestamps = false;

    protected $fillable = ['type', 'message', 'timestamp', 'lue'];

    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
            'lue' => 'boolean',
        ];
    }
}
