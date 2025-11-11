"use client";

import React, { useEffect, useState } from "react";
import { useEditorStore } from "../store/editorStore";
import { renderLayoutToHtml } from "../lib/renderer";

export default function Preview() {
  const nodes = useEditorStore((s) => s.nodes);
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // layout shape expected by renderer
    const layout = { props: { title: "Preview" }, children: nodes };
    const { html } = renderLayoutToHtml(layout);
    setSrcDoc(html);
  }, [nodes]);

  return (
    <div style={{ borderLeft: "1px solid #eee", paddingLeft: 12, height: "100%", boxSizing: "border-box" }}>
      <h4 style={{ marginTop: 0 }}>Preview</h4>
      <div style={{ height: "calc(100% - 40px)", border: "1px solid #ddd", borderRadius: 6, overflow: "hidden" }}>
        <iframe
          title="preview"
          srcDoc={srcDoc}
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
