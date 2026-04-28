<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cast extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'casts';

    protected $fillable = [
        'film_id',
        'name',
        'role',
        'image',
    ];

    public function film()
    {
        return $this->belongsTo(Film::class);
    }
}
