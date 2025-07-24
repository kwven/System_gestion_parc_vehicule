import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

const Sidebar = ({ userType = 'Responsable', isOpen = true, onToggle }) => {
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
      vehicule: {
        title: 'Véhicule',
        icon: Car,
        items: []
      },
      chauffeurs: {
        title: 'Chauffeurs',
        icon: Users,
        items: []
      },
    };

    switch (userType) {
      case 'Responsable':
        return {
          ...baseItems,
          dashboard: {
            ...baseItems.dashboard,
            items: [
              { name :'parc locale', icon: BarChart3, href: '/admin/dashboard' },
              { name: 'Tableau de bord', icon: BarChart3, href: '/admin/dashboard' },
            ]
          },
          deplacement :{
            ...baseItems.deplacement,
            items:[
              { name: 'Tous les déplacements', icon: List, href: '/admin/deplacements' },
            ]
          },
          vehicule: {
            ...baseItems.vehicule,
            items: [
              { name: 'Tous les véhicules', icon: List, href: '/admin/vehicules' },
            ]
          },
          chauffeurs: {
            ...baseItems.chauffeurs,
            items: [
              { name: 'Tous les chauffeurs', icon: List, href: '/admin/chauffeurs' },
            ]
          },

        };

      case 'chef de parc':
        return {
          ...baseItems,
          deplacement: {
            ...baseItems.deplacement,
            items: [
              { name: 'Mes déplacements', icon: List, href: '/admin/deplacements' },
              { name: 'Créer déplacement', icon: Plus, href: '/admin/deplacements/create' },
              { name: 'En attente de validation', icon: BarChart3, href: '/admin/deplacements/pending' }
            ]
          },
          vehicule: {
            ...baseItems.vehicule,
            items: [
              { name: 'Tous les véhicules', icon: List, href: '/admin/vehicules' },
              { name: 'Ajouter véhicule', icon: Plus, href: '/admin/vehicules/create' },
              { name: 'Maintenance', icon: Settings, href: '/admin/vehicules/maintenance' }
            ]
          },
          chauffeurs: {
            ...baseItems.chauffeurs,
            items: [
              { name: 'Tous les chauffeurs', icon: List, href: '/admin/chauffeurs' },
              { name: 'Ajouter chauffeur', icon: Plus, href: '/admin/chauffeurs/create' },
              { name: 'Supprimer chauffeur', icon: Edit, href: '/admin/chauffeurs/delete' }
            ]
          },
        };

      case 'chaufeur':
        return {
          ...baseItems,
          deplacement: {
            ...baseItems.deplacement,
            items: [
              { name: 'Mes missions', icon: List, href: '/driver/missions' },
              { name: 'Mission en cours', icon: MapPin, href: '/driver/current-mission' },
              { name: 'Historique', icon: Eye, href: '/driver/history' }
            ]
          },
          vehicule: {
            ...baseItems.vehicule,
            items: [
              { name: 'Mon véhicule', icon: Car, href: '/driver/vehicle' },
              { name: 'État du véhicule', icon: Settings, href: '/driver/vehicle/status' }
            ]
          },
        };
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (href) => {
    // Add your navigation logic here
    console.log('Navigating to:', href);
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-content">
        {/* User Type Badge */}
        <div className="user-type-badge">
          <span className="user-type-text">
            {userType === 'Responsable' ? 'Responsable' : 
             userType === 'Chauffeur' ? 'Chauffeur' : 
             userType === 'Chef de parc' ? 'Chef de parc' : 'Utilisateur'}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {Object.entries(menuItems).map(([key, section]) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSections[key];

            return (
              <div key={key} className="nav-section">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(key)}
                  className="section-header"
                >
                  <div className="section-header-content">
                    <IconComponent className="section-icon" />
                    {isOpen && (
                      <>
                        <span className="section-title">{section.title}</span>
                        {section.items.length > 0 && (
                          isExpanded ? 
                            <ChevronDown className="chevron-icon" /> : 
                            <ChevronRight className="chevron-icon" />
                        )}
                      </>
                    )}
                  </div>
                </button>

                {/* Section Items */}
                {isOpen && isExpanded && section.items.length > 0 && (
                  <div className="section-items">
                    {section.items.map((item, index) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleItemClick(item.href)}
                          className="nav-item"
                        >
                          <ItemIcon className="nav-item-icon" />
                          <span className="nav-item-text">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;