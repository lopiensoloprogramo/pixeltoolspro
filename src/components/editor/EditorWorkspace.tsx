import { useRef, useState } from "react";

import EditorToolbar from "../toolbar/EditorToolbar";
import EditorCanvas from "./EditorCanvas";
import type { EditorCanvasRef } from "./EditorCanvas";

import "./EditorWorkspace.css";

interface Props {
  image: string;
  result: string;

  onNewImage: () => void;

  action?: "download" | "continue";
  onContinue?: (image: string) => void;
}

export default function EditorWorkspace({
  image,
  result,
  onNewImage,
  action = "download",
  onContinue,
}: Props) {

const [mode, setMode] =
  useState<
    "erase" |
    "restore" |
    "pan" |
    null
  >(null);

  const [brushSize, setBrushSize] =
    useState(30);

  const [zoom, setZoom] =
    useState(100);

  const editorCanvasRef =
    useRef<EditorCanvasRef>(null);

  function handleZoomIn() {
    setZoom((current) => Math.min(current + 25, 300));
  }

  function handleZoomOut() {
    setZoom((current) => Math.max(current - 25, 25));
  }

  async function handleContinue() {

    if (!onContinue) return;

    const edited =
      await editorCanvasRef.current?.exportImage();

    if (!edited) return;

    onContinue(edited);

  }

  return (
    <section className="editor-workspace">

      <EditorToolbar
        mode={mode}
        zoom={zoom}

        onErase={() => setMode("erase")}
        onRestore={() => setMode("restore")}
        onPan={() => setMode("pan")}

        onUndo={() => editorCanvasRef.current?.undo()}
        onRedo={() => editorCanvasRef.current?.redo()}

        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}

        onDownload={() =>
          editorCanvasRef.current?.download()
        }

        onContinue={
          action === "continue"
            ? handleContinue
            : undefined
        }

        continueText={
          action === "continue"
            ? "Aplicar traje"
            : undefined
        }

        onNewImage={onNewImage}
      />

      <div className="brush-controls">

        <span>Tamaño del pincel</span>

        <input
          type="range"
          min="5"
          max="200"
          value={brushSize}
          onChange={(event) =>
            setBrushSize(
              Number(event.target.value)
            )
          }
        />

        <span>{brushSize}px</span>

      </div>

      <EditorCanvas
        ref={editorCanvasRef}
        image={image}
        result={result}
        mode={mode}
        brushSize={brushSize}
        zoom={zoom}
      />

    </section>
  );
}
