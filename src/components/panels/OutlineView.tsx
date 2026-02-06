// Graviton IDE - Outline View
// Show file structure with functions, classes, etc.

import { useState, useCallback, useMemo } from "react";
import { Icons } from "../icons";

export interface OutlineSymbol {
    name: string;
    kind: "class" | "function" | "method" | "property" | "variable" | "interface" | "enum" | "constant";
    line: number;
    children?: OutlineSymbol[];
}

interface OutlineViewProps {
    symbols: OutlineSymbol[];
    onSymbolClick: (symbol: OutlineSymbol) => void;
    currentLine?: number;
}

function getSymbolIcon(kind: OutlineSymbol["kind"]) {
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
        case "constant":
            return <Icons.constant className="w-4 h-4 text-blue-500" />;
        default:
            return <Icons.symbol className="w-4 h-4 text-graviton-text-muted" />;
    }
}

interface OutlineItemProps {
    symbol: OutlineSymbol;
    depth: number;
    onSymbolClick: (symbol: OutlineSymbol) => void;
    isActive: boolean;
}

function OutlineItem({ symbol, depth, onSymbolClick, isActive }: OutlineItemProps) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = symbol.children && symbol.children.length > 0;

    return (
        <div>
            <button
                onClick={() => {
                    if (hasChildren) {
                        setExpanded(!expanded);
                    }
                    onSymbolClick(symbol);
                }}
                className={`w-full flex items-center gap-1.5 px-2 py-1 text-left text-[12px] ${isActive
                        ? "bg-graviton-accent-primary/20 text-graviton-text-primary"
                        : "hover:bg-graviton-bg-hover text-graviton-text-secondary"
                    }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                {hasChildren ? (
                    <span className="text-graviton-text-muted w-3 flex-shrink-0">
                        {expanded ? (
                            <Icons.chevronDown className="w-3 h-3" />
                        ) : (
                            <Icons.chevronRight className="w-3 h-3" />
                        )}
                    </span>
                ) : (
                    <span className="w-3 flex-shrink-0" />
                )}
                {getSymbolIcon(symbol.kind)}
                <span className="truncate">{symbol.name}</span>
                <span className="ml-auto text-[10px] text-graviton-text-muted">
                    :{symbol.line}
                </span>
            </button>

            {hasChildren && expanded && (
                <div>
                    {symbol.children!.map((child, index) => (
                        <OutlineItem
                            key={`${child.name}-${child.line}-${index}`}
                            symbol={child}
                            depth={depth + 1}
                            onSymbolClick={onSymbolClick}
                            isActive={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function OutlineView({ symbols, onSymbolClick, currentLine }: OutlineViewProps) {
    const [filter, setFilter] = useState("");

    const filteredSymbols = useMemo(() => {
        if (!filter) return symbols;

        const lowerFilter = filter.toLowerCase();

        function filterSymbols(syms: OutlineSymbol[]): OutlineSymbol[] {
            return syms.reduce<OutlineSymbol[]>((acc, sym) => {
                const matches = sym.name.toLowerCase().includes(lowerFilter);
                const filteredChildren = sym.children ? filterSymbols(sym.children) : [];

                if (matches || filteredChildren.length > 0) {
                    acc.push({
                        ...sym,
                        children: filteredChildren.length > 0 ? filteredChildren : sym.children,
                    });
                }
                return acc;
            }, []);
        }

        return filterSymbols(symbols);
    }, [symbols, filter]);

    // Find active symbol based on current line
    const findActiveSymbol = useCallback((syms: OutlineSymbol[]): OutlineSymbol | null => {
        if (!currentLine) return null;

        for (const sym of syms.slice().reverse()) {
            if (sym.line <= currentLine) {
                if (sym.children) {
                    const childActive = findActiveSymbol(sym.children);
                    if (childActive) return childActive;
                }
                return sym;
            }
        }
        return null;
    }, [currentLine]);

    const activeSymbol = findActiveSymbol(symbols);

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="px-3 py-2 border-b border-graviton-border">
                <div className="flex items-center gap-2 bg-graviton-bg-tertiary rounded px-2 py-1">
                    <Icons.search className="w-3 h-3 text-graviton-text-muted" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter symbols..."
                        className="flex-1 bg-transparent text-[12px] outline-none text-graviton-text-primary"
                    />
                </div>
            </div>

            {/* Symbols List */}
            <div className="flex-1 overflow-auto">
                {filteredSymbols.length === 0 ? (
                    <div className="p-4 text-center text-graviton-text-muted text-sm">
                        {symbols.length === 0 ? "No symbols found" : "No matching symbols"}
                    </div>
                ) : (
                    <div className="py-1">
                        {filteredSymbols.map((symbol, index) => (
                            <OutlineItem
                                key={`${symbol.name}-${symbol.line}-${index}`}
                                symbol={symbol}
                                depth={0}
                                onSymbolClick={onSymbolClick}
                                isActive={activeSymbol?.name === symbol.name && activeSymbol?.line === symbol.line}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OutlineView;
