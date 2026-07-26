import { useState} from "react";

import Layout from "../components/layout/Layout";
import HeroSection from "../components/hero/HeroSection";
import UploadArea from "../components/upload/UploadArea";
import ToolInfo from "../components/toolinfo/ToolInfo";

import { compressImage } from "../services/imageCompression";

import "./CompressImage.css";
import SEO from '../components/SEO/Seo'

export default function CompressImage() {

  const [image, setImage] =
    useState<File | null>(null);

  const [compressed, setCompressed] =
    useState<File | null>(null);

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

    setImage(file);

    setCompressed(null);

    setError("");

    setLoading(true);


    try {

      const result =
        await compressImage(file);

      setCompressed(result);

    } catch (err) {

      console.error(err);

      setError(
        "No se pudo comprimir la imagen."
      );

    } finally {

      setLoading(false);

    }

  }


  /*
  ========================================
  DESCARGAR IMAGEN
  ========================================
  */

  function downloadImage() {

    if (!compressed)
      return;


    const url =
      URL.createObjectURL(
        compressed
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      `pixeltools-${compressed.name}`;


    link.click();


    URL.revokeObjectURL(
      url
    );

  }


  /*
  ========================================
  COMPRIMIR OTRA IMAGEN
  ========================================
  */

  function handleNewImage() {

    setImage(null);

    setCompressed(null);

    setError("");

  }


  /*
  ========================================
  FORMATEAR TAMAÑO
  ========================================
  */

  function formatSize(
    size: number
  ) {

    if (
      size <
      1024 * 1024
    ) {

      return (
        (size / 1024)
          .toFixed(2)
        + " KB"
      );

    }


    return (
      (size / 1024 / 1024)
        .toFixed(2)
      + " MB"
    );

  }


  /*
  ========================================
  PORCENTAJE DE COMPRESIÓN
  ========================================
  */

  function compressionPercentage() {

    if (
      !image ||
      !compressed
    ) {

      return 0;

    }


    return Math.round(

      (
        (
          image.size -
          compressed.size
        )
        /
        image.size
      )
      *
      100

    );

  }


  /*
  ========================================
  RENDER
  ========================================
  */

  return (

    <Layout>
    <SEO
        title="Comprimir imágenes online gratis | PixelTools Pro"
        description="Comprime imágenes online gratis y reduce su tamaño manteniendo una buena calidad. Optimiza tus imágenes fácilmente desde tu navegador con PixelTools Pro."
    />

      {/* ========================================
          HERO + SUBIR IMAGEN
      ======================================== */}

      {!image && (

        <>

          <HeroSection

            badge="🗜 COMPRESOR DE IMÁGENES"

            title="Comprime imágenes sin perder calidad"

            description="
              Reduce el tamaño de tus imágenes manteniendo
              una excelente calidad.
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
            Comprimiendo imagen...
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
          RESULTADO
      ======================================== */}

      {image &&
        compressed && (

        <div className="editor-workspace">


          <img

            src={
              URL.createObjectURL(
                compressed
              )
            }

            alt="Imagen comprimida"

          />


          <div>


            <p>

              <span className="correcto">

                Imagen comprimida correctamente

              </span>

            </p>


            <p>

              <br />

              Tamaño original:
              {" "}

              {formatSize(
                image.size
              )}

            </p>


            <p>

              Nuevo tamaño:

              {" "}

              {formatSize(
                compressed.size
              )}

              {" | "}

              Reducción:

              {" "}

              {compressionPercentage()}%

            </p>



            {/* ========================================
                BOTONES
            ======================================== */}

            <div className="compress-actions">


              <button

                className="
                  toolbar-button
                  download-button
                "

                onClick={
                  downloadImage
                }

              >

                ⬇

                <span>
                  Descargar
                </span>

              </button>



              <button

                className="
                  toolbar-button
                  new-image-button
                "

                onClick={
                  handleNewImage
                }

              >

                ↻

                <span>
                  Comprimir otra imagen
                </span>

              </button>


            </div>


          </div>


        </div>

      )}



      {/* ========================================
          INFORMACIÓN DE LA HERRAMIENTA
      ======================================== */}

      <ToolInfo

        description={

          <>

            <p>

              Comprimir una imagen permite reducir
              el tamaño del archivo para que ocupe
              menos espacio y sea más fácil de
              almacenar, compartir o utilizar en
              una página web.

            </p>


            <p>

              PixelTools Pro permite reducir el peso
              de tus imágenes directamente desde el
              navegador, buscando mantener un
              equilibrio entre el tamaño del archivo
              y la calidad visual.

            </p>

          </>

        }


        howToUse={[

          "Selecciona la imagen que deseas comprimir desde tu dispositivo.",

          "Espera mientras PixelTools Pro procesa la imagen.",

          "Revisa el tamaño original y el tamaño de la imagen comprimida.",

          "Descarga la imagen comprimida cuando estés satisfecho con el resultado.",

        ]}


        benefits={[

          "Reduce el tamaño de tus archivos de imagen.",

          "Facilita el envío de imágenes por correo y aplicaciones de mensajería.",

          "Ayuda a reducir el espacio utilizado por tus archivos.",

          "Puedes utilizar la herramienta desde computadoras y dispositivos móviles.",

        ]}


        faqs={[

          {

            question:
              "¿La imagen pierde calidad al comprimirse?",

            answer:
              "La compresión puede reducir ligeramente la calidad de una imagen dependiendo del nivel de compresión utilizado. PixelTools Pro busca mantener un equilibrio entre la reducción del tamaño del archivo y la calidad visual.",

          },


          {

            question:
              "¿Qué formatos de imagen puedo comprimir?",

            answer:
              "La herramienta está diseñada para trabajar con formatos de imagen compatibles con los navegadores modernos. Puedes seleccionar una imagen desde tu dispositivo para comprobar si es compatible.",

          },


          {

            question:
              "¿Por qué debería comprimir una imagen?",

            answer:
              "Una imagen más ligera ocupa menos espacio y puede ser más fácil de compartir o utilizar en sitios web y otros servicios digitales.",

          },


          {

            question:
              "¿Puedo utilizar PixelTools Pro desde mi celular?",

            answer:
              "Sí. PixelTools Pro está diseñado para funcionar desde navegadores modernos en computadoras, tablets y dispositivos móviles.",

          },

        ]}

      />


    </Layout>

  );

}