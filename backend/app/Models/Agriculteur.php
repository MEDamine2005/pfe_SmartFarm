<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agriculteur extends Model
{
    protected $table = 'agriculteur';

    public $timestamps = false;

    protected $fillable = ['id', 'phone', 'ferme_id'];

    protected function casts(): array
    {
        return ['ferme_id' => 'integer'];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }
}
