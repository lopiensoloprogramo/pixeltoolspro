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
PRESETS DE REDES SOCIALES
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


  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("transparent");


  const [backgroundColor, setBackgroundColor] =
    useState("#ffffff");


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
  CARGAR IMAGEN
  ========================================
  */

  useEffect(() => {

    const img =
      new Image();


    img.onload = () => {

      imageRef.current =
        img;

      drawCanvas();

    };


    img.src =
      image;


  }, [image]);


  /*
  ========================================
  CAMBIAR FORMATO MANUAL
  ========================================
  */

function changeAspectRatio(
  ratio: AspectRatio
) {

  // 1. Quitamos SIEMPRE el preset seleccionado
  setSelectedPreset(null);

  // 2. Cambiamos el formato manual
  setAspectRatio(ratio);


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


  // Ajustar automáticamente la imagen
  // SOLO cuando entramos a circular
  if (
    ratio === "circle" &&
    aspectRatio !== "circle"
  ) {

    const img =
      imageRef.current;


    if (img) {

      const containScale =
        Math.min(

          width /
            img.naturalWidth,

          height /
            img.naturalHeight

        );


      const coverScale =
        Math.max(

          width /
            img.naturalWidth,

          height /
            img.naturalHeight

        );


      setZoom(

        Math.min(

          containScale /
            coverScale,

          1

        )

      );

    }

  }


  setCanvasSize({

    width,
    height,

  });


  setPosition({

    x: 0,
    y: 0,

  });

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


    /*
    ========================================
    SI LA PLATAFORMA SOLO TIENE UN PRESET
    SE SELECCIONA AUTOMÁTICAMENTE
    ========================================
    */

    if (

      platform.presets.length === 1

    ) {

      const preset =
        platform.presets[0];


      /*
      ----------------------------------------
      SELECCIONAR PRESET AUTOMÁTICAMENTE
      ----------------------------------------
      */

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
      SI ES CIRCULAR, AJUSTAR LA IMAGEN
      PARA QUE ENTRE COMPLETA
      ----------------------------------------
      */

      if (

        preset.ratio === "circle"

      ) {

        const img =
          imageRef.current;


        if (img) {

          const containScale =
            Math.min(

              preset.width /
                img.naturalWidth,

              preset.height /
                img.naturalHeight

            );


          const coverScale =
            Math.max(

              preset.width /
                img.naturalWidth,

              preset.height /
                img.naturalHeight

            );


          setZoom(

            Math.min(

              containScale /
                coverScale,

              1

            )

          );

        }

      }

      return;

    }


    /*
    ========================================
    SI TIENE VARIOS PRESETS
    NO SELECCIONAR NINGUNO
    ========================================
    */

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


    /*
    ========================================
    SI CAMBIAMOS A CIRCULAR DESDE OTRO
    FORMATO, AJUSTAMOS EL ZOOM UNA SOLA VEZ
    ========================================
    */

    if (

      preset.ratio === "circle" &&

      aspectRatio !== "circle"

    ) {

      const img =
        imageRef.current;


      if (img) {

        const containScale =
          Math.min(

            preset.width /
              img.naturalWidth,

            preset.height /
              img.naturalHeight

          );


        const coverScale =
          Math.max(

            preset.width /
              img.naturalWidth,

            preset.height /
              img.naturalHeight

          );


        setZoom(

          Math.min(

            containScale /
              coverScale,

            1

          )

        );

      }

    }


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
    LIMPIAR CANVAS
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
    FONDO DE COLOR
    ========================================
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
    ========================================
    ESCALA BASE
    ========================================
    */

    const scale =

      Math.max(

        canvas.width /
          img.naturalWidth,

        canvas.height /
          img.naturalHeight

      );


    const imageWidth =

      img.naturalWidth *
      scale *
      zoom;


    const imageHeight =

      img.naturalHeight *
      scale *
      zoom;


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


    /*
    ========================================
    CIRCULAR
    ========================================
    */

    if (

      aspectRatio === "circle"

    ) {

      const radius =

        Math.min(

          canvas.width,

          canvas.height

        ) / 2;


      ctx.save();


      ctx.beginPath();


      ctx.arc(

        canvas.width / 2,

        canvas.height / 2,

        radius,

        0,

        Math.PI * 2

      );


      ctx.closePath();


      ctx.clip();


      ctx.drawImage(

        img,

        x,
        y,

        imageWidth,
        imageHeight

      );


      ctx.restore();


    } else {

      /*
      ========================================
      FORMATOS RECTANGULARES
      ========================================
      */

      ctx.drawImage(

        img,

        x,
        y,

        imageWidth,
        imageHeight

      );

    }

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


    setBackgroundMode(

      "transparent"

    );


    setBackgroundColor(

      "#ffffff"

    );

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


  function handlePointerUp(

    event:
      React.PointerEvent<HTMLCanvasElement>

  ) {

    setIsDragging(false);


    if (

      event.currentTarget

        .hasPointerCapture(

          event.pointerId

        )

    ) {

      event.currentTarget

        .releasePointerCapture(

          event.pointerId

        );

    }

  }


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
    CIRCULAR + TRANSPARENTE
    ========================================
    */

    if (

      aspectRatio === "circle" &&

      backgroundMode === "transparent"

    ) {

      const exportCanvas =
        document.createElement(

          "canvas"

        );


      exportCanvas.width =
        canvas.width;


      exportCanvas.height =
        canvas.height;


      const ctx =
        exportCanvas.getContext(

          "2d"

        );


      if (!ctx) {

        return;

      }


      ctx.clearRect(

        0,
        0,
        exportCanvas.width,
        exportCanvas.height

      );


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


      ctx.drawImage(

        canvas,

        0,
        0

      );


      ctx.restore();


      exportCanvas.toBlob(

        blob => {

          if (!blob) {

            return;

          }


          downloadBlob(

            blob,

            "pixeltools-imagen-circular"

          );

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


        downloadBlob(

          blob,

          "pixeltools-imagen-redimensionada"

        );

      },

      "image/png"

    );

  }


  /*
  ========================================
  DESCARGAR BLOB
  ========================================
  */

  function downloadBlob(

    blob: Blob,

    baseName: string

  ) {

    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href =
      url;


    let fileName =
      baseName;


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


      <div className="resize-editor-layout">


        {/* ========================================
            PANEL IZQUIERDO
        ======================================== */}

        <aside className="resize-sidebar">


          {/* PLATAFORMAS */}

          <div className="resize-sidebar-section">

            <p className="resize-section-title">

              ¿Dónde vas a utilizar tu imagen?

            </p>


            <div className="resize-platform-list">

              {platforms.map(

                platform => (

                  <button

                    key={
                      platform.name
                    }

                    className={

                      selectedPlatform ===
                      platform.name

                        ? "active"

                        : ""

                    }

                    onClick={() =>
                      selectPlatform(

                        platform

                      )

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

            <div className="resize-sidebar-section resize-presets">

              <p className="resize-section-title">

                Formatos de {currentPlatform.name}

              </p>


              <div className="resize-preset-list">

                {currentPlatform.presets.map(

                  preset => (

                    <button

                      key={
                        preset.name
                      }

                      className={

                        selectedPreset ===
                        preset.name

                          ? "active"

                          : ""

                      }

                      onClick={() =>
                        selectPreset(

                          preset

                        )

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

          <div className="resize-sidebar-section">

            <p className="resize-section-title">

              Formato

            </p>


            <div className="resize-formats">


              <button
                className={
                    aspectRatio === "square" &&
                    selectedPreset === null
                    ? "active"
                    : ""
                }
                onClick={() =>
                    changeAspectRatio("square")
                }
                >
                ⬜
                <span>
                    Cuadrado
                </span>
                </button>


              <button

                className={
                aspectRatio === "portrait" &&
                selectedPreset === null
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeAspectRatio(

                    "portrait"

                  )

                }

              >

                ▯

                <span>

                  Vertical

                </span>

              </button>


              <button

                className={
                aspectRatio === "landscape" &&
                selectedPreset === null
                    ? "active"
                    : ""
                }

                onClick={() =>
                  changeAspectRatio(

                    "landscape"

                  )

                }

              >

                ▭

                <span>

                  Horizontal

                </span>

              </button>


              <button

                className={
                aspectRatio === "circle" &&
                selectedPreset === null
                    ? "active"
                    : ""
                }

                onClick={() =>
                  changeAspectRatio(

                    "circle"

                  )

                }

              >

                ⭕


                <span>

                  Circular

                </span>

              </button>


            </div>

          </div>


          {/* FONDO */}

          <div className="resize-sidebar-section">

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

                  Color:

                </label>


                <input

                  id="background-color"

                  type="color"

                  value={
                    backgroundColor
                  }

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

          <div className="resize-sidebar-actions">


            <button

              className="reset-button"

              onClick={
                resetEditor
              }

            >

              ↺ Restablecer

            </button>


            <button

              className="download-button"

              onClick={
                downloadImage
              }

            >

              ⬇ Descargar

            </button>


            <button

              className="new-image-button"

              onClick={
                onNewImage
              }

            >

              ↻ Nueva imagen

            </button>


          </div>


        </aside>


        {/* ========================================
            ÁREA DEL EDITOR
        ======================================== */}

        <main className="resize-workspace">


          <div className="resize-canvas-wrapper">

            <canvas

              ref={
                canvasRef
              }

              className="resize-canvas"

              onPointerDown={
                handlePointerDown
              }

              onPointerMove={
                handlePointerMove
              }

              onPointerUp={
                handlePointerUp
              }

              onPointerCancel={
                handlePointerUp
              }

            />

          </div>


          {/* ZOOM */}

          <div className="resize-controls">

            <button

              onClick={
                zoomOut
              }

              aria-label="Alejar imagen"

            >

              −

            </button>


            <span>

              {Math.round(

                zoom * 100

              )}%


            </span>


            <button

              onClick={
                zoomIn
              }

              aria-label="Acercar imagen"

            >

              +

            </button>

          </div>


          <p className="resize-workspace-hint">

            Arrastra la imagen para ajustar su posición

          </p>


        </main>


      </div>


    </div>

  );

}