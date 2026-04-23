<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'capacity',
        'size',
        'description',
        'image',
        'price_unit',
        'facilities',
        'is_active',
        'order_priority',
    ];

    protected $casts = [
        'facilities'     => 'array',
        'is_active'      => 'boolean',
        'order_priority' => 'integer',
    ];
}
