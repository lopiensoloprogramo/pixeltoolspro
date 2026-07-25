import { BrowserRouter, Routes, Route } from "react-router-dom";

import RemoveBackground from "./pages/RemoveBackground";
import CompressImage from "./pages/CompressImage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<RemoveBackground />}
        />


        <Route
          path="/comprimir-imagen"
          element={<CompressImage />}
        />
        <Route
          path="/privacidad"
          element={<Privacy />}
        />
        <Route
          path="/terminos"
          element={<Terms />}
        />
        <Route
          path="/sobre-nosotros"
          element={<About />}
        />
        <Route
          path="/contacto"
          element={<Contact />}
        />
      </Routes>

    </BrowserRouter>

  );

}

export default App;