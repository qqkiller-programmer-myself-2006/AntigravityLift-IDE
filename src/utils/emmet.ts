// Graviton IDE - Emmet Abbreviation Expander
// HTML/CSS snippet expansion

// Common HTML snippets
const htmlSnippets: Record<string, string> = {
    "!": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    $0
</body>
</html>`,
    "html:5": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$1</title>
</head>
<body>
    $0
</body>
</html>`,
    "a": `<a href="$1">$0</a>`,
    "a:link": `<a href="http://$1">$0</a>`,
    "a:mail": `<a href="mailto:$1">$0</a>`,
    "link:css": `<link rel="stylesheet" href="$1.css">`,
    "link:favicon": `<link rel="icon" href="favicon.ico" type="image/x-icon">`,
    "script:src": `<script src="$1.js"></script>`,
    "img": `<img src="$1" alt="$2">`,
    "input": `<input type="$1" name="$2" id="$3">`,
    "input:text": `<input type="text" name="$1" id="$2">`,
    "input:password": `<input type="password" name="$1" id="$2">`,
    "input:email": `<input type="email" name="$1" id="$2">`,
    "input:submit": `<input type="submit" value="$1">`,
    "input:checkbox": `<input type="checkbox" name="$1" id="$2">`,
    "input:radio": `<input type="radio" name="$1" id="$2">`,
    "btn": `<button type="$1">$0</button>`,
    "btn:s": `<button type="submit">$0</button>`,
    "btn:r": `<button type="reset">$0</button>`,
    "form": `<form action="$1" method="$2">$0</form>`,
    "form:get": `<form action="$1" method="get">$0</form>`,
    "form:post": `<form action="$1" method="post">$0</form>`,
    "select": `<select name="$1" id="$2">$0</select>`,
    "option": `<option value="$1">$0</option>`,
    "table": `<table>$0</table>`,
    "table+": `<table>
    <tr>
        <td>$0</td>
    </tr>
</table>`,
    "tr": `<tr>$0</tr>`,
    "td": `<td>$0</td>`,
    "th": `<th>$0</th>`,
    "ul": `<ul>$0</ul>`,
    "ul+": `<ul>
    <li>$0</li>
</ul>`,
    "ol": `<ol>$0</ol>`,
    "li": `<li>$0</li>`,
    "div": `<div>$0</div>`,
    "span": `<span>$0</span>`,
    "p": `<p>$0</p>`,
    "header": `<header>$0</header>`,
    "footer": `<footer>$0</footer>`,
    "main": `<main>$0</main>`,
    "section": `<section>$0</section>`,
    "article": `<article>$0</article>`,
    "aside": `<aside>$0</aside>`,
    "nav": `<nav>$0</nav>`,
    "h1": `<h1>$0</h1>`,
    "h2": `<h2>$0</h2>`,
    "h3": `<h3>$0</h3>`,
    "h4": `<h4>$0</h4>`,
    "h5": `<h5>$0</h5>`,
    "h6": `<h6>$0</h6>`,
};

// Common CSS snippets
const cssSnippets: Record<string, string> = {
    "pos:a": "position: absolute;",
    "pos:r": "position: relative;",
    "pos:f": "position: fixed;",
    "pos:s": "position: sticky;",
    "d:n": "display: none;",
    "d:b": "display: block;",
    "d:i": "display: inline;",
    "d:ib": "display: inline-block;",
    "d:f": "display: flex;",
    "d:g": "display: grid;",
    "fxd:c": "flex-direction: column;",
    "fxd:r": "flex-direction: row;",
    "jc:c": "justify-content: center;",
    "jc:sb": "justify-content: space-between;",
    "jc:sa": "justify-content: space-around;",
    "ai:c": "align-items: center;",
    "ai:s": "align-items: flex-start;",
    "ai:e": "align-items: flex-end;",
    "m": "margin: $1;",
    "m:a": "margin: auto;",
    "mt": "margin-top: $1;",
    "mr": "margin-right: $1;",
    "mb": "margin-bottom: $1;",
    "ml": "margin-left: $1;",
    "p": "padding: $1;",
    "pt": "padding-top: $1;",
    "pr": "padding-right: $1;",
    "pb": "padding-bottom: $1;",
    "pl": "padding-left: $1;",
    "w": "width: $1;",
    "w:a": "width: auto;",
    "w:100": "width: 100%;",
    "h": "height: $1;",
    "h:a": "height: auto;",
    "h:100": "height: 100%;",
    "bg": "background: $1;",
    "bgc": "background-color: $1;",
    "c": "color: $1;",
    "bd": "border: $1;",
    "bdn": "border: none;",
    "bdr": "border-radius: $1;",
    "fz": "font-size: $1;",
    "fw:b": "font-weight: bold;",
    "fw:n": "font-weight: normal;",
    "ta:c": "text-align: center;",
    "ta:l": "text-align: left;",
    "ta:r": "text-align: right;",
    "tdn": "text-decoration: none;",
    "cur:p": "cursor: pointer;",
    "op": "opacity: $1;",
    "z": "z-index: $1;",
    "ov:h": "overflow: hidden;",
    "ov:a": "overflow: auto;",
    "ov:s": "overflow: scroll;",
    "trs": "transition: $1;",
    "trsa": "transition: all 0.3s ease;",
};

export function expandEmmet(abbreviation: string, language: string): string | null {
    // Select snippet set based on language
    const isCSS = ["css", "scss", "less", "stylus"].includes(language);
    const snippets = isCSS ? cssSnippets : htmlSnippets;

    // Direct match
    if (snippets[abbreviation]) {
        return snippets[abbreviation];
    }

    // Parse tag with class/id (e.g., "div.container#main")
    if (!isCSS) {
        const match = abbreviation.match(/^(\w+)?((?:[.#][\w-]+)+)?(?:\*(\d+))?$/);
        if (match) {
            const tag = match[1] || "div";
            const modifiers = match[2] || "";
            const count = match[3] ? parseInt(match[3]) : 1;

            // Extract classes and ids
            const classes: string[] = [];
            const ids: string[] = [];
            modifiers.split(/(?=[.#])/).forEach((mod) => {
                if (mod.startsWith(".")) classes.push(mod.slice(1));
                if (mod.startsWith("#")) ids.push(mod.slice(1));
            });

            // Build tag
            let attrs = "";
            if (ids.length > 0) attrs += ` id="${ids.join(" ")}"`;
            if (classes.length > 0) attrs += ` class="${classes.join(" ")}"`;

            const element = `<${tag}${attrs}>$0</${tag}>`;

            if (count > 1) {
                return Array(count).fill(element).join("\n");
            }
            return element;
        }
    }

    return null;
}

// Check if text looks like an emmet abbreviation
export function isEmmetAbbreviation(text: string, language: string): boolean {
    if (!text || text.includes(" ")) return false;

    const isCSS = ["css", "scss", "less"].includes(language);
    const snippets = isCSS ? cssSnippets : htmlSnippets;

    // Direct match
    if (snippets[text]) return true;

    // HTML pattern (tag with class/id)
    if (!isCSS && /^(\w+)?((?:[.#][\w-]+)+)?(?:\*(\d+))?$/.test(text)) {
        return true;
    }

    return false;
}

export default { expandEmmet, isEmmetAbbreviation };
