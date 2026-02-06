// Graviton IDE - Bookmarks Panel
// View and navigate all bookmarks

import { useState, useMemo } from "react";
import { Icons, getFileIcon } from "../icons";
import { useBookmarksStore, Bookmark } from "../../stores/bookmarksStore";

interface BookmarksPanelProps {
    onBookmarkClick: (bookmark: Bookmark) => void;
}

export function BookmarksPanel({ onBookmarkClick }: BookmarksPanelProps) {
    const {
        bookmarks,
        removeBookmark,
        updateBookmarkLabel,
        clearAllBookmarks
    } = useBookmarksStore();

    const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState("");

    // Group bookmarks by file
    const groupedBookmarks = useMemo(() => {
        const groups: Record<string, Bookmark[]> = {};
        for (const bookmark of bookmarks) {
            if (!groups[bookmark.filePath]) {
                groups[bookmark.filePath] = [];
            }
            groups[bookmark.filePath].push(bookmark);
        }
        return groups;
    }, [bookmarks]);

    const toggleFile = (filePath: string) => {
        setExpandedFiles((prev) => {
            const next = new Set(prev);
            if (next.has(filePath)) {
                next.delete(filePath);
            } else {
                next.add(filePath);
            }
            return next;
        });
    };

    const startEditing = (bookmark: Bookmark) => {
        setEditingId(bookmark.id);
        setEditLabel(bookmark.label || "");
    };

    const saveLabel = () => {
        if (editingId) {
            updateBookmarkLabel(editingId, editLabel);
            setEditingId(null);
            setEditLabel("");
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-graviton-border">
                <h3 className="text-sm font-medium text-graviton-text-primary">
                    Bookmarks
                </h3>
                <div className="flex items-center gap-1">
                    <span className="text-[11px] text-graviton-text-muted mr-2">
                        {bookmarks.length} total
                    </span>
                    {bookmarks.length > 0 && (
                        <button
                            onClick={clearAllBookmarks}
                            className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                            title="Clear All Bookmarks"
                        >
                            <Icons.close className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Bookmarks list */}
            <div className="flex-1 overflow-auto">
                {Object.entries(groupedBookmarks).map(([filePath, fileBookmarks]) => {
                    const isExpanded = expandedFiles.has(filePath) || expandedFiles.size === 0;
                    const fileName = filePath.split("\\").pop() || filePath;

                    return (
                        <div key={filePath} className="border-b border-graviton-border">
                            {/* File header */}
                            <button
                                onClick={() => toggleFile(filePath)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-graviton-bg-hover"
                            >
                                <Icons.chevronRight
                                    className={`w-3 h-3 text-graviton-text-muted transition-transform ${isExpanded ? "rotate-90" : ""
                                        }`}
                                />
                                {getFileIcon(fileName)}
                                <span className="text-sm text-graviton-text-primary">{fileName}</span>
                                <span className="text-[11px] text-graviton-text-muted">
                                    ({fileBookmarks.length})
                                </span>
                            </button>

                            {/* Bookmarks in file */}
                            {isExpanded && (
                                <div className="ml-5">
                                    {fileBookmarks.map((bookmark) => (
                                        <div
                                            key={bookmark.id}
                                            className="flex items-center gap-2 px-3 py-1 hover:bg-graviton-bg-hover group"
                                        >
                                            <Icons.bookmark className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />

                                            <button
                                                onClick={() => onBookmarkClick(bookmark)}
                                                className="flex-1 flex items-center gap-2 text-left min-w-0"
                                            >
                                                <span className="text-[11px] text-graviton-text-muted w-8">
                                                    :{bookmark.line}
                                                </span>
                                                {editingId === bookmark.id ? (
                                                    <input
                                                        type="text"
                                                        value={editLabel}
                                                        onChange={(e) => setEditLabel(e.target.value)}
                                                        onBlur={saveLabel}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") saveLabel();
                                                            if (e.key === "Escape") setEditingId(null);
                                                        }}
                                                        autoFocus
                                                        className="flex-1 px-1 py-0 text-[12px] bg-graviton-bg-tertiary border border-graviton-accent-primary rounded outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-[12px] text-graviton-text-secondary truncate">
                                                        {bookmark.label || `Line ${bookmark.line}`}
                                                    </span>
                                                )}
                                            </button>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={() => startEditing(bookmark)}
                                                    className="p-0.5 hover:bg-graviton-bg-hover rounded"
                                                    title="Edit Label"
                                                >
                                                    <Icons.settings className="w-3 h-3 text-graviton-text-muted" />
                                                </button>
                                                <button
                                                    onClick={() => removeBookmark(bookmark.id)}
                                                    className="p-0.5 hover:bg-graviton-bg-hover rounded"
                                                    title="Remove Bookmark"
                                                >
                                                    <Icons.close className="w-3 h-3 text-graviton-text-muted" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {bookmarks.length === 0 && (
                    <div className="p-4 text-center text-graviton-text-muted text-sm">
                        <p>No bookmarks</p>
                        <p className="text-[11px] mt-1">
                            Use Ctrl+Alt+K to toggle a bookmark
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookmarksPanel;
