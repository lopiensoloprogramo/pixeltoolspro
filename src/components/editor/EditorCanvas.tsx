import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import "./EditorCanvas.css";


/*
========================================
PROPS
========================================
*/

interface Props {
  image: string;
  result: string;
  mode: "erase" | "restore" | null;
  brushSize: number;
  zoom: number;
}


/*
========================================
FUNCIONES QUE EXPONEMOS AL PADRE
========================================
*/

export interface EditorCanvasRef {
  undo: () => void;
  redo: () => void;
  download: () => void;
}


/*
========================================
COMPONENTE
========================================
*/

const EditorCanvas = forwardRef<
  EditorCanvasRef,
  Props
>(({
  image,
  result,
  mode,
  brushSize,
  zoom,
}, ref) => {


  /*
  ========================================
  REFERENCIA AL CANVAS
  ========================================
  */

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);


  /*
  ========================================
  IMAGEN ORIGINAL

  Se utiliza para RESTAURAR.
  ========================================
  */

  const originalImageRef =
    useRef<HTMLImageElement | null>(null);


  /*
  ========================================
  HISTORIAL

  Cada elemento representa un estado
  completo del Canvas.
  ========================================
  */

  const historyRef =
    useRef<string[]>([]);


  /*
  ========================================
  HISTORIAL DE REHACER
  ========================================
  */

  const redoHistoryRef =
    useRef<string[]>([]);


  /*
  ========================================
  CONTROLAR SI ESTAMOS DIBUJANDO
  ========================================
  */

  const [isDrawing, setIsDrawing] =
    useState(false);


  /*
  ========================================
  CARGAR IMAGEN ORIGINAL
  ========================================
  */

  useEffect(() => {

    const original =
      new Image();

    original.src =
      image;

    original.onload = () => {

      originalImageRef.current =
        original;

    };

  }, [image]);


  /*
  ========================================
  CARGAR RESULTADO DE LA IA
  ========================================
  */

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas)
      return;


    const ctx =
      canvas.getContext("2d");

    if (!ctx)
      return;


    const img =
      new Image();


    img.src =
      result;


    img.onload = () => {

      /*
      ----------------------------------------
      CONFIGURAR DIMENSIONES REALES
      ----------------------------------------
      */

      canvas.width =
        img.naturalWidth;

      canvas.height =
        img.naturalHeight;


      /*
      ----------------------------------------
      LIMPIAR
      ----------------------------------------
      */

      ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

      );


      /*
      ----------------------------------------
      ASEGURAR COMPOSICIÓN NORMAL
      ----------------------------------------
      */

      ctx.globalCompositeOperation =
        "source-over";


      /*
      ----------------------------------------
      DIBUJAR RESULTADO
      ----------------------------------------
      */

      ctx.drawImage(

        img,

        0,

        0

      );


      /*
      ----------------------------------------
      REINICIAR HISTORIAL
      ----------------------------------------
      */

      historyRef.current = [];

      redoHistoryRef.current = [];

    };

  }, [result]);


  /*
  ========================================
  OBTENER POSICIÓN REAL DEL PUNTERO
  ========================================
  */

  function getPosition(
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) {

    const canvas =
      canvasRef.current;

    if (!canvas)
      return null;


    const rect =
      canvas.getBoundingClientRect();


    /*
    ----------------------------------------
    ESCALA REAL

    Esto permite que el pincel siga
    correctamente al cursor incluso
    cuando hacemos zoom.
    ----------------------------------------
    */

    const scaleX =
      canvas.width /
      rect.width;


    const scaleY =
      canvas.height /
      rect.height;


    return {

      x:
        (event.clientX -
          rect.left) *
        scaleX,

      y:
        (event.clientY -
          rect.top) *
        scaleY,

    };

  }


  /*
  ========================================
  GUARDAR ESTADO ACTUAL

  Se ejecuta ANTES de modificar
  el Canvas.
  ========================================
  */

  function saveCurrentState() {

    const canvas =
      canvasRef.current;

    if (!canvas)
      return;


    const currentState =
      canvas.toDataURL(
        "image/png"
      );


    /*
    ----------------------------------------
    GUARDAR EN HISTORIAL
    ----------------------------------------
    */

    historyRef.current.push(
      currentState
    );


    /*
    ----------------------------------------
    NUEVA ACCIÓN

    Si el usuario había hecho Undo
    y ahora empieza una nueva acción,
    ya no podemos rehacer el futuro anterior.
    ----------------------------------------
    */

    redoHistoryRef.current = [];

  }


  /*
  ========================================
  CARGAR ESTADO EN CANVAS
  ========================================
  */

  function loadCanvasState(
    state: string
  ) {

    const canvas =
      canvasRef.current;

    if (!canvas)
      return;


    const ctx =
      canvas.getContext("2d");

    if (!ctx)
      return;


    const img =
      new Image();


    img.src =
      state;


    img.onload = () => {

      ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

      );


      ctx.globalCompositeOperation =
        "source-over";


      ctx.drawImage(

        img,

        0,

        0,

        canvas.width,

        canvas.height

      );

    };

  }


  /*
  ========================================
  DESHACER
  ========================================
  */

  function undo() {

    const canvas =
      canvasRef.current;

    if (!canvas)
      return;


    /*
    ----------------------------------------
    SI NO HAY ESTADOS ANTERIORES
    ----------------------------------------
    */

    if (
      historyRef.current.length === 0
    ) {

      return;

    }


    /*
    ----------------------------------------
    GUARDAR ESTADO ACTUAL

    Lo guardamos para poder hacer Redo.
    ----------------------------------------
    */

    const currentState =
      canvas.toDataURL(
        "image/png"
      );


    redoHistoryRef.current.push(
      currentState
    );


    /*
    ----------------------------------------
    OBTENER ESTADO ANTERIOR
    ----------------------------------------
    */

    const previousState =
      historyRef.current.pop();


    if (!previousState)
      return;


    /*
    ----------------------------------------
    RESTAURAR ESTADO ANTERIOR
    ----------------------------------------
    */

    loadCanvasState(
      previousState
    );

  }


  /*
  ========================================
  REHACER
  ========================================
  */

  function redo() {

    const canvas =
      canvasRef.current;

    if (!canvas)
      return;


    /*
    ----------------------------------------
    SI NO HAY NADA QUE REHACER
    ----------------------------------------
    */

    if (
      redoHistoryRef.current.length === 0
    ) {

      return;

    }


    /*
    ----------------------------------------
    GUARDAR ESTADO ACTUAL

    Esto permite volver a hacer Undo.
    ----------------------------------------
    */

    const currentState =
      canvas.toDataURL(
        "image/png"
      );


    historyRef.current.push(
      currentState
    );


    /*
    ----------------------------------------
    OBTENER ESTADO SIGUIENTE
    ----------------------------------------
    */

    const nextState =
      redoHistoryRef.current.pop();


    if (!nextState)
      return;


    /*
    ----------------------------------------
    RESTAURAR ESTADO
    ----------------------------------------
    */

    loadCanvasState(
      nextState
    );

  }


  /*
  ========================================
  EXPONER UNDO / REDO AL PADRE
  ========================================
  */

  useImperativeHandle(
  ref,
  () => ({
    undo,
    redo,
    download,
  }),
);


  /*
  ========================================
  INICIAR DIBUJO
  ========================================
  */

  function startDrawing(
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) {

    /*
    ----------------------------------------
    SI NO HAY HERRAMIENTA
    NO HACER NADA
    ----------------------------------------
    */

    if (mode === null) {

      return;

    }


    /*
    ----------------------------------------
    GUARDAR ESTADO ANTES
    DE MODIFICAR EL CANVAS
    ----------------------------------------
    */

    saveCurrentState();


    /*
    ----------------------------------------
    CAPTURAR PUNTERO
    ----------------------------------------
    */

    event.currentTarget.setPointerCapture(

      event.pointerId

    );


    /*
    ----------------------------------------
    ACTIVAR DIBUJO
    ----------------------------------------
    */

    setIsDrawing(true);


    /*
    ----------------------------------------
    PINTAR PRIMER PUNTO
    ----------------------------------------
    */

    paint(

      event,

      true

    );

  }


  /*
  ========================================
  TERMINAR DIBUJO
  ========================================
  */

  function stopDrawing(
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) {

    setIsDrawing(false);


    /*
    ----------------------------------------
    LIBERAR CAPTURA DEL PUNTERO
    ----------------------------------------
    */

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {

      event.currentTarget.releasePointerCapture(

        event.pointerId

      );

    }

  }


  /*
  ========================================
  RESTAURAR PARTE DE LA IMAGEN ORIGINAL
  ========================================
  */

  function restoreArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  const original =
    originalImageRef.current;

  const canvas =
    canvasRef.current;

  if (!original || !canvas) {
    return;
  }

  /*
  ========================================
  ESCALA ENTRE LA IMAGEN ORIGINAL
  Y EL CANVAS DEL RESULTADO
  ========================================
  */

  const scaleX =
    original.naturalWidth /
    canvas.width;

  const scaleY =
    original.naturalHeight /
    canvas.height;


  /*
  ========================================
  CALCULAR ZONA CORRESPONDIENTE
  EN LA IMAGEN ORIGINAL
  ========================================
  */

  const sourceX =
    (x - brushSize / 2) *
    scaleX;

  const sourceY =
    (y - brushSize / 2) *
    scaleY;


  const sourceWidth =
    brushSize *
    scaleX;

  const sourceHeight =
    brushSize *
    scaleY;


  /*
  ========================================
  CREAR CANVAS TEMPORAL
  ========================================
  */

  const tempCanvas =
    document.createElement(
      "canvas"
    );


  tempCanvas.width =
    brushSize;

  tempCanvas.height =
    brushSize;


  const tempCtx =
    tempCanvas.getContext(
      "2d"
    );


  if (!tempCtx) {
    return;
  }


  /*
  ========================================
  RECORTAR PARTE DE LA IMAGEN ORIGINAL
  ========================================
  */

  tempCtx.drawImage(

    original,

    sourceX,

    sourceY,

    sourceWidth,

    sourceHeight,

    0,

    0,

    brushSize,

    brushSize

  );


  /*
  ========================================
  CREAR MÁSCARA CIRCULAR
  ========================================
  */

  tempCtx.globalCompositeOperation =
    "destination-in";


  tempCtx.beginPath();


  tempCtx.arc(

    brushSize / 2,

    brushSize / 2,

    brushSize / 2,

    0,

    Math.PI * 2

  );


  tempCtx.fill();


  /*
  ========================================
  DIBUJAR RESTAURACIÓN
  ========================================
  */

  ctx.drawImage(

    tempCanvas,

    x -
      brushSize / 2,

    y -
      brushSize / 2

  );
}


  /*
  ========================================
  PINTAR
  ========================================
  */

  function paint(

    event:
      React.PointerEvent<HTMLCanvasElement>,

    force = false

  ) {

    /*
    ----------------------------------------
    SIN HERRAMIENTA
    ----------------------------------------
    */

    if (mode === null) {

      return;

    }


    /*
    ----------------------------------------
    EVITAR PINTAR SI NO ESTÁ DIBUJANDO
    ----------------------------------------
    */

    if (
      !isDrawing &&
      !force
    ) {

      return;

    }


    const canvas =
      canvasRef.current;


    if (!canvas)
      return;


    const ctx =
      canvas.getContext(
        "2d"
      );


    if (!ctx)
      return;


    /*
    ----------------------------------------
    OBTENER POSICIÓN
    ----------------------------------------
    */

    const position =
      getPosition(event);


    if (!position)
      return;


    /*
    ========================================
    BORRAR
    ========================================
    */

    if (
      mode === "erase"
    ) {

      ctx.save();


      /*
      ----------------------------------------
      TODO LO PINTADO SE VUELVE TRANSPARENTE
      ----------------------------------------
      */

      ctx.globalCompositeOperation =
        "destination-out";


      ctx.beginPath();


      ctx.arc(

        position.x,

        position.y,

        brushSize / 2,

        0,

        Math.PI * 2

      );


      ctx.fill();


      ctx.restore();

    }


    /*
    ========================================
    RESTAURAR
    ========================================
    */

    if (
      mode === "restore"
    ) {

      ctx.save();


      ctx.globalCompositeOperation =
        "source-over";


      restoreArea(

        ctx,

        position.x,

        position.y

      );


      ctx.restore();

    }

  }


  /*
  ========================================
  RENDER
  ========================================
  */

  function download() {
  const canvas =
    canvasRef.current;

  if (!canvas) {
    return;
  }

  canvas.toBlob(
    (blob) => {

      if (!blob) {
        return;
      }

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "imagen-sin-fondo.png";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        url
      );

    },
    "image/png"
  );
}

  return (

    <div
      className="editor-canvas-container"
    >

      <canvas

        ref={canvasRef}

        className="editor-canvas"

        style={{
          transform:
            `scale(${zoom / 100})`,
        }}

        onPointerDown={
          startDrawing
        }

        onPointerMove={

          isDrawing

            ? paint

            : undefined

        }

        onPointerUp={
          stopDrawing
        }

        onPointerCancel={
          stopDrawing
        }

      />

    </div>

  );

});


/*
========================================
NOMBRE DEL COMPONENTE
========================================
*/

EditorCanvas.displayName =
  "EditorCanvas";


/*
========================================
EXPORTAR
========================================
*/

export default EditorCanvas;