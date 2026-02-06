// Graviton IDE - Terminal Panel
// Interactive terminal with real shell execution

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { Icons } from "../icons";

interface TerminalLine {
    type: "input" | "output" | "error";
    content: string;
}

interface TerminalInstance {
    id: string;
    name: string;
    lines: TerminalLine[];
    history: string[];
    historyIndex: number;
}

const tabs = ["Problems", "Output", "Debug Console", "Terminal", "Ports"];

export function TerminalPanel() {
    const [activeTab, setActiveTab] = useState("Terminal");
    const [terminals, setTerminals] = useState<TerminalInstance[]>([
        { id: "1", name: "Terminal 1", lines: [], history: [], historyIndex: -1 },
    ]);
    const [activeTerminalId, setActiveTerminalId] = useState("1");
    const [inputValue, setInputValue] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const activeTerminal = terminals.find((t) => t.id === activeTerminalId) || terminals[0];

    // Auto-scroll to bottom when output changes
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [activeTerminal?.lines]);

    // Focus input when terminal is visible
    useEffect(() => {
        if (activeTab === "Terminal") {
            inputRef.current?.focus();
        }
    }, [activeTab]);

    const addLine = useCallback((terminalId: string, line: TerminalLine) => {
        setTerminals((prev) =>
            prev.map((t) =>
                t.id === terminalId
                    ? { ...t, lines: [...t.lines, line] }
                    : t
            )
        );
    }, []);

    const executeCommand = useCallback(async (command: string) => {
        if (!command.trim()) return;

        // Add command to history
        setTerminals((prev) =>
            prev.map((t) =>
                t.id === activeTerminalId
                    ? {
                        ...t,
                        history: [...t.history, command],
                        historyIndex: t.history.length + 1,
                    }
                    : t
            )
        );

        // Add input line
        addLine(activeTerminalId, { type: "input", content: `❯ ${command}` });
        setInputValue("");
        setIsExecuting(true);

        try {
            // Import and use Tauri shell plugin
            const { Command } = await import("@tauri-apps/plugin-shell");

            // Parse command - split by first space
            const parts = command.trim().split(/\s+/);
            const program = parts[0];
            const args = parts.slice(1);

            // Create command based on OS
            const cmd = Command.create(program, args);

            // Execute and collect output
            const output = await cmd.execute();

            if (output.stdout) {
                output.stdout.split("\n").forEach((line) => {
                    if (line) {
                        addLine(activeTerminalId, { type: "output", content: line });
                    }
                });
            }

            if (output.stderr) {
                output.stderr.split("\n").forEach((line) => {
                    if (line) {
                        addLine(activeTerminalId, { type: "error", content: line });
                    }
                });
            }

            if (output.code !== 0) {
                addLine(activeTerminalId, {
                    type: "error",
                    content: `Process exited with code ${output.code}`,
                });
            }
        } catch (err) {
            addLine(activeTerminalId, {
                type: "error",
                content: `Error: ${err instanceof Error ? err.message : String(err)}`,
            });
        } finally {
            setIsExecuting(false);
        }
    }, [activeTerminalId, addLine]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isExecuting) {
            executeCommand(inputValue);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const terminal = terminals.find((t) => t.id === activeTerminalId);
            if (terminal && terminal.history.length > 0) {
                const newIndex = Math.max(0, (terminal.historyIndex || terminal.history.length) - 1);
                setTerminals((prev) =>
                    prev.map((t) =>
                        t.id === activeTerminalId ? { ...t, historyIndex: newIndex } : t
                    )
                );
                setInputValue(terminal.history[newIndex] || "");
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const terminal = terminals.find((t) => t.id === activeTerminalId);
            if (terminal && terminal.history.length > 0) {
                const newIndex = Math.min(terminal.history.length, (terminal.historyIndex || 0) + 1);
                setTerminals((prev) =>
                    prev.map((t) =>
                        t.id === activeTerminalId ? { ...t, historyIndex: newIndex } : t
                    )
                );
                setInputValue(terminal.history[newIndex] || "");
            }
        }
    }, [inputValue, isExecuting, executeCommand, terminals, activeTerminalId]);

    const addNewTerminal = useCallback(() => {
        const newId = String(terminals.length + 1);
        setTerminals((prev) => [
            ...prev,
            { id: newId, name: `Terminal ${newId}`, lines: [], history: [], historyIndex: -1 },
        ]);
        setActiveTerminalId(newId);
    }, [terminals.length]);

    const clearTerminal = useCallback(() => {
        setTerminals((prev) =>
            prev.map((t) =>
                t.id === activeTerminalId ? { ...t, lines: [] } : t
            )
        );
    }, [activeTerminalId]);

    return (
        <div className="flex flex-col h-full bg-graviton-bg-primary">
            {/* Terminal Tabs */}
            <div className="flex items-center border-b border-graviton-border bg-graviton-bg-secondary">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-[12px] transition-all ${activeTab === tab
                            ? "text-graviton-text-primary border-b border-graviton-accent-primary bg-graviton-bg-primary"
                            : "text-graviton-text-muted hover:text-graviton-text-secondary"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
                <div className="flex-1" />
                {activeTab === "Terminal" && (
                    <div className="flex items-center gap-0.5 px-2 text-graviton-text-muted">
                        {/* Terminal instance selector */}
                        <select
                            value={activeTerminalId}
                            onChange={(e) => setActiveTerminalId(e.target.value)}
                            className="bg-transparent text-[11px] outline-none cursor-pointer"
                        >
                            {terminals.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={addNewTerminal}
                            className="p-1.5 hover:bg-graviton-bg-hover rounded"
                            title="New Terminal"
                        >
                            <Icons.plus className="w-3 h-3" />
                        </button>
                        <button
                            onClick={clearTerminal}
                            className="p-1.5 hover:bg-graviton-bg-hover rounded"
                            title="Clear Terminal"
                        >
                            <Icons.close className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>

            {/* Terminal Content */}
            {activeTab === "Terminal" ? (
                <div
                    ref={outputRef}
                    className="flex-1 p-3 font-mono text-[12px] overflow-auto leading-relaxed"
                    onClick={() => inputRef.current?.focus()}
                >
                    {/* Output lines */}
                    {activeTerminal.lines.map((line, i) => (
                        <div
                            key={i}
                            className={`whitespace-pre-wrap break-all ${line.type === "input"
                                    ? "text-graviton-text-primary"
                                    : line.type === "error"
                                        ? "text-red-400"
                                        : "text-graviton-text-secondary"
                                }`}
                        >
                            {line.content}
                        </div>
                    ))}

                    {/* Input line */}
                    <div className="flex items-center mt-1">
                        <span className="text-green-400">❯</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isExecuting}
                            className="flex-1 ml-2 bg-transparent text-graviton-text-primary outline-none"
                            placeholder={isExecuting ? "Executing..." : ""}
                            autoFocus
                        />
                        {isExecuting && (
                            <span className="animate-pulse text-graviton-text-muted">⏳</span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 p-3 font-mono text-[12px] text-graviton-text-muted">
                    {activeTab} panel - Coming soon
                </div>
            )}
        </div>
    );
}

export default TerminalPanel;

