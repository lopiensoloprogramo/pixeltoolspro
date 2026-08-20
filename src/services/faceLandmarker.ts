import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";


/*
========================================
TIPOS
========================================
*/


export interface FaceAnalysisResult {

  valid: boolean;

  faceCount: number;

  faceDetected: boolean;

  frontal: boolean;

  faceSizeValid: boolean;

  centered: boolean;

  message: string;

  landmarks?: {

    x: number;

    y: number;

    z: number;

  }[];

  cropBox?: {

    x: number;

    y: number;

    width: number;

    height: number;

  };

}


/*
========================================
INSTANCIA DEL FACE LANDMARKER
========================================
*/


let faceLandmarker:
  FaceLandmarker | null = null;


/*
========================================
CREAR FACE LANDMARKER
========================================
*/


async function getFaceLandmarker() {


  if (faceLandmarker) {

    return faceLandmarker;

  }


  /*
  ========================================
  CARGAR WASM
  ========================================
  */


  const vision =
    await FilesetResolver.forVisionTasks(

      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"

    );


  /*
  ========================================
  CREAR FACE LANDMARKER
  ========================================
  */


  faceLandmarker =
    await FaceLandmarker.createFromOptions(

      vision,

      {

        baseOptions: {

          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",

        },


        runningMode:
          "IMAGE",


        numFaces:
          2,


        minFaceDetectionConfidence:
          0.5,


        minFacePresenceConfidence:
          0.5,


        minTrackingConfidence:
          0.5,


        outputFaceBlendshapes:
          true,


        outputFacialTransformationMatrixes:
          true,

      }

    );


  return faceLandmarker;

}


/*
========================================
ANALIZAR FOTOGRAFÍA
========================================
*/


export async function analyzeFace(

  file: File

): Promise<FaceAnalysisResult> {


  const detector =
    await getFaceLandmarker();


  /*
  ========================================
  CREAR IMAGEN
  ========================================
  */


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
    VALIDAR RESOLUCIÓN
    ========================================
    */


    if (

      image.width < 500 ||

      image.height < 500

    ) {


      return {

        valid: false,

        faceCount: 0,

        faceDetected: false,

        frontal: false,

        faceSizeValid: false,

        centered: false,

        message:
          "La fotografía tiene una resolución demasiado baja. Utiliza una imagen de mayor calidad.",

      };

    }


    /*
    ========================================
    DETECTAR ROSTRO
    ========================================
    */


    const result =
      detector.detect(image);


    const faces =
      result.faceLandmarks;


    const faceCount =
      faces.length;


    /*
    ========================================
    SIN ROSTRO
    ========================================
    */


    if (

      faceCount === 0

    ) {


      return {

        valid: false,

        faceCount: 0,

        faceDetected: false,

        frontal: false,

        faceSizeValid: false,

        centered: false,

        message:
          "No pudimos detectar un rostro. Utiliza una fotografía donde tu rostro sea claramente visible.",

      };

    }


    /*
    ========================================
    MÁS DE UNA PERSONA
    ========================================
    */


    if (

      faceCount > 1

    ) {


      return {

        valid: false,

        faceCount,

        faceDetected: true,

        frontal: false,

        faceSizeValid: false,

        centered: false,

        message:
          "Detectamos más de una persona. Utiliza una fotografía donde aparezca una sola persona.",

      };

    }


    /*
    ========================================
    LANDMARKS DEL ROSTRO
    ========================================
    */


    const landmarks =
      faces[0];


    /*
    ========================================
    CALCULAR LÍMITES DEL ROSTRO
    ========================================
    */


    const xs =
      landmarks.map(
        point => point.x
      );


    const ys =
      landmarks.map(
        point => point.y
      );


    const minX =
      Math.min(...xs);


    const maxX =
      Math.max(...xs);


    const minY =
      Math.min(...ys);


    const maxY =
      Math.max(...ys);


    const faceWidth =
      maxX - minX;


    const faceHeight =
      maxY - minY;





      
    /*
    ========================================
    VALIDAR TAMAÑO DEL ROSTRO
    ========================================
    */


    const faceSizeValid =

      faceWidth >= 0.15 &&

      faceHeight >= 0.15;


    /*
    ========================================
    VALIDAR CENTRADO
    ========================================
    */


    const faceCenterX =

      (minX + maxX) / 2;


    const faceCenterY =

      (minY + maxY) / 2;


    const centered =

      faceCenterX >= 0.25 &&

      faceCenterX <= 0.75 &&

      faceCenterY >= 0.15 &&

      faceCenterY <= 0.75;




        /*
        ========================================
        RECORTE IDEAL
        ========================================
        */

        const cropWidth =
        faceWidth * 2.0;

        const cropHeight =
        faceHeight * 2.8;

        const cropX =
        Math.max(
            0,
            faceCenterX - cropWidth / 2
        );

        const cropY =
        Math.max(
            0,
            faceCenterY - faceHeight * 0.9
        );









    /*
    ========================================
    ANALIZAR ORIENTACIÓN
    ========================================

    Utilizamos puntos clave:

    33  → ojo izquierdo
    263 → ojo derecho
    1   → nariz

    Comparamos la posición
    de la nariz respecto a los ojos.
    ========================================
    */


    const leftEye =
      landmarks[33];


    const rightEye =
      landmarks[263];


    const nose =
      landmarks[1];


    const eyeCenterX =

      (

        leftEye.x +

        rightEye.x

      ) / 2;


    const eyeDistance =

      Math.abs(

        rightEye.x -

        leftEye.x

      );


    const noseOffset =

      Math.abs(

        nose.x -

        eyeCenterX

      );


    /*
    ========================================
    CALCULAR ORIENTACIÓN
    ========================================
    */


    const frontalRatio =

      noseOffset /

      eyeDistance;


    const frontal =

      frontalRatio < 0.30;


    /*
    ========================================
    RESULTADO FINAL
    ========================================
    */


    const valid =

      faceSizeValid &&

      centered &&

      frontal;


    /*
    ========================================
    MENSAJES
    ========================================
    */


    let message = "";


    if (!faceSizeValid) {


      message =
        "Tu rostro aparece demasiado pequeño. Utiliza una fotografía más cercana donde se vean claramente tu cabeza y hombros.";


    }

    else if (!centered) {


      message =
        "Tu rostro no está correctamente centrado. Intenta utilizar una fotografía donde aparezcas más centrado.";


    }

    else if (!frontal) {


      message =
        "Parece que no estás mirando directamente hacia la cámara. Utiliza una fotografía tomada de frente.";


    }

    else {


      message =
        "Tu fotografía cumple con los requisitos iniciales. Puedes continuar.";

    }


    /*
    ========================================
    DEVOLVER RESULTADO
    ========================================
    */


return {

  valid,

  faceCount,

  faceDetected: true,

  frontal,

  faceSizeValid,

  centered,

  message,

  cropBox: {

    x: cropX,

    y: cropY,

    width: cropWidth,

    height: cropHeight,

  },

  landmarks:

    landmarks.map(point => ({

      x: point.x,

      y: point.y,

      z: point.z,

    })),

};


  } finally {


    URL.revokeObjectURL(

      imageUrl

    );

  }

}