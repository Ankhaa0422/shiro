'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@mantine/hooks'
import { isNullOrUndefined } from '@/utility'
import { time } from 'framer-motion'
import { setCookie, deleteCookie } from '@/lib'
const AuthContext = createContext(null)
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

let timeOut = null

export default function AuthProvider({ children }) {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage({
        key: 'isLoggedIn',
        defaultValue: false,
        getInitialValueInEffect: true,
    })

    useEffect(() => {
        // Check if the cookie exists and set isLoggedIn accordingly
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('isLoggedIn='))
        if (cookieValue) {
            const value = cookieValue.split('=')[1]
            setIsLoggedIn(value === 'true')
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    function login(password) {
        console.log('works')
        if(password === 'RGFueWFAMjQ3') {
            setIsLoggedIn(true)
            setCookie('isLoggedIn', true) // Set cookie for 7 days
            router.push('/asura')
        }
    }

    function logout() {
        setIsLoggedIn(false)
        deleteCookie('isLoggedIn')
        router.push('/')
    }

    return <AuthContext.Provider value={{ isLoggedIn, login, logout }} >
        {children}
    </AuthContext.Provider>
}
