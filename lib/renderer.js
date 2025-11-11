export function styleObjToString(style = {}) {
  return Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`)
    .join(";");
}

export function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderNodeToHtml(node) {
  if (!node) return "";
  const style = node.props?.style
    ? ` style=\"${styleObjToString(node.props.style)}\"`
    : "";
  switch (node.type) {
    case "Text": {
      const tag = node.props?.tag || "div";
      const text = node.props?.text || "";
      return `<${tag}${style}>${escapeHtml(text)}</${tag}>`;
    }
    case "Image": {
      const src = node.props?.src || "";
      const alt = escapeHtml(node.props?.alt || "");
      return `<img src=\"${src}\" alt=\"${alt}\"${style} />`;
    }
    case "Section": {
      const children = (node.children || []).map(renderNodeToHtml).join("");
      return `<section${style}>${children}</section>`;
    }
    default: {
      const children = (node.children || []).map(renderNodeToHtml).join("");
      return `<div${style}>${children}</div>`;
    }
  }
}

export function renderLayoutToHtml(layoutJson = { children: [] }) {
  const body = (layoutJson.children || []).map(renderNodeToHtml).join("");
  const title = layoutJson.props?.title || "Exported site";
  const html = `<!doctype html>
<html>
<head>
<meta charset=\"utf-8\"/>
<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>
<title>${escapeHtml(title)}</title>
<link rel=\"stylesheet\" href=\"styles.css\" />
</head>
<body>
${body}
<script src=\"script.js\"></script>
</body>
</html>`;
  const styles =
    "body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0}\\n";
  const script = "console.log('exported site loaded');";
  return { html, styles, script };
}
