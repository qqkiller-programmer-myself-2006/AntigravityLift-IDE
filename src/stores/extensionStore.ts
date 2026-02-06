// Graviton IDE - Extension System
// Plugin architecture foundation

import { create } from "zustand";

export interface Extension {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    enabled: boolean;
    category: "theme" | "language" | "tool" | "other";
    // API hooks
    onActivate?: () => void;
    onDeactivate?: () => void;
    // Contribution points
    commands?: ExtensionCommand[];
    menus?: ExtensionMenu[];
    themes?: ExtensionTheme[];
}

export interface ExtensionCommand {
    id: string;
    title: string;
    handler: () => void;
}

export interface ExtensionMenu {
    location: "explorer" | "editor" | "statusbar";
    items: { label: string; command: string }[];
}

export interface ExtensionTheme {
    id: string;
    name: string;
    type: "light" | "dark";
    colors: Record<string, string>;
}

interface ExtensionState {
    extensions: Extension[];
    installedExtensions: string[];

    // Actions
    registerExtension: (extension: Extension) => void;
    unregisterExtension: (id: string) => void;
    enableExtension: (id: string) => void;
    disableExtension: (id: string) => void;
    getExtension: (id: string) => Extension | undefined;
    getEnabledExtensions: () => Extension[];
}

// Built-in extensions
const builtInExtensions: Extension[] = [
    {
        id: "graviton.typescript",
        name: "TypeScript Language Features",
        version: "1.0.0",
        description: "Provides TypeScript language support including IntelliSense and error checking.",
        author: "Graviton",
        enabled: true,
        category: "language",
    },
    {
        id: "graviton.git",
        name: "Git Integration",
        version: "1.0.0",
        description: "Provides Git source control integration.",
        author: "Graviton",
        enabled: true,
        category: "tool",
    },
    {
        id: "graviton.markdown",
        name: "Markdown Support",
        version: "1.0.0",
        description: "Provides Markdown preview and editing support.",
        author: "Graviton",
        enabled: true,
        category: "language",
    },
];

export const useExtensionStore = create<ExtensionState>((set, get) => ({
    extensions: builtInExtensions,
    installedExtensions: builtInExtensions.map((e) => e.id),

    registerExtension: (extension) => {
        set((state) => ({
            extensions: [...state.extensions, extension],
            installedExtensions: [...state.installedExtensions, extension.id],
        }));
        if (extension.enabled && extension.onActivate) {
            extension.onActivate();
        }
    },

    unregisterExtension: (id) => {
        const extension = get().getExtension(id);
        if (extension?.onDeactivate) {
            extension.onDeactivate();
        }
        set((state) => ({
            extensions: state.extensions.filter((e) => e.id !== id),
            installedExtensions: state.installedExtensions.filter((eid) => eid !== id),
        }));
    },

    enableExtension: (id) => {
        set((state) => ({
            extensions: state.extensions.map((e) =>
                e.id === id ? { ...e, enabled: true } : e
            ),
        }));
        const extension = get().getExtension(id);
        if (extension?.onActivate) {
            extension.onActivate();
        }
    },

    disableExtension: (id) => {
        const extension = get().getExtension(id);
        if (extension?.onDeactivate) {
            extension.onDeactivate();
        }
        set((state) => ({
            extensions: state.extensions.map((e) =>
                e.id === id ? { ...e, enabled: false } : e
            ),
        }));
    },

    getExtension: (id) => get().extensions.find((e) => e.id === id),

    getEnabledExtensions: () => get().extensions.filter((e) => e.enabled),
}));

export default useExtensionStore;
