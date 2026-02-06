// Graviton IDE - Editor Tabs
// Tab management for open files

import { useCallback } from "react";
import { Icons, getFileIcon } from "../icons";
import { useEditorStore } from "../../stores/editorStore";

export function EditorTabs() {
    const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore();

    const handleTabClick = useCallback(
        (id: string) => {
            setActiveTab(id);
        },
        [setActiveTab]
    );

    const handleCloseTab = useCallback(
        (e: React.MouseEvent, id: string) => {
            e.stopPropagation();
            closeTab(id);
        },
        [closeTab]
    );

    if (tabs.length === 0) {
        return (
            <div className="h-9 bg-graviton-bg-secondary border-b border-graviton-border" />
        );
    }

    return (
        <div className="h-9 bg-graviton-bg-secondary border-b border-graviton-border flex items-center overflow-x-auto">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;

                return (
                    <div
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`group flex items-center gap-2 px-3 h-full cursor-pointer border-r border-graviton-border ${isActive
                                ? "bg-graviton-bg-primary text-graviton-text-primary"
                                : "text-graviton-text-muted hover:text-graviton-text-secondary hover:bg-graviton-bg-hover"
                            }`}
                    >
                        <span className="flex-shrink-0">{getFileIcon(tab.name)}</span>
                        <span className="text-[12px] truncate max-w-[120px]">
                            {tab.name}
                            {tab.isDirty && (
                                <span className="ml-1 text-graviton-accent-primary">●</span>
                            )}
                        </span>
                        <button
                            onClick={(e) => handleCloseTab(e, tab.id)}
                            className={`p-0.5 rounded transition-opacity ${isActive
                                    ? "opacity-100 hover:bg-graviton-bg-hover"
                                    : "opacity-0 group-hover:opacity-100 hover:bg-graviton-bg-hover"
                                }`}
                        >
                            <Icons.close className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default EditorTabs;
