// Graviton IDE - Main Application
// Integrates all components with proper state management

import { useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// Components
import { TitleBar } from "./components/layout/TitleBar";
import { ActivityBar } from "./components/layout/ActivityBar";
import { Sidebar } from "./components/layout/Sidebar";
import { EditorTabs } from "./components/layout/EditorTabs";
import { StatusBar } from "./components/layout/StatusBar";
import { TerminalPanel } from "./components/layout/TerminalPanel";
import { MonacoEditor, EmptyEditor } from "./components/editor/MonacoEditor";
import { Breadcrumbs } from "./components/editor/Breadcrumbs";
import { CommandPalette } from "./components/common/CommandPalette";
import { SettingsModal } from "./components/settings/SettingsModal";
import { SearchPanel } from "./components/search/SearchPanel";

// Stores
import { useSettingsStore } from "./stores/settingsStore";
import { useEditorStore } from "./stores/editorStore";
import { useFileStore } from "./stores/fileStore";

// Hooks
import { useFileSystem } from "./hooks/useFileSystem";
import { useDefaultShortcuts } from "./hooks/useKeyboardShortcuts";

// Types
import { ExtensionResponse } from "./types";

function App() {
    // Stores
    const {
        leftSidebarOpen,
        rightSidebarOpen,
        terminalOpen,
        commandPaletteOpen,
        leftSidebarWidth,
        terminalHeight,
        activePanel,
        toggleCommandPalette,
    } = useSettingsStore();

    const { getActiveTab } = useEditorStore();
    const { rootPath } = useFileStore();

    // Local state
    const [settingsOpen, setSettingsOpen] = useState(false);

    // File system operations
    const { openFolder, openFile, saveFile, createNewFile, createNewFolder, refreshFileTree, collapseAll } = useFileSystem();

    // Active tab
    const activeTab = getActiveTab();

    // Keyboard shortcuts
    useDefaultShortcuts({
        onSave: saveFile,
        onQuickOpen: toggleCommandPalette,
        onCommandPalette: toggleCommandPalette,
    });

    // Handle extension test
    const handleRunExtension = useCallback(async () => {
        try {
            const result = await invoke<ExtensionResponse>("invoke_extension", {
                prompt: "Hello from Graviton IDE!",
                extensionId: "mock_echo",
            });
            console.log("Extension response:", result);
        } catch (err) {
            console.error("Extension error:", err);
        }
    }, []);

    // Handle file selection from sidebar or command palette
    const handleFileSelect = useCallback(
        (path: string, name: string) => {
            openFile(path, name);
        },
        [openFile]
    );

    // Window title
    const windowTitle = activeTab
        ? `${activeTab.name}${activeTab.isDirty ? " •" : ""} — Graviton IDE`
        : rootPath
            ? `${rootPath.split("\\").pop()} — Graviton IDE`
            : "Graviton IDE";

    return (
        <div className="flex flex-col h-screen bg-graviton-bg-primary text-[13px] overflow-hidden">
            {/* Title Bar */}
            <TitleBar title={windowTitle} />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Activity Bar */}
                <ActivityBar
                    onOpenFolder={openFolder}
                    onRunExtension={handleRunExtension}
                />

                {/* Left Sidebar - switches between Explorer and Search */}
                {leftSidebarOpen && (
                    <div
                        className="bg-graviton-bg-secondary border-r border-graviton-border flex flex-col h-full"
                        style={{ width: leftSidebarWidth }}
                    >
                        {activePanel === "explorer" ? (
                            <Sidebar
                                width={leftSidebarWidth}
                                onFileClick={handleFileSelect}
                                onOpenFolder={openFolder}
                                onNewFile={createNewFile}
                                onNewFolder={createNewFolder}
                                onRefresh={refreshFileTree}
                                onCollapseAll={collapseAll}
                            />
                        ) : activePanel === "search" ? (
                            <SearchPanel onFileSelect={handleFileSelect} />
                        ) : activePanel === "git" ? (
                            <div className="p-4 text-graviton-text-muted text-sm">
                                Git panel coming soon
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Editor + Terminal */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col overflow-hidden" style={{ height: terminalOpen ? `calc(100% - ${terminalHeight}px)` : "100%" }}>
                        {/* Editor Tabs */}
                        <EditorTabs />

                        {/* Breadcrumbs */}
                        {activeTab && <Breadcrumbs path={activeTab.path} />}

                        {/* Editor Content */}
                        <div className="flex-1 overflow-hidden">
                            {activeTab ? (
                                <MonacoEditor
                                    tabId={activeTab.id}
                                    path={activeTab.path}
                                    content={activeTab.content}
                                    language={activeTab.language}
                                />
                            ) : (
                                <EmptyEditor />
                            )}
                        </div>
                    </div>

                    {/* Terminal */}
                    {terminalOpen && (
                        <div
                            className="border-t border-graviton-border flex-shrink-0"
                            style={{ height: terminalHeight }}
                        >
                            <TerminalPanel />
                        </div>
                    )}
                </div>

                {/* Right Sidebar (future: AI panel) */}
                {rightSidebarOpen && (
                    <div className="w-72 bg-graviton-bg-secondary border-l border-graviton-border p-4">
                        <h3 className="text-sm font-medium text-graviton-text-primary mb-3">
                            AI Assistant
                        </h3>
                        <p className="text-xs text-graviton-text-muted">
                            Coming in v0.2
                        </p>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <StatusBar />

            {commandPaletteOpen && (
                <CommandPalette
                    onClose={toggleCommandPalette}
                    onFileSelect={handleFileSelect}
                    customCommands={[
                        {
                            id: "open-settings",
                            label: "Preferences: Open Settings",
                            shortcut: "Ctrl+,",
                            category: "Preferences",
                            action: () => {
                                toggleCommandPalette();
                                setSettingsOpen(true);
                            },
                        },
                    ]}
                />
            )}

            {/* Settings Modal */}
            {settingsOpen && (
                <SettingsModal onClose={() => setSettingsOpen(false)} />
            )}
        </div>
    );
}

export default App;
