<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        $teamMembers = TeamMember::orderBy('order_priority', 'asc')->get();

        return inertia('TeamMembers/Index', [
            'teamMembers' => $teamMembers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'image' => 'nullable|string',
            'order_priority' => 'nullable|integer|min:0',
        ]);

        TeamMember::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'image' => 'nullable|string',
            'order_priority' => 'nullable|integer|min:0',
        ]);

        $teamMember->update($validated);

        return redirect()->back();
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return redirect()->back();
    }
}
