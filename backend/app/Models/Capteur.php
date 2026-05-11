<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capteur extends Model
{
    protected $table = 'capteurs';

    public $timestamps = false;

    protected $fillable = ['type', 'valeur', 'unite', 'timestamp'];

    protected function casts(): array
    {
        return [
            'valeur' => 'float',
            'timestamp' => 'datetime',
        ];
    }
}
