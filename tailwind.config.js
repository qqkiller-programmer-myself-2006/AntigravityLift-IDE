/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Graviton IDE Color Palette (Dark Theme)
                graviton: {
                    bg: {
                        primary: '#0d1117',
                        secondary: '#161b22',
                        tertiary: '#21262d',
                        hover: '#30363d',
                    },
                    text: {
                        primary: '#e6edf3',
                        secondary: '#8b949e',
                        muted: '#6e7681',
                    },
                    accent: {
                        primary: '#58a6ff',
                        secondary: '#7ee787',
                        warning: '#d29922',
                        error: '#f85149',
                    },
                    border: '#30363d',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            },
        },
    },
    plugins: [],
}
