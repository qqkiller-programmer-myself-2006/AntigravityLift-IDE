// Graviton IDE - Multi-Cursor Utilities
// Support for multiple cursors and selections

export interface CursorPosition {
    line: number;
    column: number;
}

export interface Selection {
    start: CursorPosition;
    end: CursorPosition;
}

export interface MultiCursorState {
    cursors: CursorPosition[];
    selections: Selection[];
}

// Find all occurrences of a word in content
export function findAllOccurrences(
    content: string,
    word: string,
    caseSensitive: boolean = true
): CursorPosition[] {
    const positions: CursorPosition[] = [];
    const lines = content.split("\n");
    const searchWord = caseSensitive ? word : word.toLowerCase();

    lines.forEach((line, lineIndex) => {
        const searchLine = caseSensitive ? line : line.toLowerCase();
        let pos = 0;

        while (pos < searchLine.length) {
            const index = searchLine.indexOf(searchWord, pos);
            if (index === -1) break;

            // Check for word boundaries
            const beforeChar = index > 0 ? searchLine[index - 1] : " ";
            const afterChar = index + searchWord.length < searchLine.length
                ? searchLine[index + searchWord.length]
                : " ";

            if (!/\w/.test(beforeChar) && !/\w/.test(afterChar)) {
                positions.push({
                    line: lineIndex + 1,
                    column: index + 1,
                });
            }

            pos = index + 1;
        }
    });

    return positions;
}

// Get the word at a cursor position
export function getWordAtPosition(content: string, position: CursorPosition): string | null {
    const lines = content.split("\n");
    const line = lines[position.line - 1];
    if (!line) return null;

    const col = position.column - 1;

    // Find word boundaries
    let start = col;
    let end = col;

    while (start > 0 && /\w/.test(line[start - 1])) start--;
    while (end < line.length && /\w/.test(line[end])) end++;

    if (start === end) return null;

    return line.substring(start, end);
}

// Add cursor at next occurrence of selected word
export function addCursorAtNextOccurrence(
    content: string,
    currentCursors: CursorPosition[],
    selectedWord: string
): CursorPosition | null {
    if (!selectedWord) return null;

    const allOccurrences = findAllOccurrences(content, selectedWord, true);

    // Find the first occurrence after the last cursor
    const lastCursor = currentCursors[currentCursors.length - 1];

    for (const occurrence of allOccurrences) {
        // Check if this occurrence is after the last cursor
        if (
            occurrence.line > lastCursor.line ||
            (occurrence.line === lastCursor.line && occurrence.column > lastCursor.column)
        ) {
            // Check if we already have this cursor
            const exists = currentCursors.some(
                (c) => c.line === occurrence.line && c.column === occurrence.column
            );
            if (!exists) {
                return occurrence;
            }
        }
    }

    // Wrap around to beginning
    for (const occurrence of allOccurrences) {
        const exists = currentCursors.some(
            (c) => c.line === occurrence.line && c.column === occurrence.column
        );
        if (!exists) {
            return occurrence;
        }
    }

    return null;
}

// Create column selection (box selection)
export function createColumnSelection(
    startLine: number,
    endLine: number,
    startColumn: number,
    endColumn: number
): Selection[] {
    const selections: Selection[] = [];
    const fromLine = Math.min(startLine, endLine);
    const toLine = Math.max(startLine, endLine);
    const fromCol = Math.min(startColumn, endColumn);
    const toCol = Math.max(startColumn, endColumn);

    for (let line = fromLine; line <= toLine; line++) {
        selections.push({
            start: { line, column: fromCol },
            end: { line, column: toCol },
        });
    }

    return selections;
}

// Convert cursors to Monaco format
export function toMonacoCursors(cursors: CursorPosition[]): Array<{ lineNumber: number; column: number }> {
    return cursors.map((c) => ({
        lineNumber: c.line,
        column: c.column,
    }));
}

// Convert selections to Monaco format
export function toMonacoSelections(selections: Selection[]): Array<{
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
}> {
    return selections.map((s) => ({
        startLineNumber: s.start.line,
        startColumn: s.start.column,
        endLineNumber: s.end.line,
        endColumn: s.end.column,
    }));
}

export default {
    findAllOccurrences,
    getWordAtPosition,
    addCursorAtNextOccurrence,
    createColumnSelection,
    toMonacoCursors,
    toMonacoSelections,
};
