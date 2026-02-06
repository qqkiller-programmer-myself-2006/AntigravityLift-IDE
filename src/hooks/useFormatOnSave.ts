// Graviton IDE - Format on Save Hook
// Auto-format with Prettier when saving

import { useCallback } from "react";

interface FormatOptions {
    tabSize?: number;
    useTabs?: boolean;
    printWidth?: number;
    singleQuote?: boolean;
    trailingComma?: "none" | "es5" | "all";
    semi?: boolean;
}

// Simple formatter - in production would use Prettier
export function formatCode(code: string, language: string, options: FormatOptions = {}): string {
    const {
        tabSize = 4,
        semi = true,
        singleQuote = false,
    } = options;

    let formatted = code;

    // Basic formatting (simplified - real implementation would use Prettier)
    if (language === "json") {
        try {
            const parsed = JSON.parse(code);
            formatted = JSON.stringify(parsed, null, tabSize);
        } catch {
            // Invalid JSON, return as-is
        }
    } else if (["typescript", "javascript", "typescriptreact", "javascriptreact"].includes(language)) {
        // Normalize line endings
        formatted = formatted.replace(/\r\n/g, "\n");

        // Fix spacing around brackets
        formatted = formatted.replace(/\{\s*\n/g, "{\n");
        formatted = formatted.replace(/\n\s*\}/g, "\n}");

        // Ensure consistent semicolons
        if (semi) {
            // Add semicolons where missing (simplified)
            formatted = formatted.replace(/([^;{}\s])(\s*\n)(?!\s*[}\]])/g, "$1;$2");
        }

        // Consistent quotes (simplified)
        if (singleQuote) {
            // Very basic - real implementation would be AST-aware
            formatted = formatted.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, "'$1'");
        }

        // Trim trailing whitespace
        formatted = formatted.split("\n").map((line) => line.trimEnd()).join("\n");

        // Ensure single newline at end
        formatted = formatted.trimEnd() + "\n";
    }

    return formatted;
}

export function useFormatOnSave() {
    const format = useCallback((code: string, language: string, options?: FormatOptions) => {
        return formatCode(code, language, options);
    }, []);

    return { format };
}

// Format selection only
export function formatSelection(
    code: string,
    selectionStart: number,
    selectionEnd: number,
    language: string,
    options?: FormatOptions
): { code: string; selectionStart: number; selectionEnd: number } {
    const before = code.substring(0, selectionStart);
    const selected = code.substring(selectionStart, selectionEnd);
    const after = code.substring(selectionEnd);

    const formatted = formatCode(selected, language, options);

    return {
        code: before + formatted + after,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
    };
}

export default useFormatOnSave;
