// Graviton IDE - Command Palette
// Quick command access with fuzzy search

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Fuse from "fuse.js";
import { useSettingsStore } from "../../stores/settingsStore";
import { useFileStore } from "../../stores/fileStore";
import { Icons } from "../icons";
import { Command, FileNode } from "../../types";

interface CommandPaletteProps {
    onClose: () => void;
    onFileSelect?: (path: string, name: string) => void;
    customCommands?: Command[];
}

// Flatten file tree for search
function flattenFileTree(nodes: FileNode[], result: FileNode[] = []): FileNode[] {
    for (const node of nodes) {
        if (node.type === "file") {
            result.push(node);
        }
        if (node.children) {
            flattenFileTree(node.children, result);
        }
    }
    return result;
}

export function CommandPalette({
    onClose,
    onFileSelect,
    customCommands = [],
}: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mode, setMode] = useState<"commands" | "files">("commands");
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const { fileTree } = useFileStore();
    const {
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleTerminal,
        setTheme,
        setActivePanel,
    } = useSettingsStore();

    // Default commands
    const defaultCommands: Command[] = useMemo(
        () => [
            // View commands
            {
                id: "toggle-sidebar",
                label: "View: Toggle Sidebar",
                shortcut: "Ctrl+B",
                category: "View",
                action: toggleLeftSidebar,
            },
            {
                id: "toggle-terminal",
                label: "View: Toggle Terminal",
                shortcut: "Ctrl+J",
                category: "View",
                action: toggleTerminal,
            },
            {
                id: "toggle-panel",
                label: "View: Toggle Right Panel",
                category: "View",
                action: toggleRightSidebar,
            },
            {
                id: "focus-explorer",
                label: "View: Focus on Explorer",
                shortcut: "Ctrl+Shift+E",
                category: "View",
                action: () => setActivePanel("explorer"),
            },
            {
                id: "focus-search",
                label: "View: Focus on Search",
                shortcut: "Ctrl+Shift+F",
                category: "View",
                action: () => setActivePanel("search"),
            },
            {
                id: "focus-git",
                label: "View: Focus on Source Control",
                shortcut: "Ctrl+Shift+G",
                category: "View",
                action: () => setActivePanel("git"),
            },
            // Theme commands
            {
                id: "theme-dark",
                label: "Preferences: Color Theme - Dark",
                category: "Preferences",
                action: () => setTheme("dark"),
            },
            {
                id: "theme-light",
                label: "Preferences: Color Theme - Light",
                category: "Preferences",
                action: () => setTheme("light"),
            },
            // Developer commands
            {
                id: "reload-window",
                label: "Developer: Reload Window",
                shortcut: "Ctrl+Shift+R",
                category: "Developer",
                action: () => window.location.reload(),
            },
            {
                id: "toggle-devtools",
                label: "Developer: Toggle Developer Tools",
                shortcut: "F12",
                category: "Developer",
                action: () => {
                    // In Tauri, devtools are handled by the app
                    console.log("Toggle devtools");
                },
            },
            ...customCommands,
        ],
        [toggleLeftSidebar, toggleTerminal, toggleRightSidebar, setTheme, setActivePanel, customCommands]
    );

    // Fuzzy search setup
    const commandFuse = useMemo(
        () =>
            new Fuse(defaultCommands, {
                keys: ["label", "category"],
                threshold: 0.4,
            }),
        [defaultCommands]
    );

    const files = useMemo(() => flattenFileTree(fileTree), [fileTree]);
    const fileFuse = useMemo(
        () =>
            new Fuse(files, {
                keys: ["name", "path"],
                threshold: 0.4,
            }),
        [files]
    );

    // Filtered results
    const results = useMemo(() => {
        if (mode === "files") {
            if (!query) return files.slice(0, 20);
            return fileFuse.search(query).map((r) => r.item).slice(0, 20);
        } else {
            if (!query) return defaultCommands;
            return commandFuse.search(query).map((r) => r.item);
        }
    }, [query, mode, files, fileFuse, defaultCommands, commandFuse]);

    // Handle input changes
    useEffect(() => {
        if (query.startsWith(">")) {
            setMode("commands");
        } else {
            setMode("files");
        }
    }, [query]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);

    // Scroll selected item into view
    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const items = list.querySelectorAll("[data-item]");
        const selectedItem = items[selectedIndex] as HTMLElement;
        if (selectedItem) {
            selectedItem.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        if (mode === "files") {
                            const file = results[selectedIndex] as FileNode;
                            onFileSelect?.(file.path, file.name);
                        } else {
                            (results[selectedIndex] as Command).action();
                        }
                        onClose();
                    }
                    break;
                case "Escape":
                    onClose();
                    break;
            }
        },
        [results, selectedIndex, mode, onFileSelect, onClose]
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15%]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Palette */}
            <div className="relative w-[600px] max-h-[400px] bg-graviton-bg-secondary rounded-lg shadow-2xl border border-graviton-border overflow-hidden">
                {/* Search input */}
                <div className="flex items-center px-4 border-b border-graviton-border">
                    <Icons.search className="w-4 h-4 text-graviton-text-muted" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={mode === "files" ? "Search files by name" : "Type '>' for commands"}
                        className="flex-1 px-3 py-3 bg-transparent text-graviton-text-primary text-sm outline-none placeholder:text-graviton-text-muted"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 hover:bg-graviton-bg-hover rounded"
                        >
                            <Icons.close className="w-3 h-3 text-graviton-text-muted" />
                        </button>
                    )}
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-[320px] overflow-auto">
                    {results.length === 0 ? (
                        <div className="p-4 text-center text-graviton-text-muted text-sm">
                            No results found
                        </div>
                    ) : (
                        results.map((item, index) => {
                            const isSelected = index === selectedIndex;
                            const isFile = mode === "files";
                            const file = item as FileNode;
                            const command = item as Command;

                            return (
                                <div
                                    key={isFile ? file.path : command.id}
                                    data-item
                                    onClick={() => {
                                        if (isFile) {
                                            onFileSelect?.(file.path, file.name);
                                        } else {
                                            command.action();
                                        }
                                        onClose();
                                    }}
                                    className={`flex items-center justify-between px-4 py-2 cursor-pointer ${isSelected
                                        ? "bg-graviton-accent-primary/20 text-graviton-text-primary"
                                        : "hover:bg-graviton-bg-hover text-graviton-text-secondary"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {isFile ? (
                                            <>
                                                <Icons.file className="w-4 h-4 text-graviton-text-muted flex-shrink-0" />
                                                <span className="truncate text-sm">{file.name}</span>
                                                <span className="text-xs text-graviton-text-muted truncate">
                                                    {file.path}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="truncate text-sm">{command.label}</span>
                                            </>
                                        )}
                                    </div>
                                    {!isFile && command.shortcut && (
                                        <kbd className="flex-shrink-0 px-2 py-0.5 text-xs bg-graviton-bg-tertiary rounded border border-graviton-border text-graviton-text-muted">
                                            {command.shortcut}
                                        </kbd>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-graviton-border text-xs text-graviton-text-muted">
                    <div className="flex items-center gap-4">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>Esc Close</span>
                    </div>
                    <span>{results.length} results</span>
                </div>
            </div>
        </div>
    );
}

export default CommandPalette;
