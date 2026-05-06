<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

protected $fillable = [
    'order_number',
    'user_id',
    'subtotal',          // ← baru
    'shipping_fee',      // ← baru
    'tax_amount',        // ← baru
    'total_amount',
    'payment_status',
    'payment_type',
    'snap_token',
    'customer_name',
    'customer_email',
    'customer_phone',    // ← baru
    'customer_address',
    'notes',             // ← baru
];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
