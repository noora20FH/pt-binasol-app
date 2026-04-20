<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::orderBy('order_priority', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'             => $r->id,
                'name'           => $r->name,
                'type'           => $r->type,
                'capacity'       => $r->capacity,
                'size'           => $r->size,
                'description'    => $r->description,
                'image'          => $r->image ? Storage::url($r->image) : null,
                'price_unit'     => $r->price_unit,
                'facilities'     => $r->facilities ?? [],
                'is_active'      => $r->is_active,
                'order_priority' => $r->order_priority,
                'created_at'     => $r->created_at?->toIso8601String(),
                'updated_at'     => $r->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/RoomManagement', ['rooms' => $rooms]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'type'           => 'nullable|string|max:100',
            'capacity'       => 'nullable|string|max:100',
            'size'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'price_unit'     => 'nullable|string|max:100',
            'facilities'     => 'nullable',
            'is_active'      => 'boolean',
            'order_priority' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'type', 'capacity', 'size', 'description', 'price_unit', 'is_active', 'order_priority']);
        $data['is_active'] = $request->boolean('is_active', true);
        $data['order_priority'] = $request->order_priority ?? 0;

        // Facilities
        if ($request->filled('facilities')) {
            $fac = is_string($request->facilities)
                ? json_decode($request->facilities, true)
                : $request->facilities;
            $data['facilities'] = is_array($fac) ? $fac : [];
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('rooms', 'public');
        }

        Room::create($data);

        return redirect()->back()->with('success', 'Ruangan berhasil ditambahkan!');
    }

    public function update(Request $request, Room $room)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'type'           => 'nullable|string|max:100',
            'capacity'       => 'nullable|string|max:100',
            'size'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'price_unit'     => 'nullable|string|max:100',
            'facilities'     => 'nullable',
            'is_active'      => 'boolean',
            'order_priority' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'type', 'capacity', 'size', 'description', 'price_unit', 'order_priority']);
        $data['is_active'] = $request->boolean('is_active', $room->is_active);
        $data['order_priority'] = $request->order_priority ?? $room->order_priority;

        if ($request->filled('facilities')) {
            $fac = is_string($request->facilities)
                ? json_decode($request->facilities, true)
                : $request->facilities;
            $data['facilities'] = is_array($fac) ? $fac : [];
        }

        if ($request->hasFile('image')) {
            if ($room->image) {
                Storage::disk('public')->delete($room->image);
            }
            $data['image'] = $request->file('image')->store('rooms', 'public');
        }

        $room->update($data);

        return redirect()->back()->with('success', 'Ruangan berhasil diperbarui!');
    }

    public function destroy(Room $room)
    {
        if ($room->image) {
            Storage::disk('public')->delete($room->image);
        }
        $room->delete();

        return redirect()->back()->with('success', 'Ruangan berhasil dihapus!');
    }
}
