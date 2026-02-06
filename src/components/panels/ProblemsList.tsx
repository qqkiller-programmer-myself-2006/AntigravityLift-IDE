// Graviton IDE - Problems Panel
// Display linting errors and warnings

import { useState, useCallback } from "react";
import { Icons } from "../icons";

export interface Problem {
    id: string;
    type: "error" | "warning" | "info";
    message: string;
    file: string;
    line: number;
    column: number;
    source?: string;
}

interface ProblemsListProps {
    problems: Problem[];
    onProblemClick: (problem: Problem) => void;
}

export function ProblemsList({ problems, onProblemClick }: ProblemsListProps) {
    const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");
    const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

    const filteredProblems = problems.filter((p) => filter === "all" || p.type === filter);

    // Group by file
    const groupedProblems = filteredProblems.reduce<Record<string, Problem[]>>((acc, problem) => {
        if (!acc[problem.file]) {
            acc[problem.file] = [];
        }
        acc[problem.file].push(problem);
        return acc;
    }, {});

    const toggleFile = useCallback((file: string) => {
        setExpandedFiles((prev) => {
            const next = new Set(prev);
            if (next.has(file)) {
                next.delete(file);
            } else {
                next.add(file);
            }
            return next;
        });
    }, []);

    const errorCount = problems.filter((p) => p.type === "error").length;
    const warningCount = problems.filter((p) => p.type === "warning").length;
    const infoCount = problems.filter((p) => p.type === "info").length;

    return (
        <div className="flex flex-col h-full">
            {/* Header with filters */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-graviton-border bg-graviton-bg-secondary">
                <button
                    onClick={() => setFilter("all")}
                    className={`text-[11px] px-2 py-0.5 rounded ${filter === "all" ? "bg-graviton-bg-hover text-graviton-text-primary" : "text-graviton-text-muted"
                        }`}
                >
                    All ({problems.length})
                </button>
                <button
                    onClick={() => setFilter("error")}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${filter === "error" ? "bg-red-500/20 text-red-400" : "text-graviton-text-muted"
                        }`}
                >
                    <Icons.close className="w-3 h-3" />
                    {errorCount}
                </button>
                <button
                    onClick={() => setFilter("warning")}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${filter === "warning" ? "bg-yellow-500/20 text-yellow-400" : "text-graviton-text-muted"
                        }`}
                >
                    <Icons.warning className="w-3 h-3" />
                    {warningCount}
                </button>
                <button
                    onClick={() => setFilter("info")}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${filter === "info" ? "bg-blue-500/20 text-blue-400" : "text-graviton-text-muted"
                        }`}
                >
                    <Icons.info className="w-3 h-3" />
                    {infoCount}
                </button>
            </div>

            {/* Problems List */}
            <div className="flex-1 overflow-auto text-[12px]">
                {Object.keys(groupedProblems).length === 0 ? (
                    <div className="p-4 text-center text-graviton-text-muted">
                        No problems detected
                    </div>
                ) : (
                    Object.entries(groupedProblems).map(([file, fileProblems]) => {
                        const fileName = file.split("\\").pop() || file;
                        const isExpanded = expandedFiles.has(file) || expandedFiles.size === 0;

                        return (
                            <div key={file}>
                                <button
                                    onClick={() => toggleFile(file)}
                                    className="w-full flex items-center gap-2 px-3 py-1 hover:bg-graviton-bg-hover text-left"
                                >
                                    <Icons.chevronRight
                                        className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                    />
                                    <Icons.file className="w-4 h-4 text-graviton-text-muted" />
                                    <span className="text-graviton-text-primary">{fileName}</span>
                                    <span className="text-graviton-text-muted">({fileProblems.length})</span>
                                </button>

                                {isExpanded && (
                                    <div className="bg-graviton-bg-tertiary/30">
                                        {fileProblems.map((problem) => (
                                            <button
                                                key={problem.id}
                                                onClick={() => onProblemClick(problem)}
                                                className="w-full flex items-start gap-2 px-6 py-1 hover:bg-graviton-bg-hover text-left"
                                            >
                                                {problem.type === "error" && (
                                                    <Icons.close className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                )}
                                                {problem.type === "warning" && (
                                                    <Icons.warning className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                )}
                                                {problem.type === "info" && (
                                                    <Icons.info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-graviton-text-secondary truncate">
                                                        {problem.message}
                                                    </div>
                                                    <div className="text-graviton-text-muted text-[10px]">
                                                        [{problem.line}:{problem.column}]
                                                        {problem.source && ` (${problem.source})`}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ProblemsList;
