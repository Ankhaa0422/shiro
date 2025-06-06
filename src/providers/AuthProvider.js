'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@mantine/hooks'
import { setCookie, deleteCookie } from '@/lib'
import { callFetch } from '@/utility'
import { Loader } from '@/components'
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
    const [isLoad, setIsLoad] = useState(false)
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

    async function login(password) {
        try {
            setIsLoad(true)
            let khariu = await callFetch('/api/login', { password })
            if(khariu['success']) {
                router.push('/martial-god-asura')
            }
        } finally {
            setIsLoad(false)
        }
        // if(password === 'RGFueWFAMjQ3') {
        //     setCookie('isLoggedIn', true) // Set cookie for 12 hour
        //     setIsLoggedIn(true)
        //     setTimeout(() => {
        //         router.push('/martial-god-asura')
        //     }, 100)
        // }
    }

    function logout() {
        setIsLoggedIn(false)
        deleteCookie('isLoggedIn')
        router.push('/')
    }

    return <AuthContext.Provider value={{ isLoggedIn, login, logout }} >
        {
            isLoad && <Loader className='!fixed w-full h-full left-0 top-0 z-[999]'/> 
        }
        {children}
    </AuthContext.Provider>
}
