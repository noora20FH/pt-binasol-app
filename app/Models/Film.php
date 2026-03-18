<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Film extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'genres',
        'rating',
        'year',
        'poster',
        'banner',
        'is_featured',
    ];

    protected $casts = [
        'rating' => 'float',
        'is_featured' => 'boolean',
    ];

    public function filmCasts()
    {
        return $this->hasMany(Cast::class);
    }

    public function episodes()
    {
        return $this->hasMany(Episode::class);
    }
}
