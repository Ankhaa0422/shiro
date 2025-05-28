"use client";
import { useTheme } from "next-themes";

export const ThemeSwitcherButton = () => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-neutral-500/10 bg-white/70 px-2 py-1 font-medium text-neutral-600 tracking-tight hover:bg-neutral-100 dark:bg-neutral-800/70 dark:text-neutral-300 dark:hover:bg-neutral-700/70"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            type="button"
        >
            <span className={"relative size-6 scale-75 rounded-full bg-linear-to-tr"}>
                <span className={`absolute top-0 left-0 z-10 h-full w-full transform-gpu rounded-full bg-linear-to-tr from-indigo-400 to-sky-200 transition-color duration-500 ${theme === "dark" ? "scale-100" : "scale-90"}`} />
                <span
                className={`absolute top-0 left-0 z-10 h-full w-full transform-gpu rounded-full bg-linear-to-tr from-rose-400 to-amber-300 transition-color duration-500 dark:from-rose-600 dark:to-amber-600 ${theme === "light" ? "opacity-100" : "opacity-0"}`}/>
                <span className={`absolute top-0 right-0 z-20 size-4 origin-top-right transform-gpu rounded-full bg-white transition-transform duration-500 group-hover:bg-neutral-100 dark:bg-neutral-800 dark:group-hover:bg-neutral-700 ${theme === "dark" ? "scale-100" : "scale-0"}`} />
            </span>
            <span className="relative h-6 w-12">
                <span className={`absolute top-0 left-0 transition-all duration-1000 ${theme === "light" ? "-translate-y-4 opacity-0 blur-lg" : "translate-y-0 opacity-100 blur-0"}`}>
                    Dark
                </span>
                <span className={`absolute top-0 left-0 transition-all duration-1000 ${theme === "dark" ? "translate-y-4 opacity-0 blur-lg" : "translate-y-0 opacity-100 blur-0"}`} >
                    Light
                </span>
            </span>
        </button>
    );
};

export default ThemeSwitcherButton;
