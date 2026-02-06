// Graviton IDE - Focus Mode
// Dim unfocused panels for better concentration

import { useState, useCallback, createContext, useContext, ReactNode } from "react";

interface FocusModeContextValue {
    isActive: boolean;
    focusedArea: "editor" | "terminal" | "sidebar" | null;
    toggleFocusMode: () => void;
    setFocusedArea: (area: "editor" | "terminal" | "sidebar" | null) => void;
}

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export function FocusModeProvider({ children }: { children: ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [focusedArea, setFocusedArea] = useState<"editor" | "terminal" | "sidebar" | null>("editor");

    const toggleFocusMode = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    return (
        <FocusModeContext.Provider
            value={{ isActive, focusedArea, toggleFocusMode, setFocusedArea }}
        >
            {children}
        </FocusModeContext.Provider>
    );
}

export function useFocusMode() {
    const context = useContext(FocusModeContext);
    if (!context) {
        throw new Error("useFocusMode must be used within FocusModeProvider");
    }
    return context;
}

// Component wrapper that dims based on focus
interface FocusAreaProps {
    area: "editor" | "terminal" | "sidebar";
    children: ReactNode;
    className?: string;
}

export function FocusArea({ area, children, className = "" }: FocusAreaProps) {
    const { isActive, focusedArea, setFocusedArea } = useFocusMode();

    const isDimmed = isActive && focusedArea !== area;

    return (
        <div
            onClick={() => isActive && setFocusedArea(area)}
            className={`relative transition-opacity duration-300 ${className} ${isDimmed ? "opacity-40" : "opacity-100"
                }`}
        >
            {children}
            {isDimmed && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            )}
        </div>
    );
}

export default FocusModeProvider;
