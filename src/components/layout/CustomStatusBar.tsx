// Graviton IDE - Status Bar Customization
// Customizable status bar with extension items

import { useState, useCallback } from "react";
import { Icons } from "../icons";

export interface StatusBarItem {
    id: string;
    text: string;
    tooltip?: string;
    icon?: React.ReactNode;
    alignment: "left" | "right";
    priority: number; // Higher = closer to edge
    visible: boolean;
    onClick?: () => void;
}

interface CustomStatusBarProps {
    items: StatusBarItem[];
    onItemClick?: (id: string) => void;
    showContextMenu?: boolean;
}

export function CustomStatusBar({ items, onItemClick, showContextMenu = true }: CustomStatusBarProps) {
    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

    const leftItems = items
        .filter((i) => i.alignment === "left" && i.visible)
        .sort((a, b) => b.priority - a.priority);

    const rightItems = items
        .filter((i) => i.alignment === "right" && i.visible)
        .sort((a, b) => a.priority - b.priority);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        if (showContextMenu) {
            e.preventDefault();
            setContextMenuPos({ x: e.clientX, y: e.clientY });
        }
    }, [showContextMenu]);

    const closeContextMenu = useCallback(() => {
        setContextMenuPos(null);
    }, []);

    return (
        <div
            className="h-6 flex items-center justify-between px-3 bg-graviton-accent-primary text-white text-[11px]"
            onContextMenu={handleContextMenu}
        >
            {/* Left side */}
            <div className="flex items-center gap-3">
                {leftItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            item.onClick?.();
                            onItemClick?.(item.id);
                        }}
                        className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
                        title={item.tooltip}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </button>
                ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {rightItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            item.onClick?.();
                            onItemClick?.(item.id);
                        }}
                        className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
                        title={item.tooltip}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </button>
                ))}
            </div>

            {/* Context Menu */}
            {contextMenuPos && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={closeContextMenu}
                    />
                    <div
                        className="fixed z-50 bg-graviton-bg-secondary border border-graviton-border rounded shadow-lg py-1 min-w-[180px]"
                        style={{
                            left: contextMenuPos.x,
                            bottom: window.innerHeight - contextMenuPos.y
                        }}
                    >
                        <div className="px-3 py-1 text-[11px] text-graviton-text-muted">
                            Status Bar Items
                        </div>
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    // Toggle visibility would go here
                                    closeContextMenu();
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1 text-[12px] text-graviton-text-secondary hover:bg-graviton-bg-hover"
                            >
                                <Icons.check
                                    className={`w-3 h-3 ${item.visible ? "opacity-100" : "opacity-0"}`}
                                />
                                <span>{item.text}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Hook for managing status bar items
export function useStatusBarItems() {
    const [items, setItems] = useState<StatusBarItem[]>([
        {
            id: "branch",
            text: "main",
            icon: <Icons.gitBranch className="w-3.5 h-3.5" />,
            alignment: "left",
            priority: 100,
            visible: true,
            tooltip: "Git Branch",
        },
        {
            id: "sync",
            text: "↑0 ↓0",
            alignment: "left",
            priority: 90,
            visible: true,
            tooltip: "Sync Changes",
        },
        {
            id: "errors",
            text: "0",
            icon: <Icons.close className="w-3 h-3" />,
            alignment: "left",
            priority: 80,
            visible: true,
            tooltip: "Errors",
        },
        {
            id: "warnings",
            text: "0",
            icon: <Icons.warning className="w-3 h-3" />,
            alignment: "left",
            priority: 70,
            visible: true,
            tooltip: "Warnings",
        },
        {
            id: "line",
            text: "Ln 1, Col 1",
            alignment: "right",
            priority: 100,
            visible: true,
            tooltip: "Go to Line",
        },
        {
            id: "spaces",
            text: "Spaces: 4",
            alignment: "right",
            priority: 90,
            visible: true,
            tooltip: "Indentation",
        },
        {
            id: "encoding",
            text: "UTF-8",
            alignment: "right",
            priority: 80,
            visible: true,
            tooltip: "Encoding",
        },
        {
            id: "eol",
            text: "LF",
            alignment: "right",
            priority: 70,
            visible: true,
            tooltip: "Line Endings",
        },
        {
            id: "language",
            text: "TypeScript",
            alignment: "right",
            priority: 60,
            visible: true,
            tooltip: "Language Mode",
        },
    ]);

    const updateItem = useCallback((id: string, updates: Partial<StatusBarItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    }, []);

    const toggleVisibility = useCallback((id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, visible: !item.visible } : item
            )
        );
    }, []);

    return { items, updateItem, toggleVisibility };
}

export default CustomStatusBar;
