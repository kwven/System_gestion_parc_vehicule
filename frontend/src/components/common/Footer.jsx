import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo et informations */}
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <h3 className="text-sm font-semibold text-blue-600">Système de Gestion de Parc de Véhicules</h3>
            <p className="text-gray-500 text-xs">
              Solution complète pour la gestion de votre flotte de véhicules
            </p>
          </div>

          {/* Copyright */}
          <div className="flex items-center text-xs text-gray-500">
            <p>© {currentYear} SGPV. Tous droits réservés.</p>
            <span className="inline-flex items-center mx-2">
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;