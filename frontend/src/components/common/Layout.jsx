
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function Layout({ title, children, userType = 'Responsable' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Fonction pour basculer l'état du sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Détection de la taille de l'écran pour le responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint in Tailwind
      setIsMobile(mobile);
      
      // Fermer automatiquement le sidebar sur mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    // Initialisation
    handleResize();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', handleResize);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay pour fermer le sidebar sur mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} userType={userType} toggleSidebar={toggleSidebar} />
      
      {/* Contenu principal */}
      <div className="flex flex-col flex-grow">
        <Header title={title} toggleSidebar={toggleSidebar} />
        
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default Layout;