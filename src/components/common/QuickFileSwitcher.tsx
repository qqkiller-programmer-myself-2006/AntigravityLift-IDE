// Graviton IDE - Quick File Switcher
// Ctrl+Tab to cycle recent files

import { useState, useEffect, useCallback, useRef } from "react";
import { getFileIcon } from "../icons";
import { useEditorStore } from "../../stores/editorStore";
import { EditorTab } from "../../types";

interface QuickSwitcherProps {
    isOpen: boolean;
    onClose: () => void;
    onFileSelect: (tabId: string) => void;
}

export function QuickFileSwitcher({ isOpen, onClose, onFileSelect }: QuickSwitcherProps) {
    const { tabs, activeTabId } = useEditorStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Use tabs sorted by most recently accessed (if no getRecentTabs, just use tabs)
    const recentTabs: EditorTab[] = tabs;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Start with second item selected (most recent after current)
            setSelectedIndex(recentTabs.length > 1 ? 1 : 0);
        }
    }, [isOpen, recentTabs.length]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === "Tab" && e.ctrlKey) {
            e.preventDefault();
            if (e.shiftKey) {
                // Move backwards
                setSelectedIndex((prev) =>
                    prev <= 0 ? recentTabs.length - 1 : prev - 1
                );
            } else {
                // Move forwards
                setSelectedIndex((prev) =>
                    prev >= recentTabs.length - 1 ? 0 : prev + 1
                );
            }
        } else if (e.key === "Control") {
            // Ctrl released - confirm selection
            // Don't handle here, handle in keyup
        } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
        }
    }, [isOpen, recentTabs.length, onClose]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        // When Ctrl is released, select the file
        if (e.key === "Control") {
            if (recentTabs[selectedIndex]) {
                onFileSelect(recentTabs[selectedIndex].id);
            }
            onClose();
        }
    }, [isOpen, recentTabs, selectedIndex, onFileSelect, onClose]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    if (!isOpen || recentTabs.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" />

            <div
                ref={containerRef}
                className="relative bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl w-[400px] max-h-[400px] overflow-hidden"
            >
                <div className="p-2 border-b border-graviton-border text-[11px] text-graviton-text-muted">
                    Hold Ctrl and press Tab to navigate • Release Ctrl to select
                </div>

                <div className="overflow-auto max-h-[350px]">
                    {recentTabs.map((tab: EditorTab, index: number) => (
                        <div
                            key={tab.id}
                            onClick={() => {
                                onFileSelect(tab.id);
                                onClose();
                            }}
                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer ${index === selectedIndex
                                ? "bg-graviton-accent-primary/20 border-l-2 border-graviton-accent-primary"
                                : "hover:bg-graviton-bg-hover"
                                } ${tab.id === activeTabId ? "opacity-70" : ""}`}
                        >
                            {getFileIcon(tab.name)}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-graviton-text-primary truncate">
                                    {tab.name}
                                    {tab.isDirty && (
                                        <span className="ml-1 text-graviton-accent-primary">●</span>
                                    )}
                                </div>
                                <div className="text-[11px] text-graviton-text-muted truncate">
                                    {tab.path}
                                </div>
                            </div>
                            {tab.id === activeTabId && (
                                <span className="text-[10px] text-graviton-text-muted">current</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuickFileSwitcher;
