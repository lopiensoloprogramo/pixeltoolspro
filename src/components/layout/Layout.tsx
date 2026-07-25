import Navbar from "./Navbar";
import Footer from "./Footer";

import "./Layout.css";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>

      <Navbar />

      <main className="container">
        {children}
      </main>

      <Footer />

    </>
  );
}