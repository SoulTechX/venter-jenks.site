import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Usará las variables de entorno, o por defecto admin/venter2026
    const validUser = process.env.ADMIN_USER || 'admin';
    const validPwd = process.env.ADMIN_PASSWORD || 'venter2026';

    if (user === validUser && pwd === validPwd) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Autenticacion requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Area Segura Venter Jenks"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/propiedades'],
};
