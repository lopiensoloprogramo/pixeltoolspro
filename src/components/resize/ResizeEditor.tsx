import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./ResizeEditor.css";


interface Props {

  image: string;

  onNewImage: () => void;

}


type AspectRatio =
  | "square"
  | "portrait"
  | "landscape"
  | "circle";


type BackgroundMode =
  | "transparent"
  | "color";


interface Preset {

  name: string;

  width: number;

  height: number;

  ratio: AspectRatio;

}


interface Platform {

  name: string;

  icon: string;

  presets: Preset[];

}


/*
========================================
PRESETS
========================================
*/

const platforms: Platform[] = [

  {
    name: "WhatsApp",

    icon: "💬",

    presets: [

      {
        name: "Foto de perfil",

        width: 500,

        height: 500,

        ratio: "circle",

      },

    ],

  },


  {
    name: "Instagram",

    icon: "📸",

    presets: [

      {
        name: "Foto de perfil",

        width: 320,

        height: 320,

        ratio: "circle",

      },

      {
        name: "Publicación cuadrada",

        width: 1080,

        height: 1080,

        ratio: "square",

      },

      {
        name: "Publicación vertical",

        width: 1080,

        height: 1350,

        ratio: "portrait",

      },

      {
        name: "Historia",

        width: 1080,

        height: 1920,

        ratio: "portrait",

      },

    ],

  },


  {
    name: "Facebook",

    icon: "📘",

    presets: [

      {
        name: "Foto de perfil",

        width: 320,

        height: 320,

        ratio: "circle",

      },

      {
        name: "Portada",

        width: 851,

        height: 315,

        ratio: "landscape",

      },

      {
        name: "Publicación",

        width: 1200,

        height: 630,

        ratio: "landscape",

      },

    ],

  },


  {
    name: "YouTube",

    icon: "▶️",

    presets: [

      {
        name: "Foto de perfil",

        width: 800,

        height: 800,

        ratio: "circle",

      },

      {
        name: "Miniatura",

        width: 1280,

        height: 720,

        ratio: "landscape",

      },

      {
        name: "Portada del canal",

        width: 2560,

        height: 1440,

        ratio: "landscape",

      },

    ],

  },


  {
    name: "Google",

    icon: "🔎",

    presets: [

      {
        name: "Foto de perfil",

        width: 720,

        height: 720,

        ratio: "circle",

      },

    ],

  },

];


export default function ResizeEditor({

  image,

  onNewImage,

}: Props) {


  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);


  const imageRef =
    useRef<HTMLImageElement | null>(null);


  /*
  ========================================
  ESTADOS
  ========================================
  */

  const [zoom, setZoom] =
    useState(1);


  const [position, setPosition] =
    useState({

      x: 0,

      y: 0,

    });


  const [aspectRatio, setAspectRatio] =
    useState<AspectRatio>("square");


  const [canvasSize, setCanvasSize] =
    useState({

      width: 500,

      height: 500,

    });


  const [selectedPlatform, setSelectedPlatform] =
    useState<string | null>(null);


  const [selectedPreset, setSelectedPreset] =
    useState<string | null>(null);


  /*
  ========================================
  FONDO
  ========================================
  */

  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("transparent");


  const [backgroundColor, setBackgroundColor] =
    useState("#ffffff");


  /*
  ========================================
  IMPORTANTE

  Indica si la imagen tiene transparencia.

  Si es true y se selecciona circular,
  hacemos que todo el contenido entre
  dentro del círculo.

  Si es false, NO alejamos automáticamente.
  ========================================
  */

  const [hasTransparency, setHasTransparency] =
    useState(false);


  /*
  ========================================
  ESCALA AUTOMÁTICA PARA CÍRCULO
  ========================================
  */

  const [circleFitScale, setCircleFitScale] =
    useState(1);


  const [isDragging, setIsDragging] =
    useState(false);


  const dragStartRef =
    useRef({

      x: 0,

      y: 0,

    });


  const positionStartRef =
    useRef({

      x: 0,

      y: 0,

    });


  /*
  ========================================
  DETECTAR TRANSPARENCIA DE LA IMAGEN
  ========================================
  */

  function detectImageTransparency(
    img: HTMLImageElement
  ) {

    /*
    ----------------------------------------
    Creamos un canvas pequeño.
    ----------------------------------------
    */

    const tempCanvas =
      document.createElement("canvas");


    const tempCtx =
      tempCanvas.getContext("2d");


    if (!tempCtx) {

      return false;

    }


    /*
    ----------------------------------------
    Reducimos la imagen para analizarla.
    ----------------------------------------
    */

    const size = 100;


    tempCanvas.width = size;

    tempCanvas.height = size;


    tempCtx.clearRect(

      0,

      0,

      size,

      size

    );


    tempCtx.drawImage(

      img,

      0,

      0,

      size,

      size

    );


    /*
    ----------------------------------------
    Revisamos los píxeles.
    ----------------------------------------
    */

    const imageData =
      tempCtx.getImageData(

        0,

        0,

        size,

        size

      );


    const data =
      imageData.data;


    /*
    ----------------------------------------
    Buscamos píxeles con alpha menor
    que 255.
    ----------------------------------------
    */

    for (

      let i = 3;

      i < data.length;

      i += 4

    ) {

      if (data[i] < 250) {

        return true;

      }

    }


    return false;

  }


  /*
  ========================================
  CARGAR IMAGEN
  ========================================
  */

  useEffect(() => {

    const img =
      new Image();


    img.onload = () => {

      imageRef.current =
        img;


      /*
      ----------------------------------------
      Detectar si la imagen tiene transparencia
      ----------------------------------------
      */

      const transparent =
        detectImageTransparency(img);


      setHasTransparency(
        transparent
      );


      /*
      ----------------------------------------
      Dibujar
      ----------------------------------------
      */

      drawCanvas();

    };


    img.src =
      image;


  }, [image]);


  /*
  ========================================
  CALCULAR ESCALA PARA IMAGEN TRANSPARENTE
  ========================================
  */

  function calculateCircleFitScale() {

    const img =
      imageRef.current;


    if (!img) {

      return 1;

    }


    /*
    ----------------------------------------
    Radio del círculo
    ----------------------------------------
    */

    const radius =
      Math.min(

        canvasSize.width,

        canvasSize.height

      ) / 2;


    /*
    ----------------------------------------
    Dejamos un pequeño margen.

    Esto evita que el contenido toque
    exactamente el borde.
    ----------------------------------------
    */

    const safeDiameter =
      radius * 2 * 0.92;


    /*
    ----------------------------------------
    Calculamos escala para que toda
    la imagen quepa dentro del círculo.

    Usamos contain.
    ----------------------------------------
    */

    const scale =
      Math.min(

        safeDiameter /
          img.naturalWidth,

        safeDiameter /
          img.naturalHeight

      );


    return scale;

  }


  /*
  ========================================
  CAMBIAR FORMATO
  ========================================
  */

  function changeAspectRatio(

    ratio: AspectRatio

  ) {

    setAspectRatio(ratio);

    setSelectedPreset(null);


    let width = 500;

    let height = 500;


    if (ratio === "portrait") {

      width = 400;

      height = 600;

    }


    if (ratio === "landscape") {

      width = 600;

      height = 400;

    }


    if (ratio === "circle") {

      width = 500;

      height = 500;

    }


    setCanvasSize({

      width,

      height,

    });


    setPosition({

      x: 0,

      y: 0,

    });


    /*
    ========================================
    AQUÍ ESTÁ EL CAMBIO IMPORTANTE

    SOLO al seleccionar circular.

    Si la imagen tiene transparencia,
    ajustamos automáticamente.

    Si NO tiene transparencia,
    dejamos escala 1.

    NO tocamos esto al cambiar el color.
    ========================================
    */

    if (

      ratio === "circle" &&

      hasTransparency

    ) {

      /*
      ----------------------------------------
      Usamos setTimeout porque canvasSize
      todavía no se ha actualizado.
      ----------------------------------------
      */

      setTimeout(() => {

        const scale =
          calculateCircleFitScale();


        if (scale > 0) {

          setCircleFitScale(scale);

        }

      }, 0);

    } else {

      setCircleFitScale(1);

    }

  }


  /*
  ========================================
  SELECCIONAR PLATAFORMA
  ========================================
  */

  function selectPlatform(

    platform: Platform

  ) {

    setSelectedPlatform(

      platform.name

    );


    setSelectedPreset(null);

  }


  /*
  ========================================
  SELECCIONAR PRESET
  ========================================
  */

  function selectPreset(

    preset: Preset

  ) {

    setSelectedPreset(

      preset.name

    );


    setAspectRatio(

      preset.ratio

    );


    setCanvasSize({

      width:
        preset.width,

      height:
        preset.height,

    });


    setPosition({

      x: 0,

      y: 0,

    });


    /*
    ----------------------------------------
    IMPORTANTE

    Al elegir un preset circular,
    hacemos el ajuste automático SOLO
    si la imagen es transparente.
    ----------------------------------------
    */

    if (

      preset.ratio === "circle" &&

      hasTransparency

    ) {

      setTimeout(() => {

        const scale =
          calculateCircleFitScale();


        setCircleFitScale(scale);

      }, 0);

    } else {

      setCircleFitScale(1);

    }

  }


  /*
  ========================================
  DIBUJAR CANVAS
  ========================================
  */

  function drawCanvas() {

    const canvas =
      canvasRef.current;


    const img =
      imageRef.current;


    if (!canvas || !img) {

      return;

    }


    const ctx =
      canvas.getContext("2d");


    if (!ctx) {

      return;

    }


    canvas.width =
      canvasSize.width;


    canvas.height =
      canvasSize.height;


    /*
    ========================================
    LIMPIAR
    ========================================
    */

    ctx.clearRect(

      0,

      0,

      canvas.width,

      canvas.height

    );


    /*
    ========================================
    CÍRCULO

    Todo lo que se dibuje aquí queda
    limitado al círculo.
    ========================================
    */

    if (

      aspectRatio === "circle"

    ) {

      ctx.save();


      ctx.beginPath();


      ctx.arc(

        canvas.width / 2,

        canvas.height / 2,

        Math.min(

          canvas.width,

          canvas.height

        ) / 2,

        0,

        Math.PI * 2

      );


      ctx.closePath();


      ctx.clip();


      /*
      ----------------------------------------
      FONDO DEL CÍRCULO
      ----------------------------------------
      */

      if (

        backgroundMode === "color"

      ) {

        ctx.fillStyle =
          backgroundColor;


        ctx.fillRect(

          0,

          0,

          canvas.width,

          canvas.height

        );

      }


      /*
      ----------------------------------------
      ESCALA DE LA IMAGEN
      ----------------------------------------

      Caso 1:
      Imagen transparente:
      usamos circleFitScale.

      Caso 2:
      Imagen normal:
      usamos cover.
      ----------------------------------------
      */

      let scale;


      if (

        hasTransparency

      ) {

        scale =
          circleFitScale *
          zoom;

      } else {

        scale =
          Math.max(

            canvas.width /
              img.naturalWidth,

            canvas.height /
              img.naturalHeight

          ) *
          zoom;

      }


      const imageWidth =
        img.naturalWidth *
        scale;


      const imageHeight =
        img.naturalHeight *
        scale;


      const x =
        (

          canvas.width -
          imageWidth

        ) / 2
        +
        position.x;


      const y =
        (

          canvas.height -
          imageHeight

        ) / 2
        +
        position.y;


      ctx.drawImage(

        img,

        x,

        y,

        imageWidth,

        imageHeight

      );


      ctx.restore();


      return;

    }


    /*
    ========================================
    FORMATOS RECTANGULARES
    ========================================
    */

    /*
    ----------------------------------------
    FONDO DE COLOR
    ----------------------------------------
    */

    if (

      backgroundMode === "color"

    ) {

      ctx.fillStyle =
        backgroundColor;


      ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

      );

    }


    /*
    ----------------------------------------
    COVER NORMAL
    ----------------------------------------
    */

    const scale =
      Math.max(

        canvas.width /
          img.naturalWidth,

        canvas.height /
          img.naturalHeight

      ) *
      zoom;


    const imageWidth =
      img.naturalWidth *
      scale;


    const imageHeight =
      img.naturalHeight *
      scale;


    const x =
      (

        canvas.width -
        imageWidth

      ) / 2
      +
      position.x;


    const y =
      (

        canvas.height -
        imageHeight

      ) / 2
      +
      position.y;


    ctx.drawImage(

      img,

      x,

      y,

      imageWidth,

      imageHeight

    );

  }


  /*
  ========================================
  ACTUALIZAR CANVAS
  ========================================
  */

  useEffect(() => {

    drawCanvas();

  }, [

    zoom,

    position,

    aspectRatio,

    canvasSize,

    backgroundMode,

    backgroundColor,

    circleFitScale,

    hasTransparency,

  ]);


  /*
  ========================================
  ZOOM IN
  ========================================
  */

  function zoomIn() {

    setZoom(

      previous =>

        Math.min(

          previous + 0.1,

          3

        )

    );

  }


  /*
  ========================================
  ZOOM OUT
  ========================================
  */

  function zoomOut() {

    setZoom(

      previous =>

        Math.max(

          previous - 0.1,

          0.05

        )

    );

  }


  /*
  ========================================
  RESTABLECER
  ========================================
  */

  function resetEditor() {

    setZoom(1);


    setPosition({

      x: 0,

      y: 0,

    });


    /*
    ----------------------------------------
    Si estamos en circular y la imagen
    es transparente, volvemos a calcular
    su escala inicial.
    ----------------------------------------
    */

    if (

      aspectRatio === "circle" &&

      hasTransparency

    ) {

      const scale =
        calculateCircleFitScale();


      setCircleFitScale(scale);

    } else {

      setCircleFitScale(1);

    }

  }


  /*
  ========================================
  ARRASTRE
  ========================================
  */

  function handlePointerDown(

    event:
      React.PointerEvent<HTMLCanvasElement>

  ) {

    setIsDragging(true);


    dragStartRef.current = {

      x:
        event.clientX,

      y:
        event.clientY,

    };


    positionStartRef.current = {

      x:
        position.x,

      y:
        position.y,

    };


    event.currentTarget.setPointerCapture(

      event.pointerId

    );

  }


  /*
  ========================================
  MOVER IMAGEN
  ========================================
  */

  function handlePointerMove(

    event:
      React.PointerEvent<HTMLCanvasElement>

  ) {

    if (!isDragging) {

      return;

    }


    const deltaX =
      event.clientX -
      dragStartRef.current.x;


    const deltaY =
      event.clientY -
      dragStartRef.current.y;


    setPosition({

      x:
        positionStartRef.current.x +
        deltaX,

      y:
        positionStartRef.current.y +
        deltaY,

    });

  }


  /*
  ========================================
  TERMINAR ARRASTRE
  ========================================
  */

  function handlePointerUp(

    event:
      React.PointerEvent<HTMLCanvasElement>

  ) {

    setIsDragging(false);


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
  DESCARGAR
  ========================================
  */

 /*
========================================
DESCARGAR IMAGEN
========================================
*/

function downloadImage() {

  const canvas =
    canvasRef.current;


  if (!canvas) {

    return;

  }


  /*
  ========================================
  SI ES CIRCULAR Y TRANSPARENTE
  ========================================
  */

  if (
    aspectRatio === "circle" &&
    backgroundMode === "transparent"
  ) {

    const exportCanvas =
      document.createElement("canvas");


    exportCanvas.width =
      canvas.width;

    exportCanvas.height =
      canvas.height;


    const ctx =
      exportCanvas.getContext("2d");


    if (!ctx) {

      return;

    }


    /*
    ----------------------------------------
    ASEGURAR TRANSPARENCIA
    ----------------------------------------
    */

    ctx.clearRect(

      0,

      0,

      exportCanvas.width,

      exportCanvas.height

    );


    /*
    ----------------------------------------
    CREAR CÍRCULO PERFECTO
    ----------------------------------------
    */

    const radius =
      Math.min(

        exportCanvas.width,

        exportCanvas.height

      ) / 2;


    ctx.save();


    ctx.beginPath();


    ctx.arc(

      exportCanvas.width / 2,

      exportCanvas.height / 2,

      radius,

      0,

      Math.PI * 2

    );


    ctx.closePath();


    ctx.clip();


    /*
    ----------------------------------------
    DIBUJAR EL CANVAS ORIGINAL
    ----------------------------------------
    */

    ctx.drawImage(

      canvas,

      0,

      0

    );


    ctx.restore();


    /*
    ----------------------------------------
    DESCARGAR
    ----------------------------------------
    */

    exportCanvas.toBlob(

      blob => {

        if (!blob) {

          return;

        }


        const url =
          URL.createObjectURL(blob);


        const link =
          document.createElement("a");


        link.href =
          url;


        let fileName =
          "pixeltools-imagen-circular";


        if (selectedPlatform) {

          fileName +=

            "-" +

            selectedPlatform
              .toLowerCase()
              .replace(
                /\s+/g,
                "-"
              );

        }


        if (selectedPreset) {

          fileName +=

            "-" +

            selectedPreset
              .toLowerCase()
              .replace(
                /\s+/g,
                "-"
              );

        }


        link.download =
          `${fileName}.png`;


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        URL.revokeObjectURL(url);

      },

      "image/png"

    );


    return;

  }


  /*
  ========================================
  DESCARGA NORMAL
  ========================================
  */

  canvas.toBlob(

    blob => {

      if (!blob) {

        return;

      }


      const url =
        URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href =
        url;


      let fileName =
        "pixeltools-imagen-redimensionada";


      if (selectedPlatform) {

        fileName +=

          "-" +

          selectedPlatform
            .toLowerCase()
            .replace(
              /\s+/g,
              "-"
            );

      }


      if (selectedPreset) {

        fileName +=

          "-" +

          selectedPreset
            .toLowerCase()
            .replace(
              /\s+/g,
              "-"
            );

      }


      link.download =
        `${fileName}.png`;


      document.body.appendChild(link);


      link.click();


      document.body.removeChild(link);


      URL.revokeObjectURL(url);

    },

    "image/png"

  );

}


  /*
  ========================================
  PLATAFORMA ACTUAL
  ========================================
  */

  const currentPlatform =
    platforms.find(

      platform =>

        platform.name ===
        selectedPlatform

    );


  /*
  ========================================
  RENDER
  ========================================
  */

  return (

    <div className="resize-editor">


      <div className="resize-editor-header">

        <h2>

          Ajusta tu imagen

        </h2>


        <p>

          Elige un tamaño para redes sociales,
          ajusta tu imagen y descarga el resultado.

        </p>

      </div>


      {/* PLATAFORMAS */}

      <div className="resize-platforms">

        <p className="resize-section-title">

          ¿Dónde vas a utilizar tu imagen?

        </p>


        <div className="resize-platform-list">

          {platforms.map(

            platform => (

              <button

                key={platform.name}

                className={

                  selectedPlatform ===
                  platform.name

                    ? "active"

                    : ""

                }

                onClick={() =>
                  selectPlatform(platform)

                }

              >

                <span>

                  {platform.icon}

                </span>


                {platform.name}

              </button>

            )

          )}

        </div>

      </div>


      {/* PRESETS */}

      {currentPlatform && (

        <div className="resize-presets">

          <p className="resize-section-title">

            Selecciona el formato

          </p>


          <div className="resize-preset-list">

            {currentPlatform.presets.map(

              preset => (

                <button

                  key={preset.name}

                  className={

                    selectedPreset ===
                    preset.name

                      ? "active"

                      : ""

                  }

                  onClick={() =>
                    selectPreset(preset)

                  }

                >

                  <strong>

                    {preset.name}

                  </strong>


                  <span>

                    {preset.width} ×{" "}

                    {preset.height} px

                  </span>

                </button>

              )

            )}

          </div>

        </div>

      )}


      {/* FORMATOS */}

      <div className="resize-formats">

        <p className="resize-section-title">

          O elige un formato

        </p>


        <button

          className={

            aspectRatio === "square" &&
            !selectedPreset

              ? "active"

              : ""

          }

          onClick={() =>
            changeAspectRatio("square")

          }

        >

          ⬜ Cuadrado

        </button>


        <button

          className={

            aspectRatio === "portrait" &&
            !selectedPreset

              ? "active"

              : ""

          }

          onClick={() =>
            changeAspectRatio("portrait")

          }

        >

          ▯ Vertical

        </button>


        <button

          className={

            aspectRatio === "landscape" &&
            !selectedPreset

              ? "active"

              : ""

          }

          onClick={() =>
            changeAspectRatio("landscape")

          }

        >

          ▭ Horizontal

        </button>


        <button

          className={

            aspectRatio === "circle" &&
            !selectedPreset

              ? "active"

              : ""

          }

          onClick={() =>
            changeAspectRatio("circle")

          }

        >

          ⭕ Circular

        </button>

      </div>


      {/* CANVAS */}

      <div className="resize-canvas-wrapper">

        <canvas

          ref={canvasRef}

          className="resize-canvas"

          onPointerDown={handlePointerDown}

          onPointerMove={handlePointerMove}

          onPointerUp={handlePointerUp}

          onPointerCancel={handlePointerUp}

        />

      </div>


      {/* ZOOM */}

      <div className="resize-controls">

        <button

          onClick={zoomOut}

          aria-label="Alejar imagen"

        >

          −

        </button>


        <span>

          {Math.round(zoom * 100)}%

        </span>


        <button

          onClick={zoomIn}

          aria-label="Acercar imagen"

        >

          +

        </button>

      </div>


      {/* FONDO */}

      <div className="resize-background">

        <p className="resize-section-title">

          Fondo del recorte

        </p>


        <div className="resize-background-options">

          <label>

            <input

              type="radio"

              name="backgroundMode"

              checked={

                backgroundMode ===
                "transparent"

              }

              onChange={() =>
                setBackgroundMode(

                  "transparent"

                )

              }

            />

            <span>

              Transparente

            </span>

          </label>


          <label>

            <input

              type="radio"

              name="backgroundMode"

              checked={

                backgroundMode ===
                "color"

              }

              onChange={() =>
                setBackgroundMode(

                  "color"

                )

              }

            />

            <span>

              Color de fondo

            </span>

          </label>

        </div>


        {backgroundMode === "color" && (

          <div className="resize-color-picker">

            <label htmlFor="background-color">

              Color de fondo:

            </label>


            <input

              id="background-color"

              type="color"

              value={backgroundColor}

              onChange={event =>
                setBackgroundColor(

                  event.target.value

                )

              }

            />


            <span>

              {backgroundColor}

            </span>

          </div>

        )}

      </div>


      {/* ACCIONES */}

      <div className="resize-actions">

        <button

          className="reset-button"

          onClick={resetEditor}

        >

          ↺ Restablecer

        </button>


        <button

          className="download-button"

          onClick={downloadImage}

        >

          ⬇ Descargar

        </button>


        <button

          className="new-image-button"

          onClick={onNewImage}

        >

          ↻ Nueva imagen

        </button>

      </div>


    </div>

  );

}