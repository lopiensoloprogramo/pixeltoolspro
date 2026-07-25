import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <h3>PixelTools Pro</h3>

          <p>
            Herramientas sencillas para trabajar
            con tus imágenes.
          </p>

        </div>


        <div className="footer-section">

          <h4>Herramientas</h4>

          <Link to="/">
            Eliminar fondo
          </Link>

          <Link to="/comprimir-imagen">
            Comprimir imagen
          </Link>

        </div>


        <div className="footer-section">

          <h4>Información</h4>

          <Link to="/sobre-nosotros">
            Sobre nosotros
          </Link>

          <Link to="/contacto">
            Contacto
          </Link>

          <Link to="/privacidad">
            Política de privacidad
          </Link>

          <Link to="/terminos">
            Términos y condiciones
          </Link>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 PixelTools Pro. Todos los derechos reservados.
        </p>

      </div>

    </footer>
  );
}