// Graviton IDE - Editor Configuration Store
// Advanced editor settings for Monaco

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EditorConfig {
    // Display
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    tabSize: number;
    wordWrap: "on" | "off" | "wordWrapColumn" | "bounded";
    wordWrapColumn: number;
    minimap: boolean;
    minimapScale: number;
    lineNumbers: "on" | "off" | "relative" | "interval";

    // Behavior
    autoCloseBrackets: boolean;
    autoIndent: boolean;
    formatOnSave: boolean;
    formatOnPaste: boolean;
    autoSave: boolean;
    autoSaveDelay: number;

    // Visual
    bracketPairColorization: boolean;
    indentGuides: boolean;
    highlightActiveLine: boolean;
    stickyScroll: boolean;
    smoothScrolling: boolean;
    cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid";
    cursorStyle: "line" | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin";

    // Code Folding
    folding: boolean;
    foldingHighlight: boolean;
    showFoldingControls: "always" | "mouseover";
}

interface EditorConfigState extends EditorConfig {
    // Actions
    setConfig: <K extends keyof EditorConfig>(key: K, value: EditorConfig[K]) => void;
    setMultiple: (configs: Partial<EditorConfig>) => void;
    resetToDefaults: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
}

const defaultConfig: EditorConfig = {
    // Display
    fontSize: 14,
    fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
    lineHeight: 1.5,
    tabSize: 4,
    wordWrap: "off",
    wordWrapColumn: 80,
    minimap: true,
    minimapScale: 1,
    lineNumbers: "on",

    // Behavior
    autoCloseBrackets: true,
    autoIndent: true,
    formatOnSave: false,
    formatOnPaste: true,
    autoSave: false,
    autoSaveDelay: 1000,

    // Visual
    bracketPairColorization: true,
    indentGuides: true,
    highlightActiveLine: true,
    stickyScroll: false,
    smoothScrolling: true,
    cursorBlinking: "blink",
    cursorStyle: "line",

    // Code Folding
    folding: true,
    foldingHighlight: true,
    showFoldingControls: "mouseover",
};

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

export const useEditorConfigStore = create<EditorConfigState>()(
    persist(
        (set) => ({
            ...defaultConfig,

            setConfig: (key, value) => {
                set({ [key]: value });
            },

            setMultiple: (configs) => {
                set(configs);
            },

            resetToDefaults: () => {
                set(defaultConfig);
            },

            zoomIn: () => {
                set((state) => ({
                    fontSize: Math.min(MAX_FONT_SIZE, state.fontSize + 1),
                }));
            },

            zoomOut: () => {
                set((state) => ({
                    fontSize: Math.max(MIN_FONT_SIZE, state.fontSize - 1),
                }));
            },

            resetZoom: () => {
                set({ fontSize: defaultConfig.fontSize });
            },
        }),
        {
            name: "graviton-editor-config",
        }
    )
);

// Convert store config to Monaco editor options
export function toMonacoOptions(config: EditorConfig): Record<string, unknown> {
    return {
        fontSize: config.fontSize,
        fontFamily: config.fontFamily,
        lineHeight: config.lineHeight,
        tabSize: config.tabSize,
        wordWrap: config.wordWrap,
        wordWrapColumn: config.wordWrapColumn,
        minimap: { enabled: config.minimap, scale: config.minimapScale },
        lineNumbers: config.lineNumbers,
        autoClosingBrackets: config.autoCloseBrackets ? "always" : "never",
        autoIndent: config.autoIndent ? "full" : "none",
        formatOnPaste: config.formatOnPaste,
        bracketPairColorization: { enabled: config.bracketPairColorization },
        guides: { indentation: config.indentGuides },
        renderLineHighlight: config.highlightActiveLine ? "all" : "none",
        stickyScroll: { enabled: config.stickyScroll },
        smoothScrolling: config.smoothScrolling,
        cursorBlinking: config.cursorBlinking,
        cursorStyle: config.cursorStyle,
        folding: config.folding,
        foldingHighlight: config.foldingHighlight,
        showFoldingControls: config.showFoldingControls,
    };
}

export default useEditorConfigStore;
