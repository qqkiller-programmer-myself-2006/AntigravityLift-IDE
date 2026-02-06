// Graviton IDE - Bracket Matching
// Jump to and highlight matching brackets

export type BracketType = "(" | ")" | "[" | "]" | "{" | "}" | "<" | ">";

const bracketPairs: Record<string, string> = {
    "(": ")",
    ")": "(",
    "[": "]",
    "]": "[",
    "{": "}",
    "}": "{",
    "<": ">",
    ">": "<",
};

const openBrackets = new Set(["(", "[", "{", "<"]);
const closeBrackets = new Set([")", "]", "}", ">"]);

export interface BracketMatch {
    openPosition: number;
    closePosition: number;
    type: string;
}

// Find the matching bracket position
export function findMatchingBracket(
    content: string,
    position: number
): number | null {
    const char = content[position];
    if (!bracketPairs[char]) return null;

    const isOpen = openBrackets.has(char);
    const matchingBracket = bracketPairs[char];
    const direction = isOpen ? 1 : -1;
    let depth = 1;
    let i = position + direction;

    while (i >= 0 && i < content.length) {
        const current = content[i];

        // Skip strings and comments (simplified)
        if (current === char) {
            depth++;
        } else if (current === matchingBracket) {
            depth--;
            if (depth === 0) {
                return i;
            }
        }

        i += direction;
    }

    return null;
}

// Find all bracket pairs in content
export function findAllBracketPairs(content: string): BracketMatch[] {
    const matches: BracketMatch[] = [];
    const stack: { char: string; position: number }[] = [];

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (openBrackets.has(char)) {
            stack.push({ char, position: i });
        } else if (closeBrackets.has(char)) {
            // Find matching open bracket
            for (let j = stack.length - 1; j >= 0; j--) {
                if (bracketPairs[stack[j].char] === char) {
                    const open = stack.splice(j, 1)[0];
                    matches.push({
                        openPosition: open.position,
                        closePosition: i,
                        type: open.char,
                    });
                    break;
                }
            }
        }
    }

    return matches;
}

// Get bracket nesting level at position (for colorization)
export function getBracketNestingLevel(
    content: string,
    position: number,
    bracketType: string = "all"
): number {
    let level = 0;
    const opens = bracketType === "all"
        ? openBrackets
        : new Set([bracketType]);
    const closes = bracketType === "all"
        ? closeBrackets
        : new Set([bracketPairs[bracketType]]);

    for (let i = 0; i < position; i++) {
        if (opens.has(content[i])) level++;
        if (closes.has(content[i])) level--;
    }

    return Math.max(0, level);
}

// Check if position is inside a bracket pair
export function isInsideBrackets(
    content: string,
    position: number,
    bracketType?: string
): boolean {
    return getBracketNestingLevel(content, position, bracketType) > 0;
}

// Get the enclosing bracket pair at position
export function getEnclosingBrackets(
    content: string,
    position: number
): BracketMatch | null {
    const pairs = findAllBracketPairs(content);

    // Find smallest enclosing pair
    let smallest: BracketMatch | null = null;
    let smallestSize = Infinity;

    for (const pair of pairs) {
        if (pair.openPosition < position && pair.closePosition > position) {
            const size = pair.closePosition - pair.openPosition;
            if (size < smallestSize) {
                smallestSize = size;
                smallest = pair;
            }
        }
    }

    return smallest;
}

// Colors for bracket pair colorization (by nesting level)
export const bracketColors = [
    "#ffd700", // gold
    "#da70d6", // orchid
    "#87ceeb", // skyblue
    "#98fb98", // palegreen
    "#ffa07a", // lightsalmon
    "#dda0dd", // plum
];

export function getBracketColor(nestingLevel: number): string {
    return bracketColors[nestingLevel % bracketColors.length];
}

export default {
    findMatchingBracket,
    findAllBracketPairs,
    getBracketNestingLevel,
    isInsideBrackets,
    getEnclosingBrackets,
    getBracketColor,
};
