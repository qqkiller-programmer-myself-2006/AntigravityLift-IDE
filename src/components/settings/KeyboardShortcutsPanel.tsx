// Graviton IDE - Keyboard Shortcuts Panel
// View and edit keyboard shortcuts

import { useState, useMemo } from "react";
import { Icons } from "../icons";
import { useKeyboardShortcutsStore, KeyBinding } from "../../stores/keyboardShortcutsStore";

export function KeyboardShortcutsPanel() {
    const { bindings, formatShortcut, resetBinding, resetAll } = useKeyboardShortcutsStore();
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const filteredBindings = useMemo(() => {
        if (!search) return bindings;
        const lowerSearch = search.toLowerCase();
        return bindings.filter(
            (b) =>
                b.command.toLowerCase().includes(lowerSearch) ||
                b.id.toLowerCase().includes(lowerSearch)
        );
    }, [bindings, search]);

    // Group by category (first part of id)
    const groupedBindings = useMemo(() => {
        const groups: Record<string, KeyBinding[]> = {};
        for (const binding of filteredBindings) {
            const category = binding.id.split(".")[0];
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(binding);
        }
        return groups;
    }, [filteredBindings]);

    return (
        <div className="flex flex-col h-full bg-graviton-bg-primary">
            {/* Header */}
            <div className="px-4 py-3 border-b border-graviton-border">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-medium text-graviton-text-primary">
                        Keyboard Shortcuts
                    </h2>
                    <button
                        onClick={resetAll}
                        className="text-[11px] text-graviton-accent-primary hover:underline"
                    >
                        Reset All
                    </button>
                </div>
                <div className="flex items-center gap-2 bg-graviton-bg-tertiary rounded px-3 py-2">
                    <Icons.search className="w-4 h-4 text-graviton-text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search shortcuts..."
                        className="flex-1 bg-transparent text-sm outline-none text-graviton-text-primary"
                    />
                </div>
            </div>

            {/* Shortcuts list */}
            <div className="flex-1 overflow-auto">
                {Object.entries(groupedBindings).map(([category, categoryBindings]) => (
                    <div key={category} className="border-b border-graviton-border">
                        <div className="px-4 py-2 text-[11px] font-medium text-graviton-text-muted uppercase tracking-wider bg-graviton-bg-secondary">
                            {category}
                        </div>
                        {categoryBindings.map((binding) => (
                            <div
                                key={binding.id}
                                className="flex items-center justify-between px-4 py-2 hover:bg-graviton-bg-hover group"
                            >
                                <div className="flex-1">
                                    <div className="text-sm text-graviton-text-primary">
                                        {binding.command}
                                    </div>
                                    <div className="text-[11px] text-graviton-text-muted">
                                        {binding.id}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {editingId === binding.id ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Press keys..."
                                            className="px-2 py-1 text-sm bg-graviton-bg-tertiary border border-graviton-accent-primary rounded text-graviton-text-primary outline-none w-32"
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                                // Would capture and set new binding here
                                                setEditingId(null);
                                            }}
                                            onBlur={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setEditingId(binding.id)}
                                            className="px-2 py-1 text-sm bg-graviton-bg-tertiary rounded text-graviton-text-secondary hover:bg-graviton-bg-hover"
                                        >
                                            {formatShortcut(binding)}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => resetBinding(binding.id)}
                                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-graviton-bg-hover rounded"
                                        title="Reset to default"
                                    >
                                        <Icons.refresh className="w-3 h-3 text-graviton-text-muted" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-graviton-border text-[11px] text-graviton-text-muted">
                Click on a shortcut to edit it. Press Escape to cancel.
            </div>
        </div>
    );
}

export default KeyboardShortcutsPanel;
