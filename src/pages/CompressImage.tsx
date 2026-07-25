import { useState } from "react";

import Layout from "../components/layout/Layout";
import HeroSection from "../components/hero/HeroSection";
import UploadArea from "../components/upload/UploadArea";

import { compressImage } from "../services/imageCompression";

import "./CompressImage.css";


export default function CompressImage() {

  const [image, setImage] = useState<File | null>(null);

  const [compressed, setCompressed] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  async function handleSelect(file: File) {

    setImage(file);

    setCompressed(null);

    setError("");

    setLoading(true);


    try {

      const result = await compressImage(file);

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


  function downloadImage() {

    if (!compressed) return;


    const url = URL.createObjectURL(compressed);


    const link = document.createElement("a");

    link.href = url;

    link.download = `pixeltools-${compressed.name}`;


    link.click();


    URL.revokeObjectURL(url);

  }


  function handleNewImage() {

    setImage(null);

    setCompressed(null);

    setError("");

  }


function formatSize(size: number) {
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  }

  return (size / 1024 / 1024).toFixed(2) + " MB";
}


  function compressionPercentage() {

    if (!image || !compressed) {
      return 0;
    }


    return Math.round(

      ((image.size - compressed.size)
        / image.size) * 100

    );

  }


  return (

    <Layout>


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

            onSelect={handleSelect}

          />

        </>

      )}



      {loading && (

        <div className="processing">

          <p>
            Comprimiendo imagen...
          </p>

        </div>

      )}



      {error && (

        <p>
          {error}
        </p>

      )}



      {image && compressed && (

        <div className="editor-workspace">


          <img

            src={URL.createObjectURL(compressed)}

            alt="Imagen comprimida"

          />


                <div>

                    <p>
                    <span className="correcto">Imagen comprimida correctamente </span>
                    </p>
                    <p><br></br>
                    Tamaño original: {" "} {formatSize(image.size)} 
                    </p>

                    <p>
                    Nuevo tamaño:                  
                    {" "}
                    {formatSize(compressed.size)}|  Reducción:
                    {" "}
                    {compressionPercentage()}%
                    </p>



                    <div className="compress-actions">


                    <button

                        className="toolbar-button download-button"

                        onClick={downloadImage}

                    >
                        ⬇

                        <span>
                        Descargar
                        </span>

                    </button>



                    <button

                        className="toolbar-button new-image-button"

                        onClick={handleNewImage}

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


    </Layout>

  );

}