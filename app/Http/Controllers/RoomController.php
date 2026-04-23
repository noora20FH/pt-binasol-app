<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::where('is_active', true)
            ->orderBy('order_priority', 'asc')
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id,
                'name'        => $r->name,
                'type'        => $r->type,
                'capacity'    => $r->capacity,
                'size'        => $r->size,
                'description' => $r->description,
                'image'       => $r->image ? Storage::url($r->image) : null,
                'price_unit'  => $r->price_unit,
                'facilities'  => $r->facilities ?? [],
            ]);

        return inertia('SewaRuangan', ['rooms' => $rooms]);
    }
}
