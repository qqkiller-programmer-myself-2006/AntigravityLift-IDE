// Graviton IDE - Keyboard Shortcuts Store
// User-configurable keybindings

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface KeyBinding {
    id: string;
    command: string;
    key: string;
    modifiers: {
        ctrl?: boolean;
        shift?: boolean;
        alt?: boolean;
        meta?: boolean;
    };
    when?: string; // Context condition
}

interface KeyboardShortcutsState {
    bindings: KeyBinding[];

    // Actions
    setBinding: (id: string, key: string, modifiers: KeyBinding["modifiers"]) => void;
    resetBinding: (id: string) => void;
    resetAll: () => void;
    getBinding: (command: string) => KeyBinding | undefined;
    formatShortcut: (binding: KeyBinding) => string;
}

// Default keyboard shortcuts
const defaultBindings: KeyBinding[] = [
    // File operations
    { id: "file.new", command: "New File", key: "n", modifiers: { ctrl: true } },
    { id: "file.open", command: "Open File", key: "o", modifiers: { ctrl: true } },
    { id: "file.save", command: "Save", key: "s", modifiers: { ctrl: true } },
    { id: "file.saveAll", command: "Save All", key: "s", modifiers: { ctrl: true, shift: true } },
    { id: "file.close", command: "Close Tab", key: "w", modifiers: { ctrl: true } },

    // Edit operations
    { id: "edit.undo", command: "Undo", key: "z", modifiers: { ctrl: true } },
    { id: "edit.redo", command: "Redo", key: "y", modifiers: { ctrl: true } },
    { id: "edit.cut", command: "Cut", key: "x", modifiers: { ctrl: true } },
    { id: "edit.copy", command: "Copy", key: "c", modifiers: { ctrl: true } },
    { id: "edit.paste", command: "Paste", key: "v", modifiers: { ctrl: true } },
    { id: "edit.find", command: "Find", key: "f", modifiers: { ctrl: true } },
    { id: "edit.replace", command: "Replace", key: "h", modifiers: { ctrl: true } },
    { id: "edit.goToLine", command: "Go to Line", key: "g", modifiers: { ctrl: true } },

    // View operations
    { id: "view.commandPalette", command: "Command Palette", key: "p", modifiers: { ctrl: true } },
    { id: "view.toggleSidebar", command: "Toggle Sidebar", key: "b", modifiers: { ctrl: true } },
    { id: "view.toggleTerminal", command: "Toggle Terminal", key: "j", modifiers: { ctrl: true } },
    { id: "view.explorer", command: "Focus Explorer", key: "e", modifiers: { ctrl: true, shift: true } },
    { id: "view.search", command: "Focus Search", key: "f", modifiers: { ctrl: true, shift: true } },
    { id: "view.zenMode", command: "Toggle Zen Mode", key: "k", modifiers: { ctrl: true }, when: "editorFocus" },

    // Navigation
    { id: "nav.goToSymbol", command: "Go to Symbol", key: "o", modifiers: { ctrl: true, shift: true } },
    { id: "nav.goToDefinition", command: "Go to Definition", key: "F12", modifiers: {} },
    { id: "nav.back", command: "Navigate Back", key: "ArrowLeft", modifiers: { alt: true } },
    { id: "nav.forward", command: "Navigate Forward", key: "ArrowRight", modifiers: { alt: true } },
];

export const useKeyboardShortcutsStore = create<KeyboardShortcutsState>()(
    persist(
        (set, get) => ({
            bindings: defaultBindings,

            setBinding: (id, key, modifiers) => {
                set((state) => ({
                    bindings: state.bindings.map((b) =>
                        b.id === id ? { ...b, key, modifiers } : b
                    ),
                }));
            },

            resetBinding: (id) => {
                const defaultBinding = defaultBindings.find((b) => b.id === id);
                if (defaultBinding) {
                    set((state) => ({
                        bindings: state.bindings.map((b) =>
                            b.id === id ? defaultBinding : b
                        ),
                    }));
                }
            },

            resetAll: () => set({ bindings: defaultBindings }),

            getBinding: (command) => get().bindings.find((b) => b.command === command),

            formatShortcut: (binding) => {
                const parts: string[] = [];
                if (binding.modifiers.ctrl) parts.push("Ctrl");
                if (binding.modifiers.shift) parts.push("Shift");
                if (binding.modifiers.alt) parts.push("Alt");
                if (binding.modifiers.meta) parts.push("Cmd");
                parts.push(binding.key.toUpperCase());
                return parts.join("+");
            },
        }),
        {
            name: "graviton-keyboard-shortcuts",
        }
    )
);

export default useKeyboardShortcutsStore;
