// Graviton IDE - Smart Selection
// Expand/shrink selection by semantic units

export interface SelectionRange {
    start: number;
    end: number;
}

// Get word boundaries at position
function getWordAt(content: string, position: number): SelectionRange {
    const wordRegex = /[\w$]+/g;
    let match;

    while ((match = wordRegex.exec(content)) !== null) {
        if (match.index <= position && match.index + match[0].length >= position) {
            return { start: match.index, end: match.index + match[0].length };
        }
    }

    return { start: position, end: position };
}

// Get string at position (handles quotes)
function getStringAt(content: string, position: number): SelectionRange | null {
    const quotes = ['"', "'", "`"];

    for (const quote of quotes) {
        let start = -1;
        let i = 0;

        while (i < content.length) {
            if (content[i] === quote && (i === 0 || content[i - 1] !== "\\")) {
                if (start === -1) {
                    start = i;
                } else {
                    if (start < position && i >= position) {
                        return { start, end: i + 1 };
                    }
                    start = -1;
                }
            }
            i++;
        }
    }

    return null;
}

// Get bracket block at position
function getBracketBlockAt(content: string, position: number): SelectionRange | null {
    const pairs: { open: string; close: string }[] = [
        { open: "(", close: ")" },
        { open: "[", close: "]" },
        { open: "{", close: "}" },
    ];

    for (const { open, close } of pairs) {
        let depth = 0;
        let start = -1;

        for (let i = 0; i < content.length; i++) {
            if (content[i] === open) {
                if (depth === 0) start = i;
                depth++;
            } else if (content[i] === close) {
                depth--;
                if (depth === 0 && start !== -1 && start <= position && i >= position) {
                    return { start, end: i + 1 };
                }
            }
        }
    }

    return null;
}

// Get line at position
function getLineAt(content: string, position: number): SelectionRange {
    let start = position;
    let end = position;

    while (start > 0 && content[start - 1] !== "\n") start--;
    while (end < content.length && content[end] !== "\n") end++;

    return { start, end };
}

// Expand selection to next semantic unit
export function expandSelection(
    content: string,
    currentSelection: SelectionRange
): SelectionRange {
    const { start, end } = currentSelection;
    const position = start;

    // If no selection, start with word
    if (start === end) {
        const word = getWordAt(content, position);
        if (word.start !== word.end) {
            return word;
        }
    }

    // Try to expand to string
    const string = getStringAt(content, position);
    if (string && (string.start < start || string.end > end)) {
        return string;
    }

    // Try to expand to bracket block
    const block = getBracketBlockAt(content, start);
    if (block && (block.start < start || block.end > end)) {
        return block;
    }

    // Expand to line
    const line = getLineAt(content, start);
    if (line.start < start || line.end > end) {
        return line;
    }

    // Expand to multiple lines (paragraph)
    let pStart = start;
    let pEnd = end;

    // Expand to include surrounding non-empty lines
    while (pStart > 0) {
        const prevLine = getLineAt(content, pStart - 1);
        const lineContent = content.substring(prevLine.start, prevLine.end);
        if (lineContent.trim() === "") break;
        pStart = prevLine.start;
    }

    while (pEnd < content.length) {
        const nextLine = getLineAt(content, pEnd + 1);
        const lineContent = content.substring(nextLine.start, nextLine.end);
        if (lineContent.trim() === "") break;
        pEnd = nextLine.end;
    }

    if (pStart < start || pEnd > end) {
        return { start: pStart, end: pEnd };
    }

    // Finally, select all
    return { start: 0, end: content.length };
}

// Shrink selection to smaller semantic unit
export function shrinkSelection(
    _content: string,
    currentSelection: SelectionRange,
    history: SelectionRange[]
): SelectionRange {
    // If we have history, go back one step
    if (history.length > 0) {
        return history[history.length - 1];
    }

    // Otherwise collapse to cursor
    return { start: currentSelection.start, end: currentSelection.start };
}

export default { expandSelection, shrinkSelection };
