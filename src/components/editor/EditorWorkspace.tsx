import { useRef, useState } from "react";

import EditorToolbar from "../toolbar/EditorToolbar";

import EditorCanvas from "./EditorCanvas";
import type { EditorCanvasRef } from "./EditorCanvas";

import "./EditorWorkspace.css";


interface Props {
  image: string;
  result: string;

  onNewImage: () => void;
}


export default function EditorWorkspace({
  image,
  result,
  onNewImage,
}: Props) {

  /*
  ========================================
  HERRAMIENTA ACTIVA
  ========================================
  */

  const [mode, setMode] =
    useState<
      "erase" |
      "restore" |
      null
    >(null);


  /*
  ========================================
  TAMAÑO DEL PINCEL
  ========================================
  */

  const [brushSize, setBrushSize] =
    useState(30);


  /*
  ========================================
  ZOOM
  ========================================
  */

  const [zoom, setZoom] =
    useState(100);


  /*
  ========================================
  REFERENCIA AL EDITOR CANVAS
  ========================================
  */

  const editorCanvasRef =
    useRef<EditorCanvasRef>(null);


  /*
  ========================================
  AUMENTAR ZOOM
  ========================================
  */

  function handleZoomIn() {

    setZoom((current) =>
      Math.min(
        current + 25,
        300
      )
    );

  }


  /*
  ========================================
  REDUCIR ZOOM
  ========================================
  */

  function handleZoomOut() {

    setZoom((current) =>
      Math.max(
        current - 25,
        25
      )
    );

  }


  /*
  ========================================
  RENDER
  ========================================
  */

  return (

    <section
      className="editor-workspace"
    >

      {/* ========================================
          TOOLBAR
      ======================================== */}

<EditorToolbar

  mode={mode}

  zoom={zoom}

  onErase={() => {
    setMode("erase");
  }}

  onRestore={() => {
    setMode("restore");
  }}

  onUndo={() => {
    editorCanvasRef.current?.undo();
  }}

  onRedo={() => {
    editorCanvasRef.current?.redo();
  }}

  onZoomIn={
    handleZoomIn
  }

  onZoomOut={
    handleZoomOut
  }

  onDownload={() => {
    editorCanvasRef.current?.download();
  }}

  onNewImage={
    onNewImage
  }

/>


      {/* ========================================
          CONTROL DEL PINCEL
      ======================================== */}

      <div
        className="brush-controls"
      >

        <span>
          Tamaño del pincel
        </span>


        <input

          type="range"

          min="5"

          max="200"

          value={
            brushSize
          }

          onChange={(event) => {

            setBrushSize(

              Number(
                event.target.value
              )

            );

          }}

        />


        <span>

          {brushSize}px

        </span>

      </div>


      {/* ========================================
          EDITOR CANVAS
      ======================================== */}

      <EditorCanvas

        ref={
          editorCanvasRef
        }

        image={
          image
        }

        result={
          result
        }

        mode={
          mode
        }

        brushSize={
          brushSize
        }

        zoom={
          zoom
        }

      />

    </section>

  );

}