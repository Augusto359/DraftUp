import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/landingpage';
import UploadPage from './Pages/uploadpage';
import AnalyzingPage from './Pages/analyzing';
import AboutUs from './Pages/AboutUs';
import Viwer3D from './Pages/viewer3D';
import LoginPage from './Pages/loginpage';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/analyzing" element={<AnalyzingPage />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/viewer3d" element={<Viwer3D />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
