// Graviton IDE - Split Editor
// Side-by-side file editing

import { useState, useCallback } from "react";
import { Icons } from "../icons";

interface SplitEditorProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    onClose: () => void;
    orientation?: "horizontal" | "vertical";
}

export function SplitEditor({
    leftContent,
    rightContent,
    onClose,
    orientation = "horizontal"
}: SplitEditorProps) {
    const [splitRatio, setSplitRatio] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();

        if (orientation === "horizontal") {
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            setSplitRatio(Math.min(80, Math.max(20, percentage)));
        } else {
            const y = e.clientY - rect.top;
            const percentage = (y / rect.height) * 100;
            setSplitRatio(Math.min(80, Math.max(20, percentage)));
        }
    }, [isDragging, orientation]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div
            className={`flex-1 flex ${orientation === "vertical" ? "flex-col" : "flex-row"} overflow-hidden`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Left/Top pane */}
            <div
                className="overflow-hidden"
                style={{
                    [orientation === "horizontal" ? "width" : "height"]: `${splitRatio}%`
                }}
            >
                {leftContent}
            </div>

            {/* Divider */}
            <div
                className={`relative ${orientation === "horizontal"
                        ? "w-1 cursor-col-resize"
                        : "h-1 cursor-row-resize"
                    } bg-graviton-border hover:bg-graviton-accent-primary transition-colors group`}
                onMouseDown={handleMouseDown}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute ${orientation === "horizontal"
                            ? "top-1 -left-2 -right-2"
                            : "left-1 -top-2 -bottom-2"
                        } p-0.5 bg-graviton-bg-secondary border border-graviton-border rounded opacity-0 group-hover:opacity-100 transition-opacity z-10`}
                    title="Close split"
                >
                    <Icons.close className="w-3 h-3 text-graviton-text-muted" />
                </button>
            </div>

            {/* Right/Bottom pane */}
            <div
                className="flex-1 overflow-hidden"
            >
                {rightContent}
            </div>
        </div>
    );
}

// Hook for managing split editor state
export function useSplitEditor() {
    const [isSplit, setIsSplit] = useState(false);
    const [splitOrientation, setSplitOrientation] = useState<"horizontal" | "vertical">("horizontal");
    const [rightPanePath, setRightPanePath] = useState<string | null>(null);

    const openSplit = useCallback((path: string, orientation: "horizontal" | "vertical" = "horizontal") => {
        setRightPanePath(path);
        setSplitOrientation(orientation);
        setIsSplit(true);
    }, []);

    const closeSplit = useCallback(() => {
        setIsSplit(false);
        setRightPanePath(null);
    }, []);

    return {
        isSplit,
        splitOrientation,
        rightPanePath,
        openSplit,
        closeSplit,
    };
}

export default SplitEditor;
