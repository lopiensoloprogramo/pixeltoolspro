import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
}

export default function Seo({
  title,
  description,
}: SEOProps) {

  useEffect(() => {

    // Título de la página
    document.title = title;


    // Meta description
    let metaDescription =
      document.querySelector(
        'meta[name="description"]'
      );


    // Si no existe, la creamos
    if (!metaDescription) {

      metaDescription =
        document.createElement("meta");

      metaDescription.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(
        metaDescription
      );

    }


    // Actualizamos la descripción
    metaDescription.setAttribute(
      "content",
      description
    );


  }, [
    title,
    description,
  ]);


  // SEO no renderiza nada visible
  return null;
}