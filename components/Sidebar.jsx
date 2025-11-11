"use client";

import React from "react";
import { useEditorStore } from "../store/editorStore";
import { useDraggable } from "@dnd-kit/core";

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

function DraggableToken({ token }) {
  // Provide a simple data payload via dataTransfer-like pattern
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `token-${token.type}-${Math.random().toString(36).slice(2)}`,
    data: { payload: token },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: 8,
        textAlign: "left",
        border: "1px solid #ddd",
        borderRadius: 6,
        background: "white",
        cursor: "grab",
        ...style,
      }}
    >
      {token.type}
    </div>
  );
}

export default function Sidebar() {
  const addNode = useEditorStore((s) => s.addNode);

  // Keep click fallback (adds without drag)
  const addByClick = (t) => addNode(t);

  return (
    <div>
      <h4>Components</h4>
      <div style={{ display: "grid", gap: 8 }}>
        {TOKENS.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <DraggableToken token={t} />
            <button
              onClick={() => addByClick(t)}
              style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #eee" }}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
