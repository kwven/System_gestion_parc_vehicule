import React, { useState, useEffect } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';

const ParcSelector = ({ onParcChange, selectedParc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parcs, setParcs] = useState([]);

  // Données d'exemple - à remplacer par un appel API
  useEffect(() => {
    const mockParcs = [
      { id: 1, nom: 'Parc Central Rabat', entite: 'secretariat generale', vehicules: 45 },
      { id: 2, nom: 'Parc Régional Casablanca', entite: 'Direction Régionale', vehicules: 32 },
      { id: 3, nom: 'Parc Provincial Fès', entite: 'Direction generale', vehicules: 28 },
      { id: 4, nom: 'Parc Local Marrakech', entite: 'Cabinet', vehicules: 19 }
    ];
    setParcs(mockParcs);
  }, []);

  const handleParcSelect = (parc) => {
    onParcChange(parc);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un parc
        </label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {selectedParc ? selectedParc.nom : 'Sélectionner un parc'}
                  </div>
                  {selectedParc && (
                    <div className="text-sm text-gray-500">
                      {selectedParc.entite} • {selectedParc.vehicules} véhicules
                    </div>
                  )}
                </div>
              </div>
              <ChevronDown 
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`} 
              />
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {parcs.map((parc) => (
                <button
                  key={parc.id}
                  onClick={() => handleParcSelect(parc)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                    selectedParc?.id === parc.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{parc.nom}</div>
                      <div className="text-sm text-gray-500">
                        {parc.entite} • {parc.vehicules} véhicules
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcSelector;