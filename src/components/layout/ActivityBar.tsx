// Graviton IDE - Activity Bar
// Left vertical icon bar

import { Icons } from "../icons";
import { useSettingsStore } from "../../stores/settingsStore";

interface ActivityButtonProps {
    icon: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    title?: string;
    badge?: number;
}

function ActivityButton({ icon, active, onClick, title, badge }: ActivityButtonProps) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`relative p-2.5 rounded transition-colors ${active
                ? "text-graviton-text-primary bg-graviton-bg-hover"
                : "text-graviton-text-muted hover:text-graviton-text-secondary hover:bg-graviton-bg-hover"
                }`}
        >
            {icon}
            {badge !== undefined && badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-[10px] font-medium bg-graviton-accent-primary text-white rounded-full flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </button>
    );
}

interface ActivityBarProps {
    onOpenFolder?: () => void;
    onRunExtension?: () => void;
}

export function ActivityBar({ onOpenFolder: _onOpenFolder, onRunExtension }: ActivityBarProps) {
    const {
        leftSidebarOpen,
        rightSidebarOpen,
        terminalOpen,
        activePanel,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleTerminal,
        setActivePanel,
    } = useSettingsStore();

    return (
        <div className="w-12 bg-graviton-bg-secondary border-r border-graviton-border flex flex-col items-center py-1 select-none">
            <ActivityButton
                icon={<Icons.files />}
                active={leftSidebarOpen && activePanel === "explorer"}
                onClick={() => activePanel === "explorer" && leftSidebarOpen ? toggleLeftSidebar() : setActivePanel("explorer")}
                title="Explorer (Ctrl+Shift+E)"
            />
            <ActivityButton
                icon={<Icons.search />}
                active={leftSidebarOpen && activePanel === "search"}
                onClick={() => activePanel === "search" && leftSidebarOpen ? toggleLeftSidebar() : setActivePanel("search")}
                title="Search (Ctrl+Shift+F)"
            />
            <ActivityButton
                icon={<Icons.gitBranch />}
                active={leftSidebarOpen && activePanel === "git"}
                onClick={() => activePanel === "git" && leftSidebarOpen ? toggleLeftSidebar() : setActivePanel("git")}
                title="Source Control (Ctrl+Shift+G)"
            />
            <ActivityButton
                icon={<Icons.debug />}
                title="Run and Debug (Ctrl+Shift+D)"
            />
            <ActivityButton
                icon={<Icons.extensions />}
                title="Extensions (Ctrl+Shift+X)"
            />
            <ActivityButton
                icon={<Icons.panel />}
                active={rightSidebarOpen}
                onClick={toggleRightSidebar}
                title="Toggle Panel"
            />

            <div className="flex-1" />

            <ActivityButton
                icon={<Icons.terminal />}
                active={terminalOpen}
                onClick={toggleTerminal}
                title="Toggle Terminal (Ctrl+`)"
            />
            <ActivityButton
                icon={<Icons.play />}
                onClick={onRunExtension}
                title="Run Extension Test"
            />
            <ActivityButton
                icon={<Icons.settings />}
                title="Settings (Ctrl+,)"
            />
        </div>
    );
}

export default ActivityBar;
