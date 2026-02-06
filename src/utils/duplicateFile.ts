// Graviton IDE - Duplicate File Utility
// Copy files and folders

import { copyFile, mkdir, readDir } from "@tauri-apps/plugin-fs";
import { join, dirname, basename } from "@tauri-apps/api/path";

export async function duplicateFile(sourcePath: string): Promise<string> {
    const dir = await dirname(sourcePath);
    const name = await basename(sourcePath);

    // Generate new name
    const ext = name.includes(".") ? "." + name.split(".").pop() : "";
    const baseName = ext ? name.slice(0, -ext.length) : name;
    const newName = `${baseName} copy${ext}`;
    const destPath = await join(dir, newName);

    // Copy the file
    await copyFile(sourcePath, destPath);

    return destPath;
}

export async function duplicateFolder(sourcePath: string): Promise<string> {
    const dir = await dirname(sourcePath);
    const name = await basename(sourcePath);

    // Generate new name
    const newName = `${name} copy`;
    const destPath = await join(dir, newName);

    // Create the new directory
    await mkdir(destPath, { recursive: true });

    // Copy contents recursively
    await copyDirectoryContents(sourcePath, destPath);

    return destPath;
}

async function copyDirectoryContents(source: string, dest: string): Promise<void> {
    const entries = await readDir(source);

    for (const entry of entries) {
        const sourcePath = await join(source, entry.name);
        const destPath = await join(dest, entry.name);

        if (entry.isDirectory) {
            await mkdir(destPath, { recursive: true });
            await copyDirectoryContents(sourcePath, destPath);
        } else {
            await copyFile(sourcePath, destPath);
        }
    }
}

// Move file to a new location
export async function moveFile(sourcePath: string, destPath: string): Promise<void> {
    // First copy
    await copyFile(sourcePath, destPath);
    // Then delete original (would use removeFile in a real implementation)
    // For now, just log
    console.log(`Would delete: ${sourcePath}`);
}

export default { duplicateFile, duplicateFolder, moveFile };
