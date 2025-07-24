import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-300 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Informations de l'entreprise */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Système de Gestion de Parc de Véhicules</h3>
            <p className="text-gray-400 text-sm">
              Solution complète pour la gestion de votre flotte de véhicules
            </p>
          </div>
        </div>
        {/* Ligne de séparation */}
        <hr className="border-gray-600 my-4" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Système de Gestion de Parc de Véhicules. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;