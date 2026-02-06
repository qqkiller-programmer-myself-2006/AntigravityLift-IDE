// Graviton IDE - Comment Toggle
// Toggle line and block comments

interface CommentConfig {
    lineComment?: string;
    blockComment?: { start: string; end: string };
}

// Language-specific comment syntax
const commentConfigs: Record<string, CommentConfig> = {
    javascript: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    typescript: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    javascriptreact: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    typescriptreact: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    css: { blockComment: { start: "/*", end: "*/" } },
    scss: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    html: { blockComment: { start: "<!--", end: "-->" } },
    xml: { blockComment: { start: "<!--", end: "-->" } },
    json: { lineComment: "//" },
    python: { lineComment: "#", blockComment: { start: '"""', end: '"""' } },
    ruby: { lineComment: "#" },
    rust: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    go: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    java: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    c: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    cpp: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    csharp: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    php: { lineComment: "//", blockComment: { start: "/*", end: "*/" } },
    shell: { lineComment: "#" },
    bash: { lineComment: "#" },
    yaml: { lineComment: "#" },
    toml: { lineComment: "#" },
    sql: { lineComment: "--", blockComment: { start: "/*", end: "*/" } },
    markdown: { blockComment: { start: "<!--", end: "-->" } },
    lua: { lineComment: "--", blockComment: { start: "--[[", end: "]]" } },
};

// Toggle line comment on single line
export function toggleLineComment(line: string, language: string): string {
    const config = commentConfigs[language];
    if (!config?.lineComment) return line;

    const commentPrefix = config.lineComment;
    const trimmed = line.trimStart();
    const indent = line.substring(0, line.length - trimmed.length);

    if (trimmed.startsWith(commentPrefix)) {
        // Remove comment
        const afterComment = trimmed.substring(commentPrefix.length);
        // Remove one space after comment if present
        const withoutSpace = afterComment.startsWith(" ")
            ? afterComment.substring(1)
            : afterComment;
        return indent + withoutSpace;
    } else {
        // Add comment
        return indent + commentPrefix + " " + trimmed;
    }
}

// Toggle line comments on multiple lines
export function toggleLineComments(lines: string[], language: string): string[] {
    const config = commentConfigs[language];
    if (!config?.lineComment) return lines;

    const commentPrefix = config.lineComment;

    // Check if all non-empty lines are commented
    const nonEmptyLines = lines.filter((line) => line.trim() !== "");
    const allCommented = nonEmptyLines.every((line) =>
        line.trimStart().startsWith(commentPrefix)
    );

    if (allCommented) {
        // Remove comments from all lines
        return lines.map((line) => {
            if (line.trim() === "") return line;
            return toggleLineComment(line, language);
        });
    } else {
        // Add comments to all uncommented lines
        return lines.map((line) => {
            if (line.trim() === "") return line;
            if (line.trimStart().startsWith(commentPrefix)) return line;
            return toggleLineComment(line, language);
        });
    }
}

// Toggle block comment around selection
export function toggleBlockComment(selection: string, language: string): string {
    const config = commentConfigs[language];
    if (!config?.blockComment) {
        // Fall back to line comments
        const lines = selection.split("\n");
        return toggleLineComments(lines, language).join("\n");
    }

    const { start, end } = config.blockComment;
    const trimmed = selection.trim();

    if (trimmed.startsWith(start) && trimmed.endsWith(end)) {
        // Remove block comment
        const content = trimmed
            .substring(start.length, trimmed.length - end.length)
            .trim();
        return content;
    } else {
        // Add block comment
        return `${start} ${selection} ${end}`;
    }
}

// Get comment config for language
export function getCommentConfig(language: string): CommentConfig | null {
    return commentConfigs[language] || null;
}

export default {
    toggleLineComment,
    toggleLineComments,
    toggleBlockComment,
    getCommentConfig,
};
