// Graviton IDE - Welcome Screen
// Shown when no file is open

import { Icons } from "../icons";

interface WelcomeScreenProps {
    onOpenFolder: () => void;
    onNewFile: () => void;
    recentFolders?: string[];
    onOpenRecentFolder?: (path: string) => void;
}

export function WelcomeScreen({
    onOpenFolder,
    onNewFile,
    recentFolders = [],
    onOpenRecentFolder
}: WelcomeScreenProps) {
    return (
        <div className="flex-1 flex items-center justify-center bg-graviton-bg-primary">
            <div className="max-w-lg text-center">
                {/* Logo */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-graviton-accent-primary to-purple-600 flex items-center justify-center shadow-lg shadow-graviton-accent-primary/20">
                        <span className="text-white text-4xl font-bold">G</span>
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold text-graviton-text-primary">
                        Graviton IDE
                    </h1>
                    <p className="mt-1 text-graviton-text-muted text-sm">
                        Lightweight & Modern Code Editor
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button
                        onClick={onNewFile}
                        className="flex items-center gap-3 p-4 rounded-lg bg-graviton-bg-secondary hover:bg-graviton-bg-hover border border-graviton-border transition-colors text-left"
                    >
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Icons.newFile className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-graviton-text-primary">New File</div>
                            <div className="text-[11px] text-graviton-text-muted">Ctrl+N</div>
                        </div>
                    </button>
                    <button
                        onClick={onOpenFolder}
                        className="flex items-center gap-3 p-4 rounded-lg bg-graviton-bg-secondary hover:bg-graviton-bg-hover border border-graviton-border transition-colors text-left"
                    >
                        <div className="p-2 rounded-lg bg-yellow-500/20">
                            <Icons.folder className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-graviton-text-primary">Open Folder</div>
                            <div className="text-[11px] text-graviton-text-muted">Ctrl+K Ctrl+O</div>
                        </div>
                    </button>
                </div>

                {/* Recent Folders */}
                {recentFolders.length > 0 && (
                    <div className="text-left">
                        <h3 className="text-[11px] font-medium text-graviton-text-muted uppercase tracking-wider mb-2">
                            Recent Folders
                        </h3>
                        <div className="space-y-1">
                            {recentFolders.slice(0, 5).map((folder) => {
                                const name = folder.split("\\").pop() || folder;
                                return (
                                    <button
                                        key={folder}
                                        onClick={() => onOpenRecentFolder?.(folder)}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-graviton-bg-hover text-left group"
                                    >
                                        <Icons.folder className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm text-graviton-text-primary truncate flex-1">
                                            {name}
                                        </span>
                                        <span className="text-[10px] text-graviton-text-muted truncate max-w-[200px] opacity-0 group-hover:opacity-100">
                                            {folder}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Keyboard Shortcuts */}
                <div className="mt-8 pt-6 border-t border-graviton-border">
                    <div className="flex justify-center gap-6 text-[11px] text-graviton-text-muted">
                        <div>
                            <kbd className="px-1.5 py-0.5 rounded bg-graviton-bg-secondary border border-graviton-border">Ctrl+P</kbd>
                            <span className="ml-1">Command Palette</span>
                        </div>
                        <div>
                            <kbd className="px-1.5 py-0.5 rounded bg-graviton-bg-secondary border border-graviton-border">Ctrl+Shift+F</kbd>
                            <span className="ml-1">Search Files</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;
