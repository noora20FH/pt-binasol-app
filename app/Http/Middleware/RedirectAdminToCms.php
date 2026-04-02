<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RedirectAdminToCms
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Redirect admin jika mengakses halaman home ATAU dashboard customer
        if ($user && $user->role === 'admin' &&
            ($request->is('/') || $request->is('dashboard') || $request->routeIs('dashboard'))) {

            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}
