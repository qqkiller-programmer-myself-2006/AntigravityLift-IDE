// Graviton IDE - Sidebar
// Left sidebar with file explorer

import { Icons } from "../icons";
import { FileTree } from "../explorer/FileTree";
import { useFileStore } from "../../stores/fileStore";

interface SidebarProps {
    width: number;
    onFileClick: (path: string, name: string) => void;
    onOpenFolder?: () => void;
    onNewFile?: () => void;
    onNewFolder?: () => void;
    onRefresh?: () => void;
    onCollapseAll?: () => void;
}

export function Sidebar({
    width,
    onFileClick,
    onOpenFolder,
    onNewFile,
    onNewFolder,
    onRefresh,
    onCollapseAll,
}: SidebarProps) {
    const { rootPath, fileTree } = useFileStore();
    const folderName = rootPath?.split("\\").pop() || "Explorer";

    return (
        <div
            className="bg-graviton-bg-secondary border-r border-graviton-border flex flex-col h-full"
            style={{ width }}
        >
            {/* Header */}
            <div className="h-9 flex items-center justify-between px-4 text-[11px] text-graviton-text-muted uppercase tracking-wider font-medium flex-shrink-0">
                Explorer
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={onOpenFolder}
                        className="p-1 hover:bg-graviton-bg-hover rounded"
                        title="Open Folder"
                    >
                        <Icons.newFolder className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onNewFile}
                        className="p-1 hover:bg-graviton-bg-hover rounded"
                        title="New File"
                    >
                        <Icons.newFile className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onNewFolder}
                        className="p-1 hover:bg-graviton-bg-hover rounded"
                        title="New Folder"
                    >
                        <Icons.folder className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onRefresh}
                        className="p-1 hover:bg-graviton-bg-hover rounded"
                        title="Refresh"
                    >
                        <Icons.refresh className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onCollapseAll}
                        className="p-1 hover:bg-graviton-bg-hover rounded"
                        title="Collapse All"
                    >
                        <Icons.collapseAll className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Folder Name */}
            {rootPath && (
                <div className="px-3 py-1 text-[11px] text-graviton-text-secondary uppercase tracking-wider font-medium flex items-center gap-1 flex-shrink-0">
                    <Icons.chevronDown className="w-3 h-3" />
                    <span className="truncate">{folderName}</span>
                </div>
            )}

            {/* File Tree */}
            <div className="flex-1 overflow-auto">
                {rootPath && fileTree.length > 0 ? (
                    <FileTree
                        onFileClick={onFileClick}
                        onRefresh={onRefresh}
                        onNewFile={onNewFile}
                        onNewFolder={onNewFolder}
                    />
                ) : (
                    <div className="p-4 text-center text-graviton-text-muted text-sm">
                        <p className="mb-4">No folder opened</p>
                        <button
                            onClick={onOpenFolder}
                            className="px-4 py-2 bg-graviton-accent-primary text-white rounded hover:bg-graviton-accent-primary/80 transition-colors text-[12px]"
                        >
                            Open Folder
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;

