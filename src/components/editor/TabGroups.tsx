// Graviton IDE - Tab Groups
// Enhanced editor tabs with pinning and grouping

import { useState, useCallback } from "react";
import { Icons, getFileIcon } from "../icons";

export interface TabInfo {
    id: string;
    path: string;
    name: string;
    isDirty: boolean;
    isPinned: boolean;
    groupId?: string;
}

interface TabGroupsProps {
    tabs: TabInfo[];
    activeTabId: string | null;
    onTabClick: (tabId: string) => void;
    onTabClose: (tabId: string) => void;
    onTabPin: (tabId: string) => void;
    onTabUnpin: (tabId: string) => void;
    onTabsReorder: (tabs: TabInfo[]) => void;
}

export function TabGroups({
    tabs,
    activeTabId,
    onTabClick,
    onTabClose,
    onTabPin,
    onTabUnpin,
    onTabsReorder,
}: TabGroupsProps) {
    const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);

    // Sort tabs: pinned first, then by order
    const sortedTabs = [...tabs].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
    });

    const handleDragStart = useCallback((e: React.DragEvent, tabId: string) => {
        setDraggedTabId(tabId);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, tabId: string) => {
        e.preventDefault();
        if (tabId !== draggedTabId) {
            setDropTargetId(tabId);
        }
    }, [draggedTabId]);

    const handleDragEnd = useCallback(() => {
        if (draggedTabId && dropTargetId) {
            const draggedTab = tabs.find((t) => t.id === draggedTabId);
            const dropIndex = tabs.findIndex((t) => t.id === dropTargetId);

            if (draggedTab && dropIndex !== -1) {
                const newTabs = tabs.filter((t) => t.id !== draggedTabId);
                newTabs.splice(dropIndex, 0, draggedTab);
                onTabsReorder(newTabs);
            }
        }
        setDraggedTabId(null);
        setDropTargetId(null);
    }, [draggedTabId, dropTargetId, tabs, onTabsReorder]);

    const handleContextMenu = useCallback((e: React.MouseEvent, _tab: TabInfo) => {
        e.preventDefault();
        // Could show context menu here
    }, []);

    return (
        <div className="flex items-center overflow-x-auto bg-graviton-bg-secondary border-b border-graviton-border">
            {sortedTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const isDragTarget = tab.id === dropTargetId;

                return (
                    <div
                        key={tab.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tab.id)}
                        onDragOver={(e) => handleDragOver(e, tab.id)}
                        onDragEnd={handleDragEnd}
                        onContextMenu={(e) => handleContextMenu(e, tab)}
                        onClick={() => onTabClick(tab.id)}
                        className={`
                            group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer select-none
                            border-r border-graviton-border min-w-0
                            ${isActive
                                ? "bg-graviton-bg-primary text-graviton-text-primary"
                                : "text-graviton-text-muted hover:bg-graviton-bg-hover"
                            }
                            ${isDragTarget ? "border-l-2 border-l-graviton-accent-primary" : ""}
                            ${tab.isPinned ? "bg-graviton-bg-tertiary/30" : ""}
                        `}
                    >
                        {/* Pin indicator */}
                        {tab.isPinned && (
                            <Icons.pin className="w-3 h-3 text-graviton-accent-primary flex-shrink-0" />
                        )}

                        {/* File icon */}
                        <span className="flex-shrink-0">
                            {getFileIcon(tab.name)}
                        </span>

                        {/* File name */}
                        <span className={`text-[12px] truncate max-w-[120px] ${tab.isPinned ? "" : ""}`}>
                            {tab.name}
                        </span>

                        {/* Dirty indicator */}
                        {tab.isDirty && (
                            <span className="w-2 h-2 rounded-full bg-graviton-accent-primary flex-shrink-0" />
                        )}

                        {/* Close button (not for pinned) */}
                        {!tab.isPinned && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTabClose(tab.id);
                                }}
                                className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-graviton-bg-hover"
                            >
                                <Icons.close className="w-3 h-3" />
                            </button>
                        )}

                        {/* Pin/Unpin button (shown on hover) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                tab.isPinned ? onTabUnpin(tab.id) : onTabPin(tab.id);
                            }}
                            className={`p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-graviton-bg-hover ${tab.isPinned ? "text-graviton-accent-primary" : ""
                                }`}
                            title={tab.isPinned ? "Unpin" : "Pin"}
                        >
                            <Icons.pin className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}

            {/* Empty space for dropping at end */}
            <div className="flex-1 min-w-[20px]" />
        </div>
    );
}

export default TabGroups;
