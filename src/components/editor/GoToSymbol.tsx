// Graviton IDE - Go to Symbol Dialog
// Quick navigation to functions, classes, etc.

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Icons } from "../icons";

export interface Symbol {
    name: string;
    kind: "function" | "class" | "method" | "variable" | "interface" | "enum" | "property";
    line: number;
    containerName?: string;
}

interface GoToSymbolProps {
    isOpen: boolean;
    onClose: () => void;
    symbols: Symbol[];
    onSymbolSelect: (symbol: Symbol) => void;
}

function getSymbolIcon(kind: Symbol["kind"]) {
    switch (kind) {
        case "class":
            return <Icons.class className="w-4 h-4 text-orange-400" />;
        case "interface":
            return <Icons.interface className="w-4 h-4 text-blue-400" />;
        case "function":
            return <Icons.function className="w-4 h-4 text-purple-400" />;
        case "method":
            return <Icons.method className="w-4 h-4 text-purple-400" />;
        case "property":
            return <Icons.property className="w-4 h-4 text-cyan-400" />;
        case "variable":
            return <Icons.variable className="w-4 h-4 text-blue-300" />;
        case "enum":
            return <Icons.enum className="w-4 h-4 text-yellow-400" />;
        default:
            return <Icons.symbol className="w-4 h-4 text-graviton-text-muted" />;
    }
}

export function GoToSymbol({ isOpen, onClose, symbols, onSymbolSelect }: GoToSymbolProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const filteredSymbols = useMemo(() => {
        if (!query) return symbols;
        const lowerQuery = query.toLowerCase();
        return symbols.filter((s) =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.containerName?.toLowerCase().includes(lowerQuery)
        );
    }, [symbols, query]);

    // Scroll selected item into view
    useEffect(() => {
        const list = listRef.current;
        if (list) {
            const selected = list.children[selectedIndex] as HTMLElement;
            if (selected) {
                selected.scrollIntoView({ block: "nearest" });
            }
        }
    }, [selectedIndex]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case "Escape":
                onClose();
                break;
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
                if (filteredSymbols[selectedIndex]) {
                    onSymbolSelect(filteredSymbols[selectedIndex]);
                    onClose();
                }
                break;
        }
    }, [onClose, onSymbolSelect, filteredSymbols, selectedIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10%]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl w-[500px] max-h-[400px] overflow-hidden">
                {/* Search input */}
                <div className="p-3 border-b border-graviton-border">
                    <div className="flex items-center gap-2 bg-graviton-bg-tertiary rounded px-3 py-2">
                        <span className="text-graviton-text-muted">@</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Go to symbol..."
                            className="flex-1 bg-transparent text-sm outline-none text-graviton-text-primary"
                        />
                        <span className="text-[10px] text-graviton-text-muted">
                            {filteredSymbols.length} symbols
                        </span>
                    </div>
                </div>

                {/* Results */}
                <div ref={listRef} className="overflow-auto max-h-[300px]">
                    {filteredSymbols.length === 0 ? (
                        <div className="p-4 text-center text-graviton-text-muted text-sm">
                            No symbols found
                        </div>
                    ) : (
                        filteredSymbols.map((symbol, index) => (
                            <button
                                key={`${symbol.name}-${symbol.line}`}
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
                                    <div className="text-sm text-graviton-text-primary truncate">
                                        {symbol.name}
                                    </div>
                                    {symbol.containerName && (
                                        <div className="text-[11px] text-graviton-text-muted truncate">
                                            {symbol.containerName}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[11px] text-graviton-text-muted">
                                    :{symbol.line}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default GoToSymbol;
