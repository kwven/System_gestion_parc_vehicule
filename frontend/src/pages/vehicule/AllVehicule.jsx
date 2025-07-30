import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Calendar, MapPin, Users, User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const AllVehicule = ({userType}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [vehicules, setVehicules] = useState([]);
  const itemsPerPage = 4;

  // Données d'exemple - à remplacer par un appel API
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        immatriculation: "123ABC",
        type: "Berline",
        marque: "Toyota",
        modele: "Camry",
        isDisponible: true,
        dateAcquisition: "2024-01-15",
        est_actif: true,
        kilometrage: "12000",
      },
      {
        id: 2,
        immatriculation: "456DEF",
        type: "Berline",
        marque: "Honda",
        modele: "CRV",
        isDisponible: true,
        dateAcquisition: "2024-01-16",
        est_actif: true,
        kilometrage: "15000",
      },
      {
        id: 3,
        immatriculation: "789GHI",
        type: "Moto",
        marque: "Yamaha",
        modele: "MT-07",
        isDisponible: true,
        dateAcquisition: "2024-01-17",
        est_actif: true,
        kilometrage: "18000",
      },
      {
        id: 4,
        immatriculation: "101JKL",
        type: "Berline",
        marque: "Nissan",
        modele: "Sentra",
        isDisponible: true,
        dateAcquisition: "2024-01-18",
        est_actif: true,
        kilometrage: "20000",
      },
      {
        id: 5,
        immatriculation: "321MNO",
        type: "Break",
        marque: "Skoda",
        modele: "Octavia",
        isDisponible: true,
        dateAcquisition: "2024-01-19",
        est_actif: true,
        kilometrage: "22000",
      },
      {
        id: 6,
        immatriculation: "654PQR",
        type: "Bus",
        marque: "Hyundai",
        modele: "Elantra",
        isDisponible: false,
        dateAcquisition: "2024-01-20",
        est_actif: true,
        kilometrage: "24000",
      }
    ];
    setVehicules(mockData);
  }, []);

  // Calcul de la pagination
  const totalPages = Math.ceil(vehicules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = vehicules.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const VehiculeCard = ({ vehicule }) => {
    return (
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-300">
        {/* En-tête avec type et destination */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              vehicule.isDisponible 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {vehicule.isDisponible ? 'Disponible' : 'Non Disponible'}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2 flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              {vehicule.type}
            </h3>
          </div>
        </div>

        {/* Marque */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Marque:</span>
            <span className="ml-1">{vehicule.marque}</span>
          </div>
        </div>
        {/* Modele */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Modele:</span>
            <span className="ml-1">{vehicule.modele}</span>
          </div>
        </div>
        {/* Kilometrage */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Kilometrage:</span>
            <span className="ml-1">{vehicule.kilometrage}</span>
          </div>
        </div>

        {/* est actif */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">est actif:</span>
            <span className="ml-1">{vehicule.est_actif ? 'Oui' : 'Non'}</span>
          </div>
        </div>
        {/* Date d'Acquisition */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Date d'Acquisition:</span>
            <span className="ml-1">{formatDate(vehicule.dateAcquisition)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Tous les vehicules" userType={userType}>
      <div className="p-1">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tous les vehicules</h1>
          <p className="text-gray-600">Gestion des vehicules</p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-2 mb-6">
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">totale</p>
                <p className="text-2xl font-semibold text-gray-900">{vehicules.length}</p>
              </div>
            </div>
          </div>
            {/*vehicule disponible*/}
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">disponible</p>
                <p className="text-2xl font-semibold text-gray-900">{vehicules.filter(v => v.isDisponible).length}</p>
              </div>
            </div>
          </div>
          {/*vehicule non disponible*/}
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">non disponible</p>
                <p className="text-2xl font-semibold text-gray-900">{vehicules.filter(v => !v.isDisponible).length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grille des cartes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
          {currentItems.map((vehicule) => (
            <VehiculeCard key={vehicule.id} vehicule={vehicule} />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(endIndex, vehicules.length)}</span> sur{' '}
                  <span className="font-medium">{vehicules.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Message si aucun vehicule */}
        {vehicules.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun vehicule</h3>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllVehicule;
