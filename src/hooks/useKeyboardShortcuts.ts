// Graviton IDE - Keyboard Shortcuts Hook
// Global keyboard shortcut handling

import { useEffect, useCallback } from "react";
import { useSettingsStore } from "../stores/settingsStore";
import { useEditorStore } from "../stores/editorStore";

interface ShortcutHandler {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
}

export function useKeyboardShortcuts(handlers: ShortcutHandler[]) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            for (const handler of handlers) {
                const ctrlMatch = handler.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
                const shiftMatch = handler.shift ? e.shiftKey : !e.shiftKey;
                const altMatch = handler.alt ? e.altKey : !e.altKey;
                const keyMatch = e.key.toLowerCase() === handler.key.toLowerCase();

                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    e.preventDefault();
                    handler.action();
                    return;
                }
            }
        },
        [handlers]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}

// Default IDE shortcuts
export function useDefaultShortcuts(
    customHandlers?: Partial<{
        onSave: () => void;
        onQuickOpen: () => void;
        onCommandPalette: () => void;
    }>
) {
    const {
        toggleLeftSidebar,
        toggleTerminal,
        toggleCommandPalette,
    } = useSettingsStore();

    const { closeTab, getActiveTab } = useEditorStore();

    const shortcuts: ShortcutHandler[] = [
        {
            key: "s",
            ctrl: true,
            action: () => customHandlers?.onSave?.(),
            description: "Save file",
        },
        {
            key: "p",
            ctrl: true,
            action: () => customHandlers?.onQuickOpen?.(),
            description: "Quick open file",
        },
        {
            key: "p",
            ctrl: true,
            shift: true,
            action: () => {
                toggleCommandPalette();
                customHandlers?.onCommandPalette?.();
            },
            description: "Command palette",
        },
        {
            key: "b",
            ctrl: true,
            action: toggleLeftSidebar,
            description: "Toggle sidebar",
        },
        {
            key: "j",
            ctrl: true,
            action: toggleTerminal,
            description: "Toggle terminal",
        },
        {
            key: "`",
            ctrl: true,
            action: toggleTerminal,
            description: "Toggle terminal (alternate)",
        },
        {
            key: "w",
            ctrl: true,
            action: () => {
                const activeTab = getActiveTab();
                if (activeTab) closeTab(activeTab.id);
            },
            description: "Close tab",
        },
        {
            key: "n",
            ctrl: true,
            action: () => customHandlers?.onQuickOpen?.(),
            description: "New file",
        },
    ];

    useKeyboardShortcuts(shortcuts);

    return shortcuts;
}

// Format shortcut for display
export function formatShortcut(handler: ShortcutHandler): string {
    const parts: string[] = [];
    if (handler.ctrl) parts.push("Ctrl");
    if (handler.shift) parts.push("Shift");
    if (handler.alt) parts.push("Alt");
    parts.push(handler.key.toUpperCase());
    return parts.join("+");
}
