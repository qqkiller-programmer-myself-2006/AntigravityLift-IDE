// Graviton IDE - Go to Line Dialog
// Quick navigation to specific line number

import { useState, useEffect, useRef, useCallback } from "react";

interface GoToLineProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToLine: (line: number) => void;
    totalLines: number;
    currentLine: number;
}

export function GoToLine({ isOpen, onClose, onGoToLine, totalLines, currentLine }: GoToLineProps) {
    const [lineNumber, setLineNumber] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setLineNumber(String(currentLine));
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 0);
        }
    }, [isOpen, currentLine]);

    const handleSubmit = useCallback(() => {
        const line = parseInt(lineNumber, 10);
        if (!isNaN(line) && line >= 1 && line <= totalLines) {
            onGoToLine(line);
            onClose();
        }
    }, [lineNumber, totalLines, onGoToLine, onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        } else if (e.key === "Enter") {
            handleSubmit();
        }
    }, [onClose, handleSubmit]);

    if (!isOpen) return null;

    const parsedLine = parseInt(lineNumber, 10);
    const isValid = !isNaN(parsedLine) && parsedLine >= 1 && parsedLine <= totalLines;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15%]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Dialog */}
            <div className="relative bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl w-[400px] overflow-hidden">
                <div className="p-3">
                    <div className="flex items-center gap-2 bg-graviton-bg-tertiary rounded px-3 py-2">
                        <span className="text-graviton-text-muted text-sm">Go to line:</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={lineNumber}
                            onChange={(e) => setLineNumber(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`1-${totalLines}`}
                            className="flex-1 bg-transparent text-sm outline-none text-graviton-text-primary"
                        />
                    </div>

                    <div className="mt-2 text-[11px] text-graviton-text-muted">
                        {isValid ? (
                            <span className="text-green-400">Line {parsedLine} of {totalLines}</span>
                        ) : lineNumber ? (
                            <span className="text-red-400">Invalid line number (1-{totalLines})</span>
                        ) : (
                            <span>Current line: {currentLine}, Total: {totalLines}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoToLine;
