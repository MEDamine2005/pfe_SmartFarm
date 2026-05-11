<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonnerMeteo extends Model
{
    protected $table = 'donnerMeteo';

    public $timestamps = false;

    protected $fillable = ['temperature', 'himidite', 'precipitation', 'timestamp'];

    protected function casts(): array
    {
        return [
            'temperature' => 'float',
            'himidite' => 'float',
            'precipitation' => 'float',
            'timestamp' => 'datetime',
        ];
    }
}
