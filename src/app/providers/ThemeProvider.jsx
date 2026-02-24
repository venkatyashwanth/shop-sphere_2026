"use client";

import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("system");
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) setTheme(saved);
        setMounted(true);
    }, [])

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        const systemDark =
            window.matchMedia("(prefers-color-scheme: dark)")
                .matches;
        const resolvedTheme =
            theme === "system"
                ? systemDark
                    ? "dark"
                    : "light"
                : theme;
        root.setAttribute("data-theme", resolvedTheme);

        localStorage.setItem("theme", theme);
    }, [theme, mounted])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}