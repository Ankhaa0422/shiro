import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { Navbar } from "@/components";
import AuthProvider from "@/providers/AuthProvider";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Shiro Novel",
    description: "Novel",
};

export default function RootLayout({ children }) {
    return <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#efefef] dark:bg-[#212729] text-[#212729] dark:text-[#efefef] w-full overflow-x-hidden`} >
            <AuthProvider>
                <ThemeProvider>
                    <Navbar />
                    <main className="w-full h-fit flex flex-col gap-2">
                        {children}
                    </main>
                </ThemeProvider>
            </AuthProvider>
        </body>
    </html>
}
