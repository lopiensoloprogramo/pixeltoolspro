
import Layout from "../components/layout/Layout";
import LegalPage from "../components/legal/LegalPage";
import SeoComponent from '../components/SEO/SeoComponent'

export default function Contact() {


  return (
    <Layout>
        <SeoComponent
        title="Contacto | PixelTools Pro"
        description="Ponte en contacto con PixelTools Pro para realizar consultas, informar problemas o enviar sugerencias sobre nuestras herramientas online."
        />

      <LegalPage title="Contacto">

        <p>
          <strong>Última actualización:</strong> 25 de julio de 2026
        </p>

        <h2>¿Necesitas ponerte en contacto con PixelTools Pro?</h2>

        <p>
          Si tienes alguna pregunta, sugerencia, has encontrado un problema con
          alguna de nuestras herramientas o quieres informarnos sobre algún
          inconveniente, puedes ponerte en contacto con nosotros.
        </p>

        <p>
          Valoramos los comentarios de nuestros usuarios y utilizamos sus
          sugerencias para mejorar PixelTools Pro.
        </p>


        <h2>¿Qué puedes consultar?</h2>

        <p>
          Puedes contactarnos para:
        </p>

        <ul>
          <li>Informar sobre errores o problemas técnicos.</li>
          <li>Enviar sugerencias para nuevas herramientas.</li>
          <li>Reportar problemas relacionados con el sitio.</li>
          <li>Realizar consultas sobre privacidad.</li>
          <li>
            Informar sobre contenido o problemas relacionados con nuestros
            servicios.
          </li>
        </ul>


        <h2>Escríbenos</h2>

        <p>
          Puedes ponerte en contacto con nosotros mediante el siguiente correo
          electrónico:
        </p>

        <p>
          <strong>Correo electrónico:</strong> cjeancito121212@gmail.com
        </p>

        <p>
          Intentaremos responder a las consultas en el menor tiempo posible.
        </p>


        <h2>Información importante</h2>

        <p>
          Cuando nos escribas, intenta incluir información suficiente para
          comprender tu consulta. Si estás reportando un problema técnico,
          puedes incluir el nombre de la herramienta utilizada y una descripción
          del problema.
        </p>

        <p>
          No envíes información personal innecesaria ni archivos que contengan
          datos sensibles.
        </p>


        <p>
          <strong>PixelTools Pro</strong>
        </p>

        <p>
          <strong>Sitio web:</strong> pixeltoolspro.com
        </p>

      </LegalPage>

    </Layout>
  );
}

