// Graviton IDE - Code Folding Controls
// Fold/unfold all, fold level 1-3 commands

export interface FoldingRange {
    startLine: number;
    endLine: number;
    kind?: "comment" | "imports" | "region";
}

// Detect foldable regions in code
export function detectFoldingRanges(content: string, language: string): FoldingRange[] {
    const lines = content.split("\n");
    const ranges: FoldingRange[] = [];
    const stack: { start: number; type: string }[] = [];

    // Bracket-based folding
    const openBrackets = ["{", "[", "("];
    const closeBrackets = ["}", "]", ")"];

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmed = line.trim();

        // Check for block comments
        if (trimmed.startsWith("/*") && !trimmed.includes("*/")) {
            stack.push({ start: lineNumber, type: "comment" });
        } else if (trimmed.includes("*/") && stack.length > 0 && stack[stack.length - 1].type === "comment") {
            const { start } = stack.pop()!;
            if (lineNumber > start) {
                ranges.push({ startLine: start, endLine: lineNumber, kind: "comment" });
            }
        }

        // Check for region markers
        if (trimmed.match(/^\/\/\s*#?region/i) || trimmed.match(/^\/\*\s*#?region/i)) {
            stack.push({ start: lineNumber, type: "region" });
        } else if (trimmed.match(/^\/\/\s*#?endregion/i) || trimmed.match(/^\/\*\s*#?endregion/i)) {
            const regionIndex = [...stack].reverse().findIndex((s) => s.type === "region");
            if (regionIndex !== -1) {
                const { start } = stack.splice(stack.length - 1 - regionIndex, 1)[0];
                ranges.push({ startLine: start, endLine: lineNumber, kind: "region" });
            }
        }

        // Check for imports (JavaScript/TypeScript)
        if (["javascript", "typescript", "javascriptreact", "typescriptreact"].includes(language)) {
            if ((trimmed.startsWith("import ") || trimmed.startsWith("export ")) &&
                trimmed.includes("{") && !trimmed.includes("}")) {
                stack.push({ start: lineNumber, type: "imports" });
            }
        }

        // Check for brackets
        for (const char of line) {
            const openIndex = openBrackets.indexOf(char);
            const closeIndex = closeBrackets.indexOf(char);

            if (openIndex !== -1) {
                stack.push({ start: lineNumber, type: openBrackets[openIndex] });
            } else if (closeIndex !== -1) {
                // Find matching open bracket
                const matchingOpen = openBrackets[closeIndex];
                for (let i = stack.length - 1; i >= 0; i--) {
                    if (stack[i].type === matchingOpen) {
                        const { start } = stack.splice(i, 1)[0];
                        if (lineNumber > start) {
                            ranges.push({ startLine: start, endLine: lineNumber });
                        }
                        break;
                    }
                }
            }
        }
    });

    return ranges.sort((a, b) => a.startLine - b.startLine);
}

// Get maximum nesting level
export function getMaxNestingLevel(ranges: FoldingRange[]): number {
    let maxLevel = 0;
    const lineToLevel: Record<number, number> = {};

    for (const range of ranges) {
        let level = 1;
        for (let line = range.startLine; line <= range.endLine; line++) {
            const existingLevel = lineToLevel[line] || 0;
            level = Math.max(level, existingLevel + 1);
        }
        for (let line = range.startLine; line <= range.endLine; line++) {
            lineToLevel[line] = level;
        }
        maxLevel = Math.max(maxLevel, level);
    }

    return maxLevel;
}

// Get ranges at specific nesting level
export function getRangesAtLevel(ranges: FoldingRange[], level: number): FoldingRange[] {
    const result: FoldingRange[] = [];
    const lineToLevel: Record<number, number> = {};

    // Sort ranges by start line and size (smaller first for proper nesting)
    const sorted = [...ranges].sort((a, b) => {
        if (a.startLine !== b.startLine) return a.startLine - b.startLine;
        return (a.endLine - a.startLine) - (b.endLine - b.startLine);
    });

    for (const range of sorted) {
        let currentLevel = 1;
        for (let line = range.startLine; line <= range.endLine; line++) {
            if (lineToLevel[line]) {
                currentLevel = Math.max(currentLevel, lineToLevel[line] + 1);
            }
        }

        if (currentLevel === level) {
            result.push(range);
        }

        for (let line = range.startLine; line <= range.endLine; line++) {
            lineToLevel[line] = currentLevel;
        }
    }

    return result;
}

// Command handlers
export const foldingCommands = {
    foldAll: (editor: unknown) => {
        // Implementation would call Monaco's foldAll
        console.log("Fold all regions", editor);
    },
    unfoldAll: (editor: unknown) => {
        // Implementation would call Monaco's unfoldAll
        console.log("Unfold all regions", editor);
    },
    foldLevel: (editor: unknown, level: number) => {
        // Fold all regions at specific level
        console.log(`Fold level ${level}`, editor);
    },
    foldComments: (editor: unknown) => {
        // Fold all comment blocks
        console.log("Fold all comments", editor);
    },
    foldImports: (editor: unknown) => {
        // Fold all import statements
        console.log("Fold all imports", editor);
    },
    toggleFold: (editor: unknown) => {
        // Toggle fold at cursor
        console.log("Toggle fold at cursor", editor);
    },
};

export default {
    detectFoldingRanges,
    getMaxNestingLevel,
    getRangesAtLevel,
    foldingCommands,
};
