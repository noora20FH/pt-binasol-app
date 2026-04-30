<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminTeamMemberController extends Controller
{
    public function index()
    {
        $members = TeamMember::orderBy('order_priority', 'asc')
            ->get()
            ->map(fn($m) => [
                'id'             => $m->id,
                'name'           => $m->name,
                'role'           => $m->role,
                'image'          => $m->image ? Storage::url($m->image) : null,
                'order_priority' => $m->order_priority,
                'created_at'     => $m->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/TeamManagement', ['members' => $members]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'role'           => 'required|string|max:255',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'order_priority' => 'nullable|integer|min:0',
        ]);

        $data = [
            'name'           => $request->name,
            'role'           => $request->role,
            'order_priority' => $request->order_priority ?? 0,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('team', 'public');
        }

        TeamMember::create($data);

        return redirect()->back()->with('success', 'Anggota tim berhasil ditambahkan!');
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'role'           => 'required|string|max:255',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'order_priority' => 'nullable|integer|min:0',
        ]);

        $data = [
            'name'           => $request->name,
            'role'           => $request->role,
            'order_priority' => $request->order_priority ?? $teamMember->order_priority,
        ];

        if ($request->hasFile('image')) {
            // Delete old image
            if ($teamMember->image) {
                Storage::disk('public')->delete($teamMember->image);
            }
            $data['image'] = $request->file('image')->store('team', 'public');
        }

        $teamMember->update($data);

        return redirect()->back()->with('success', 'Anggota tim berhasil diperbarui!');
    }

    public function destroy(TeamMember $teamMember)
    {
        if ($teamMember->image) {
            Storage::disk('public')->delete($teamMember->image);
        }
        $teamMember->delete();

        return redirect()->back()->with('success', 'Anggota tim berhasil dihapus!');
    }
}
