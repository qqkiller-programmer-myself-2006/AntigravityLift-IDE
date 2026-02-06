// Graviton IDE - Monaco Editor Component
// Professional code editor with syntax highlighting

import { useRef, useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { useEditorStore } from "../../stores/editorStore";
import { useSettingsStore } from "../../stores/settingsStore";

// Graviton dark theme definition
const gravitonDarkTheme = {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
        { token: "constant", foreground: "4FC1FF" },
    ],
    colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editor.lineHighlightBackground": "#161b22",
        "editor.selectionBackground": "#264f78",
        "editorCursor.foreground": "#58a6ff",
        "editorLineNumber.foreground": "#484f58",
        "editorLineNumber.activeForeground": "#c9d1d9",
        "editor.inactiveSelectionBackground": "#3a3d41",
        "editorIndentGuide.background": "#21262d",
        "editorIndentGuide.activeBackground": "#30363d",
        "editorBracketMatch.background": "#17191e",
        "editorBracketMatch.border": "#58a6ff",
    },
};

interface MonacoEditorProps {
    tabId: string;
    path: string;
    content: string;
    language: string;
    onChange?: (value: string) => void;
}

export function MonacoEditor({
    tabId,
    content,
    language,
    onChange,
}: MonacoEditorProps) {
    const editorRef = useRef<any>(null);
    const { updateTabContent } = useEditorStore();
    const { settings } = useSettingsStore();

    const handleEditorMount: OnMount = useCallback((editor, monaco) => {
        editorRef.current = editor;

        // Define Graviton theme
        monaco.editor.defineTheme("graviton-dark", gravitonDarkTheme);
        monaco.editor.setTheme("graviton-dark");

        // Focus editor
        editor.focus();

        // Add custom keybindings
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Save handled by global shortcut
        });
    }, []);

    const handleChange: OnChange = useCallback(
        (value) => {
            if (value !== undefined) {
                updateTabContent(tabId, value);
                onChange?.(value);
            }
        },
        [tabId, updateTabContent, onChange]
    );

    return (
        <Editor
            height="100%"
            language={language}
            value={content}
            theme="graviton-dark"
            onChange={handleChange}
            onMount={handleEditorMount}
            options={{
                fontSize: settings.fontSize,
                fontFamily: settings.fontFamily,
                tabSize: settings.tabSize,
                wordWrap: settings.wordWrap ? "on" : "off",
                minimap: { enabled: settings.minimap },
                lineNumbers: settings.lineNumbers ? "on" : "off",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                guides: {
                    bracketPairs: true,
                    indentation: true,
                },
                suggest: {
                    showKeywords: true,
                    showSnippets: true,
                },
                quickSuggestions: true,
                formatOnPaste: true,
                formatOnType: true,
            }}
            loading={
                <div className="flex items-center justify-center h-full bg-graviton-bg-primary text-graviton-text-muted">
                    Loading editor...
                </div>
            }
        />
    );
}

// Empty state when no tabs are open
export function EmptyEditor() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-graviton-bg-primary text-graviton-text-muted select-none">
            <div className="text-6xl mb-6 opacity-20">⚡</div>
            <h2 className="text-xl font-medium text-graviton-text-secondary mb-2">
                Graviton IDE
            </h2>
            <p className="text-sm mb-8">Open a file or folder to get started</p>
            <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                    <kbd className="px-2 py-1 bg-graviton-bg-tertiary rounded border border-graviton-border">
                        Ctrl+O
                    </kbd>
                    <span>Open Folder</span>
                </div>
                <div className="flex items-center gap-3">
                    <kbd className="px-2 py-1 bg-graviton-bg-tertiary rounded border border-graviton-border">
                        Ctrl+P
                    </kbd>
                    <span>Quick Open</span>
                </div>
                <div className="flex items-center gap-3">
                    <kbd className="px-2 py-1 bg-graviton-bg-tertiary rounded border border-graviton-border">
                        Ctrl+Shift+P
                    </kbd>
                    <span>Command Palette</span>
                </div>
            </div>
        </div>
    );
}

export default MonacoEditor;
