import { useState } from "react";

import Layout from "../components/layout/Layout";
import HeroSection from "../components/hero/HeroSection";
import UploadArea from "../components/upload/UploadArea";
import ToolInfo from "../components/toolinfo/ToolInfo";
import ResizeEditor from "../components/resize/ResizeEditor";
import SEO from "../components/SEO/SeoComponent";



export default function ResizeImage() {

  const [image, setImage] =
    useState<string | null>(null);


  function handleSelect(file: File) {

    const imageUrl =
      URL.createObjectURL(file);

    setImage(imageUrl);

  }


  function handleNewImage() {

    if (image) {

      URL.revokeObjectURL(image);

    }

    setImage(null);

  }


  return (

    <Layout>

      <SEO

        title="Redimensionar y Recortar Imágenes Online | PixelTools Pro"

        description="Redimensiona, recorta y ajusta tus imágenes online. Cambia el tamaño para Instagram, WhatsApp, Facebook, YouTube y otras plataformas. Ajusta el zoom y la posición antes de descargar."

      />


      {!image && (

        <>

          <HeroSection

            badge="🖼️ REDIMENSIONAR Y RECORTAR IMÁGENES"

            title="Redimensiona y recorta tus imágenes para redes sociales fácilmente"

            description="
              Cambia el tamaño de tus imágenes, ajusta el zoom
              y recorta la parte que necesitas. Prepara tus fotos
              para redes sociales y otras plataformas.
            "

          />


          <UploadArea

            onSelect={
              handleSelect
            }

          />

        </>

      )}


      {image && (

        <ResizeEditor

          image={image}

          onNewImage={
            handleNewImage
          }

        />

      )}


      <ToolInfo

        description={

          <>

            <p>

              Redimensionar una imagen permite adaptar sus
              dimensiones para diferentes plataformas,
              redes sociales y necesidades digitales.

            </p>


            <p>

              Con PixelTools Pro puedes ajustar el tamaño
              de una imagen, modificar el nivel de zoom
              y mover la fotografía para seleccionar
              exactamente la zona que deseas conservar.

            </p>


            <p>

              La herramienta está diseñada para facilitar
              la preparación de imágenes para perfiles,
              publicaciones y otros formatos digitales,
              sin necesidad de utilizar programas complejos
              de edición.

            </p>

          </>

        }


        howToUse={[

          "Selecciona la imagen que deseas redimensionar.",

          "Elige el formato o tamaño que deseas utilizar.",

          "Utiliza el control de zoom para acercar o alejar la imagen.",

          "Arrastra la imagen para ajustar su posición dentro del área de recorte.",

          "Comprueba la vista previa del resultado.",

          "Descarga la imagen cuando hayas terminado.",

        ]}


        benefits={[

          "Redimensiona imágenes para diferentes formatos digitales.",

          "Permite acercar y alejar la imagen antes de recortarla.",

          "Puedes mover la imagen para seleccionar la zona que deseas conservar.",

          "Facilita la preparación de imágenes para redes sociales.",

          "Puedes descargar el resultado directamente desde el navegador.",

        ]}


        faqs={[

          {

            question:
              "¿Puedo alejar la imagen para evitar que se recorte?",

            answer:
              "Sí. Puedes utilizar el control de zoom para alejar la imagen y ajustar mejor la zona que deseas conservar dentro del área de recorte.",

          },


          {

            question:
              "¿Puedo mover la imagen dentro del recorte?",

            answer:
              "Sí. Puedes arrastrar la imagen para cambiar su posición y elegir qué parte de la fotografía aparece en el resultado final.",

          },


          {

            question:
              "¿Puedo utilizar la herramienta para redes sociales?",

            answer:
              "Sí. La herramienta está pensada para facilitar la preparación de imágenes para diferentes formatos utilizados en redes sociales y plataformas digitales.",

          },


          {

            question:
              "¿La imagen se sube a un servidor?",

            answer:
              "El procesamiento de la imagen se realiza directamente en el navegador. El archivo seleccionado se utiliza para generar el resultado en tu dispositivo.",

          },


          {

            question:
              "¿Puedo descargar la imagen después de redimensionarla?",

            answer:
              "Sí. Una vez que hayas ajustado el tamaño, el zoom y la posición de la imagen, podrás descargar el resultado.",

          },

        ]}

      />

    </Layout>

  );

}