<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EpisodePlatform extends Model
{
    use HasFactory;

    protected $fillable = [
        'episode_id',
        'platform_name',
        'url',
    ];

    public function episode()
    {
        return $this->belongsTo(Episode::class);
    }
}
