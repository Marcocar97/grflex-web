import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import FindSupplierPage from "./pages/FindSupplierPage";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";
import DiscoverPage from "./pages/DiscoverPage";

function Layout({ children }) {
  const { pathname } = useLocation();
  const isDiscover = pathname === "/discover";

  return (
    <>
      {!isDiscover && <Navbar />}
      {children}
      {!isDiscover && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
    <Layout>

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/find-a-supplier" element={<FindSupplierPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
      </Routes>

      </Layout>
    </BrowserRouter>
  );
}

export default App;
