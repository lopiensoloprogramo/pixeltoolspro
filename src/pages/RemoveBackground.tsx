import { useState } from "react";

import Layout from "../components/layout/Layout";

import HeroSection from "../components/hero/HeroSection";

import UploadArea from "../components/upload/UploadArea";

import EditorWorkspace from "../components/editor/EditorWorkspace";

import ToolInfo from "../components/toolinfo/ToolInfo";

import { removeBackground } from "../services/backgroundRemoval";

import "./RemoveBackground.css"
import Seo from "../components/SEO/Seo";

export default function RemoveBackground() {

  const [image, setImage] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
  ========================================
  SELECCIONAR IMAGEN
  ========================================
  */

  async function handleSelect(file: File) {

    setLoading(true);

    setError("");

    setResult(null);


    const imageUrl =
      URL.createObjectURL(file);

    setImage(imageUrl);


    try {

      const output =
        await removeBackground(file);


      const blob =
        await output.toBlob();


      const resultUrl =
        URL.createObjectURL(blob);


      setResult(resultUrl);

    } catch (err) {

      console.error(err);

      setError(
        "No se pudo eliminar el fondo."
      );

    } finally {

      setLoading(false);

    }

  }


  /*
  ========================================
  NUEVA IMAGEN
  ========================================
  */

  function handleNewImage() {

    setImage(null);

    setResult(null);

    setError("");

  }


  /*
  ========================================
  RENDER
  ========================================
  */



  return (

    <Layout>

   <Seo
      title="Eliminar fondo de imágenes con IA | PixelTools Pro"
      description="Elimina el fondo de tus imágenes con inteligencia artificial. Procesa tus imágenes desde el navegador, edita el resultado y descarga tu imagen fácilmente."
    />
      {/* ========================================
          HERO + SUBIR IMAGEN
      ======================================== */}

      {!image && (

        <>

          <HeroSection

            badge="🪄 ELIMINAR FONDO • IA LOCAL"

            title="Elimina el fondo de cualquier imagen"

            description="
              Procesamiento local con inteligencia artificial.
              Tus imágenes permanecen en tu dispositivo.
            "

          />


          <UploadArea

            onSelect={
              handleSelect
            }

          />

        </>

      )}



      {/* ========================================
          PROCESANDO IMAGEN
      ======================================== */}

        {loading && (

        <div className="processing">

            <div className="loading-spinner"></div>

            <p>
            Eliminando fondo...
            </p>

        </div>

        )}



      {/* ========================================
          ERROR
      ======================================== */}

      {error && (

        <p>
          {error}
        </p>

      )}



      {/* ========================================
          EDITOR
      ======================================== */}

      {image && result && (

        <EditorWorkspace

          image={image}

          result={result}

          onNewImage={
            handleNewImage
          }

        />

      )}



      {/* ========================================
          INFORMACIÓN DE LA HERRAMIENTA
      ======================================== */}

      <ToolInfo

        description={

          <>

            <p>

              Eliminar el fondo de una imagen permite
              separar el objeto o sujeto principal del
              resto de la fotografía. Esto puede ser
              útil para crear imágenes con fondo
              transparente, preparar fotografías de
              productos o utilizar imágenes en diseños
              y publicaciones.

            </p>


            <p>

              PixelTools Pro utiliza procesamiento
              mediante inteligencia artificial para
              identificar el sujeto principal de una
              imagen y eliminar el fondo. El objetivo
              es facilitar el proceso sin necesidad de
              utilizar programas complejos de edición
              de imágenes.

            </p>


            <p>

              Después de eliminar el fondo, puedes
              revisar el resultado y utilizar las
              herramientas disponibles en el editor
              para realizar ajustes antes de descargar
              tu imagen.

            </p>

          </>

        }


        howToUse={[

          "Selecciona la imagen de la que deseas eliminar el fondo.",

          "Espera mientras la inteligencia artificial procesa la imagen.",

          "Revisa el resultado generado y comprueba que el sujeto principal se haya identificado correctamente.",

          "Utiliza las herramientas de edición disponibles para corregir o restaurar partes de la imagen si es necesario.",

          "Descarga tu imagen cuando hayas terminado de editarla.",

        ]}


        benefits={[

          "Elimina el fondo de tus imágenes de forma sencilla.",

          "Puedes utilizar la herramienta para fotografías de productos, personas y otros objetos.",

          "El resultado puede utilizarse para diseños, presentaciones y publicaciones digitales.",

          "Incluye un editor para realizar ajustes después de eliminar el fondo.",

          "Puedes utilizar PixelTools Pro desde computadoras y dispositivos móviles compatibles.",

        ]}


        faqs={[

          {

            question:
              "¿Cómo funciona la eliminación de fondo?",

            answer:
              "La herramienta utiliza un modelo de inteligencia artificial para analizar la imagen e identificar el sujeto principal, intentando separar este elemento del fondo de la fotografía.",

          },


          {

            question:
              "¿La herramienta funciona con cualquier imagen?",

            answer:
              "El resultado puede variar dependiendo de la imagen. Fotografías con un sujeto claramente definido suelen ser más fáciles de procesar, mientras que imágenes con fondos complejos, sujetos pequeños o elementos superpuestos pueden requerir ajustes adicionales.",

          },


          {

            question:
              "¿Puedo corregir el resultado después de eliminar el fondo?",

            answer:
              "Sí. Después de procesar la imagen puedes utilizar las herramientas disponibles en el editor para borrar partes adicionales o restaurar zonas de la imagen original.",

          },


          {

            question:
              "¿Mis imágenes se envían a un servidor?",

            answer:
              "La herramienta está diseñada para realizar el procesamiento de inteligencia artificial de forma local en el dispositivo. Esto significa que el procesamiento se realiza directamente en el navegador compatible, sin necesidad de enviar la imagen a un servicio externo para realizar la eliminación del fondo.",

          },


          {

            question:
              "¿Puedo utilizar la herramienta desde mi celular?",

            answer:
              "Sí. PixelTools Pro está diseñado para funcionar en navegadores modernos de computadoras y dispositivos móviles compatibles. El rendimiento puede variar dependiendo de las capacidades del dispositivo y del tamaño de la imagen.",

          },

        ]}

      />


    </Layout>

  );

}