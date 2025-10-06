// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Prefijos de rutas protegidas (añade los que necesites)
const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/perfil'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  const wantsProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // 1) Sin token intentando entrar a ruta protegida -> a /sign-in
  if (!token && wantsProtected) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // 2) Con token entrando a la raíz -> a /dashboard
  //    (NO redirigimos /sign-in; así puedes abrirla si necesitas)
  if (token && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Excluye assets estáticos del middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
