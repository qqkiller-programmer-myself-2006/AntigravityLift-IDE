// Graviton IDE - Auto Save Hook
// Automatically saves files after inactivity

import { useEffect, useRef } from "react";
import { useEditorStore } from "../stores/editorStore";
import { writeTextFile } from "@tauri-apps/plugin-fs";

interface UseAutoSaveOptions {
    delay?: number; // Delay in ms before saving (default: 1000)
    enabled?: boolean;
}

export function useAutoSave({ delay = 1000, enabled = true }: UseAutoSaveOptions = {}) {
    const { tabs, markTabDirty } = useEditorStore();
    const timeoutRef = useRef<number | null>(null);
    const lastContentRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        if (!enabled) return;

        // Find dirty tabs
        const dirtyTabs = tabs.filter((tab) => tab.isDirty);

        if (dirtyTabs.length === 0) {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            return;
        }

        // Check if content actually changed
        const hasRealChanges = dirtyTabs.some((tab) => {
            const lastContent = lastContentRef.current.get(tab.id);
            return lastContent !== tab.content;
        });

        if (!hasRealChanges) return;

        // Update last content
        dirtyTabs.forEach((tab) => {
            lastContentRef.current.set(tab.id, tab.content);
        });

        // Clear previous timeout
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        // Set new timeout for auto-save
        timeoutRef.current = window.setTimeout(async () => {
            for (const tab of dirtyTabs) {
                try {
                    await writeTextFile(tab.path, tab.content);
                    markTabDirty(tab.id, false); // Mark as not dirty
                    console.log(`Auto-saved: ${tab.name}`);
                } catch (error) {
                    console.error(`Failed to auto-save ${tab.name}:`, error);
                }
            }
        }, delay);

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [tabs, delay, enabled, markTabDirty]);
}

export default useAutoSave;
