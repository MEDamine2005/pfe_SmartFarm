<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReglerIrrigation extends Model
{
    protected $table = 'reglerIrrigation';

    public $timestamps = false;

    protected $fillable = ['seuil_humidite', 'dueree', 'active'];

    protected function casts(): array
    {
        return [
            'seuil_humidite' => 'float',
            'dueree' => 'integer',
            'active' => 'boolean',
        ];
    }
}
