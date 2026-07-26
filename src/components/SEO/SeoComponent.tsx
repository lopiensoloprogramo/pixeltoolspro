import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
}

export default function SeoComponent({
  title,
  description,
  canonical,
  image,
}: SEOProps) {

  useEffect(() => {

    // ========================================
    // TÍTULO DE LA PÁGINA
    // ========================================

    document.title = title;


    // ========================================
    // META DESCRIPTION
    // ========================================

    let metaDescription =
      document.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement | null;


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


    metaDescription.setAttribute(
      "content",
      description
    );


    // ========================================
    // URL CANÓNICA
    // ========================================

    if (canonical) {

      let canonicalLink =
        document.querySelector(
          'link[rel="canonical"]'
        ) as HTMLLinkElement | null;


      if (!canonicalLink) {

        canonicalLink =
          document.createElement("link");

        canonicalLink.setAttribute(
          "rel",
          "canonical"
        );

        document.head.appendChild(
          canonicalLink
        );

      }


      canonicalLink.setAttribute(
        "href",
        canonical
      );

    }


    // ========================================
    // OPEN GRAPH
    // ========================================

    function setMetaProperty(
      property: string,
      content: string
    ) {

      let meta =
        document.querySelector(
          `meta[property="${property}"]`
        ) as HTMLMetaElement | null;


      if (!meta) {

        meta =
          document.createElement("meta");

        meta.setAttribute(
          "property",
          property
        );

        document.head.appendChild(
          meta
        );

      }


      meta.setAttribute(
        "content",
        content
      );

    }


    // Tipo de contenido
    setMetaProperty(
      "og:type",
      "website"
    );


    // Título
    setMetaProperty(
      "og:title",
      title
    );


    // Descripción
    setMetaProperty(
      "og:description",
      description
    );


    // URL
    if (canonical) {

      setMetaProperty(
        "og:url",
        canonical
      );

    }


    // Imagen
    if (image) {

      setMetaProperty(
        "og:image",
        image
      );

    }


  }, [
    title,
    description,
    canonical,
    image,
  ]);


  return null;
}