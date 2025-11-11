import React from "react";
import Canvas from "../components/Canvas";
import Sidebar from "../components/Sidebar";

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

      <main style={{ flex: 1, padding: 16 }}>
        <Canvas />
      </main>
    </div>
  );
}
