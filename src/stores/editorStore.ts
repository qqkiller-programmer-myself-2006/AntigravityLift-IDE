// Graviton IDE - Editor Store
// Manages tabs, active file, and editor state

import { create } from "zustand";
import { EditorTab } from "../types";

interface EditorState {
    tabs: EditorTab[];
    activeTabId: string | null;

    // Actions
    openTab: (tab: Omit<EditorTab, "id" | "isActive">) => void;
    closeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    updateTabContent: (id: string, content: string) => void;
    markTabDirty: (id: string, isDirty: boolean) => void;
    closeAllTabs: () => void;
    closeOtherTabs: (id: string) => void;
    getActiveTab: () => EditorTab | undefined;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    tabs: [],
    activeTabId: null,

    openTab: (tabData) => {
        const { tabs } = get();

        // Check if tab already exists
        const existingTab = tabs.find((t) => t.path === tabData.path);
        if (existingTab) {
            set({ activeTabId: existingTab.id });
            return;
        }

        const newTab: EditorTab = {
            ...tabData,
            id: `tab-${Date.now()}`,
            isActive: true,
        };

        set((state) => ({
            tabs: [
                ...state.tabs.map((t) => ({ ...t, isActive: false })),
                newTab,
            ],
            activeTabId: newTab.id,
        }));
    },

    closeTab: (id) => {
        set((state) => {
            const tabs = state.tabs.filter((t) => t.id !== id);
            let activeTabId = state.activeTabId;

            if (activeTabId === id) {
                // Activate the previous or next tab
                const closedIndex = state.tabs.findIndex((t) => t.id === id);
                const newActiveTab = tabs[closedIndex] || tabs[closedIndex - 1];
                activeTabId = newActiveTab?.id || null;
            }

            return {
                tabs: tabs.map((t) => ({
                    ...t,
                    isActive: t.id === activeTabId,
                })),
                activeTabId,
            };
        });
    },

    setActiveTab: (id) => {
        set((state) => ({
            tabs: state.tabs.map((t) => ({
                ...t,
                isActive: t.id === id,
            })),
            activeTabId: id,
        }));
    },

    updateTabContent: (id, content) => {
        set((state) => ({
            tabs: state.tabs.map((t) =>
                t.id === id ? { ...t, content, isDirty: true } : t
            ),
        }));
    },

    markTabDirty: (id, isDirty) => {
        set((state) => ({
            tabs: state.tabs.map((t) =>
                t.id === id ? { ...t, isDirty } : t
            ),
        }));
    },

    closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
    },

    closeOtherTabs: (id) => {
        set((state) => ({
            tabs: state.tabs.filter((t) => t.id === id).map((t) => ({
                ...t,
                isActive: true,
            })),
            activeTabId: id,
        }));
    },

    getActiveTab: () => {
        const { tabs, activeTabId } = get();
        return tabs.find((t) => t.id === activeTabId);
    },
}));
