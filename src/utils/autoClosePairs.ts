// Graviton IDE - Auto Close Pairs
// Automatically insert closing brackets, quotes, etc.

interface AutoClosePair {
    open: string;
    close: string;
    notIn?: string[]; // Contexts where not to auto-close
}

const defaultPairs: AutoClosePair[] = [
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "<", close: ">", notIn: ["string", "comment"] }, // For JSX/HTML
];

// Language-specific pairs
const languagePairs: Record<string, AutoClosePair[]> = {
    html: [
        ...defaultPairs,
        { open: "<!--", close: "-->" },
    ],
    markdown: [
        ...defaultPairs,
        { open: "**", close: "**" },
        { open: "__", close: "__" },
        { open: "~~", close: "~~" },
        { open: "```", close: "```" },
    ],
    python: [
        { open: "(", close: ")" },
        { open: "[", close: "]" },
        { open: "{", close: "}" },
        { open: "'", close: "'", notIn: ["string"] },
        { open: '"', close: '"', notIn: ["string"] },
        { open: '"""', close: '"""' },
        { open: "'''", close: "'''" },
    ],
};

export function getAutoClosePairs(language: string): AutoClosePair[] {
    return languagePairs[language] || defaultPairs;
}

// Check if we should auto-close at current position
export function shouldAutoClose(
    char: string,
    content: string,
    position: number,
    language: string
): { shouldClose: boolean; closeChar: string } {
    const pairs = getAutoClosePairs(language);
    const pair = pairs.find((p) => p.open === char);

    if (!pair) {
        return { shouldClose: false, closeChar: "" };
    }

    // Check if next character is whitespace or closing bracket
    const nextChar = content[position] || "";
    const shouldClose = !nextChar || /[\s\)\]\}>,;]/.test(nextChar);

    // For quotes, check if we're not inside a string
    if (char === "'" || char === '"' || char === "`") {
        // Count occurrences before cursor to determine if we're in a string
        const before = content.substring(0, position);
        const count = (before.match(new RegExp(`[^\\\\]${char}`, "g")) || []).length;
        if (count % 2 !== 0) {
            return { shouldClose: false, closeChar: "" };
        }
    }

    return { shouldClose, closeChar: pair.close };
}

// Handle typing over closing bracket
export function shouldSkipClosing(
    char: string,
    content: string,
    position: number
): boolean {
    const nextChar = content[position];
    return nextChar === char && [")", "]", "}", "'", '"', "`", ">"].includes(char);
}

// Handle backspace to delete both brackets
export function shouldDeletePair(
    content: string,
    position: number,
    language: string
): boolean {
    if (position <= 0) return false;

    const pairs = getAutoClosePairs(language);
    const charBefore = content[position - 1];
    const charAfter = content[position];

    return pairs.some((p) => p.open === charBefore && p.close === charAfter);
}

// Surround selection with pair
export function surroundWith(
    selection: string,
    openChar: string,
    language: string
): string | null {
    const pairs = getAutoClosePairs(language);
    const pair = pairs.find((p) => p.open === openChar);

    if (!pair) return null;

    return pair.open + selection + pair.close;
}

// Get the closing character for an opening one
export function getClosingChar(openChar: string, language: string): string | null {
    const pairs = getAutoClosePairs(language);
    const pair = pairs.find((p) => p.open === openChar);
    return pair?.close || null;
}

export default {
    getAutoClosePairs,
    shouldAutoClose,
    shouldSkipClosing,
    shouldDeletePair,
    surroundWith,
    getClosingChar,
};
