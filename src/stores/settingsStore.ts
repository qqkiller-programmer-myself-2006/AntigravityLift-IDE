// Graviton IDE - Settings Store
// Manages user preferences and UI state

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Settings, ThemeMode } from "../types";

interface UIState {
    leftSidebarOpen: boolean;
    rightSidebarOpen: boolean;
    terminalOpen: boolean;
    commandPaletteOpen: boolean;
    leftSidebarWidth: number;
    rightSidebarWidth: number;
    terminalHeight: number;
    activePanel: "explorer" | "search" | "git" | "debug" | "extensions";
}

interface SettingsState extends UIState {
    settings: Settings;

    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
    toggleTerminal: () => void;
    toggleCommandPalette: () => void;
    setLeftSidebarWidth: (width: number) => void;
    setRightSidebarWidth: (width: number) => void;
    setTerminalHeight: (height: number) => void;
    setActivePanel: (panel: UIState["activePanel"]) => void;

    // Settings Actions
    setTheme: (theme: ThemeMode) => void;
    setFontSize: (size: number) => void;
    setFontFamily: (family: string) => void;
    setTabSize: (size: number) => void;
    toggleWordWrap: () => void;
    toggleMinimap: () => void;
    toggleLineNumbers: () => void;
    updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
    theme: "dark",
    fontSize: 14,
    fontFamily: "JetBrains Mono, Consolas, monospace",
    tabSize: 2,
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Initial UI state
            leftSidebarOpen: true,
            rightSidebarOpen: false,
            terminalOpen: true,
            commandPaletteOpen: false,
            leftSidebarWidth: 260,
            rightSidebarWidth: 300,
            terminalHeight: 200,
            activePanel: "explorer" as const,

            // Initial settings
            settings: defaultSettings,

            // UI Actions
            toggleLeftSidebar: () =>
                set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
            toggleRightSidebar: () =>
                set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
            toggleTerminal: () =>
                set((state) => ({ terminalOpen: !state.terminalOpen })),
            toggleCommandPalette: () =>
                set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
            setLeftSidebarWidth: (width) => set({ leftSidebarWidth: width }),
            setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),
            setTerminalHeight: (height) => set({ terminalHeight: height }),
            setActivePanel: (panel) => set({ activePanel: panel, leftSidebarOpen: true }),

            // Settings Actions
            setTheme: (theme) =>
                set((state) => ({
                    settings: { ...state.settings, theme },
                })),
            setFontSize: (fontSize) =>
                set((state) => ({
                    settings: { ...state.settings, fontSize },
                })),
            setFontFamily: (fontFamily) =>
                set((state) => ({
                    settings: { ...state.settings, fontFamily },
                })),
            setTabSize: (tabSize) =>
                set((state) => ({
                    settings: { ...state.settings, tabSize },
                })),
            toggleWordWrap: () =>
                set((state) => ({
                    settings: { ...state.settings, wordWrap: !state.settings.wordWrap },
                })),
            toggleMinimap: () =>
                set((state) => ({
                    settings: { ...state.settings, minimap: !state.settings.minimap },
                })),
            toggleLineNumbers: () =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        lineNumbers: !state.settings.lineNumbers,
                    },
                })),
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
        }),
        {
            name: "graviton-settings",
            partialize: (state) => ({
                settings: state.settings,
                leftSidebarWidth: state.leftSidebarWidth,
                rightSidebarWidth: state.rightSidebarWidth,
                terminalHeight: state.terminalHeight,
            }),
        }
    )
);
