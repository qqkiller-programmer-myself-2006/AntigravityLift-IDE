// Graviton IDE - Snippets System
// User-defined code templates with tab stops

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Snippet {
    id: string;
    name: string;
    prefix: string;
    body: string[];
    description?: string;
    language?: string; // e.g., "typescript", "javascript", "*" for all
}

interface SnippetsState {
    snippets: Snippet[];

    // Actions
    addSnippet: (snippet: Omit<Snippet, "id">) => void;
    updateSnippet: (id: string, updates: Partial<Snippet>) => void;
    deleteSnippet: (id: string) => void;
    getSnippetsByLanguage: (language: string) => Snippet[];
    getSnippetByPrefix: (prefix: string, language?: string) => Snippet | undefined;
}

// Default snippets
const defaultSnippets: Snippet[] = [
    // React/TypeScript
    {
        id: "react-fc",
        name: "React Functional Component",
        prefix: "rfc",
        language: "typescriptreact",
        description: "Create a React functional component",
        body: [
            "interface ${1:ComponentName}Props {",
            "    $2",
            "}",
            "",
            "export function ${1:ComponentName}({ $3 }: ${1:ComponentName}Props) {",
            "    return (",
            "        <div>",
            "            $0",
            "        </div>",
            "    );",
            "}",
        ],
    },
    {
        id: "react-useState",
        name: "React useState Hook",
        prefix: "us",
        language: "typescriptreact",
        description: "Create a useState hook",
        body: ["const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:type}>($3);"],
    },
    {
        id: "react-useEffect",
        name: "React useEffect Hook",
        prefix: "ue",
        language: "typescriptreact",
        description: "Create a useEffect hook",
        body: [
            "useEffect(() => {",
            "    $1",
            "    return () => {",
            "        $2",
            "    };",
            "}, [$3]);",
        ],
    },
    // TypeScript
    {
        id: "ts-interface",
        name: "TypeScript Interface",
        prefix: "int",
        language: "typescript",
        description: "Create a TypeScript interface",
        body: [
            "interface ${1:InterfaceName} {",
            "    $0",
            "}",
        ],
    },
    {
        id: "ts-async-function",
        name: "Async Function",
        prefix: "afn",
        language: "typescript",
        description: "Create an async function",
        body: [
            "async function ${1:functionName}(${2:params}): Promise<${3:ReturnType}> {",
            "    $0",
            "}",
        ],
    },
    // General
    {
        id: "console-log",
        name: "Console Log",
        prefix: "cl",
        language: "*",
        description: "Console log statement",
        body: ['console.log("$1", $2);'],
    },
    {
        id: "try-catch",
        name: "Try Catch Block",
        prefix: "tc",
        language: "*",
        description: "Try-catch block",
        body: [
            "try {",
            "    $1",
            "} catch (error) {",
            "    console.error(error);",
            "    $0",
            "}",
        ],
    },
    {
        id: "arrow-function",
        name: "Arrow Function",
        prefix: "af",
        language: "*",
        description: "Arrow function",
        body: ["const ${1:name} = (${2:params}) => {", "    $0", "};"],
    },
];

export const useSnippetsStore = create<SnippetsState>()(
    persist(
        (set, get) => ({
            snippets: defaultSnippets,

            addSnippet: (snippet) => {
                const id = `custom-${Date.now()}`;
                set((state) => ({
                    snippets: [...state.snippets, { ...snippet, id }],
                }));
            },

            updateSnippet: (id, updates) => {
                set((state) => ({
                    snippets: state.snippets.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                }));
            },

            deleteSnippet: (id) => {
                set((state) => ({
                    snippets: state.snippets.filter((s) => s.id !== id),
                }));
            },

            getSnippetsByLanguage: (language) => {
                const allSnippets = get().snippets;
                return allSnippets.filter(
                    (s) => s.language === "*" || s.language === language
                );
            },

            getSnippetByPrefix: (prefix, language) => {
                const allSnippets = get().snippets;
                return allSnippets.find(
                    (s) =>
                        s.prefix === prefix &&
                        (s.language === "*" || s.language === language)
                );
            },
        }),
        {
            name: "graviton-snippets",
        }
    )
);

// Helper to expand snippet body with tab stops
export function expandSnippet(body: string[]): string {
    // Join body lines and convert tab stops
    // $0 is final cursor position, $1, $2, etc. are tab stops
    // ${1:default} is a tab stop with default value
    return body.join("\n");
}

export default useSnippetsStore;
