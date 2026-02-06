// Graviton IDE - File System Hook
// Tauri FS API integration for file operations

import { useCallback } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile, readDir } from "@tauri-apps/plugin-fs";
import { useFileStore } from "../stores/fileStore";
import { useEditorStore } from "../stores/editorStore";
import { FileNode } from "../types";

// Language detection by extension
function getLanguage(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
        ts: "typescript",
        tsx: "typescript",
        js: "javascript",
        jsx: "javascript",
        rs: "rust",
        json: "json",
        toml: "toml",
        css: "css",
        scss: "scss",
        html: "html",
        md: "markdown",
        py: "python",
        go: "go",
        yaml: "yaml",
        yml: "yaml",
        sh: "shell",
        bash: "shell",
        ps1: "powershell",
        sql: "sql",
        xml: "xml",
        svg: "xml",
    };
    return langMap[ext || ""] || "plaintext";
}

export function useFileSystem() {
    const { setRootPath, setFileTree, setLoading, setError } = useFileStore();
    const { openTab, getActiveTab, markTabDirty } = useEditorStore();

    // Read directory recursively
    const readDirectory = useCallback(
        async (path: string, depth = 0): Promise<FileNode[]> => {
            if (depth > 5) return []; // Limit depth

            try {
                const entries = await readDir(path);
                const nodes: FileNode[] = [];

                for (const entry of entries) {
                    // Skip hidden files and node_modules
                    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "target") {
                        continue;
                    }

                    const fullPath = `${path}\\${entry.name}`;
                    const node: FileNode = {
                        name: entry.name,
                        path: fullPath,
                        type: entry.isDirectory ? "directory" : "file",
                    };

                    if (entry.isDirectory && depth < 3) {
                        node.children = await readDirectory(fullPath, depth + 1);
                    } else if (entry.isDirectory) {
                        node.children = [];
                    }

                    nodes.push(node);
                }

                // Sort: folders first, then files, alphabetically
                return nodes.sort((a, b) => {
                    if (a.type !== b.type) {
                        return a.type === "directory" ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name);
                });
            } catch (err) {
                console.error("Failed to read directory:", err);
                return [];
            }
        },
        []
    );

    // Open folder dialog
    const openFolder = useCallback(async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: "Open Folder",
            });

            if (selected && typeof selected === "string") {
                setLoading(true);
                setRootPath(selected);
                const tree = await readDirectory(selected);
                setFileTree(tree);
            }
        } catch (err) {
            setError(String(err));
        }
    }, [readDirectory, setRootPath, setFileTree, setLoading, setError]);

    // Open a file in editor
    const openFile = useCallback(
        async (path: string, name: string) => {
            try {
                const content = await readTextFile(path);
                const language = getLanguage(name);

                openTab({
                    path,
                    name,
                    content,
                    language,
                    isDirty: false,
                });
            } catch (err) {
                console.error("Failed to open file:", err);
                setError(`Failed to open ${name}: ${err}`);
            }
        },
        [openTab, setError]
    );

    // Save current file
    const saveFile = useCallback(async () => {
        const activeTab = getActiveTab();
        if (!activeTab || !activeTab.isDirty) return;

        try {
            await writeTextFile(activeTab.path, activeTab.content);
            markTabDirty(activeTab.id, false);
        } catch (err) {
            console.error("Failed to save file:", err);
            setError(`Failed to save: ${err}`);
        }
    }, [getActiveTab, markTabDirty, setError]);

    // Save file as (new file)
    const saveFileAs = useCallback(async () => {
        const activeTab = getActiveTab();
        if (!activeTab) return;

        try {
            const path = await save({
                title: "Save As",
                defaultPath: activeTab.name,
            });

            if (path) {
                await writeTextFile(path, activeTab.content);
                markTabDirty(activeTab.id, false);
            }
        } catch (err) {
            console.error("Failed to save file:", err);
            setError(`Failed to save: ${err}`);
        }
    }, [getActiveTab, markTabDirty, setError]);

    // Create new file
    const createNewFile = useCallback(async (parentPath?: string) => {
        const { rootPath } = useFileStore.getState();
        const basePath = parentPath || rootPath;
        
        if (!basePath) {
            // No folder open, create untitled tab
            openTab({
                path: "",
                name: "Untitled",
                content: "",
                language: "plaintext",
                isDirty: true,
            });
            return;
        }

        // Prompt for filename
        const filename = window.prompt("Enter file name:");
        if (!filename) return;

        const filePath = `${basePath}\\${filename}`;
        try {
            await writeTextFile(filePath, "");
            // Refresh and open the new file
            const tree = await readDirectory(rootPath!);
            setFileTree(tree);
            openTab({
                path: filePath,
                name: filename,
                content: "",
                language: getLanguage(filename),
                isDirty: false,
            });
        } catch (err) {
            console.error("Failed to create file:", err);
            setError(`Failed to create file: ${err}`);
        }
    }, [openTab, readDirectory, setFileTree, setError]);

    // Create new folder
    const createNewFolder = useCallback(async (parentPath?: string) => {
        const { rootPath } = useFileStore.getState();
        const basePath = parentPath || rootPath;
        
        if (!basePath) {
            setError("No folder open");
            return;
        }

        // Prompt for folder name
        const folderName = window.prompt("Enter folder name:");
        if (!folderName) return;

        const folderPath = `${basePath}\\${folderName}`;
        try {
            const { mkdir } = await import("@tauri-apps/plugin-fs");
            await mkdir(folderPath);
            // Refresh file tree
            const tree = await readDirectory(rootPath!);
            setFileTree(tree);
        } catch (err) {
            console.error("Failed to create folder:", err);
            setError(`Failed to create folder: ${err}`);
        }
    }, [readDirectory, setFileTree, setError]);

    // Refresh file tree
    const refreshFileTree = useCallback(async () => {
        const { rootPath } = useFileStore.getState();
        if (!rootPath) return;

        setLoading(true);
        const tree = await readDirectory(rootPath);
        setFileTree(tree);
    }, [readDirectory, setFileTree, setLoading]);

    // Collapse all folders
    const collapseAll = useCallback(() => {
        const { rootPath } = useFileStore.getState();
        // Reset to only root expanded
        if (rootPath) {
            useFileStore.setState({ expandedPaths: new Set([rootPath]) });
        } else {
            useFileStore.setState({ expandedPaths: new Set() });
        }
    }, []);

    return {
        openFolder,
        openFile,
        saveFile,
        saveFileAs,
        createNewFile,
        createNewFolder,
        refreshFileTree,
        collapseAll,
        readDirectory,
    };
}
