// Graviton IDE - SVG Icons
// Professional VS Code-style icons

import React from "react";

interface IconProps {
    className?: string;
    size?: number;
    style?: React.CSSProperties;
}

const createIcon = (paths: React.ReactNode) => {
    return ({ className = "w-5 h-5", size, style }: IconProps) => (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
        >
            {paths}
        </svg>
    );
};

export const Icons = {
    // Activity Bar
    files: createIcon(
        <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" />
    ),
    search: createIcon(
        <>
            <circle cx="11" cy="11" r="6" />
            <path d="M21 21L16 16" />
        </>
    ),
    gitBranch: createIcon(
        <>
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
            <circle cx="6" cy="18" r="2" />
            <path d="M6 8V16M18 16V9C18 7.89543 17.1046 7 16 7H8" />
        </>
    ),
    debug: createIcon(
        <>
            <path d="M12 12V19M12 8V5M8 12H3M21 12H16M5 6L8 9M16 15L19 18M19 6L16 9M8 15L5 18" />
            <circle cx="12" cy="12" r="4" />
        </>
    ),
    extensions: createIcon(
        <>
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
        </>
    ),
    panel: createIcon(
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M15 3V21" />
        </>
    ),
    terminal: createIcon(
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 9L10 12L7 15M13 15H17" />
        </>
    ),
    play: createIcon(
        <polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none" />
    ),
    settings: createIcon(
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" />
        </>
    ),

    // File Tree
    folder: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={style}>
            <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" />
        </svg>
    ),
    folderOpen: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={style}>
            <path d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z" />
        </svg>
    ),
    file: createIcon(
        <>
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
            <path d="M14 2V8H20" />
        </>
    ),
    fileCode: createIcon(
        <>
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
            <path d="M14 2V8H20" />
            <path d="M10 13L8 15L10 17M14 13L16 15L14 17" />
        </>
    ),

    // Chevrons
    chevronRight: createIcon(<path d="M9 18L15 12L9 6" />),
    chevronDown: createIcon(<path d="M6 9L12 15L18 9" />),

    // Actions
    close: createIcon(<path d="M18 6L6 18M6 6L18 18" />),
    plus: createIcon(<path d="M12 5V19M5 12H19" />),
    minus: createIcon(<path d="M5 12H19" />),
    maximize: createIcon(<rect x="4" y="4" width="16" height="16" rx="1" />),
    check: createIcon(<path d="M20 6L9 17L4 12" />),
    ellipsis: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={style}>
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
        </svg>
    ),
    save: createIcon(
        <>
            <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" />
            <path d="M17 21V13H7V21M7 3V8H15" />
        </>
    ),
    newFile: createIcon(
        <>
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
            <path d="M14 2V8H20" />
            <path d="M12 11V17M9 14H15" />
        </>
    ),
    newFolder: createIcon(
        <>
            <path d="M22 19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H9L11 5H20C21.1046 5 22 5.89543 22 7V19Z" />
            <path d="M12 10V16M9 13H15" />
        </>
    ),
    refresh: createIcon(
        <>
            <path d="M1 4V10H7" />
            <path d="M23 20V14H17" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" />
        </>
    ),
    collapseAll: createIcon(
        <>
            <path d="M4 6H20M4 12H20M4 18H20" />
            <path d="M8 3V6M8 12V15M8 18V21" />
        </>
    ),

    // Language icons
    typescript: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" style={style}>
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178C6" />
            <path
                d="M14.5 12V17M14.5 12C16.5 12 17.5 13 17.5 14.5M9 12H13M11 12V17"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
            />
        </svg>
    ),
    javascript: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" style={style}>
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E" />
            <path
                d="M9 17V10M14 17C14 17 15 18 16 18C17 18 18 17 18 16C18 14 14 14.5 14 12.5C14 11.5 15 10.5 16.5 10.5C17.5 10.5 18 11 18 11"
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
            />
        </svg>
    ),
    rust: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" style={style}>
            <circle cx="12" cy="12" r="10" fill="#DEA584" />
            <path
                d="M12 6V18M7 9L12 12L7 15M17 9L12 12L17 15"
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
            />
        </svg>
    ),
    json: createIcon(
        <path d="M8 3C6 3 5 4 5 6V10C5 11 4 12 3 12C4 12 5 13 5 14V18C5 20 6 21 8 21M16 3C18 3 19 4 19 6V10C19 11 20 12 21 12C20 12 19 13 19 14V18C19 20 18 21 16 21" />
    ),
    css: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" style={style}>
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#264DE4" />
            <path
                d="M7 7H17L16 17L12 18L8 17L7.5 12H10L10.25 14.5L12 15L13.75 14.5L14 11H7.5"
                fill="none"
                stroke="white"
                strokeWidth="1"
            />
        </svg>
    ),
    html: ({ className = "w-4 h-4", style }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" style={style}>
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#E34F26" />
            <path
                d="M7 7H17L16 17L12 18L8 17L7.5 12H10L10.25 14.5L12 15L13.75 14.5L14 11H7.5"
                fill="none"
                stroke="white"
                strokeWidth="1"
            />
        </svg>
    ),
    markdown: createIcon(
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 15V9L10 12L13 9V15M17 9V15M17 12H15" />
        </>
    ),
    document: createIcon(
        <>
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
            <path d="M14 2V8H20" />
            <path d="M8 13H16M8 17H12" />
        </>
    ),

    // UI
    splitHorizontal: createIcon(
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 3V21" />
        </>
    ),
    splitVertical: createIcon(
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 12H21" />
        </>
    ),
    warning: createIcon(
        <>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <path d="M12 9V13M12 17H12.01" />
        </>
    ),
    error: createIcon(
        <>
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9L9 15M9 9L15 15" />
        </>
    ),
    info: createIcon(
        <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16V12M12 8H12.01" />
        </>
    ),

    // Navigation
    chevronUp: createIcon(<path d="M18 15L12 9L6 15" />),
    arrowLeft: createIcon(<path d="M19 12H5M12 19L5 12L12 5" />),
    arrowRight: createIcon(<path d="M5 12H19M12 5L19 12L12 19" />),
    pin: createIcon(
        <>
            <path d="M12 17V21M9 4L8 8L12 12L16 8L15 4H9Z" />
            <circle cx="12" cy="12" r="2" />
        </>
    ),
    history: createIcon(
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7V12L15 14" />
        </>
    ),
    split: createIcon(
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 3V21" />
        </>
    ),
    zen: createIcon(
        <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8H18M6 12H14M6 16H10" />
        </>
    ),

    // Outline View Symbols
    class: createIcon(
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 8H15M7 12H17M7 16H13" />
        </>
    ),
    interface: createIcon(
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8V16M8 12H16" />
        </>
    ),
    function: createIcon(
        <>
            <path d="M10 4C7 4 6 6 6 8V12M6 12C6 12 4 12 4 14V16C4 18 6 20 6 20" />
            <path d="M14 4C17 4 18 6 18 8V12M18 12C18 12 20 12 20 14V16C20 18 18 20 18 20" />
            <path d="M4 12H20" />
        </>
    ),
    method: createIcon(
        <>
            <rect x="4" y="6" width="16" height="12" rx="1" />
            <path d="M8 10L10 12L8 14M12 14H16" />
        </>
    ),
    property: createIcon(
        <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8H16M8 12H12" />
        </>
    ),
    variable: createIcon(
        <>
            <path d="M4 4L8 20M20 4L16 20M6 12H18" />
        </>
    ),
    enum: createIcon(
        <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8H16M8 12H14M8 16H12" />
        </>
    ),
    constant: createIcon(
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8V12L15 15" />
        </>
    ),
    symbol: createIcon(
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8V16M8 12H16" />
        </>
    ),

    // Additional icons
    git: createIcon(
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3V9M12 15V21" />
            <path d="M5.64 5.64L9.17 9.17M14.83 14.83L18.36 18.36" />
        </>
    ),
    react: createIcon(
        <>
            <circle cx="12" cy="12" r="2" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)" />
        </>
    ),
    python: createIcon(
        <>
            <path d="M12 3C7 3 7 5 7 6V8H12V9H5C4 9 3 10 3 12C3 14 4 15 5 15H7V13C7 12 8 11 9 11H15C16 11 17 10 17 9V6C17 5 17 3 12 3Z" />
            <path d="M12 21C17 21 17 19 17 18V16H12V15H19C20 15 21 14 21 12C21 10 20 9 19 9H17V11C17 12 16 13 15 13H9C8 13 7 14 7 15V18C7 19 7 21 12 21Z" />
            <circle cx="10" cy="6" r="1" />
            <circle cx="14" cy="18" r="1" />
        </>
    ),
    image: createIcon(
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8" cy="8" r="2" />
            <path d="M21 15L16 10L5 21" />
        </>
    ),
    bookmark: createIcon(
        <path d="M19 21L12 16L5 21V5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21Z" />
    ),
    externalLink: createIcon(
        <>
            <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" />
            <path d="M15 3H21V9" />
            <path d="M10 14L21 3" />
        </>
    ),
};

// File icon by extension
export function getFileIcon(filename: string): React.ReactNode {
    const ext = filename.split(".").pop()?.toLowerCase();
    const className = "w-4 h-4";

    switch (ext) {
        case "ts":
        case "tsx":
            return <Icons.typescript className={className} />;
        case "js":
        case "jsx":
            return <Icons.javascript className={className} />;
        case "rs":
            return <Icons.rust className={className} />;
        case "json":
        case "toml":
            return <span className="text-yellow-400"><Icons.json className={className} /></span>;
        case "css":
        case "scss":
        case "sass":
            return <Icons.css className={className} />;
        case "html":
            return <Icons.html className={className} />;
        case "md":
        case "mdx":
            return <span className="text-blue-300"><Icons.markdown className={className} /></span>;
        default:
            return <span className="text-gray-400"><Icons.file className={className} /></span>;
    }
}

export default Icons;
