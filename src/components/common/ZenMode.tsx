// Graviton IDE - Zen Mode Overlay
// Distraction-free full-screen editing

import { useEffect } from "react";
import { Icons } from "../icons";

interface ZenModeProps {
    isActive: boolean;
    onExit: () => void;
    children: React.ReactNode;
}

export function ZenMode({ isActive, onExit, children }: ZenModeProps) {
    // Exit on Escape
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onExit();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isActive, onExit]);

    if (!isActive) return <>{children}</>;

    return (
        <div className="fixed inset-0 z-50 bg-graviton-bg-primary flex flex-col">
            {/* Minimal header that appears on hover */}
            <div className="absolute top-0 left-0 right-0 h-8 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-4 py-1 bg-graviton-bg-secondary/80 backdrop-blur">
                    <span className="text-[11px] text-graviton-text-muted">
                        Zen Mode - Press <kbd className="px-1 bg-graviton-bg-tertiary rounded">Esc</kbd> to exit
                    </span>
                    <button
                        onClick={onExit}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                    >
                        <Icons.close className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Editor content - centered and full height */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-4xl h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ZenMode;
