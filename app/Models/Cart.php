<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'session_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // Helper untuk load product sekaligus
    public function itemsWithProduct()
    {
        return $this->items()->with('product');
    }

    // Total harga keranjang
    public function getTotalAttribute()
    {
        return $this->items->sum(function ($item) {
            return $item->quantity * ($item->unit_price ?? $item->product?->price ?? 0);
        });
    }

    // Total jumlah item (untuk badge cart)
    public function getCountAttribute()
    {
        return $this->items->sum('quantity');
    }
}
