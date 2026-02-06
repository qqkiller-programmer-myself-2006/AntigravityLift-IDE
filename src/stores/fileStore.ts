// Graviton IDE - File Store
// Manages file tree and current working directory

import { create } from "zustand";
import { FileNode } from "../types";

interface FileState {
    rootPath: string | null;
    fileTree: FileNode[];
    expandedPaths: Set<string>;
    selectedPath: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setRootPath: (path: string) => void;
    setFileTree: (tree: FileNode[]) => void;
    toggleExpanded: (path: string) => void;
    setExpanded: (path: string, expanded: boolean) => void;
    setSelectedPath: (path: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    isExpanded: (path: string) => boolean;
    refreshTree: () => void;
}

export const useFileStore = create<FileState>((set, get) => ({
    rootPath: null,
    fileTree: [],
    expandedPaths: new Set<string>(),
    selectedPath: null,
    isLoading: false,
    error: null,

    setRootPath: (path) => {
        set({ rootPath: path, expandedPaths: new Set([path]) });
    },

    setFileTree: (tree) => {
        set({ fileTree: tree, isLoading: false });
    },

    toggleExpanded: (path) => {
        set((state) => {
            const newSet = new Set(state.expandedPaths);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return { expandedPaths: newSet };
        });
    },

    setExpanded: (path, expanded) => {
        set((state) => {
            const newSet = new Set(state.expandedPaths);
            if (expanded) {
                newSet.add(path);
            } else {
                newSet.delete(path);
            }
            return { expandedPaths: newSet };
        });
    },

    setSelectedPath: (path) => {
        set({ selectedPath: path });
    },

    setLoading: (loading) => {
        set({ isLoading: loading });
    },

    setError: (error) => {
        set({ error, isLoading: false });
    },

    isExpanded: (path) => {
        return get().expandedPaths.has(path);
    },

    refreshTree: () => {
        // Will be implemented with actual file system
        set({ isLoading: true });
    },
}));
