<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilmPlatform extends Model
{
    use HasFactory;

    protected $table = 'film_platforms';

    protected $fillable = [
        'film_id',
        'platform_name',
        'url',
    ];

    public function film()
    {
        return $this->belongsTo(Film::class);
    }
}
