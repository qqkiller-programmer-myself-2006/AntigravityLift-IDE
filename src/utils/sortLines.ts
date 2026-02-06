// Graviton IDE - Sort Lines Utility
// Sort selected lines alphabetically

export type SortOrder = "asc" | "desc";
export type SortType = "alphabetical" | "length" | "numeric";

export interface SortOptions {
    order?: SortOrder;
    type?: SortType;
    caseSensitive?: boolean;
    removeDuplicates?: boolean;
    trimLines?: boolean;
}

export function sortLines(text: string, options: SortOptions = {}): string {
    const {
        order = "asc",
        type = "alphabetical",
        caseSensitive = false,
        removeDuplicates = false,
        trimLines = false,
    } = options;

    let lines = text.split("\n");

    // Trim if requested
    if (trimLines) {
        lines = lines.map((line) => line.trim());
    }

    // Remove duplicates if requested
    if (removeDuplicates) {
        const seen = new Set<string>();
        lines = lines.filter((line) => {
            const key = caseSensitive ? line : line.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    // Sort based on type
    lines.sort((a, b) => {
        let compareA = caseSensitive ? a : a.toLowerCase();
        let compareB = caseSensitive ? b : b.toLowerCase();

        let result: number;

        switch (type) {
            case "length":
                result = a.length - b.length;
                break;
            case "numeric":
                // Extract first number from each line
                const numA = parseFloat(a.match(/[\d.]+/)?.[0] || "0");
                const numB = parseFloat(b.match(/[\d.]+/)?.[0] || "0");
                result = numA - numB;
                break;
            case "alphabetical":
            default:
                result = compareA.localeCompare(compareB);
        }

        return order === "desc" ? -result : result;
    });

    return lines.join("\n");
}

// Reverse lines
export function reverseLines(text: string): string {
    return text.split("\n").reverse().join("\n");
}

// Shuffle lines randomly
export function shuffleLines(text: string): string {
    const lines = text.split("\n");
    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    return lines.join("\n");
}

// Remove empty lines
export function removeEmptyLines(text: string): string {
    return text.split("\n").filter((line) => line.trim() !== "").join("\n");
}

// Remove duplicate lines
export function removeDuplicateLines(text: string, caseSensitive = false): string {
    const seen = new Set<string>();
    return text
        .split("\n")
        .filter((line) => {
            const key = caseSensitive ? line : line.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .join("\n");
}

// Join lines with separator
export function joinLines(text: string, separator = " "): string {
    return text.split("\n").join(separator);
}

// Split line by separator
export function splitLine(text: string, separator: string): string {
    return text.split(separator).join("\n");
}

export default {
    sortLines,
    reverseLines,
    shuffleLines,
    removeEmptyLines,
    removeDuplicateLines,
    joinLines,
    splitLine,
};
