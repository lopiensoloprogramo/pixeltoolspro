import { BrowserRouter, Routes, Route } from "react-router-dom";

import RemoveBackground from "./pages/RemoveBackground";
import CompressImage from "./pages/CompressImage";


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

      </Routes>

    </BrowserRouter>

  );

}

export default App;