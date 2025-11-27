import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
    mode: ThemeMode;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(
        () => (localStorage.getItem("appTheme") as ThemeMode) || "light"
    );

    useEffect(() => {
        localStorage.setItem("appTheme", mode);
    }, [mode]);

    const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

    const { defaultAlgorithm, darkAlgorithm } = antdTheme;

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ConfigProvider
                theme={{
                    algorithm: mode === "dark" ? darkAlgorithm : defaultAlgorithm,
                    token: {
                        colorPrimary: mode === "dark" ? "#4096ff" : "#1677ff",                       
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useThemeContext must be used inside ThemeProvider");
    return ctx;
}
