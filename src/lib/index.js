'use server'
import { cookies } from "next/headers";

export async function setCookie(name, value, options = {
    maxAge: 60 * 60 * 12
}) {
    const cookieStore = await cookies();
    cookieStore.set(name, value, options);
}

export async function deleteCookie(name) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

export async function getCookie(name) {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
}