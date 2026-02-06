// Graviton IDE - Editor Settings Panel
// Visual settings for Monaco editor configurations

import { useState } from "react";
import { useEditorConfigStore, EditorConfig } from "../../stores/editorConfigStore";

interface EditorSettingsPanelProps {
    onClose?: () => void;
}

export function EditorSettingsPanel({ onClose }: EditorSettingsPanelProps) {
    const config = useEditorConfigStore();
    const [activeSection, setActiveSection] = useState<"display" | "behavior" | "visual">("display");

    const sections = [
        { id: "display", label: "Display", icon: "🖥️" },
        { id: "behavior", label: "Behavior", icon: "⚙️" },
        { id: "visual", label: "Visual", icon: "🎨" },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-graviton-bg-primary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-graviton-border">
                <h2 className="text-lg font-medium text-graviton-text-primary">
                    Editor Settings
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-graviton-text-muted hover:text-graviton-text-primary"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r border-graviton-border p-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-left ${activeSection === section.id
                                    ? "bg-graviton-accent-primary/20 text-graviton-text-primary"
                                    : "text-graviton-text-secondary hover:bg-graviton-bg-hover"
                                }`}
                        >
                            <span>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Settings */}
                <div className="flex-1 overflow-auto p-4">
                    {activeSection === "display" && (
                        <div className="space-y-4">
                            <SettingRow label="Font Size" description="Editor font size in pixels">
                                <div className="flex items-center gap-2">
                                    <button onClick={config.zoomOut} className="px-2 py-1 bg-graviton-bg-hover rounded">-</button>
                                    <span className="w-8 text-center">{config.fontSize}</span>
                                    <button onClick={config.zoomIn} className="px-2 py-1 bg-graviton-bg-hover rounded">+</button>
                                </div>
                            </SettingRow>

                            <SettingRow label="Tab Size" description="Number of spaces per tab">
                                <select
                                    value={config.tabSize}
                                    onChange={(e) => config.setConfig("tabSize", Number(e.target.value))}
                                    className="bg-graviton-bg-tertiary border border-graviton-border rounded px-2 py-1"
                                >
                                    <option value={2}>2</option>
                                    <option value={4}>4</option>
                                    <option value={8}>8</option>
                                </select>
                            </SettingRow>

                            <SettingRow label="Word Wrap" description="How lines should wrap">
                                <select
                                    value={config.wordWrap}
                                    onChange={(e) => config.setConfig("wordWrap", e.target.value as EditorConfig["wordWrap"])}
                                    className="bg-graviton-bg-tertiary border border-graviton-border rounded px-2 py-1"
                                >
                                    <option value="off">Off</option>
                                    <option value="on">On</option>
                                    <option value="wordWrapColumn">Wrap at column</option>
                                    <option value="bounded">Bounded</option>
                                </select>
                            </SettingRow>

                            <SettingRow label="Line Numbers" description="Show line numbers in editor">
                                <select
                                    value={config.lineNumbers}
                                    onChange={(e) => config.setConfig("lineNumbers", e.target.value as EditorConfig["lineNumbers"])}
                                    className="bg-graviton-bg-tertiary border border-graviton-border rounded px-2 py-1"
                                >
                                    <option value="on">On</option>
                                    <option value="off">Off</option>
                                    <option value="relative">Relative</option>
                                    <option value="interval">Interval</option>
                                </select>
                            </SettingRow>

                            <SettingRow label="Minimap" description="Show code minimap">
                                <Toggle checked={config.minimap} onChange={(v) => config.setConfig("minimap", v)} />
                            </SettingRow>
                        </div>
                    )}

                    {activeSection === "behavior" && (
                        <div className="space-y-4">
                            <SettingRow label="Auto Save" description="Automatically save files">
                                <Toggle checked={config.autoSave} onChange={(v) => config.setConfig("autoSave", v)} />
                            </SettingRow>

                            <SettingRow label="Format on Save" description="Format file when saving">
                                <Toggle checked={config.formatOnSave} onChange={(v) => config.setConfig("formatOnSave", v)} />
                            </SettingRow>

                            <SettingRow label="Format on Paste" description="Format code when pasting">
                                <Toggle checked={config.formatOnPaste} onChange={(v) => config.setConfig("formatOnPaste", v)} />
                            </SettingRow>

                            <SettingRow label="Auto Close Brackets" description="Automatically close brackets">
                                <Toggle checked={config.autoCloseBrackets} onChange={(v) => config.setConfig("autoCloseBrackets", v)} />
                            </SettingRow>

                            <SettingRow label="Auto Indent" description="Automatically indent new lines">
                                <Toggle checked={config.autoIndent} onChange={(v) => config.setConfig("autoIndent", v)} />
                            </SettingRow>
                        </div>
                    )}

                    {activeSection === "visual" && (
                        <div className="space-y-4">
                            <SettingRow label="Bracket Colorization" description="Color nested brackets">
                                <Toggle checked={config.bracketPairColorization} onChange={(v) => config.setConfig("bracketPairColorization", v)} />
                            </SettingRow>

                            <SettingRow label="Indent Guides" description="Show indentation guides">
                                <Toggle checked={config.indentGuides} onChange={(v) => config.setConfig("indentGuides", v)} />
                            </SettingRow>

                            <SettingRow label="Highlight Active Line" description="Highlight the current line">
                                <Toggle checked={config.highlightActiveLine} onChange={(v) => config.setConfig("highlightActiveLine", v)} />
                            </SettingRow>

                            <SettingRow label="Sticky Scroll" description="Keep function headers visible">
                                <Toggle checked={config.stickyScroll} onChange={(v) => config.setConfig("stickyScroll", v)} />
                            </SettingRow>

                            <SettingRow label="Smooth Scrolling" description="Animate scrolling">
                                <Toggle checked={config.smoothScrolling} onChange={(v) => config.setConfig("smoothScrolling", v)} />
                            </SettingRow>

                            <SettingRow label="Code Folding" description="Enable code folding">
                                <Toggle checked={config.folding} onChange={(v) => config.setConfig("folding", v)} />
                            </SettingRow>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-graviton-border">
                        <button
                            onClick={config.resetToDefaults}
                            className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components
function SettingRow({
    label,
    description,
    children
}: {
    label: string;
    description: string;
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <div className="text-sm text-graviton-text-primary">{label}</div>
                <div className="text-[11px] text-graviton-text-muted">{description}</div>
            </div>
            {children}
        </div>
    );
}

function Toggle({
    checked,
    onChange
}: {
    checked: boolean;
    onChange: (value: boolean) => void
}) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-graviton-accent-primary" : "bg-graviton-bg-tertiary"
                }`}
        >
            <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"
                    }`}
            />
        </button>
    );
}

export default EditorSettingsPanel;
