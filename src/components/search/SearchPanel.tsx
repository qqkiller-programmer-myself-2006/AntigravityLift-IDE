// Graviton IDE - Search Panel
// Project-wide search with regex and case-sensitive options

import { useState, useCallback, useRef, useEffect } from "react";
import { readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { useFileStore } from "../../stores/fileStore";
import { Icons } from "../icons";

interface SearchResult {
    path: string;
    name: string;
    line: number;
    content: string;
    matchStart: number;
    matchEnd: number;
}

interface SearchPanelProps {
    onFileSelect: (path: string, name: string) => void;
}

export function SearchPanel({ onFileSelect }: SearchPanelProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

    const { rootPath } = useFileStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<boolean>(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Get all files recursively
    const getAllFiles = useCallback(async (dir: string, depth = 0): Promise<string[]> => {
        if (depth > 10 || abortRef.current) return [];

        try {
            const entries = await readDir(dir);
            const files: string[] = [];

            for (const entry of entries) {
                if (abortRef.current) break;

                // Skip hidden files, node_modules, target, dist, .git
                if (entry.name.startsWith(".") ||
                    entry.name === "node_modules" ||
                    entry.name === "target" ||
                    entry.name === "dist") {
                    continue;
                }

                const fullPath = `${dir}\\${entry.name}`;

                if (entry.isDirectory) {
                    const subFiles = await getAllFiles(fullPath, depth + 1);
                    files.push(...subFiles);
                } else {
                    // Only include text files
                    const ext = entry.name.split(".").pop()?.toLowerCase() || "";
                    const textExts = ["ts", "tsx", "js", "jsx", "json", "md", "css", "scss", "html", "rs", "toml", "yaml", "yml", "txt", "py", "go", "sh"];
                    if (textExts.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }

            return files;
        } catch {
            return [];
        }
    }, []);

    // Search all files
    const searchFiles = useCallback(async () => {
        if (!query.trim() || !rootPath) return;

        abortRef.current = false;
        setIsSearching(true);
        setResults([]);

        try {
            const files = await getAllFiles(rootPath);
            const searchResults: SearchResult[] = [];

            let pattern: RegExp;
            try {
                if (useRegex) {
                    pattern = new RegExp(query, caseSensitive ? "g" : "gi");
                } else {
                    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    pattern = new RegExp(escaped, caseSensitive ? "g" : "gi");
                }
            } catch {
                // Invalid regex
                setIsSearching(false);
                return;
            }

            for (const filePath of files) {
                if (abortRef.current) break;

                try {
                    const content = await readTextFile(filePath);
                    const lines = content.split("\n");

                    lines.forEach((lineContent, lineIndex) => {
                        pattern.lastIndex = 0;
                        let match;

                        while ((match = pattern.exec(lineContent)) !== null) {
                            searchResults.push({
                                path: filePath,
                                name: filePath.split("\\").pop() || "",
                                line: lineIndex + 1,
                                content: lineContent.trim(),
                                matchStart: match.index,
                                matchEnd: match.index + match[0].length,
                            });

                            // Limit results per file
                            if (searchResults.filter(r => r.path === filePath).length > 10) break;
                        }
                    });
                } catch {
                    // Skip unreadable files
                }
            }

            setResults(searchResults.slice(0, 100)); // Limit total results
        } finally {
            setIsSearching(false);
        }
    }, [query, rootPath, caseSensitive, useRegex, getAllFiles]);

    // Group results by file
    const groupedResults = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
        if (!acc[result.path]) {
            acc[result.path] = [];
        }
        acc[result.path].push(result);
        return acc;
    }, {});

    const togglePath = useCallback((path: string) => {
        setExpandedPaths((prev) => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            searchFiles();
        }
    }, [searchFiles]);

    return (
        <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="p-3 border-b border-graviton-border">
                <div className="flex items-center gap-2 bg-graviton-bg-tertiary rounded px-3 py-1.5">
                    <Icons.search className="w-4 h-4 text-graviton-text-muted" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search files..."
                        className="flex-1 bg-transparent text-sm text-graviton-text-primary outline-none"
                    />
                    {isSearching && (
                        <span className="animate-spin text-graviton-text-muted">⏳</span>
                    )}
                </div>

                {/* Options */}
                <div className="flex items-center gap-3 mt-2 text-[11px]">
                    <button
                        onClick={() => setCaseSensitive(!caseSensitive)}
                        className={`px-2 py-0.5 rounded ${caseSensitive
                                ? "bg-graviton-accent-primary text-white"
                                : "bg-graviton-bg-tertiary text-graviton-text-muted"
                            }`}
                        title="Case Sensitive"
                    >
                        Aa
                    </button>
                    <button
                        onClick={() => setUseRegex(!useRegex)}
                        className={`px-2 py-0.5 rounded font-mono ${useRegex
                                ? "bg-graviton-accent-primary text-white"
                                : "bg-graviton-bg-tertiary text-graviton-text-muted"
                            }`}
                        title="Use Regular Expression"
                    >
                        .*
                    </button>
                    <button
                        onClick={searchFiles}
                        disabled={isSearching || !query.trim()}
                        className="px-3 py-0.5 bg-graviton-accent-primary text-white rounded disabled:opacity-50"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto text-[12px]">
                {!rootPath ? (
                    <div className="p-4 text-center text-graviton-text-muted">
                        Open a folder to search
                    </div>
                ) : results.length === 0 && !isSearching ? (
                    <div className="p-4 text-center text-graviton-text-muted">
                        {query ? "No results found" : "Enter a search term"}
                    </div>
                ) : (
                    Object.entries(groupedResults).map(([path, fileResults]) => {
                        const fileName = path.split("\\").pop() || "";
                        const relativePath = rootPath ? path.replace(rootPath + "\\", "") : path;
                        const isExpanded = expandedPaths.has(path);

                        return (
                            <div key={path} className="border-b border-graviton-border/50">
                                <button
                                    onClick={() => togglePath(path)}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-graviton-bg-hover text-left"
                                >
                                    <Icons.chevronRight
                                        className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                    />
                                    <Icons.file className="w-4 h-4 text-graviton-text-muted" />
                                    <span className="text-graviton-text-primary font-medium truncate">
                                        {fileName}
                                    </span>
                                    <span className="text-graviton-text-muted text-[10px] truncate">
                                        {relativePath}
                                    </span>
                                    <span className="ml-auto text-graviton-text-muted">
                                        {fileResults.length}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="bg-graviton-bg-tertiary/30">
                                        {fileResults.map((result, i) => (
                                            <button
                                                key={`${result.path}-${result.line}-${i}`}
                                                onClick={() => onFileSelect(result.path, result.name)}
                                                className="w-full flex items-start gap-2 px-6 py-1 hover:bg-graviton-bg-hover text-left"
                                            >
                                                <span className="text-graviton-text-muted w-8 text-right flex-shrink-0">
                                                    {result.line}
                                                </span>
                                                <span className="text-graviton-text-secondary truncate">
                                                    {result.content}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Status */}
            {results.length > 0 && (
                <div className="px-3 py-1.5 border-t border-graviton-border text-[11px] text-graviton-text-muted">
                    {results.length} results in {Object.keys(groupedResults).length} files
                </div>
            )}
        </div>
    );
}

export default SearchPanel;
