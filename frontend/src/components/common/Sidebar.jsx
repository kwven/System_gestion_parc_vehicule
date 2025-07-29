import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  Users, 
  MapPin, 
  ChevronDown, 
  ChevronRight,
  Plus,
  List,
  Edit,
  Eye,
  Settings,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Home
} from 'lucide-react';

const Sidebar = ({ userType = 'Responsable', isOpen = true, toggleSidebar }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Détecte si l'écran est mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  const [expandedSections, setExpandedSections] = useState({
    dashboard:false,
    deplacement: false,
    vehicule: false,
    chauffeurs: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Define menu items based on user type
  const getMenuItems = () => {
    // Définition des sections de base (templates)
    const baseItems = {
      dashboard: {
        title: 'Tableau de bord',
        icon: BarChart3,
        items: []
      },
      deplacement: {
        title: 'Déplacement',
        icon: MapPin,
        items: []
      },
      chauffeurs: {
        title: 'Chauffeurs',
        icon: Users,
        items: []
      },
      vehicule: {
        title: 'Véhicule',
        icon: Car,
        items: []
      }
    };
    switch (userType) {
      case 'Responsable':
        // Le responsable ne voit que le tableau de bord
        return {
          dashboard: {
            ...baseItems.dashboard,
            items: [
              { name: 'Tableau de bord local', icon: BarChart3, href: '/admin/dashboard' },
              { name: 'Tableau de bord global', icon: BarChart3, href: '/admin/dashboard/global' },
            ]
          }
        };

      case 'chef de parc':
        // Le chef de parc voit les déplacements, véhicules et chauffeurs
        return {
          deplacement: {
            ...baseItems.deplacement,
            items: [
              { name: 'Tous les déplacements', icon: List, href: '/all-deplacement' },
              { name: 'Créer déplacement', icon: Plus, href: '/create-deplacement' },
              { name: 'En attente de validation', icon: BarChart3, href: '/to-validate' }
            ]
          },
          vehicule: {
            ...baseItems.vehicule,
            items: [
              { name: 'Tous les véhicules', icon: List, href: '/all-vehicule' },
              { name: 'Ajouter véhicule', icon: Plus, href: '/create-vehicule' },
              { name: 'Gestion véhicule', icon: Edit, href: '/manage-vehicule' }
            ]
          },
          chauffeurs: {
            ...baseItems.chauffeurs,
            items: [
              { name: 'Tous les chauffeurs', icon: List, href: '/all-chauffeur' },
              { name: 'Ajouter chauffeur', icon: Plus, href: '/create-chauffeur' },
              { name: 'Gérer chauffeurs', icon: Edit, href: '/manage-chauffeur' }
            ]
          }
          // Pas de tableau de bord pour le chef de parc
        };

      case 'chauffeur':
        // Le chauffeur ne voit que la section déplacement
        return {
          deplacement: {
            ...baseItems.deplacement,
            items: [
              { name: 'Mes déplacements', icon: List, href: '/Ch-Deplacement' },
              { name: 'Formulaire trajet', icon: MapPin, href: '/fill-trajet' },
            ]
          }
        };
      default:
        // Par défaut, retourner un objet vide
        return {};
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (href) => {
    // Add your navigation logic here
    console.log('Navigating to:', href);
  };

  // Vérifie si un élément est actif en fonction de l'URL actuelle
  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === href;
    }
    // Pour les autres URLs, vérifie si le chemin actuel commence par l'URL de l'élément
    // Cela permet de garder un élément actif même dans les sous-pages
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Bouton de fermeture mobile */}
      {isMobile && isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100"
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out bg-white shadow-lg ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}
      >
      {/* En-tête de la sidebar */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-blue-600 text-white">
          <Link to="/" className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-white text-blue-600">
              <Home className="h-5 w-5" />
            </div>
            {isOpen && <span className="ml-2 font-semibold text-sm">Gestion Parc</span>}
          </Link>
          <button 
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition-colors"
            >
              {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </div>
      
      {/* Badge de type d'utilisateur */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${!isOpen && 'mx-auto'}`}>
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm">
              {userType === 'Responsable' ? 'R' : userType === 'chauffeur' ? 'C' : 'CP'}
            </span>
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate">
                {userType === 'Responsable' ? 'Responsable' : userType === 'chauffeur' ? 'Chauffeur' : 'Chef de parc'}
              </p>
              <p className="text-xs text-gray-500 truncate">Connecté</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Menu de navigation */}
      <nav className="flex-1 overflow-y-auto py-4 bg-gray-50">
        {/* Liens principaux */}
        <div className="px-3 mb-3">
          <Link 
            to="/profile" 
            className={`flex items-center px-4 py-2 mb-1 text-sm font-medium rounded-md ${isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200 ${!isOpen && 'justify-center'}`}
          >
            <Users className={`h-5 w-5 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-500'}`} />
            {isOpen && <span className="ml-3">Profil</span>}
          </Link>
          
        </div>

        {/* Sections du menu */}
        {Object.entries(menuItems).map(([key, section]) => {
          const IconComponent = section.icon;
          const isExpanded = expandedSections[key];
          
          return (
            <div key={key} className="mb-2">
              {/* En-tête de section */}
              <button
                onClick={() => toggleSection(key)}
                className={`flex items-center w-full px-4 py-2 text-left text-sm font-medium ${isExpanded ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200 ${!isOpen && 'justify-center'}`}
              >
                <IconComponent className={`h-5 w-5 ${isExpanded ? 'text-blue-600' : 'text-gray-500'}`} />
                {isOpen && (
                  <>
                    <span className="ml-3">{section.title}</span>
                    {section.items.length > 0 && (
                      <div className="ml-auto">
                        {isExpanded ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </div>
                    )}
                  </>
                )}
              </button>
              
              {/* Éléments de section */}
              {isOpen && isExpanded && section.items.length > 0 && (
                <div className="mt-1 space-y-1 pl-10">
                  {section.items.map((item, index) => {
                    const ItemIcon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={index}
                        to={item.href}
                        className={`flex items-center px-4 py-2 text-sm rounded-md ${active ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                      >
                        <ItemIcon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
              
              {/* Version condensée pour sidebar fermée */}
              {!isOpen && isExpanded && section.items.length > 0 && (
                <div className="mt-1 space-y-1">
                  {section.items.map((item, index) => {
                    const ItemIcon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={index}
                        to={item.href}
                        className={`flex items-center justify-center px-4 py-2 text-sm rounded-md ${active ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                      >
                        <ItemIcon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* Pied de la sidebar */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="space-y-3">
          <Link to="/settings" className={`flex items-center text-sm text-gray-700 hover:text-blue-600 ${!isOpen && 'justify-center'}`}>
            <Settings className="h-5 w-5" />
            {isOpen && <span className="ml-3">Paramètres</span>}
          </Link>
          
          <Link to="/logout" className={`flex items-center text-sm text-red-600 hover:text-red-700 ${!isOpen && 'justify-center'}`}>
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="ml-3">Déconnexion</span>}
          </Link>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;