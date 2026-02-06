// Graviton IDE - Settings Modal
// UI for editing user preferences

import { useState } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import { Icons } from "../icons";
import { ThemeMode } from "../../types";

interface SettingsModalProps {
    onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
    const { settings, setTheme, setFontSize, setFontFamily, setTabSize, toggleWordWrap, toggleMinimap, toggleLineNumbers } = useSettingsStore();

    const [localFontSize, setLocalFontSize] = useState(settings.fontSize);
    const [localTabSize, setLocalTabSize] = useState(settings.tabSize);
    const [localFontFamily, setLocalFontFamily] = useState(settings.fontFamily);

    const handleFontSizeChange = (value: number) => {
        setLocalFontSize(value);
        setFontSize(value);
    };

    const handleTabSizeChange = (value: number) => {
        setLocalTabSize(value);
        setTabSize(value);
    };

    const handleFontFamilyChange = (value: string) => {
        setLocalFontFamily(value);
        setFontFamily(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-[600px] max-h-[80vh] bg-graviton-bg-secondary rounded-lg shadow-2xl border border-graviton-border overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-graviton-border">
                    <h2 className="text-lg font-medium text-graviton-text-primary">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-graviton-bg-hover rounded text-graviton-text-muted"
                    >
                        <Icons.close className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-auto max-h-[60vh]">
                    {/* Theme */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-graviton-text-primary">Theme</label>
                        <div className="flex gap-2">
                            {(["dark", "light"] as ThemeMode[]).map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => setTheme(theme)}
                                    className={`px-4 py-2 rounded text-sm capitalize transition-colors ${settings.theme === theme
                                            ? "bg-graviton-accent-primary text-white"
                                            : "bg-graviton-bg-tertiary text-graviton-text-secondary hover:bg-graviton-bg-hover"
                                        }`}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-graviton-text-primary">
                            Font Size: {localFontSize}px
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="24"
                            value={localFontSize}
                            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                            className="w-full accent-graviton-accent-primary"
                        />
                    </div>

                    {/* Font Family */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-graviton-text-primary">Font Family</label>
                        <input
                            type="text"
                            value={localFontFamily}
                            onChange={(e) => handleFontFamilyChange(e.target.value)}
                            className="w-full px-3 py-2 bg-graviton-bg-tertiary border border-graviton-border rounded text-sm text-graviton-text-primary focus:outline-none focus:border-graviton-accent-primary"
                        />
                    </div>

                    {/* Tab Size */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-graviton-text-primary">
                            Tab Size: {localTabSize}
                        </label>
                        <div className="flex gap-2">
                            {[2, 4, 8].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleTabSizeChange(size)}
                                    className={`px-4 py-2 rounded text-sm transition-colors ${localTabSize === size
                                            ? "bg-graviton-accent-primary text-white"
                                            : "bg-graviton-bg-tertiary text-graviton-text-secondary hover:bg-graviton-bg-hover"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-graviton-text-primary">Word Wrap</span>
                            <button
                                onClick={toggleWordWrap}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.wordWrap ? "bg-graviton-accent-primary" : "bg-graviton-bg-tertiary"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.wordWrap ? "translate-x-6" : "translate-x-0.5"
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-graviton-text-primary">Minimap</span>
                            <button
                                onClick={toggleMinimap}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.minimap ? "bg-graviton-accent-primary" : "bg-graviton-bg-tertiary"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.minimap ? "translate-x-6" : "translate-x-0.5"
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-graviton-text-primary">Line Numbers</span>
                            <button
                                onClick={toggleLineNumbers}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.lineNumbers ? "bg-graviton-accent-primary" : "bg-graviton-bg-tertiary"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.lineNumbers ? "translate-x-6" : "translate-x-0.5"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-graviton-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-graviton-accent-primary text-white rounded text-sm hover:bg-graviton-accent-primary/80 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
