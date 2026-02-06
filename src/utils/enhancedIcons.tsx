// Graviton IDE - Enhanced File Icons
// Extended file icons with folder-specific icons

import { Icons } from "../components/icons";
import React from "react";

// Folder icons by folder name
const folderIcons: Record<string, { color: string }> = {
    src: { color: "#42a5f5" },
    source: { color: "#42a5f5" },
    lib: { color: "#7e57c2" },
    node_modules: { color: "#8d6e63" },
    dist: { color: "#66bb6a" },
    build: { color: "#66bb6a" },
    out: { color: "#66bb6a" },
    public: { color: "#26a69a" },
    assets: { color: "#ffa726" },
    images: { color: "#ffa726" },
    img: { color: "#ffa726" },
    icons: { color: "#ffa726" },
    styles: { color: "#ec407a" },
    css: { color: "#ec407a" },
    components: { color: "#42a5f5" },
    pages: { color: "#42a5f5" },
    views: { color: "#42a5f5" },
    hooks: { color: "#ab47bc" },
    utils: { color: "#78909c" },
    helpers: { color: "#78909c" },
    services: { color: "#26a69a" },
    api: { color: "#26a69a" },
    store: { color: "#7e57c2" },
    stores: { color: "#7e57c2" },
    state: { color: "#7e57c2" },
    types: { color: "#29b6f6" },
    interfaces: { color: "#29b6f6" },
    models: { color: "#29b6f6" },
    tests: { color: "#ef5350" },
    test: { color: "#ef5350" },
    __tests__: { color: "#ef5350" },
    spec: { color: "#ef5350" },
    config: { color: "#78909c" },
    configs: { color: "#78909c" },
    scripts: { color: "#ffa726" },
    docs: { color: "#42a5f5" },
    documentation: { color: "#42a5f5" },
    ".git": { color: "#ef5350" },
    ".github": { color: "#333" },
    ".vscode": { color: "#007acc" },
};

// Extended file icons by extension - mapping to icon function names
type IconName = "typescript" | "react" | "javascript" | "html" | "css" | "json" | "markdown" | "file" | "git" | "image" | "terminal" | "python" | "rust";

const fileIcons: Record<string, { icon: IconName; color: string }> = {
    // TypeScript/JavaScript
    ts: { icon: "typescript", color: "#3178c6" },
    tsx: { icon: "react", color: "#61dafb" },
    js: { icon: "javascript", color: "#f7df1e" },
    jsx: { icon: "react", color: "#61dafb" },
    mjs: { icon: "javascript", color: "#f7df1e" },
    cjs: { icon: "javascript", color: "#f7df1e" },

    // Web
    html: { icon: "html", color: "#e44d26" },
    css: { icon: "css", color: "#264de4" },
    scss: { icon: "css", color: "#c6538c" },
    sass: { icon: "css", color: "#c6538c" },
    less: { icon: "css", color: "#1d365d" },

    // Data
    json: { icon: "json", color: "#cbcb41" },
    yaml: { icon: "file", color: "#cb171e" },
    yml: { icon: "file", color: "#cb171e" },
    xml: { icon: "file", color: "#e37933" },
    toml: { icon: "file", color: "#9c4221" },

    // Docs
    md: { icon: "markdown", color: "#083fa1" },
    mdx: { icon: "markdown", color: "#fcb32c" },
    txt: { icon: "file", color: "#89898f" },
    pdf: { icon: "file", color: "#ff0000" },

    // Config
    env: { icon: "file", color: "#ecd53f" },
    gitignore: { icon: "git", color: "#f05032" },
    eslintrc: { icon: "file", color: "#4b32c3" },
    prettierrc: { icon: "file", color: "#56b3b4" },

    // Images
    png: { icon: "image", color: "#a074c4" },
    jpg: { icon: "image", color: "#a074c4" },
    jpeg: { icon: "image", color: "#a074c4" },
    gif: { icon: "image", color: "#a074c4" },
    svg: { icon: "image", color: "#ffb13b" },
    ico: { icon: "image", color: "#a074c4" },
    webp: { icon: "image", color: "#a074c4" },

    // Other languages
    py: { icon: "python", color: "#3776ab" },
    rb: { icon: "file", color: "#cc342d" },
    go: { icon: "file", color: "#00add8" },
    rs: { icon: "rust", color: "#dea584" },
    java: { icon: "file", color: "#007396" },
    c: { icon: "file", color: "#a8b9cc" },
    cpp: { icon: "file", color: "#00599c" },
    cs: { icon: "file", color: "#68217a" },
    php: { icon: "file", color: "#777bb4" },
    swift: { icon: "file", color: "#fa7343" },
    kt: { icon: "file", color: "#7f52ff" },

    // Shell
    sh: { icon: "terminal", color: "#89e051" },
    bash: { icon: "terminal", color: "#89e051" },
    zsh: { icon: "terminal", color: "#89e051" },
    ps1: { icon: "terminal", color: "#012456" },

    // Build
    lock: { icon: "file", color: "#8b8b8b" },
    log: { icon: "file", color: "#8b8b8b" },
};

// Special filenames
const specialFiles: Record<string, { icon: IconName; color: string }> = {
    "package.json": { icon: "json", color: "#cb3837" },
    "package-lock.json": { icon: "json", color: "#cb3837" },
    "tsconfig.json": { icon: "typescript", color: "#3178c6" },
    "vite.config.ts": { icon: "file", color: "#646cff" },
    "next.config.js": { icon: "file", color: "#000000" },
    "tailwind.config.js": { icon: "file", color: "#06b6d4" },
    ".env": { icon: "file", color: "#ecd53f" },
    ".env.local": { icon: "file", color: "#ecd53f" },
    ".gitignore": { icon: "git", color: "#f05032" },
    "README.md": { icon: "markdown", color: "#083fa1" },
    "LICENSE": { icon: "file", color: "#d4af37" },
    "Dockerfile": { icon: "file", color: "#2496ed" },
    "docker-compose.yml": { icon: "file", color: "#2496ed" },
};

export function getEnhancedFileIcon(fileName: string): React.ReactNode {
    // Check special files first
    if (specialFiles[fileName]) {
        const config = specialFiles[fileName];
        const IconComponent = Icons[config.icon];
        return <IconComponent className="w-4 h-4" style={{ color: config.color }} />;
    }

    // Get extension
    const ext = fileName.includes(".")
        ? fileName.split(".").pop()?.toLowerCase() || ""
        : "";

    if (fileIcons[ext]) {
        const config = fileIcons[ext];
        const IconComponent = Icons[config.icon];
        return <IconComponent className="w-4 h-4" style={{ color: config.color }} />;
    }

    // Default file icon
    return <Icons.file className="w-4 h-4 text-graviton-text-muted" />;
}

export function getEnhancedFolderIcon(folderName: string, isExpanded: boolean): React.ReactNode {
    const config = folderIcons[folderName.toLowerCase()];
    const IconComponent = isExpanded ? Icons.folderOpen : Icons.folder;
    const color = config?.color || "#90a4ae";

    return <IconComponent className="w-4 h-4" style={{ color }} />;
}

export default { getEnhancedFileIcon, getEnhancedFolderIcon };
