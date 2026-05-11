<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatIA extends Model
{
    protected $table = 'ChatIA';

    public $timestamps = false;

    protected $fillable = ['question', 'reponse', 'timestamp'];

    protected function casts(): array
    {
        return ['timestamp' => 'datetime'];
    }
}
