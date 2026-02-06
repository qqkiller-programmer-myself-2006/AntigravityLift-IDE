// Graviton IDE - Minimap Component
// Code minimap for quick navigation

import { useEffect, useRef, useMemo } from "react";

interface MinimapProps {
    content: string;
    visibleStartLine: number;
    visibleEndLine: number;
    onLineClick: (line: number) => void;
    width?: number;
}

export function Minimap({
    content,
    visibleStartLine,
    visibleEndLine,
    onLineClick,
    width = 80
}: MinimapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const lines = useMemo(() => content.split("\n"), [content]);
    const totalLines = lines.length;

    // Render minimap
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const lineHeight = 2;
        const charWidth = 1;

        // Set canvas size
        canvas.height = totalLines * lineHeight;
        canvas.width = width;

        // Clear canvas
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw lines
        lines.forEach((line, index) => {
            const y = index * lineHeight;

            // Simple syntax highlighting colors
            let color = "#d4d4d4"; // default text
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*")) {
                color = "#6a9955"; // comment
            } else if (trimmedLine.startsWith("import") || trimmedLine.startsWith("export")) {
                color = "#c586c0"; // keyword
            } else if (trimmedLine.match(/^(const|let|var|function|class|interface|type)/)) {
                color = "#569cd6"; // keyword
            } else if (trimmedLine.match(/^(if|else|for|while|return|switch|case)/)) {
                color = "#c586c0"; // control
            }

            ctx.fillStyle = color;

            // Draw character blocks (simplified)
            const maxChars = Math.min(line.length, width / charWidth);
            for (let i = 0; i < maxChars; i++) {
                if (line[i] !== " " && line[i] !== "\t") {
                    ctx.fillRect(i * charWidth, y, charWidth, lineHeight - 1);
                }
            }
        });
    }, [content, lines, totalLines, width]);

    // Handle click
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const lineHeight = 2;
        const clickedLine = Math.floor(y / lineHeight) + 1;
        onLineClick(Math.min(Math.max(clickedLine, 1), totalLines));
    };

    // Visible area indicator
    const lineHeight = 2;
    const viewportTop = (visibleStartLine - 1) * lineHeight;
    const viewportHeight = (visibleEndLine - visibleStartLine + 1) * lineHeight;

    return (
        <div
            ref={containerRef}
            className="relative bg-graviton-bg-secondary cursor-pointer"
            style={{ width }}
            onClick={handleClick}
        >
            <canvas ref={canvasRef} className="block" />

            {/* Viewport indicator */}
            <div
                className="absolute left-0 right-0 bg-graviton-text-muted/10 border-l-2 border-graviton-accent-primary"
                style={{
                    top: viewportTop,
                    height: viewportHeight,
                }}
            />
        </div>
    );
}

export default Minimap;
