import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const cookies = request.cookies.get('isLoggedIn');
    if(!checkAuth(request) && request.nextUrl.pathname !== '/' && !request.nextUrl.pathname.includes('/api')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    } else if (checkAuth(request) && request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/martial-god-asura'
        return NextResponse.redirect(url)
    }
//   return 
}
 
function checkAuth(request) {
    const cookies = request.cookies.get('isLoggedIn');
    if (cookies && cookies.value === 'true') {
        return true;
    }
    return false;
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!_next|api/auth).*)(.+)'
  ],
}