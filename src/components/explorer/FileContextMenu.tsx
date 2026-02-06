// Graviton IDE - File Context Menu
// Right-click context menu for file explorer

import { useState, useEffect, useCallback } from "react";
import { Icons } from "../icons";

interface ContextMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    danger?: boolean;
    divider?: boolean;
    action: () => void;
}

interface FileContextMenuProps {
    x: number;
    y: number;
    path: string;
    name: string;
    isDirectory: boolean;
    onClose: () => void;
    onRename?: (path: string, newName: string) => void;
    onDelete?: (path: string) => void;
    onRefresh?: () => void;
    onNewFile?: (parentPath: string) => void;
    onNewFolder?: (parentPath: string) => void;
}

export function FileContextMenu({
    x,
    y,
    path,
    name,
    isDirectory,
    onClose,
    onRename,
    onDelete,
    onRefresh,
    onNewFile,
    onNewFolder,
}: FileContextMenuProps) {
    const [position, setPosition] = useState({ x, y });

    // Adjust position if menu goes off screen
    useEffect(() => {
        const menuWidth = 200;
        const menuHeight = 300;
        const padding = 10;

        let adjustedX = x;
        let adjustedY = y;

        if (x + menuWidth > window.innerWidth - padding) {
            adjustedX = window.innerWidth - menuWidth - padding;
        }

        if (y + menuHeight > window.innerHeight - padding) {
            adjustedY = window.innerHeight - menuHeight - padding;
        }

        setPosition({ x: adjustedX, y: adjustedY });
    }, [x, y]);

    // Close on escape or outside click
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleClick = () => onClose();

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("click", handleClick);
        };
    }, [onClose]);

    const handleCopyPath = useCallback(() => {
        navigator.clipboard.writeText(path);
        onClose();
    }, [path, onClose]);

    const handleCopyRelativePath = useCallback(() => {
        // Get just the filename or relative path
        const parts = path.split("\\");
        navigator.clipboard.writeText(parts[parts.length - 1]);
        onClose();
    }, [path, onClose]);

    const handleRename = useCallback(() => {
        const newName = window.prompt("Enter new name:", name);
        if (newName && newName !== name) {
            const parentPath = path.substring(0, path.lastIndexOf("\\"));
            onRename?.(path, `${parentPath}\\${newName}`);
        }
        onClose();
    }, [path, name, onRename, onClose]);

    const handleDelete = useCallback(async () => {
        const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (confirmed) {
            try {
                const { remove } = await import("@tauri-apps/plugin-fs");
                await remove(path, { recursive: isDirectory });
                onDelete?.(path);
                onRefresh?.();
            } catch (err) {
                console.error("Failed to delete:", err);
                alert(`Failed to delete: ${err}`);
            }
        }
        onClose();
    }, [path, name, isDirectory, onDelete, onRefresh, onClose]);

    const items: ContextMenuItem[] = [
        ...(isDirectory
            ? [
                {
                    id: "new-file",
                    label: "New File",
                    icon: <Icons.newFile className="w-4 h-4" />,
                    action: () => {
                        onNewFile?.(path);
                        onClose();
                    },
                },
                {
                    id: "new-folder",
                    label: "New Folder",
                    icon: <Icons.newFolder className="w-4 h-4" />,
                    action: () => {
                        onNewFolder?.(path);
                        onClose();
                    },
                },
                { id: "div1", label: "", divider: true, action: () => { } },
            ]
            : []),
        {
            id: "copy-path",
            label: "Copy Path",
            action: handleCopyPath,
        },
        {
            id: "copy-relative-path",
            label: "Copy Name",
            action: handleCopyRelativePath,
        },
        { id: "div2", label: "", divider: true, action: () => { } },
        {
            id: "rename",
            label: "Rename",
            shortcut: "F2",
            action: handleRename,
        },
        {
            id: "delete",
            label: "Delete",
            shortcut: "Del",
            danger: true,
            action: handleDelete,
        },
    ];

    return (
        <div
            className="fixed z-50 min-w-[180px] py-1 bg-graviton-bg-secondary border border-graviton-border rounded-md shadow-xl"
            style={{ left: position.x, top: position.y }}
            onClick={(e) => e.stopPropagation()}
        >
            {items.map((item) =>
                item.divider ? (
                    <div
                        key={item.id}
                        className="my-1 border-t border-graviton-border"
                    />
                ) : (
                    <button
                        key={item.id}
                        onClick={item.action}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-[12px] hover:bg-graviton-bg-hover ${item.danger
                            ? "text-red-400 hover:text-red-300"
                            : "text-graviton-text-secondary hover:text-graviton-text-primary"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        {item.shortcut && (
                            <span className="text-graviton-text-muted text-[10px]">
                                {item.shortcut}
                            </span>
                        )}
                    </button>
                )
            )}
        </div>
    );
}

export default FileContextMenu;
