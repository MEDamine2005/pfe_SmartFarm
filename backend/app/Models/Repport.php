<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repport extends Model
{
    protected $table = 'Repport';

    public $timestamps = false;

    protected $fillable = ['type', 'date_debut', 'date_fin'];

    protected function casts(): array
    {
        return [
            'date_debut' => 'datetime',
            'date_fin' => 'datetime',
        ];
    }
}
