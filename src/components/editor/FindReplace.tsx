// Graviton IDE - Find and Replace Dialog
// In-file search and replace functionality

import { useState, useEffect, useCallback, useRef } from "react";
import { Icons } from "../icons";

interface FindReplaceProps {
    isOpen: boolean;
    onClose: () => void;
    onFind: (query: string, options: FindOptions) => void;
    onReplace: (query: string, replacement: string, options: FindOptions) => void;
    onReplaceAll: (query: string, replacement: string, options: FindOptions) => void;
    matchCount?: number;
    currentMatch?: number;
    onNext?: () => void;
    onPrevious?: () => void;
}

export interface FindOptions {
    caseSensitive: boolean;
    wholeWord: boolean;
    useRegex: boolean;
}

export function FindReplace({
    isOpen,
    onClose,
    onFind,
    onReplace,
    onReplaceAll,
    matchCount = 0,
    currentMatch = 0,
    onNext,
    onPrevious,
}: FindReplaceProps) {
    const [findValue, setFindValue] = useState("");
    const [replaceValue, setReplaceValue] = useState("");
    const [showReplace, setShowReplace] = useState(false);
    const [options, setOptions] = useState<FindOptions>({
        caseSensitive: false,
        wholeWord: false,
        useRegex: false,
    });

    const findInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            findInputRef.current?.focus();
            findInputRef.current?.select();
        }
    }, [isOpen]);

    useEffect(() => {
        if (findValue) {
            onFind(findValue, options);
        }
    }, [findValue, options, onFind]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        } else if (e.key === "Enter") {
            if (e.shiftKey) {
                onPrevious?.();
            } else {
                onNext?.();
            }
        }
    }, [onClose, onNext, onPrevious]);

    const toggleOption = useCallback((key: keyof FindOptions) => {
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 right-4 z-40 bg-graviton-bg-secondary border border-graviton-border rounded-b-lg shadow-xl p-2 min-w-[320px]">
            <div className="flex flex-col gap-2">
                {/* Find Row */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowReplace(!showReplace)}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                    >
                        <Icons.chevronRight
                            className={`w-3 h-3 transition-transform ${showReplace ? "rotate-90" : ""}`}
                        />
                    </button>
                    <div className="flex-1 flex items-center bg-graviton-bg-tertiary rounded px-2">
                        <input
                            ref={findInputRef}
                            type="text"
                            value={findValue}
                            onChange={(e) => setFindValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Find"
                            className="flex-1 bg-transparent text-sm py-1 outline-none text-graviton-text-primary"
                        />
                        <span className="text-[10px] text-graviton-text-muted px-1">
                            {matchCount > 0 ? `${currentMatch}/${matchCount}` : "No results"}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button
                            onClick={() => toggleOption("caseSensitive")}
                            className={`p-1 rounded text-[11px] font-medium ${options.caseSensitive
                                    ? "bg-graviton-accent-primary text-white"
                                    : "hover:bg-graviton-bg-hover text-graviton-text-muted"
                                }`}
                            title="Case Sensitive"
                        >
                            Aa
                        </button>
                        <button
                            onClick={() => toggleOption("wholeWord")}
                            className={`p-1 rounded text-[11px] font-medium ${options.wholeWord
                                    ? "bg-graviton-accent-primary text-white"
                                    : "hover:bg-graviton-bg-hover text-graviton-text-muted"
                                }`}
                            title="Whole Word"
                        >
                            ab
                        </button>
                        <button
                            onClick={() => toggleOption("useRegex")}
                            className={`p-1 rounded text-[11px] font-mono ${options.useRegex
                                    ? "bg-graviton-accent-primary text-white"
                                    : "hover:bg-graviton-bg-hover text-graviton-text-muted"
                                }`}
                            title="Use Regex"
                        >
                            .*
                        </button>
                    </div>
                    <button
                        onClick={onPrevious}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                        title="Previous Match"
                    >
                        <Icons.chevronUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onNext}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                        title="Next Match"
                    >
                        <Icons.chevronDown className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                        title="Close"
                    >
                        <Icons.close className="w-4 h-4" />
                    </button>
                </div>

                {/* Replace Row */}
                {showReplace && (
                    <div className="flex items-center gap-1 pl-5">
                        <div className="flex-1 bg-graviton-bg-tertiary rounded px-2">
                            <input
                                type="text"
                                value={replaceValue}
                                onChange={(e) => setReplaceValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Replace"
                                className="w-full bg-transparent text-sm py-1 outline-none text-graviton-text-primary"
                            />
                        </div>
                        <button
                            onClick={() => onReplace(findValue, replaceValue, options)}
                            className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted text-[11px]"
                            title="Replace"
                        >
                            Replace
                        </button>
                        <button
                            onClick={() => onReplaceAll(findValue, replaceValue, options)}
                            className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted text-[11px]"
                            title="Replace All"
                        >
                            All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindReplace;
