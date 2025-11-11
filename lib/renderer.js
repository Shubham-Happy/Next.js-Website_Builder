// lib/renderer.js
// Produces HTML and a class-based styles string for cleaner export/preview.
// Works both server-side and client-side (no DOM calls).

function styleObjToString(style = {}) {
  return Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`)
    .join(";");
}

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Generate short class names: c1, c2, ...
// Use a map keyed by JSON.stringify(style) so identical style objects reuse the same class.
export function createClassStyleMapper() {
  const map = new Map();
  let counter = 0;
  return {
    getClassForStyle(style = {}) {
      const key = JSON.stringify(style || {});
      if (map.has(key)) return map.get(key).className;
      counter += 1;
      const className = `c${counter}`;
      const cssBody = styleObjToString(style);
      map.set(key, { className, css: `.${className}{${cssBody}}` });
      return className;
    },
    getAllCss() {
      // join all css fragments in map insertion order
      return Array.from(map.values()).map((v) => v.css).join("\n");
    },
  };
}

function wrapTag(tag, attrs = {}, inner = "") {
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `<${tag}${attrStr ? " " + attrStr : ""}>${inner}</${tag}>`;
}

export function renderNodeToHtml(node, mapper) {
  if (!node) return "";
  const props = node.props || {};
  const style = props.style || {};
  const className = Object.keys(style).length ? mapper.getClassForStyle(style) : null;

  switch (node.type) {
    case "Text": {
      const tag = props.tag || "div";
      const text = props.text || "";
      const attrs = className ? { class: className } : {};
      return wrapTag(tag, attrs, escapeHtml(text));
    }
    case "Image": {
      const src = props.src || "";
      const alt = escapeHtml(props.alt || "");
      const attrs = { src, alt };
      if (className) attrs.class = className;
      // self-closing img (ok in HTML)
      return `<img ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ")} />`;
    }
    case "Section": {
      const children = (node.children || []).map((c) => renderNodeToHtml(c, mapper)).join("");
      const attrs = className ? { class: className } : {};
      return wrapTag("section", attrs, children);
    }
    default: {
      const children = (node.children || []).map((c) => renderNodeToHtml(c, mapper)).join("");
      const attrs = className ? { class: className } : {};
      return wrapTag("div", attrs, children);
    }
  }
}

// Returns { html, styles, script } where html is a full document (for preview srcDoc).
// For export you can use mapper.getAllCss() separately and write styles to styles.css.
export function renderLayoutToHtml(layoutJson = { children: [] }, opts = {}) {
  const mapper = createClassStyleMapper();
  const body = (layoutJson.children || []).map((n) => renderNodeToHtml(n, mapper)).join("");
  const title = layoutJson.props?.title || "Exported site";

  // default base styles (you can expand)
  const base = (opts.baseStyles !== undefined) ? opts.baseStyles : `
    body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0}
    .btn{display:inline-block;padding:10px 14px;border-radius:6px;background:#0366d6;color:#fff;text-decoration:none}
  `;

  const styles = base + "\n" + mapper.getAllCss();

  // inline styles inside head for preview convenience
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<style>${styles}</style>
</head>
<body>
${body}
<script>
  // optional runtime stub
  console.log('Preview page loaded');
</script>
</body>
</html>`;

  const script = "// exported runtime (empty)";

  return { html, styles, script };
}
