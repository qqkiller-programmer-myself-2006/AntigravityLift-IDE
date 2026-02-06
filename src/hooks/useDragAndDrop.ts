// Graviton IDE - Drag and Drop Hook
// File drag and drop functionality

import { useState, useCallback, useRef } from "react";

interface DragState {
    isDragging: boolean;
    draggedPath: string | null;
    draggedType: "file" | "directory" | null;
    dropTargetPath: string | null;
}

interface UseDragAndDropOptions {
    onFileDrop: (sourcePath: string, targetPath: string) => void;
    onExternalFileDrop?: (files: FileList, targetPath: string) => void;
}

export function useDragAndDrop({ onFileDrop, onExternalFileDrop }: UseDragAndDropOptions) {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedPath: null,
        draggedType: null,
        dropTargetPath: null,
    });

    const dragCountRef = useRef(0);

    const handleDragStart = useCallback((
        e: React.DragEvent,
        path: string,
        type: "file" | "directory"
    ) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", path);
        e.dataTransfer.setData("application/graviton-file", JSON.stringify({ path, type }));

        setDragState({
            isDragging: true,
            draggedPath: path,
            draggedType: type,
            dropTargetPath: null,
        });
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, targetPath: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Can't drop on self
        if (dragState.draggedPath === targetPath) {
            e.dataTransfer.dropEffect = "none";
            return;
        }

        // Can't drop into a subdirectory of self
        if (dragState.draggedPath && targetPath.startsWith(dragState.draggedPath)) {
            e.dataTransfer.dropEffect = "none";
            return;
        }

        e.dataTransfer.dropEffect = "move";
        setDragState((prev) => ({ ...prev, dropTargetPath: targetPath }));
    }, [dragState.draggedPath]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCountRef.current--;
        if (dragCountRef.current === 0) {
            setDragState((prev) => ({ ...prev, dropTargetPath: null }));
        }
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCountRef.current++;
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetPath: string) => {
        e.preventDefault();
        e.stopPropagation();

        dragCountRef.current = 0;

        // Check for internal file drag
        const gravitonData = e.dataTransfer.getData("application/graviton-file");
        if (gravitonData) {
            try {
                const { path } = JSON.parse(gravitonData);
                if (path !== targetPath && !targetPath.startsWith(path)) {
                    onFileDrop(path, targetPath);
                }
            } catch {
                // Ignore parsing errors
            }
        }

        // Check for external file drag
        if (e.dataTransfer.files.length > 0 && onExternalFileDrop) {
            onExternalFileDrop(e.dataTransfer.files, targetPath);
        }

        setDragState({
            isDragging: false,
            draggedPath: null,
            draggedType: null,
            dropTargetPath: null,
        });
    }, [onFileDrop, onExternalFileDrop]);

    const handleDragEnd = useCallback(() => {
        dragCountRef.current = 0;
        setDragState({
            isDragging: false,
            draggedPath: null,
            draggedType: null,
            dropTargetPath: null,
        });
    }, []);

    return {
        dragState,
        handlers: {
            onDragStart: handleDragStart,
            onDragOver: handleDragOver,
            onDragEnter: handleDragEnter,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
            onDragEnd: handleDragEnd,
        },
    };
}

export default useDragAndDrop;
