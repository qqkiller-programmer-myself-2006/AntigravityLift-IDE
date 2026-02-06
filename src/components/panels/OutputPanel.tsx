// Graviton IDE - Output Channel
// Separate output panels for different tools

import { useState, useCallback, useRef, useEffect } from "react";
import { Icons } from "../icons";

export interface OutputLine {
    timestamp: Date;
    message: string;
    level: "info" | "warn" | "error" | "debug";
}

export interface OutputChannel {
    id: string;
    name: string;
    lines: OutputLine[];
}

interface OutputPanelProps {
    channels: OutputChannel[];
    activeChannelId: string;
    onChannelChange: (channelId: string) => void;
    onClear: (channelId: string) => void;
}

export function OutputPanel({
    channels,
    activeChannelId,
    onChannelChange,
    onClear
}: OutputPanelProps) {
    const outputRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    const activeChannel = channels.find((c) => c.id === activeChannelId);

    // Auto-scroll to bottom
    useEffect(() => {
        if (autoScroll && outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [activeChannel?.lines, autoScroll]);

    const handleScroll = useCallback(() => {
        if (!outputRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
        // Disable auto-scroll if user scrolls up
        setAutoScroll(scrollTop + clientHeight >= scrollHeight - 10);
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-1 bg-graviton-bg-secondary border-b border-graviton-border">
                <div className="flex items-center gap-2">
                    {/* Channel selector */}
                    <select
                        value={activeChannelId}
                        onChange={(e) => onChannelChange(e.target.value)}
                        className="bg-graviton-bg-tertiary text-graviton-text-primary text-[11px] px-2 py-0.5 rounded border border-graviton-border outline-none"
                    >
                        {channels.map((channel) => (
                            <option key={channel.id} value={channel.id}>
                                {channel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onClear(activeChannelId)}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                        title="Clear Output"
                    >
                        <Icons.close className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => {
                            setAutoScroll(true);
                            if (outputRef.current) {
                                outputRef.current.scrollTop = outputRef.current.scrollHeight;
                            }
                        }}
                        className={`p-1 hover:bg-graviton-bg-hover rounded ${autoScroll ? "text-graviton-accent-primary" : "text-graviton-text-muted"
                            }`}
                        title="Auto Scroll"
                    >
                        <Icons.chevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Output content */}
            <div
                ref={outputRef}
                onScroll={handleScroll}
                className="flex-1 overflow-auto font-mono text-[12px] p-2"
            >
                {activeChannel?.lines.map((line, index) => (
                    <div
                        key={index}
                        className={`flex gap-2 py-0.5 ${line.level === "error"
                                ? "text-red-400"
                                : line.level === "warn"
                                    ? "text-yellow-400"
                                    : line.level === "debug"
                                        ? "text-gray-500"
                                        : "text-graviton-text-secondary"
                            }`}
                    >
                        <span className="text-graviton-text-muted flex-shrink-0">
                            [{line.timestamp.toLocaleTimeString()}]
                        </span>
                        <span className="break-all">{line.message}</span>
                    </div>
                ))}

                {(!activeChannel || activeChannel.lines.length === 0) && (
                    <div className="text-graviton-text-muted text-center py-4">
                        No output
                    </div>
                )}
            </div>
        </div>
    );
}

// Hook for managing output channels
export function useOutputChannels() {
    const [channels, setChannels] = useState<OutputChannel[]>([
        { id: "main", name: "Main", lines: [] },
        { id: "build", name: "Build", lines: [] },
        { id: "linter", name: "Linter", lines: [] },
    ]);
    const [activeChannelId, setActiveChannelId] = useState("main");

    const appendLine = useCallback((channelId: string, message: string, level: OutputLine["level"] = "info") => {
        setChannels((prev) =>
            prev.map((channel) =>
                channel.id === channelId
                    ? {
                        ...channel,
                        lines: [...channel.lines, { timestamp: new Date(), message, level }],
                    }
                    : channel
            )
        );
    }, []);

    const clearChannel = useCallback((channelId: string) => {
        setChannels((prev) =>
            prev.map((channel) =>
                channel.id === channelId ? { ...channel, lines: [] } : channel
            )
        );
    }, []);

    const createChannel = useCallback((id: string, name: string) => {
        setChannels((prev) => [...prev, { id, name, lines: [] }]);
    }, []);

    return {
        channels,
        activeChannelId,
        setActiveChannelId,
        appendLine,
        clearChannel,
        createChannel,
    };
}

export default OutputPanel;
