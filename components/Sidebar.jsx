"use client";

import React from "react";
import { useEditorStore } from "../store/editorStore";

const TOKENS = [
  { type: "Text", props: { text: "Heading", tag: "h1" } },
  { type: "Section", props: { style: { padding: "24px" } } },
  {
    type: "Image",
    props: {
      src: "/assets/placeholder.png",
      alt: "placeholder",
      style: { width: "100%" },
    },
  },
  { type: "Button", props: { text: "Click me", href: "#" } },
];

export default function Sidebar() {
  const addNode = useEditorStore((s) => s.addNode);

  return (
    <div>
      <h4>Components</h4>
      <div style={{ display: "grid", gap: 8 }}>
        {TOKENS.map((t, i) => (
          <button
            key={i}
            style={{
              padding: 8,
              textAlign: "left",
              border: "1px solid #ddd",
              borderRadius: 6,
              background: "white",
              cursor: "pointer",
            }}
            onClick={() => addNode(t)}
          >
            {t.type}
          </button>
        ))}
      </div>
    </div>
  );
}
