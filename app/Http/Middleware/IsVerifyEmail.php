<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsVerifyEmail
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user()->is_email_verified) {
            Auth::logout();
            return redirect()
                ->route("login")
                ->with(
                    "message",
                    " Necesitas confirmar tu cuenta. Hemos enviado un enlace de activación a tu correo electrónico."
                );
        }
        return $next($request);
    }
}
