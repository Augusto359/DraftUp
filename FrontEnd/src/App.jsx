import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/landingpage';
import UploadPage from './Pages/uploadpage';
import AnalyzingPage from './Pages/analyzing';
import AboutUs from './Pages/AboutUs';
import Viwer3D from './Pages/viewer3D';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        
        {/* Rota ajustada para bater com a navegação do AnalyzingPage */}
        <Route path="/viewer-3d" element={<Viwer3D />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;