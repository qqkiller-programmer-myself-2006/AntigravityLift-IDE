// Graviton IDE - Status Bar
// Bottom status bar with info

import { Icons } from "../icons";
import { useEditorStore } from "../../stores/editorStore";

interface StatusBarProps {
    version?: string;
}

export function StatusBar({ version = "0.1.0" }: StatusBarProps) {
    const { getActiveTab } = useEditorStore();
    const activeTab = getActiveTab();

    // Get file info
    const language = activeTab?.language || "Plain Text";
    const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);

    return (
        <footer className="h-[22px] bg-[#007acc] flex items-center px-2 text-[11px] text-white select-none">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 rounded cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    main
                </span>
                <span className="flex items-center gap-1 hover:bg-white/10 px-1.5 rounded cursor-pointer">
                    <Icons.error className="w-3 h-3" />
                    <span>0</span>
                </span>
                <span className="flex items-center gap-1 hover:bg-white/10 px-1.5 rounded cursor-pointer">
                    <Icons.warning className="w-3 h-3" />
                    <span>0</span>
                </span>
            </div>

            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-1 text-white/90">
                {activeTab && (
                    <>
                        <span className="hover:bg-white/10 px-1.5 rounded cursor-pointer">
                            Ln 1, Col 1
                        </span>
                        <span className="hover:bg-white/10 px-1.5 rounded cursor-pointer">
                            Spaces: 2
                        </span>
                        <span className="hover:bg-white/10 px-1.5 rounded cursor-pointer">
                            UTF-8
                        </span>
                        <span className="hover:bg-white/10 px-1.5 rounded cursor-pointer">
                            {displayLanguage}
                        </span>
                    </>
                )}
                <span className="hover:bg-white/10 px-1.5 rounded cursor-pointer">
                    Graviton v{version}
                </span>
            </div>
        </footer>
    );
}

export default StatusBar;
