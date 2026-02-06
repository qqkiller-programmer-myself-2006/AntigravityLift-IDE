// Graviton IDE - Type Definitions

// File system types
export interface FileNode {
    name: string;
    path: string;
    type: "file" | "directory";
    children?: FileNode[];
    expanded?: boolean;
}

// Editor types
export interface EditorTab {
    id: string;
    path: string;
    name: string;
    content: string;
    language: string;
    isDirty: boolean;
    isActive: boolean;
}

// Extension types (MCP)
export interface ExtensionResponse {
    success: boolean;
    content: string;
    extension_name: string;
}

export interface ExtensionRequest {
    prompt: string;
    extensionId: string;
}

// Command Palette types
export interface Command {
    id: string;
    label: string;
    shortcut?: string;
    category?: string;
    action: () => void;
}

// Theme types
export type ThemeMode = "dark" | "light" | "high-contrast";

export interface ThemeColors {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgHover: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accentPrimary: string;
    accentSecondary: string;
    border: string;
}

// Panel types
export type PanelType = "terminal" | "output" | "problems" | "debug";

// Settings
export interface Settings {
    theme: ThemeMode;
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
}
