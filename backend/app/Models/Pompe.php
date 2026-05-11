<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pompe extends Model
{
    protected $table = 'pompe';

    public $timestamps = false;

    protected $fillable = ['etat', 'dabit'];

    protected function casts(): array
    {
        return [
            'etat' => 'boolean',
            'dabit' => 'float',
        ];
    }
}
