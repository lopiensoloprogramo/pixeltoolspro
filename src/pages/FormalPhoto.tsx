import { useState } from "react";

import Layout from "../components/layout/Layout";

import HeroSection from "../components/hero/HeroSection";

import UploadArea from "../components/upload/UploadArea";

import ToolInfo from "../components/toolinfo/ToolInfo";

import SeoComponent from "../components/SEO/SeoComponent";

import PhotoAnalysis
  from "../components/formalPhoto/PhotoAnalyzer";

import CropEditor
  from "../components/formalPhoto/CropEditor";


import { analyzeFace } 
  from "../services/faceLandmarker";


import type {
  FaceAnalysisResult,
} from "../services/faceLandmarker";


import {
  calculateAutoCrop,
} from "../services/autoCropper";


import type {
  AutoCropResult,
} from "../services/autoCropper";


import {
  base64ToFile,
} from "../services/imageToFile";


import {
  removeBackground,
} from "../services/backgroundRemoval";


import "./FormalPhoto.css";

import {
  cleanBackgroundEdges,
} from "../services/BackgroundCleaner";
import SuitGenerator from "../components/formalPhoto/SuitGenerator";
import EditorWorkspace from "../components/editor/EditorWorkspace";
export default function FormalPhoto() {


  const [image, setImage] =
    useState<string | null>(null);



  const [analysis, setAnalysis] =
    useState<FaceAnalysisResult | null>(null);



  const [loading, setLoading] =
    useState(false);



  const [error, setError] =
    useState("");


const [step, setStep] =
  useState<
    | "analysis"
    | "crop"
    | "background"
    | "editor"
    | "suit"
    | "result"
  >("analysis");



  const [crop, setCrop] =
    useState<AutoCropResult | null>(null);



  const [croppedImage, setCroppedImage] =
    useState<string | null>(null);



  const [backgroundRemoved, setBackgroundRemoved] =
    useState<string | null>(null);




  /*
  ========================================
  SELECCIONAR IMAGEN
  ========================================
  */


  async function handleSelect(
    file: File
  ) {


    setLoading(true);

    setError("");

    setAnalysis(null);

    setCrop(null);

    setCroppedImage(null);

    setBackgroundRemoved(null);

    setStep("analysis");



    const imageUrl =
      URL.createObjectURL(file);



    setImage(imageUrl);



    try {


      const result =
        await analyzeFace(file);



      setAnalysis(result);



    } catch(err){


      console.error(
        "Error al analizar:",
        err
      );


      setError(
        "No se pudo analizar la fotografía."
      );


    } finally {


      setLoading(false);


    }


  }




  /*
  ========================================
  NUEVA FOTO
  ========================================
  */


  function handleNewImage(){


    setImage(null);

    setAnalysis(null);

    setCrop(null);

    setCroppedImage(null);

    setBackgroundRemoved(null);

    setStep("analysis");

    setError("");


  }





  /*
  ========================================
  IR AL RECORTE
  ========================================
  */


  function handleContinue(){


    if(!analysis?.landmarks){

      return;

    }



    const cropArea =
      calculateAutoCrop(
        analysis.landmarks
      );



    setCrop(
      cropArea
    );


    setStep(
      "crop"
    );


  }





  /*
  ========================================
  RECORTE TERMINADO
  ========================================
  */


async function handleCropComplete(
  result:string
){

  setCroppedImage(result);


  try {

    setLoading(true);


    const file =
      await base64ToFile(result);


    const processed =
      await removeBackground(file);


    const blob =
      await processed.toBlob();


     const cleanBlob =
    await cleanBackgroundEdges(blob);

    const url =
    URL.createObjectURL(cleanBlob);

 setBackgroundRemoved(url);

setStep("editor");


  } catch(error){

    console.error(
      "Error quitando fondo:",
      error
    );

    setError(
      "No se pudo eliminar el fondo."
    );

  } finally {

    setLoading(false);

  }

}




  /*
  ========================================
  QUITAR FONDO
  ========================================
  */


  /*
  ========================================
  DESCARGAR RESULTADO
  ========================================
  */


  function handleDownload(){


    const finalImage =
      backgroundRemoved ||
      croppedImage ||
      image;



    if(!finalImage){

      return;

    }



    const link =
      document.createElement(
        "a"
      );


    link.href =
      finalImage;


    link.download =
      "foto-formal.png";


    link.click();


  }





  /*
  ========================================
  RENDER
  ========================================
  */


  return (

    <Layout>


      <SeoComponent
        title="Foto formal con IA gratis"
        description="Convierte tu foto en una imagen formal profesional usando inteligencia artificial."
      />



        <HeroSection
        badge="IA • Foto formal"
        title="Crea tu foto formal profesional"
        description="Convierte una foto normal en una imagen lista para CV, documentos o perfiles profesionales."
        />



      <main className="formal-photo-page">



        {
          !image && (

            <UploadArea
              onSelect={handleSelect}
            />

          )
        }




        {
          image && (


            <section className="formal-workspace">



              {
                loading && (

                  <div className="formal-loading">

                    Procesando imagen...

                  </div>

                )
              }




              {
                error && (

                  <div className="formal-error">

                    {error}

                  </div>

                )
              }





              {
                step === "analysis" && (


            <PhotoAnalysis

            image={image}

            message={
                analysis?.message ?? "Analizando rostro..."
            }

            valid={
                analysis?.valid ?? false
            }

            faceDetected={
                analysis?.faceDetected ?? false
            }

            faceSizeValid={
                analysis?.faceSizeValid ?? false
            }

            centered={
                analysis?.centered ?? false
            }

            frontal={
                analysis?.frontal ?? false
            }

            onContinue={
                handleContinue
            }

            onNewImage={
                handleNewImage
            }

            />


                )

              }






              {
                step === "crop" && crop && (


<CropEditor

  image={image}

  crop={crop}

  onComplete={
    handleCropComplete
  }

  onBack={() =>
    setStep(
      "analysis"
    )
  }

/>

                )

              }




{
  step === "editor" &&
  croppedImage &&
  backgroundRemoved && (

    <EditorWorkspace
      image={croppedImage}
      result={backgroundRemoved}
      onNewImage={handleNewImage}
      action="continue"
      onContinue={(editedImage) => {

        setBackgroundRemoved(editedImage);

        setStep("suit");

      }}
    />

  )
}

      {
  step === "background" && backgroundRemoved && (

    <section className="formal-result">

      <h2>
        Fondo eliminado correctamente
      </h2>


      <img

        src={backgroundRemoved}

        className="formal-result-image"

        alt="Foto sin fondo"

      />


      <div className="formal-actions">


        <button

          onClick={() => setStep("suit")}

          className="formal-download"

        >

          Aplicar traje

        </button>



        <button

          onClick={handleNewImage}

          className="formal-new"

        >

          Nueva foto

        </button>


      </div>

    </section>

  )
}
{
  step === "suit" && backgroundRemoved && (

    <SuitGenerator

      image={backgroundRemoved}

      onComplete={(result) => {

        setBackgroundRemoved(result);

        setStep("result");

      }}

    />

  )
}

{
  step === "result" && backgroundRemoved && (

    <section className="formal-result">

      <h2>
        ¡Tu foto formal está lista!
      </h2>


      <img

        src={backgroundRemoved}

        className="formal-result-image"

        alt="Foto formal generada"

      />


      <div className="formal-actions">

        <button

          onClick={handleDownload}

          className="formal-download"

        >

          Descargar foto

        </button>



        <button

          onClick={handleNewImage}

          className="formal-new"

        >

          Nueva foto

        </button>

      </div>

    </section>

  )
}





            </section>


          )
        }




      </main>




<ToolInfo

  description={
    <>
      <p>
        PixelTools Pro utiliza inteligencia artificial para ayudarte
        a crear una foto formal profesional. Analiza tu rostro,
        ajusta el encuadre automáticamente y elimina el fondo para
        obtener una imagen ideal para CV, documentos o perfiles.
      </p>
    </>
  }


  howToUse={[
    "Sube una fotografía clara de tu rostro.",
    "La inteligencia artificial analizará la posición y calidad de la imagen.",
    "Ajusta el recorte automático según tus necesidades.",
    "Elimina el fondo y descarga tu foto profesional."
  ]}


  benefits={[
    "Procesamiento automático con inteligencia artificial.",
    "No necesitas programas de edición.",
    "Resultado optimizado para perfiles profesionales.",
    "Tus imágenes se procesan directamente en el navegador."
  ]}


  faqs={[
    {
      question:
        "¿Sirve para fotos de CV?",
      answer:
        "Sí, la herramienta está pensada para crear fotos formales ideales para currículums, perfiles laborales y documentos."
    },

    {
      question:
        "¿La imagen se sube a algún servidor?",
      answer:
        "El procesamiento se realiza localmente cuando es posible, manteniendo mayor privacidad para tus fotografías."
    },

    {
      question:
        "¿Puedo usar cualquier foto?",
      answer:
        "Se recomienda una foto frontal, con buena iluminación y el rostro visible para obtener mejores resultados."
    }
  ]}

/>



    </Layout>

  );

}