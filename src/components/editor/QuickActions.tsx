// Graviton IDE - Quick Actions (Lightbulb)
// Code actions and quick fixes

import { useState, useEffect, useRef } from "react";
import { Icons } from "../icons";

export interface CodeAction {
    id: string;
    title: string;
    kind: "quickfix" | "refactor" | "source";
    isPreferred?: boolean;
    execute: () => void;
}

interface QuickActionsProps {
    actions: CodeAction[];
    position: { top: number; left: number };
    onClose: () => void;
}

export function QuickActionsMenu({ actions, position, onClose }: QuickActionsProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.min(prev + 1, actions.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (actions[selectedIndex]) {
                        actions[selectedIndex].execute();
                        onClose();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [actions, selectedIndex, onClose]);

    useEffect(() => {
        // Click outside to close
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    if (actions.length === 0) return null;

    const kindIcons = {
        quickfix: <Icons.close className="w-3.5 h-3.5 text-yellow-400" />,
        refactor: <Icons.settings className="w-3.5 h-3.5 text-blue-400" />,
        source: <Icons.file className="w-3.5 h-3.5 text-purple-400" />,
    };

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl min-w-[250px] overflow-hidden"
            style={{ top: position.top, left: position.left }}
        >
            <div className="px-3 py-1.5 text-[10px] text-graviton-text-muted border-b border-graviton-border">
                Code Actions
            </div>
            {actions.map((action, index) => (
                <button
                    key={action.id}
                    onClick={() => {
                        action.execute();
                        onClose();
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] ${index === selectedIndex
                        ? "bg-graviton-accent-primary/20 text-graviton-text-primary"
                        : "text-graviton-text-secondary hover:bg-graviton-bg-hover"
                        }`}
                >
                    {kindIcons[action.kind]}
                    <span className="flex-1">{action.title}</span>
                    {action.isPreferred && (
                        <span className="text-[10px] text-graviton-accent-primary">preferred</span>
                    )}
                </button>
            ))}
        </div>
    );
}

// Lightbulb indicator in gutter
interface LightbulbProps {
    hasActions: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
}

export function Lightbulb({ hasActions, onClick, style }: LightbulbProps) {
    if (!hasActions) return null;

    return (
        <button
            onClick={onClick}
            className="absolute w-5 h-5 flex items-center justify-center text-yellow-400 hover:text-yellow-300 cursor-pointer z-10"
            style={style}
            title="Show Code Actions (Ctrl+.)"
        >
            💡
        </button>
    );
}

// Sample quick actions for demo
export function getSampleActions(_line: number, _code: string): CodeAction[] {
    return [
        {
            id: "extract-variable",
            title: "Extract to variable",
            kind: "refactor",
            execute: () => console.log("Extract to variable"),
        },
        {
            id: "extract-function",
            title: "Extract to function",
            kind: "refactor",
            execute: () => console.log("Extract to function"),
        },
        {
            id: "add-missing-import",
            title: "Add missing import",
            kind: "quickfix",
            isPreferred: true,
            execute: () => console.log("Add import"),
        },
        {
            id: "organize-imports",
            title: "Organize imports",
            kind: "source",
            execute: () => console.log("Organize imports"),
        },
    ];
}

export default QuickActionsMenu;
