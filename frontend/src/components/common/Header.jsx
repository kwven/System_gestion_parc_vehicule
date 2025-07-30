import React, { useState } from 'react';
import { Bell, LogOut,User, Settings, ChevronDown, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ title, toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount] = useState(3); // Example notification count
  const location = useLocation();

  // Fonction pour obtenir le titre de la page en fonction de l'URL
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Mapping des chemins vers les titres
    const pathTitles = {
      '/': 'Accueil',
      '/dashboard': 'Tableau de bord',
      '/profile': 'Mon profil',
      '/settings': 'Paramètres',
      '/about': 'À propos',
      '/help': 'Aide',
      // Ajoutez d'autres mappings selon vos routes
    };
    
    // Retourne le titre correspondant au chemin ou le titre par défaut
    return pathTitles[path] || title || 'Tableau de bord';
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* Bouton de menu mobile et logo */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 mr-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Menu principal"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Logo à gauche (visible sur tous les écrans) */}
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo du système" className="h-8 w-auto" />
            </div>
          </div>

          {/* Titre centré */}
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-xl font-semibold text-gray-800 truncate text-center">
              {getPageTitle()}
            </h1>
          </div>
          
          {/* Espace vide à droite pour équilibrer le layout */}
          <div className="w-[88px]"></div>

          {/* Notifications et profil */}
          <div className="flex items-center space-x-3">
            {/* Menu profil */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="relative w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden border-2 border-white shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  John Dol
                </span>
                <ChevronDown 
                  className={`hidden md:block h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Menu déroulant du profil */}
              {isProfileOpen && (
                <>
                  {/* Overlay pour fermer le menu */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  
                  {/* Contenu du menu déroulant */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
                    </div>
                    
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Mon profil
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500" />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;