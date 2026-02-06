// Graviton IDE - Bookmarks System
// Toggle and navigate bookmarks in code

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
    id: string;
    filePath: string;
    fileName: string;
    line: number;
    column?: number;
    label?: string;
    createdAt: number;
}

interface BookmarksState {
    bookmarks: Bookmark[];

    // Actions
    toggleBookmark: (filePath: string, fileName: string, line: number, column?: number) => void;
    addBookmark: (filePath: string, fileName: string, line: number, column?: number, label?: string) => void;
    removeBookmark: (id: string) => void;
    updateBookmarkLabel: (id: string, label: string) => void;
    getBookmarksForFile: (filePath: string) => Bookmark[];
    isLineBookmarked: (filePath: string, line: number) => boolean;
    clearAllBookmarks: () => void;
    clearFileBookmarks: (filePath: string) => void;
    getNextBookmark: (currentFile: string, currentLine: number) => Bookmark | null;
    getPrevBookmark: (currentFile: string, currentLine: number) => Bookmark | null;
}

export const useBookmarksStore = create<BookmarksState>()(
    persist(
        (set, get) => ({
            bookmarks: [],

            toggleBookmark: (filePath, fileName, line, column) => {
                const existing = get().bookmarks.find(
                    (b) => b.filePath === filePath && b.line === line
                );
                if (existing) {
                    set((state) => ({
                        bookmarks: state.bookmarks.filter((b) => b.id !== existing.id),
                    }));
                } else {
                    get().addBookmark(filePath, fileName, line, column);
                }
            },

            addBookmark: (filePath, fileName, line, column, label) => {
                const id = `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                set((state) => ({
                    bookmarks: [
                        ...state.bookmarks,
                        {
                            id,
                            filePath,
                            fileName,
                            line,
                            column,
                            label,
                            createdAt: Date.now(),
                        },
                    ].sort((a, b) => {
                        if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
                        return a.line - b.line;
                    }),
                }));
            },

            removeBookmark: (id) => {
                set((state) => ({
                    bookmarks: state.bookmarks.filter((b) => b.id !== id),
                }));
            },

            updateBookmarkLabel: (id, label) => {
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        b.id === id ? { ...b, label } : b
                    ),
                }));
            },

            getBookmarksForFile: (filePath) => {
                return get().bookmarks.filter((b) => b.filePath === filePath);
            },

            isLineBookmarked: (filePath, line) => {
                return get().bookmarks.some((b) => b.filePath === filePath && b.line === line);
            },

            clearAllBookmarks: () => set({ bookmarks: [] }),

            clearFileBookmarks: (filePath) => {
                set((state) => ({
                    bookmarks: state.bookmarks.filter((b) => b.filePath !== filePath),
                }));
            },

            getNextBookmark: (currentFile, currentLine) => {
                const bookmarks = get().bookmarks;
                // Find next bookmark in current file first
                const inFile = bookmarks.filter((b) => b.filePath === currentFile && b.line > currentLine);
                if (inFile.length > 0) return inFile[0];

                // Find first bookmark in next file or wrap around
                const afterFile = bookmarks.filter((b) => b.filePath > currentFile);
                if (afterFile.length > 0) return afterFile[0];

                // Wrap to beginning
                return bookmarks[0] || null;
            },

            getPrevBookmark: (currentFile, currentLine) => {
                const bookmarks = get().bookmarks;
                // Find prev bookmark in current file first
                const inFile = bookmarks.filter((b) => b.filePath === currentFile && b.line < currentLine);
                if (inFile.length > 0) return inFile[inFile.length - 1];

                // Find last bookmark in prev file or wrap around
                const beforeFile = bookmarks.filter((b) => b.filePath < currentFile);
                if (beforeFile.length > 0) return beforeFile[beforeFile.length - 1];

                // Wrap to end
                return bookmarks[bookmarks.length - 1] || null;
            },
        }),
        {
            name: "graviton-bookmarks",
        }
    )
);

export default useBookmarksStore;
