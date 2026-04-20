<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Episode extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'film_id',
        'number',
        'title',
        'duration',
        'thumbnail',
    ];

    public function film()
    {
        return $this->belongsTo(Film::class);
    }


}
