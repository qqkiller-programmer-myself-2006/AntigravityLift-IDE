// Graviton IDE - File Tree Component
// Recursive file explorer with context menu

import { useCallback, useState } from "react";
import { Icons, getFileIcon } from "../icons";
import { useFileStore } from "../../stores/fileStore";
import { FileNode } from "../../types";
import { FileContextMenu } from "./FileContextMenu";

interface ContextMenuState {
    x: number;
    y: number;
    node: FileNode | null;
}

interface FileTreeItemProps {
    node: FileNode;
    depth?: number;
    onFileClick: (path: string, name: string) => void;
    onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
}

function FileTreeItem({ node, depth = 0, onFileClick, onContextMenu }: FileTreeItemProps) {
    const { isExpanded, toggleExpanded, selectedPath, setSelectedPath } = useFileStore();
    const expanded = isExpanded(node.path);
    const isSelected = selectedPath === node.path;

    const handleClick = useCallback(() => {
        if (node.type === "directory") {
            toggleExpanded(node.path);
        } else {
            setSelectedPath(node.path);
            onFileClick(node.path, node.name);
        }
    }, [node, toggleExpanded, setSelectedPath, onFileClick]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPath(node.path);
        onContextMenu(e, node);
    }, [node, setSelectedPath, onContextMenu]);

    return (
        <div>
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                className={`flex items-center gap-1.5 px-2 py-[2px] cursor-pointer select-none ${isSelected
                    ? "bg-graviton-accent-primary/20 text-graviton-text-primary"
                    : "hover:bg-graviton-bg-hover text-graviton-text-secondary"
                    }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                {node.type === "directory" ? (
                    <>
                        <span className="text-graviton-text-muted w-3 flex-shrink-0">
                            {expanded ? (
                                <Icons.chevronDown className="w-3 h-3" />
                            ) : (
                                <Icons.chevronRight className="w-3 h-3" />
                            )}
                        </span>
                        <span className="text-yellow-500 flex-shrink-0">
                            {expanded ? (
                                <Icons.folderOpen className="w-4 h-4" />
                            ) : (
                                <Icons.folder className="w-4 h-4" />
                            )}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="w-3 flex-shrink-0" />
                        <span className="flex-shrink-0">{getFileIcon(node.name)}</span>
                    </>
                )}
                <span className="truncate text-[13px]">{node.name}</span>
            </div>

            {node.type === "directory" && expanded && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.path}
                            node={child}
                            depth={depth + 1}
                            onFileClick={onFileClick}
                            onContextMenu={onContextMenu}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface FileTreeProps {
    onFileClick: (path: string, name: string) => void;
    onRefresh?: () => void;
    onNewFile?: (parentPath: string) => void;
    onNewFolder?: (parentPath: string) => void;
}

export function FileTree({ onFileClick, onRefresh, onNewFile, onNewFolder }: FileTreeProps) {
    const { fileTree, rootPath, isLoading } = useFileStore();
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, node: null });

    const handleContextMenu = useCallback((e: React.MouseEvent, node: FileNode) => {
        setContextMenu({ x: e.clientX, y: e.clientY, node });
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu({ x: 0, y: 0, node: null });
    }, []);

    if (isLoading) {
        return (
            <div className="p-4 text-center text-graviton-text-muted text-sm">
                Loading...
            </div>
        );
    }

    if (!rootPath || fileTree.length === 0) {
        return (
            <div className="p-4 text-center text-graviton-text-muted text-sm">
                No folder open
            </div>
        );
    }

    return (
        <div className="text-[13px]">
            {fileTree.map((node) => (
                <FileTreeItem
                    key={node.path}
                    node={node}
                    onFileClick={onFileClick}
                    onContextMenu={handleContextMenu}
                />
            ))}

            {/* Context Menu */}
            {contextMenu.node && (
                <FileContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    path={contextMenu.node.path}
                    name={contextMenu.node.name}
                    isDirectory={contextMenu.node.type === "directory"}
                    onClose={closeContextMenu}
                    onRefresh={onRefresh}
                    onNewFile={onNewFile}
                    onNewFolder={onNewFolder}
                />
            )}
        </div>
    );
}

export default FileTree;

