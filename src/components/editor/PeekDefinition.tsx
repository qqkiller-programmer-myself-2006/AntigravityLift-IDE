// Graviton IDE - Peek Definition
// Inline preview of definition without leaving current file

import { useState, useEffect, useRef } from "react";
import { Icons, getFileIcon } from "../icons";

export interface DefinitionLocation {
    filePath: string;
    fileName: string;
    line: number;
    column: number;
    preview: string[]; // Lines of code around the definition
    previewStartLine: number;
}

interface PeekDefinitionProps {
    symbol: string;
    locations: DefinitionLocation[];
    position: { top: number; left: number };
    onClose: () => void;
    onGoToDefinition: (location: DefinitionLocation) => void;
}

export function PeekDefinition({
    symbol: _symbol,
    locations,
    position,
    onClose,
    onGoToDefinition,
}: PeekDefinitionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeLocation = locations[activeIndex];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowUp":
                    if (e.altKey && locations.length > 1) {
                        e.preventDefault();
                        setActiveIndex((prev) => (prev > 0 ? prev - 1 : locations.length - 1));
                    }
                    break;
                case "ArrowDown":
                    if (e.altKey && locations.length > 1) {
                        e.preventDefault();
                        setActiveIndex((prev) => (prev < locations.length - 1 ? prev + 1 : 0));
                    }
                    break;
                case "Enter":
                    e.preventDefault();
                    if (activeLocation) {
                        onGoToDefinition(activeLocation);
                        onClose();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [locations, activeIndex, activeLocation, onClose, onGoToDefinition]);

    // Click outside to close
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    if (!activeLocation) return null;

    return (
        <div
            ref={containerRef}
            className="absolute z-50 bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl w-[500px] overflow-hidden"
            style={{ top: position.top, left: position.left }}
        >
            {/* Header with file selector */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-graviton-border bg-graviton-bg-tertiary">
                <div className="flex items-center gap-2">
                    {getFileIcon(activeLocation.fileName)}
                    <span className="text-sm text-graviton-text-primary">
                        {activeLocation.fileName}
                    </span>
                    <span className="text-[11px] text-graviton-text-muted">
                        :{activeLocation.line}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {locations.length > 1 && (
                        <div className="flex items-center gap-1 text-[11px] text-graviton-text-muted">
                            <button
                                onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : locations.length - 1))}
                                className="p-0.5 hover:bg-graviton-bg-hover rounded"
                            >
                                <Icons.chevronUp className="w-3 h-3" />
                            </button>
                            <span>{activeIndex + 1}/{locations.length}</span>
                            <button
                                onClick={() => setActiveIndex((prev) => (prev < locations.length - 1 ? prev + 1 : 0))}
                                className="p-0.5 hover:bg-graviton-bg-hover rounded"
                            >
                                <Icons.chevronDown className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            onGoToDefinition(activeLocation);
                            onClose();
                        }}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                        title="Go to Definition"
                    >
                        <Icons.externalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                    >
                        <Icons.close className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Code preview */}
            <div className="max-h-[300px] overflow-auto">
                <div className="font-mono text-[12px] leading-5">
                    {activeLocation.preview.map((line, index) => {
                        const lineNumber = activeLocation.previewStartLine + index;
                        const isDefinitionLine = lineNumber === activeLocation.line;

                        return (
                            <div
                                key={index}
                                className={`flex ${isDefinitionLine ? "bg-yellow-500/10" : ""}`}
                            >
                                <span className="w-10 text-right pr-3 text-graviton-text-muted select-none flex-shrink-0">
                                    {lineNumber}
                                </span>
                                <pre className={`flex-1 whitespace-pre ${isDefinitionLine ? "text-graviton-text-primary" : "text-graviton-text-secondary"
                                    }`}>
                                    {line}
                                </pre>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer hint */}
            <div className="px-3 py-1 border-t border-graviton-border text-[10px] text-graviton-text-muted">
                {locations.length > 1 && "Alt+↑/↓ to navigate • "}
                Enter to go to definition • Esc to close
            </div>
        </div>
    );
}

export default PeekDefinition;
