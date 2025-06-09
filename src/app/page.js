/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from "next/image";
import sienna from '../../public/Sienna_free.webp'
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

// Uncomment and import these if you want to use the commented-out home page sections
// import bg2 from '../../public/bg2.png'
// import bg from '../../public/bg.png'
// import { motion } from "framer-motion";
// import Card from "@/components/Card";

export default function Home() {
    const { isLoggedIn, login } = useAuth()
    const router = useRouter()
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/martial-god-asura')
        }
    }, [isLoggedIn])

    function onKeyDown(e) {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    function handleLogin() {
        if (password) {
            const encryptedValue = btoa(password);
            login(encryptedValue);
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full h-screen items-center justify-center">
            <div className="rounded-2xl w-[300px] h-[350px] bg-white/70 dark:bg-[#313739]/70 relative overflow-hidden p-5 flex flex-col items-center justify-center gap-4 shadow-2xl">
                <div className="min-w-[150px] min-h-[150px] relative rounded-full">
                    <Image src={sienna.src} alt="" fill style={{ objectFit: 'cover' }} className="rounded-full" />
                </div>
                <span>Shiro</span>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="password"
                    className="w-full h-[40px] px-4 rounded-full dark:bg-[#414749] bg-[#e3e3e3] outline-none focus:ring-2 focus:ring-[#e3e3e3]/30 transition-all"
                />
                <button
                    className="w-full h-[40px] px-4 rounded-full dark:bg-[#414749] bg-[#e3e3e3] outline-none focus:ring-2 focus:ring-[#e3e3e3]/30 transition-all"
                    onClick={handleLogin}
                >
                    login
                </button>
            </div>
        </div>
    )
}