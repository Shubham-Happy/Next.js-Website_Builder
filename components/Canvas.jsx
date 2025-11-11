"use client";

import React from "react";
import { useEditorStore } from "../store/editorStore";

export default function Canvas() {
  const nodes = useEditorStore((s) => s.nodes);

  return (
    <div
      style={{
        border: "1px dashed #ccc",
        height: "100%",
        borderRadius: 8,
        padding: 12,
        overflow: "auto",
      }}
    >
      <h3>Canvas</h3>
      <div>
        {nodes.length === 0 ? (
          <div style={{ color: "#666" }}>
            Drag components from the left to start
          </div>
        ) : (
          nodes.map((n) => (
            <div
              key={n.id}
              style={{
                padding: 8,
                margin: 8,
                border: "1px solid #eee",
                background: "#fff",
              }}
            >
              <strong>{n.type}</strong>
              <div style={{ fontSize: 13, color: "#333" }}>
                {JSON.stringify(n.props || {})}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
