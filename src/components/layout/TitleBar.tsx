// Graviton IDE - Title Bar
// Custom window title bar

import { Icons } from "../icons";

interface TitleBarProps {
    title?: string;
}

export function TitleBar({ title = "Graviton IDE" }: TitleBarProps) {
    return (
        <header className="h-9 bg-graviton-bg-secondary border-b border-graviton-border flex items-center px-4 select-none" data-tauri-drag-region>
            {/* Left: Logo and Menu */}
            <div className="flex items-center gap-6">
                <span className="text-graviton-text-primary font-medium text-[13px]">
                    Graviton
                </span>
                <nav className="flex items-center gap-4 text-graviton-text-muted text-[12px]">
                    {["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"].map((item) => (
                        <span
                            key={item}
                            className="hover:text-graviton-text-primary cursor-pointer transition-colors px-1"
                        >
                            {item}
                        </span>
                    ))}
                </nav>
            </div>

            {/* Center: Title */}
            <div className="flex-1 text-center text-graviton-text-muted text-[12px]">
                {title}
            </div>

            {/* Right: Window Controls */}
            <div className="flex items-center gap-1 text-graviton-text-muted">
                <button
                    className="p-1.5 hover:bg-graviton-bg-hover rounded transition-colors"
                    title="Minimize"
                >
                    <Icons.minus className="w-3 h-3" />
                </button>
                <button
                    className="p-1.5 hover:bg-graviton-bg-hover rounded transition-colors"
                    title="Maximize"
                >
                    <Icons.maximize className="w-3 h-3" />
                </button>
                <button
                    className="p-1.5 hover:bg-red-500/20 rounded text-graviton-text-muted hover:text-red-400 transition-colors"
                    title="Close"
                >
                    <Icons.close className="w-3 h-3" />
                </button>
            </div>
        </header>
    );
}

export default TitleBar;
