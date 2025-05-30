'use client'
import { MobileNavHeader, NavbarRoot, NavBody, NavItems, NavbarLogo, NavbarButton, MobileNav, MobileNavMenu, MobileNavToggle } from "./comp/comps";
import { useState } from "react";
// import { ThemeSwitcher } from "..";
import dynamic from "next/dynamic";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalStorage } from "@mantine/hooks";
const ThemeSwitcherButton = dynamic(() => import('../themeSwitcher'), { ssr: false })

export default function Navbar() {
    const { isLoggedIn, login, logout } = useAuth();
    const [model, setModel] = useLocalStorage({
        key: 'model',
        defaultValue: 'gemini-2.0-flash',
    })
    const navItems = [
        { name: "Asura", link: "/martial-god-asura", },
    ];
  
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    return <div className="relative w-full">
        <NavbarRoot>
        {/* Desktop Navigation */}
            <NavBody>
                <NavbarLogo />
                <NavItems items={navItems} />
                <div className="flex items-center gap-4">
                    {
                        isLoggedIn && <select name='aiModel' className="bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 z-40" value={model} onChange={(e) => setModel(e.target.value)}>
                            <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                        </select>
                    }
                    <ThemeSwitcherButton />
                    {
                        isLoggedIn && <NavbarButton variant="secondary" onClick={logout}>Logout</NavbarButton>
                    }
                </div>
            </NavBody>

        {/* Mobile Navigation */}
            <MobileNav>
                <MobileNavHeader>
                    <NavbarLogo />
                    <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                </MobileNavHeader>

                <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} >
                {navItems.map((item, idx) => (
                    <a key={`mobile-link-${idx}`} href={item.link} onClick={() => setIsMobileMenuOpen(false)} className="relative text-neutral-600 dark:text-neutral-300" >
                        <span className="block">{item.name}</span>
                    </a>
                ))}
                <div className="flex w-full flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center justify-between">
                        {
                            isLoggedIn && <select name='aiModel' className="bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 z-40" value={model} onChange={(e) => setModel(e.target.value)}>
                                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                            </select>
                        }
                        <ThemeSwitcherButton />
                    </div>
                    {
                        isLoggedIn && <NavbarButton variant="secondary" className="w-full" onClick={() => {
                            logout()
                            setIsMobileMenuOpen(false)
                        }}>
                            Logout
                        </NavbarButton>
                    }
                </div>
                </MobileNavMenu>
            </MobileNav>
        </NavbarRoot>
    </div>
}