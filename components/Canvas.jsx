"use client";

import React, { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

function SortableItem({ id, node }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.6 : 1,
    padding: 8,
    margin: 8,
    border: "1px solid #eee",
    background: "#fff",
  };
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <strong>{node.type}</strong>
      <div style={{ fontSize: 13, color: "#333" }}>{JSON.stringify(node.props || {})}</div>
    </div>
  );
}

export default function Canvas() {
  const nodes = useEditorStore((s) => s.nodes);
  const setNodes = useEditorStore((s) => s.setNodes);
  const addNode = useEditorStore((s) => s.addNode);

  const [activeDragPayload, setActiveDragPayload] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(event) {
    const { active } = event;
    // tokens from Sidebar use data.payload; items in canvas have id as active.id
    if (active?.data?.current?.payload) {
      setActiveDragPayload(active.data.current.payload);
    } else {
      setActiveDragPayload(null);
    }
  }

  function handleDragOver(event) {
    // no-op for now
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    // If dragging a sidebar token (payload) and dropped over canvas (over is not null)
    if (active?.data?.current?.payload) {
      // simply add to the end or at position if over an item
      const payload = active.data.current.payload;
      if (over && over.id && over.id.startsWith("node-")) {
        // find index of over id
        const index = nodes.findIndex((n) => `node-${n.id}` === over.id);
        const newNode = { id: Math.random().toString(36).slice(2), ...payload };
        const newNodes = [...nodes];
        newNodes.splice(index + 1, 0, newNode);
        setNodes(newNodes);
      } else {
        addNode(payload);
      }
    } else {
      // sorting within canvas
      if (active?.id && over?.id && active.id !== over.id) {
        const oldIndex = nodes.findIndex((n) => `node-${n.id}` === active.id);
        const newIndex = nodes.findIndex((n) => `node-${n.id}` === over.id);
        if (oldIndex > -1 && newIndex > -1) {
          const newOrder = arrayMove(nodes, oldIndex, newIndex);
          setNodes(newOrder);
        }
      }
    }

    setActiveDragPayload(null);
  }

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={nodes.map((n) => `node-${n.id}`)} strategy={rectSortingStrategy}>
          <div style={{ minHeight: 200 }}>
            {nodes.length === 0 ? (
              <div style={{ color: "#666" }}>Drag components from the left to start</div>
            ) : (
              nodes.map((n) => <SortableItem key={n.id} id={`node-${n.id}`} node={n} />)
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeDragPayload ? (
            <div style={{ padding: 12, border: "1px solid #ddd", background: "#fff" }}>
              {activeDragPayload.type}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
