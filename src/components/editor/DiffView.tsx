// Graviton IDE - File Diff View
// Compare two files side by side

import { useMemo } from "react";

interface DiffLine {
    type: "unchanged" | "added" | "removed";
    lineNumber: number | null;
    content: string;
}

interface DiffViewProps {
    originalContent: string;
    modifiedContent: string;
    originalName?: string;
    modifiedName?: string;
}

function computeDiff(original: string, modified: string): DiffLine[] {
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");
    const result: DiffLine[] = [];

    // Simple line-by-line diff (could use a proper diff algorithm like Myers)
    let i = 0, j = 0;

    while (i < originalLines.length || j < modifiedLines.length) {
        if (i >= originalLines.length) {
            // Remaining lines in modified are additions
            result.push({
                type: "added",
                lineNumber: j + 1,
                content: modifiedLines[j],
            });
            j++;
        } else if (j >= modifiedLines.length) {
            // Remaining lines in original are deletions
            result.push({
                type: "removed",
                lineNumber: i + 1,
                content: originalLines[i],
            });
            i++;
        } else if (originalLines[i] === modifiedLines[j]) {
            // Lines match
            result.push({
                type: "unchanged",
                lineNumber: i + 1,
                content: originalLines[i],
            });
            i++;
            j++;
        } else {
            // Lines differ - mark original as removed, modified as added
            result.push({
                type: "removed",
                lineNumber: i + 1,
                content: originalLines[i],
            });
            result.push({
                type: "added",
                lineNumber: j + 1,
                content: modifiedLines[j],
            });
            i++;
            j++;
        }
    }

    return result;
}

export function DiffView({
    originalContent,
    modifiedContent,
    originalName = "Original",
    modifiedName = "Modified"
}: DiffViewProps) {
    const diffLines = useMemo(
        () => computeDiff(originalContent, modifiedContent),
        [originalContent, modifiedContent]
    );

    const stats = useMemo(() => {
        const added = diffLines.filter((l) => l.type === "added").length;
        const removed = diffLines.filter((l) => l.type === "removed").length;
        return { added, removed };
    }, [diffLines]);

    return (
        <div className="flex flex-col h-full bg-graviton-bg-primary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-graviton-bg-secondary border-b border-graviton-border">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-graviton-text-primary">{originalName}</span>
                    <span className="text-graviton-text-muted">→</span>
                    <span className="text-sm text-graviton-text-primary">{modifiedName}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-green-400">+{stats.added}</span>
                    <span className="text-red-400">-{stats.removed}</span>
                </div>
            </div>

            {/* Diff content */}
            <div className="flex-1 overflow-auto font-mono text-[13px]">
                {diffLines.map((line, index) => (
                    <div
                        key={index}
                        className={`flex ${line.type === "added"
                                ? "bg-green-500/10"
                                : line.type === "removed"
                                    ? "bg-red-500/10"
                                    : ""
                            }`}
                    >
                        {/* Indicator */}
                        <div className={`w-6 flex-shrink-0 text-center ${line.type === "added"
                                ? "text-green-400"
                                : line.type === "removed"
                                    ? "text-red-400"
                                    : "text-graviton-text-muted"
                            }`}>
                            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                        </div>

                        {/* Line number */}
                        <div className="w-12 flex-shrink-0 text-right pr-3 text-graviton-text-muted select-none">
                            {line.lineNumber}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 px-2 whitespace-pre ${line.type === "added"
                                ? "text-green-300"
                                : line.type === "removed"
                                    ? "text-red-300"
                                    : "text-graviton-text-secondary"
                            }`}>
                            {line.content || " "}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DiffView;
