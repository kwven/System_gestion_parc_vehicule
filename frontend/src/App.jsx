import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importez vos pages ici
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/Home'; 
import Profile from './pages/auth/Profile'; 
import About from './pages/About';
import Help from './pages/Help';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
       <Route path="/about" element={<About />} />
       <Route path="/help" element={<Help />} />
      {/* Ajoutez d'autres routes ici au fur et à mesure du développement */}
    </Routes>
  );
}

export default App;