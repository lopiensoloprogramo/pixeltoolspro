import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";


let faceDetector: FaceDetector | null = null;


async function getFaceDetector() {

  if (faceDetector) {
    return faceDetector;
  }


const vision =
  await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );


  faceDetector =
    await FaceDetector.createFromOptions(

      vision,

      {

        baseOptions: {

          modelAssetPath:
            "/models/face_detector.task",

          delegate: "GPU",

        },


        runningMode: "IMAGE",


        minDetectionConfidence: 0.5,

      }

    );


  return faceDetector;

}


/*
========================================
TIPO DEL RESULTADO
========================================
*/


export interface PhotoAnalysisResult {

  valid: boolean;

  faceDetected: boolean;

  faceCount: number;

  isFrontal: boolean;

  resolutionOk: boolean;

  message: string;

  faceBox?: {

    x: number;

    y: number;

    width: number;

    height: number;

  };

}


/*
========================================
ANALIZAR FOTOGRAFÍA
========================================
*/


export async function analyzePhoto(

  file: File

): Promise<PhotoAnalysisResult> {


  const detector =
    await getFaceDetector();


  const imageUrl =
    URL.createObjectURL(file);


  const image =
    new Image();


  try {


    image.src =
      imageUrl;


    await new Promise<void>(

      (resolve, reject) => {


        image.onload =
          () => resolve();


        image.onerror =
          () => reject(

            new Error(
              "No se pudo cargar la imagen."
            )

          );


      }

    );


    /*
    ========================================
    RESOLUCIÓN
    ========================================
    */


    const resolutionOk =

      image.width >= 500 &&

      image.height >= 500;


    if (!resolutionOk) {


      return {

        valid: false,

        faceDetected: false,

        faceCount: 0,

        isFrontal: false,

        resolutionOk: false,

        message:
          "La imagen tiene una resolución demasiado baja. Utiliza una foto de mayor calidad.",

      };

    }


    /*
    ========================================
    DETECTAR ROSTROS
    ========================================
    */


    const result =
      detector.detect(image);


    const detections =
      result.detections;


    const faceCount =
      detections.length;


    /*
    ========================================
    SIN ROSTRO
    ========================================
    */


    if (faceCount === 0) {


      return {

        valid: false,

        faceDetected: false,

        faceCount: 0,

        isFrontal: false,

        resolutionOk: true,

        message:
          "No pudimos detectar un rostro. Utiliza una fotografía donde tu rostro sea claramente visible.",

      };

    }


    /*
    ========================================
    VARIOS ROSTROS
    ========================================
    */


    if (faceCount > 1) {


      return {

        valid: false,

        faceDetected: true,

        faceCount,

        isFrontal: false,

        resolutionOk: true,

        message:
          "Detectamos más de una persona. Utiliza una fotografía donde aparezca una sola persona.",

      };

    }


    /*
    ========================================
    ROSTRO DETECTADO
    ========================================
    */


    const detection =
      detections[0];


    const boundingBox =
      detection.boundingBox;


    if (!boundingBox) {


      return {

        valid: false,

        faceDetected: true,

        faceCount: 1,

        isFrontal: false,

        resolutionOk: true,

        message:
          "No pudimos determinar correctamente la posición del rostro.",

      };

    }


    const faceBox = {

      x:
        boundingBox.originX,

      y:
        boundingBox.originY,

      width:
        boundingBox.width,

      height:
        boundingBox.height,

    };


    /*
    ========================================
    TAMAÑO DEL ROSTRO
    ========================================
    */


    const faceArea =

      faceBox.width *

      faceBox.height;


    const imageArea =

      image.width *

      image.height;


    const faceRatio =

      faceArea /

      imageArea;


    /*
    ROSTRO MUY PEQUEÑO
    */


    if (faceRatio < 0.02) {


      return {

        valid: false,

        faceDetected: true,

        faceCount: 1,

        isFrontal: false,

        resolutionOk: true,

        faceBox,

        message:
          "El rostro aparece demasiado lejos. Utiliza una foto donde la cabeza y los hombros sean claramente visibles.",

      };

    }


    /*
    ROSTRO MUY GRANDE
    */


    if (faceRatio > 0.65) {


      return {

        valid: false,

        faceDetected: true,

        faceCount: 1,

        isFrontal: false,

        resolutionOk: true,

        faceBox,

        message:
          "El rostro está demasiado cerca de la cámara. Utiliza una fotografía donde también se vean los hombros.",

      };

    }


    /*
    ========================================
    FOTO APROBADA
    ========================================
    */


    return {

      valid: true,

      faceDetected: true,

      faceCount: 1,

      isFrontal: true,

      resolutionOk: true,

      faceBox,

      message:
        "Tu fotografía cumple con los requisitos básicos.",

    };


  } finally {


    URL.revokeObjectURL(

      imageUrl

    );


  }

}