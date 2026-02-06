// Graviton IDE - Debug Panel
// Breakpoints and debug controls (placeholder)

import { useState, useCallback } from "react";
import { Icons } from "../icons";

export interface Breakpoint {
    id: string;
    file: string;
    line: number;
    enabled: boolean;
    condition?: string;
}

interface DebugPanelProps {
    breakpoints: Breakpoint[];
    isDebugging: boolean;
    isPaused: boolean;
    onToggleBreakpoint: (id: string) => void;
    onRemoveBreakpoint: (id: string) => void;
    onContinue: () => void;
    onStepOver: () => void;
    onStepInto: () => void;
    onStepOut: () => void;
    onStop: () => void;
    onBreakpointClick: (breakpoint: Breakpoint) => void;
}

export function DebugPanel({
    breakpoints,
    isDebugging,
    isPaused,
    onToggleBreakpoint,
    onRemoveBreakpoint,
    onContinue,
    onStepOver,
    onStepInto,
    onStepOut,
    onStop,
    onBreakpointClick,
}: DebugPanelProps) {
    const [expandedSections, setExpandedSections] = useState({
        breakpoints: true,
        callStack: true,
        variables: true,
    });

    const toggleSection = useCallback((section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* Debug toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 bg-graviton-bg-secondary border-b border-graviton-border">
                <button
                    onClick={onContinue}
                    disabled={!isDebugging || !isPaused}
                    className="p-1.5 rounded hover:bg-graviton-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Continue (F5)"
                >
                    <Icons.play className="w-4 h-4 text-green-400" />
                </button>
                <button
                    onClick={onStepOver}
                    disabled={!isDebugging || !isPaused}
                    className="p-1.5 rounded hover:bg-graviton-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step Over (F10)"
                >
                    <Icons.arrowRight className="w-4 h-4 text-graviton-text-muted" />
                </button>
                <button
                    onClick={onStepInto}
                    disabled={!isDebugging || !isPaused}
                    className="p-1.5 rounded hover:bg-graviton-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step Into (F11)"
                >
                    <Icons.chevronDown className="w-4 h-4 text-graviton-text-muted" />
                </button>
                <button
                    onClick={onStepOut}
                    disabled={!isDebugging || !isPaused}
                    className="p-1.5 rounded hover:bg-graviton-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step Out (Shift+F11)"
                >
                    <Icons.chevronUp className="w-4 h-4 text-graviton-text-muted" />
                </button>
                <div className="w-px h-4 bg-graviton-border mx-1" />
                <button
                    onClick={onStop}
                    disabled={!isDebugging}
                    className="p-1.5 rounded hover:bg-graviton-bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Stop (Shift+F5)"
                >
                    <Icons.close className="w-4 h-4 text-red-400" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {/* Variables Section */}
                <div>
                    <button
                        onClick={() => toggleSection("variables")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-graviton-text-muted uppercase tracking-wider hover:bg-graviton-bg-hover"
                    >
                        <Icons.chevronRight
                            className={`w-3 h-3 transition-transform ${expandedSections.variables ? "rotate-90" : ""}`}
                        />
                        Variables
                    </button>
                    {expandedSections.variables && (
                        <div className="px-4 py-2 text-[12px] text-graviton-text-muted">
                            {isDebugging && isPaused ? (
                                <div className="text-graviton-text-secondary">
                                    {/* Variable list would go here */}
                                    <div className="py-1">No variables in scope</div>
                                </div>
                            ) : (
                                <div>Not paused</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Call Stack Section */}
                <div>
                    <button
                        onClick={() => toggleSection("callStack")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-graviton-text-muted uppercase tracking-wider hover:bg-graviton-bg-hover"
                    >
                        <Icons.chevronRight
                            className={`w-3 h-3 transition-transform ${expandedSections.callStack ? "rotate-90" : ""}`}
                        />
                        Call Stack
                    </button>
                    {expandedSections.callStack && (
                        <div className="px-4 py-2 text-[12px] text-graviton-text-muted">
                            {isDebugging && isPaused ? (
                                <div>No call stack</div>
                            ) : (
                                <div>Not paused</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Breakpoints Section */}
                <div>
                    <button
                        onClick={() => toggleSection("breakpoints")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-graviton-text-muted uppercase tracking-wider hover:bg-graviton-bg-hover"
                    >
                        <Icons.chevronRight
                            className={`w-3 h-3 transition-transform ${expandedSections.breakpoints ? "rotate-90" : ""}`}
                        />
                        Breakpoints ({breakpoints.length})
                    </button>
                    {expandedSections.breakpoints && (
                        <div className="py-1">
                            {breakpoints.length === 0 ? (
                                <div className="px-4 py-2 text-[12px] text-graviton-text-muted">
                                    No breakpoints
                                </div>
                            ) : (
                                breakpoints.map((bp) => (
                                    <div
                                        key={bp.id}
                                        className="flex items-center gap-2 px-4 py-1 hover:bg-graviton-bg-hover group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={bp.enabled}
                                            onChange={() => onToggleBreakpoint(bp.id)}
                                            className="w-3 h-3 accent-graviton-accent-primary"
                                        />
                                        <button
                                            onClick={() => onBreakpointClick(bp)}
                                            className="flex-1 text-left text-[12px] truncate"
                                        >
                                            <span className="text-graviton-text-primary">
                                                {bp.file.split("\\").pop()}
                                            </span>
                                            <span className="text-graviton-text-muted">:{bp.line}</span>
                                        </button>
                                        <button
                                            onClick={() => onRemoveBreakpoint(bp.id)}
                                            className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-graviton-bg-hover rounded"
                                        >
                                            <Icons.close className="w-3 h-3 text-graviton-text-muted" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status bar */}
            <div className="px-3 py-1 bg-graviton-bg-secondary border-t border-graviton-border text-[11px] text-graviton-text-muted">
                {isDebugging ? (
                    isPaused ? "Paused" : "Running..."
                ) : (
                    "Not debugging"
                )}
            </div>
        </div>
    );
}

export default DebugPanel;
