// Graviton IDE - Theme Picker
// UI for selecting and previewing themes

import { useState, useMemo } from "react";
import { Icons } from "../icons";
import { useSettingsStore } from "../../stores/settingsStore";

interface Theme {
    id: string;
    name: string;
    type: "dark" | "light";
    colors: {
        bgPrimary: string;
        bgSecondary: string;
        bgTertiary: string;
        textPrimary: string;
        textSecondary: string;
        accentPrimary: string;
        border: string;
    };
}

const builtInThemes: Theme[] = [
    {
        id: "dark-default",
        name: "Dark+ (default)",
        type: "dark",
        colors: {
            bgPrimary: "#1e1e1e",
            bgSecondary: "#252526",
            bgTertiary: "#2d2d30",
            textPrimary: "#cccccc",
            textSecondary: "#9d9d9d",
            accentPrimary: "#007acc",
            border: "#3c3c3c",
        },
    },
    {
        id: "dark-monokai",
        name: "Monokai",
        type: "dark",
        colors: {
            bgPrimary: "#272822",
            bgSecondary: "#1e1f1c",
            bgTertiary: "#3e3d32",
            textPrimary: "#f8f8f2",
            textSecondary: "#75715e",
            accentPrimary: "#a6e22e",
            border: "#3c3d37",
        },
    },
    {
        id: "dark-dracula",
        name: "Dracula",
        type: "dark",
        colors: {
            bgPrimary: "#282a36",
            bgSecondary: "#21222c",
            bgTertiary: "#44475a",
            textPrimary: "#f8f8f2",
            textSecondary: "#6272a4",
            accentPrimary: "#bd93f9",
            border: "#44475a",
        },
    },
    {
        id: "dark-nord",
        name: "Nord",
        type: "dark",
        colors: {
            bgPrimary: "#2e3440",
            bgSecondary: "#3b4252",
            bgTertiary: "#434c5e",
            textPrimary: "#eceff4",
            textSecondary: "#d8dee9",
            accentPrimary: "#88c0d0",
            border: "#4c566a",
        },
    },
    {
        id: "light-default",
        name: "Light+",
        type: "light",
        colors: {
            bgPrimary: "#ffffff",
            bgSecondary: "#f3f3f3",
            bgTertiary: "#e5e5e5",
            textPrimary: "#333333",
            textSecondary: "#616161",
            accentPrimary: "#0066b8",
            border: "#d4d4d4",
        },
    },
    {
        id: "light-github",
        name: "GitHub Light",
        type: "light",
        colors: {
            bgPrimary: "#ffffff",
            bgSecondary: "#f6f8fa",
            bgTertiary: "#eaeef2",
            textPrimary: "#24292f",
            textSecondary: "#57606a",
            accentPrimary: "#0969da",
            border: "#d0d7de",
        },
    },
];

interface ThemePickerProps {
    onClose: () => void;
}

export function ThemePicker({ onClose }: ThemePickerProps) {
    const { settings, setTheme } = useSettingsStore();
    const theme = settings.theme;
    const [filter, setFilter] = useState<"all" | "dark" | "light">("all");
    const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

    const filteredThemes = useMemo(() => {
        if (filter === "all") return builtInThemes;
        return builtInThemes.filter((t) => t.type === filter);
    }, [filter]);

    const handleSelectTheme = (themeId: string) => {
        setTheme(themeId as "dark" | "light");
        // In a real implementation, would apply the full theme colors
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-graviton-bg-secondary border border-graviton-border rounded-lg shadow-xl w-[600px] max-h-[500px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-graviton-border">
                    <h2 className="text-lg font-medium text-graviton-text-primary">
                        Color Theme
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                    >
                        <Icons.close className="w-4 h-4" />
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 px-4 py-2 border-b border-graviton-border">
                    {(["all", "dark", "light"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-[12px] rounded ${filter === f
                                ? "bg-graviton-accent-primary text-white"
                                : "text-graviton-text-muted hover:bg-graviton-bg-hover"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Theme list */}
                <div className="overflow-auto max-h-[380px] p-2">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredThemes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleSelectTheme(t.id)}
                                onMouseEnter={() => setHoveredTheme(t.id)}
                                onMouseLeave={() => setHoveredTheme(null)}
                                className={`flex flex-col overflow-hidden rounded-lg border-2 transition-all ${theme === t.id
                                    ? "border-graviton-accent-primary"
                                    : hoveredTheme === t.id
                                        ? "border-graviton-text-muted"
                                        : "border-transparent"
                                    }`}
                            >
                                {/* Preview */}
                                <div
                                    className="h-24 p-2 flex flex-col gap-1"
                                    style={{ backgroundColor: t.colors.bgPrimary }}
                                >
                                    <div
                                        className="h-3 w-12 rounded"
                                        style={{ backgroundColor: t.colors.accentPrimary }}
                                    />
                                    <div
                                        className="h-2 w-20 rounded"
                                        style={{ backgroundColor: t.colors.textPrimary + "40" }}
                                    />
                                    <div
                                        className="h-2 w-16 rounded"
                                        style={{ backgroundColor: t.colors.textSecondary + "40" }}
                                    />
                                    <div className="flex gap-1 mt-auto">
                                        <div
                                            className="h-2 w-8 rounded"
                                            style={{ backgroundColor: t.colors.bgSecondary }}
                                        />
                                        <div
                                            className="h-2 w-10 rounded"
                                            style={{ backgroundColor: t.colors.bgTertiary }}
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <div
                                    className="px-2 py-1.5 text-[12px] text-left"
                                    style={{ backgroundColor: t.colors.bgSecondary }}
                                >
                                    <span style={{ color: t.colors.textPrimary }}>{t.name}</span>
                                    {theme === t.id && (
                                        <Icons.check className="inline-block w-3 h-3 ml-2" style={{ color: t.colors.accentPrimary }} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThemePicker;
