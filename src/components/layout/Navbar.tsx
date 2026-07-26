import "./Navbat.css";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <header className="navbar">

     <Link to="/">
            <div className="brand">

            <div className="brand-logo">

            <div className="logo-paper">

                <div className="logo-fold"></div>

                <div className="logo-image">

                <div className="logo-sun"></div>

                <div className="logo-mountain"></div>

                </div>

            </div>

            </div>


            <div className="brand-info">

            <h2 className="brand-name">
                PixelTools
            </h2>

            <span className="brand-tagline">
                Herramientas para imágenes
            </span>

            </div>

            </div>


    </Link>
      

      <nav className="navbar-links">

        <Link to="/">
        Inicio
        </Link>

         <Link to="/eliminar-fondo"  className={location.pathname === "/" ? "active" : ""}>
        Eliminar fondo
        </Link>

        <Link to="/comprimir-imagen" className={ location.pathname === "/comprimir-imagen"
            ? "active"
            : ""}>
        Comprimir
        </Link>

        <a href="#">
          Convertir
        </a>

        <a href="#">
          Blog
        </a>

        <a href="#">
          API
        </a>

      </nav>


    </header>
  );
  
}