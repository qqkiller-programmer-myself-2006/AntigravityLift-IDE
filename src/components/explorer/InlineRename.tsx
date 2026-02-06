// Graviton IDE - Inline File Rename
// Rename files directly in the tree

import { useState, useEffect, useRef, useCallback } from "react";

interface InlineRenameProps {
    currentName: string;
    onRename: (newName: string) => void;
    onCancel: () => void;
}

export function InlineRename({ currentName, onRename, onCancel }: InlineRenameProps) {
    const [value, setValue] = useState(currentName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            // Select filename without extension
            const lastDot = currentName.lastIndexOf(".");
            if (lastDot > 0) {
                inputRef.current.setSelectionRange(0, lastDot);
            } else {
                inputRef.current.select();
            }
        }
    }, [currentName]);

    const handleSubmit = useCallback(() => {
        const trimmed = value.trim();
        if (trimmed && trimmed !== currentName) {
            onRename(trimmed);
        } else {
            onCancel();
        }
    }, [value, currentName, onRename, onCancel]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
        }
    }, [handleSubmit, onCancel]);

    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="w-full px-1 py-0 text-[13px] bg-graviton-bg-primary border border-graviton-accent-primary rounded outline-none text-graviton-text-primary"
        />
    );
}

// Hook for managing inline rename state
export function useInlineRename() {
    const [renamingPath, setRenamingPath] = useState<string | null>(null);

    const startRename = useCallback((path: string) => {
        setRenamingPath(path);
    }, []);

    const cancelRename = useCallback(() => {
        setRenamingPath(null);
    }, []);

    return {
        renamingPath,
        isRenaming: (path: string) => renamingPath === path,
        startRename,
        cancelRename,
    };
}

export default InlineRename;
