import React from "react";
import Canvas from "../components/Canvas";
import Sidebar from "../components/Sidebar";
import Preview from "../components/Preview";

export default function Page() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial" }}>
      <aside
        style={{
          width: 260,
          borderRight: "1px solid #eee",
          padding: 16,
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Builder</h2>
        <Sidebar />
      </aside>

      <main style={{ flex: 1, padding: 12, display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Canvas />
        </div>

        <div style={{ width: 420 }}>
          <Preview />
        </div>
      </main>
    </div>
  );
}
