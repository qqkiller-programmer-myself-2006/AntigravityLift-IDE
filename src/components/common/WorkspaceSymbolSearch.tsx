// Graviton IDE - Workspace Symbol Search
// Ctrl+T to search all symbols across workspace

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Icons, getFileIcon } from "../icons";

export type SymbolKind =
    | "function"
    | "class"
    | "interface"
    | "type"
    | "variable"
    | "constant"
    | "method"
    | "property"
    | "enum"
    | "module";

export interface WorkspaceSymbol {
    name: string;
    kind: SymbolKind;
    filePath: string;
    fileName: string;
    line: number;
    column: number;
    containerName?: string; // Parent class/module
}

interface WorkspaceSymbolSearchProps {
    isOpen: boolean;
    symbols: WorkspaceSymbol[];
    onClose: () => void;
    onSymbolSelect: (symbol: WorkspaceSymbol) => void;
}

// Map symbol kinds to icon colors
const symbolColors: Record<SymbolKind, string> = {
    function: "#dcdcaa",
    class: "#4ec9b0",
    interface: "#4ec9b0",
    type: "#4ec9b0",
    variable: "#9cdcfe",
    constant: "#4fc1ff",
    method: "#dcdcaa",
    property: "#9cdcfe",
    enum: "#b5cea8",
    module: "#4ec9b0",
};

// Get icon component for symbol kind
function getSymbolIcon(kind: SymbolKind) {
    const color = symbolColors[kind];
    switch (kind) {
        case "function":
        case "method":
            return <Icons.method className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "class":
            return <Icons.class className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "interface":
        case "type":
            return <Icons.interface className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "variable":
            return <Icons.variable className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "constant":
            return <Icons.constant className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "property":
            return <Icons.property className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "enum":
            return <Icons.enum className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        case "module":
            return <Icons.folder className="w-4 h-4 flex-shrink-0" style={{ color }} />;
        default:
            return <Icons.symbol className="w-4 h-4 flex-shrink-0" style={{ color }} />;
    }
}

export function WorkspaceSymbolSearch({
    isOpen,
    symbols,
    onClose,
    onSymbolSelect,
}: WorkspaceSymbolSearchProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [kindFilter, setKindFilter] = useState<SymbolKind | "all">("all");
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Filter and search symbols
    const filteredSymbols = useMemo(() => {
        let result = symbols;

        // Filter by kind
        if (kindFilter !== "all") {
            result = result.filter((s) => s.kind === kindFilter);
        }

        // Search by name (fuzzy)
        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((s) => {
                const name = s.name.toLowerCase();
                // Support fuzzy matching
                let queryIndex = 0;
                for (const char of name) {
                    if (char === lowerQuery[queryIndex]) {
                        queryIndex++;
                        if (queryIndex === lowerQuery.length) return true;
                    }
                }
                return queryIndex === lowerQuery.length;
            });

            // Sort by match quality
            result.sort((a, b) => {
                const aStartsWith = a.name.toLowerCase().startsWith(lowerQuery);
                const bStartsWith = b.name.toLowerCase().startsWith(lowerQuery);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.name.localeCompare(b.name);
            });
        }

        return result.slice(0, 100); // Limit results
    }, [symbols, query, kindFilter]);

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredSymbols.length, query, kindFilter]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery("");
            setKindFilter("all");
        }
    }, [isOpen]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const item = listRef.current.children[selectedIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    Math.min(prev + 1, filteredSymbols.length - 1)
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (filteredSymbols[selectedIndex]) {
                    onSymbolSelect(filteredSymbols[selectedIndex]);
                    onClose();
                }
                break;
            case "Escape":
                e.preventDefault();
                onClose();
                break;
        }
    }, [filteredSymbols, selectedIndex, onSymbolSelect, onClose]);

    if (!isOpen) return null;

    const kindOptions: (SymbolKind | "all")[] = [
        "all", "function", "class", "interface", "type", "variable", "method"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />

            <div className="relative bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl w-[600px] max-h-[400px] overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-graviton-border">
                    <Icons.search className="w-4 h-4 text-graviton-text-muted" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search workspace symbols..."
                        className="flex-1 bg-transparent outline-none text-graviton-text-primary placeholder:text-graviton-text-muted"
                    />
                    <span className="text-[11px] text-graviton-text-muted">
                        {filteredSymbols.length} symbols
                    </span>
                </div>

                {/* Kind filter */}
                <div className="flex gap-1 px-4 py-2 border-b border-graviton-border overflow-x-auto">
                    {kindOptions.map((kind) => (
                        <button
                            key={kind}
                            onClick={() => setKindFilter(kind)}
                            className={`px-2 py-0.5 text-[11px] rounded whitespace-nowrap ${kindFilter === kind
                                ? "bg-graviton-accent-primary text-white"
                                : "text-graviton-text-muted hover:bg-graviton-bg-hover"
                                }`}
                        >
                            {kind === "all" ? "All" : kind}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div ref={listRef} className="overflow-auto max-h-[280px]">
                    {filteredSymbols.map((symbol, index) => (
                        <button
                            key={`${symbol.filePath}-${symbol.name}-${symbol.line}`}
                            onClick={() => {
                                onSymbolSelect(symbol);
                                onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left ${index === selectedIndex
                                ? "bg-graviton-accent-primary/20"
                                : "hover:bg-graviton-bg-hover"
                                }`}
                        >
                            {getSymbolIcon(symbol.kind)}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-graviton-text-primary">
                                        {symbol.name}
                                    </span>
                                    {symbol.containerName && (
                                        <span className="text-[11px] text-graviton-text-muted">
                                            in {symbol.containerName}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-graviton-text-muted">
                                    {getFileIcon(symbol.fileName)}
                                    <span className="truncate">{symbol.fileName}</span>
                                    <span>:{symbol.line}</span>
                                </div>
                            </div>
                        </button>
                    ))}

                    {filteredSymbols.length === 0 && (
                        <div className="p-4 text-center text-graviton-text-muted text-sm">
                            No symbols found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WorkspaceSymbolSearch;
