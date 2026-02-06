// Graviton IDE - File History Store
// Track recently opened files and navigation history

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileHistoryEntry {
    path: string;
    name: string;
    timestamp: number;
}

interface FileHistoryState {
    recentFiles: FileHistoryEntry[];
    navigationStack: string[];
    navigationIndex: number;

    // Actions
    addRecentFile: (path: string, name: string) => void;
    clearRecentFiles: () => void;
    pushNavigation: (path: string) => void;
    navigateBack: () => string | null;
    navigateForward: () => string | null;
    canNavigateBack: () => boolean;
    canNavigateForward: () => boolean;
}

const MAX_RECENT_FILES = 20;

export const useFileHistoryStore = create<FileHistoryState>()(
    persist(
        (set, get) => ({
            recentFiles: [],
            navigationStack: [],
            navigationIndex: -1,

            addRecentFile: (path, name) => {
                set((state) => {
                    // Remove existing entry if present
                    const filtered = state.recentFiles.filter((f) => f.path !== path);
                    // Add to front
                    const updated = [
                        { path, name, timestamp: Date.now() },
                        ...filtered,
                    ].slice(0, MAX_RECENT_FILES);
                    return { recentFiles: updated };
                });
            },

            clearRecentFiles: () => set({ recentFiles: [] }),

            pushNavigation: (path) => {
                set((state) => {
                    // If we're not at the end, truncate forward history
                    const stack = state.navigationStack.slice(0, state.navigationIndex + 1);
                    // Don't add if same as current
                    if (stack[stack.length - 1] === path) {
                        return state;
                    }
                    return {
                        navigationStack: [...stack, path],
                        navigationIndex: stack.length,
                    };
                });
            },

            navigateBack: () => {
                const state = get();
                if (state.navigationIndex <= 0) return null;
                const newIndex = state.navigationIndex - 1;
                set({ navigationIndex: newIndex });
                return state.navigationStack[newIndex];
            },

            navigateForward: () => {
                const state = get();
                if (state.navigationIndex >= state.navigationStack.length - 1) return null;
                const newIndex = state.navigationIndex + 1;
                set({ navigationIndex: newIndex });
                return state.navigationStack[newIndex];
            },

            canNavigateBack: () => get().navigationIndex > 0,
            canNavigateForward: () => get().navigationIndex < get().navigationStack.length - 1,
        }),
        {
            name: "graviton-file-history",
            partialize: (state) => ({ recentFiles: state.recentFiles }),
        }
    )
);

export default useFileHistoryStore;
