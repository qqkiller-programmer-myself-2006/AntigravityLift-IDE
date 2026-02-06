// Graviton IDE - Task Runner
// Run npm scripts and commands from UI

import { useState, useEffect } from "react";
import { Icons } from "../icons";

interface Task {
    name: string;
    command: string;
    isRunning: boolean;
}

interface TaskRunnerProps {
    tasks: Task[];
    onRunTask: (task: Task) => void;
    onStopTask: (task: Task) => void;
}

export function TaskRunner({ tasks, onRunTask, onStopTask }: TaskRunnerProps) {
    const [filter, setFilter] = useState("");

    const filteredTasks = tasks.filter((task) =>
        task.name.toLowerCase().includes(filter.toLowerCase()) ||
        task.command.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="px-3 py-2 border-b border-graviton-border">
                <div className="flex items-center gap-2 bg-graviton-bg-tertiary rounded px-2 py-1">
                    <Icons.search className="w-4 h-4 text-graviton-text-muted" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search tasks..."
                        className="flex-1 bg-transparent text-sm outline-none text-graviton-text-primary"
                    />
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-auto">
                {filteredTasks.length === 0 ? (
                    <div className="p-4 text-center text-graviton-text-muted text-sm">
                        {tasks.length === 0 ? "No tasks found in package.json" : "No matching tasks"}
                    </div>
                ) : (
                    <div className="py-1">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.name}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-graviton-bg-hover group"
                            >
                                <button
                                    onClick={() => task.isRunning ? onStopTask(task) : onRunTask(task)}
                                    className={`p-1 rounded ${task.isRunning
                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                        }`}
                                    title={task.isRunning ? "Stop" : "Run"}
                                >
                                    {task.isRunning ? (
                                        <Icons.close className="w-3 h-3" />
                                    ) : (
                                        <Icons.play className="w-3 h-3" />
                                    )}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-graviton-text-primary truncate">
                                        {task.name}
                                    </div>
                                    <div className="text-[10px] text-graviton-text-muted truncate font-mono">
                                        {task.command}
                                    </div>
                                </div>
                                {task.isRunning && (
                                    <span className="text-[10px] text-green-400 animate-pulse">
                                        Running...
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Hook to parse package.json scripts
export function usePackageScripts(rootPath: string | null) {
    const [scripts, setScripts] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!rootPath) {
            setScripts({});
            return;
        }

        async function loadScripts() {
            try {
                const { readTextFile } = await import("@tauri-apps/plugin-fs");
                const packageJson = await readTextFile(`${rootPath}\\package.json`);
                const pkg = JSON.parse(packageJson);
                setScripts(pkg.scripts || {});
            } catch {
                setScripts({});
            }
        }

        loadScripts();
    }, [rootPath]);

    const tasks: Task[] = Object.entries(scripts).map(([name, command]) => ({
        name,
        command: command as string,
        isRunning: false,
    }));

    return tasks;
}

export default TaskRunner;
