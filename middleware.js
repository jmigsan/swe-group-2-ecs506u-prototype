import { NextResponse } from 'next/server'
import isAuthenticated from '@/lib/auth'
// This function can be marked `async` if using `await` inside
export async function middleware(req) {
    const valid = await isAuthenticated(req);
    if(valid) {
        return NextResponse.next()
    }

    else{
        console.log("here")
        return NextResponse.redirect(new URL('/', req.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/viewCryptos',
}