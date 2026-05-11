<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrateur extends Model
{
    protected $table = 'administrateur';

    public $timestamps = false;

    protected $fillable = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }
}
