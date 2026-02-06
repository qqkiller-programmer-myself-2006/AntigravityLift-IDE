// Graviton IDE - Breadcrumbs
// File path navigation above the editor

import { Icons } from "../icons";
import { useFileStore } from "../../stores/fileStore";

interface BreadcrumbsProps {
    path: string;
    onNavigate?: (path: string) => void;
}

export function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
    const { rootPath } = useFileStore();

    if (!path) return null;

    // Get relative path from root
    const relativePath = rootPath ? path.replace(rootPath + "\\", "") : path;
    const parts = relativePath.split("\\");

    // Build full paths for each segment
    const segments = parts.map((part, index) => {
        const fullPath = rootPath
            ? `${rootPath}\\${parts.slice(0, index + 1).join("\\")}`
            : parts.slice(0, index + 1).join("\\");
        return { name: part, path: fullPath, isLast: index === parts.length - 1 };
    });

    return (
        <div className="flex items-center gap-1 px-4 py-1 bg-graviton-bg-primary border-b border-graviton-border text-[12px] overflow-x-auto">
            {/* Root folder indicator */}
            {rootPath && (
                <>
                    <button
                        onClick={() => onNavigate?.(rootPath)}
                        className="flex items-center gap-1 text-graviton-text-muted hover:text-graviton-text-secondary"
                    >
                        <Icons.folder className="w-3.5 h-3.5" />
                        <span>{rootPath.split("\\").pop()}</span>
                    </button>
                    <Icons.chevronRight className="w-3 h-3 text-graviton-text-muted flex-shrink-0" />
                </>
            )}

            {/* Path segments */}
            {segments.map((segment) => (
                <div key={segment.path} className="flex items-center gap-1">
                    <button
                        onClick={() => onNavigate?.(segment.path)}
                        className={`flex items-center gap-1 truncate max-w-[150px] ${segment.isLast
                            ? "text-graviton-text-primary font-medium"
                            : "text-graviton-text-muted hover:text-graviton-text-secondary"
                            }`}
                    >
                        {segment.isLast && <Icons.file className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">{segment.name}</span>
                    </button>
                    {!segment.isLast && (
                        <Icons.chevronRight className="w-3 h-3 text-graviton-text-muted flex-shrink-0" />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Breadcrumbs;
