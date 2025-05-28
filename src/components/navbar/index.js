'use client'
import { MobileNavHeader, NavbarRoot, NavBody, NavItems, NavbarLogo, NavbarButton, MobileNav, MobileNavMenu, MobileNavToggle } from "./comp/comps";
import { useState } from "react";
// import { ThemeSwitcher } from "..";
import dynamic from "next/dynamic";
import { useAuth } from "@/providers/AuthProvider";
const ThemeSwitcherButton = dynamic(() => import('../themeSwitcher'), { ssr: false })

export default function Navbar() {

    const { isLoggedIn, login, logout } = useAuth();

    const navItems = [
        { name: "Asura", link: "/asura", },
        // { name: "Pricing", link: "#pricing", },
        // { name: "Contact", link: "#contact", },
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
                        isLoggedIn && <NavbarButton variant="secondary" onClick={logout}>Logout</NavbarButton>
                    }
                    <ThemeSwitcherButton />
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
                    {/* <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="secondary" className="w-full" >
                        Login
                    </NavbarButton> */}
                    {/* <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full" >
                        Book a call
                    </NavbarButton> */}
                    <ThemeSwitcherButton />
                </div>
                </MobileNavMenu>
            </MobileNav>
        </NavbarRoot>
    </div>
}