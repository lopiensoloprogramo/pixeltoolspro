import { useState } from "react";

import Layout from "../components/layout/Layout";

import HeroSection from "../components/hero/HeroSection";

import UploadArea from "../components/upload/UploadArea";

import EditorWorkspace from "../components/editor/EditorWorkspace";

import { removeBackground } from "../services/backgroundRemoval";


export default function RemoveBackground() {

  const [image, setImage] = useState<string | null>(null);

  const [result, setResult] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  async function handleSelect(file: File) {

    setLoading(true);

    setError("");

    setResult(null);


    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);


    try {

      const output = await removeBackground(file);

      const blob = await output.toBlob();

      const resultUrl = URL.createObjectURL(blob);

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


  


  function handleNewImage() {

    setImage(null);

    setResult(null);

    setError("");

  }


  return (

    <Layout>

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

            onSelect={handleSelect}

          />

        </>

      )}


      {loading && (

        <div className="processing">

          <p>

            Eliminando fondo...

          </p>

        </div>

      )}


      {error && (

        <p>

          {error}

        </p>

      )}


      {image && result && (

        <EditorWorkspace

          image={image}

          result={result}

          onNewImage={handleNewImage}

        />

      )}

    </Layout>

  );

}