// Graviton IDE - References Panel
// Show all references to a symbol

import { useState, useMemo } from "react";
import { Icons, getFileIcon } from "../icons";

export interface Reference {
    filePath: string;
    fileName: string;
    line: number;
    column: number;
    preview: string; // Line content
    matchStart: number; // Start of match in preview
    matchEnd: number; // End of match in preview
}

interface ReferencesPanelProps {
    symbol: string;
    references: Reference[];
    onReferenceClick: (ref: Reference) => void;
    onClose: () => void;
}

export function ReferencesPanel({
    symbol,
    references,
    onReferenceClick,
    onClose
}: ReferencesPanelProps) {
    const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

    // Group references by file
    const groupedRefs = useMemo(() => {
        const groups: Record<string, Reference[]> = {};
        for (const ref of references) {
            if (!groups[ref.filePath]) {
                groups[ref.filePath] = [];
            }
            groups[ref.filePath].push(ref);
        }
        return groups;
    }, [references]);

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

    // Expand all files by default
    useState(() => {
        setExpandedFiles(new Set(Object.keys(groupedRefs)));
    });

    return (
        <div className="flex flex-col h-full bg-graviton-bg-primary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-graviton-border bg-graviton-bg-secondary">
                <div>
                    <span className="text-sm text-graviton-text-primary">
                        References to <code className="px-1 bg-graviton-bg-tertiary rounded">{symbol}</code>
                    </span>
                    <span className="ml-2 text-[11px] text-graviton-text-muted">
                        {references.length} references in {Object.keys(groupedRefs).length} files
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                >
                    <Icons.close className="w-4 h-4" />
                </button>
            </div>

            {/* References list */}
            <div className="flex-1 overflow-auto">
                {Object.entries(groupedRefs).map(([filePath, refs]) => {
                    const isExpanded = expandedFiles.has(filePath);
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
                                    ({refs.length})
                                </span>
                            </button>

                            {/* References in file */}
                            {isExpanded && (
                                <div className="ml-6">
                                    {refs.map((ref, index) => (
                                        <button
                                            key={`${ref.line}-${index}`}
                                            onClick={() => onReferenceClick(ref)}
                                            className="w-full flex items-start gap-2 px-3 py-1 hover:bg-graviton-bg-hover text-left"
                                        >
                                            <span className="text-[11px] text-graviton-text-muted w-8 text-right flex-shrink-0">
                                                {ref.line}
                                            </span>
                                            <span className="font-mono text-[12px] text-graviton-text-secondary truncate">
                                                {ref.preview.substring(0, ref.matchStart)}
                                                <span className="bg-yellow-500/30 text-graviton-text-primary">
                                                    {ref.preview.substring(ref.matchStart, ref.matchEnd)}
                                                </span>
                                                {ref.preview.substring(ref.matchEnd)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {references.length === 0 && (
                    <div className="p-4 text-center text-graviton-text-muted text-sm">
                        No references found
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReferencesPanel;
