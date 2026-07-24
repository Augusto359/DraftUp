import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './Pages/landingpage';
import UploadPage from './Pages/uploadpage';

function App() {
  return (
  
    <BrowserRouter>
      

      <Routes>
        

        <Route path="/" element={<LandingPage />} />

    
        <Route path="/upload" element={<UploadPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;