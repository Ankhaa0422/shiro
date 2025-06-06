import { cookies } from "next/headers"

export async function POST(req) {
    try {
        const body = await req.json()
        const { password } = body
        
        if(password === 'RGFueWFAMjQ3') {
            const cookieStore = await cookies();
            cookieStore.set('isLoggedIn', true, {
                maxAge: 60 * 60 * 12
            });
            return new Response(JSON.stringify({ message: 'Login success', success: true }), {
                status: 200,
            })
        } else {
            return new Response(JSON.stringify({ message: 'Password not match', success: false }), {
                status: 202,
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error?.['message'] || 'Error occured', success: false }), {
            status: 201,
        })
    }
}