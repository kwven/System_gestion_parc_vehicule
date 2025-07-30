import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Calendar, MapPin, Users, User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const AllDeplacement = ({userType}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deplacements, setDeplacements] = useState([]);
  const itemsPerPage = 4;

  // Données d'exemple - à remplacer par un appel API
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        isMission: false,
        destination: "Casablanca",
        chauffeur: "Ahmed Benali",
        participants: ["Mohamed Ali", "Fatima Zahra"],
        dateCreation: "2024-01-15",
        dateDepart: "2024-01-20",
        description: "Déplacement pour réunion d'affaires"
      },
      {
        id: 2,
        isMission: true,
        destination: "Rabat",
        chauffeur: "Youssef Alami",
        participants: ["Sara Bennani", "Omar Tazi", "Laila Mansouri"],
        dateCreation: "2024-01-16",
        dateDepart: "2024-01-22",
        description: "Mission officielle au ministère"
      },
      {
        id: 3,
        isMission: false,
        destination: "Marrakech",
        chauffeur: "Hassan Idrissi",
        participants: ["Nadia Berrada"],
        dateCreation: "2024-01-17",
        dateDepart: "2024-01-25",
        description: "Déplacement pour formation"
      },
      {
        id: 4,
        isMission: true,
        destination: "Fès",
        chauffeur: "Karim Ouali",
        participants: ["Rachid Amrani", "Zineb Fassi"],
        dateCreation: "2024-01-18",
        dateDepart: "2024-01-28",
        description: "Mission d'inspection"
      },
      {
        id: 5,
        isMission: false,
        destination: "Agadir",
        chauffeur: "Abdelkader Senhaji",
        participants: ["Meryem Cherkaoui", "Tarik Benkirane", "Aicha Lamrani"],
        dateCreation: "2024-01-19",
        dateDepart: "2024-01-30",
        description: "Déplacement pour conférence"
      },
      {
        id: 6,
        isMission: true,
        destination: "Tanger",
        chauffeur: "Mustapha Radi",
        participants: ["Khalid Benjelloun"],
        dateCreation: "2024-01-20",
        dateDepart: "2024-02-01",
        description: "Mission de contrôle"
      }
    ];
    setDeplacements(mockData);
  }, []);

  // Calcul de la pagination
  const totalPages = Math.ceil(deplacements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = deplacements.slice(startIndex, endIndex);

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

  const DeplacementCard = ({ deplacement }) => {
    return (
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-300">
        {/* En-tête avec type et destination */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              deplacement.isMission 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {deplacement.isMission ? 'Mission' : 'Déplacement'}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2 flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              {deplacement.destination}
            </h3>
          </div>
        </div>

        {/* Chauffeur */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Chauffeur:</span>
            <span className="ml-1">{deplacement.chauffeur}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-3">
          <div className="flex items-start text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 mt-0.5" />
            <div>
              <span className="font-medium">Participants:</span>
              <div className="ml-1 mt-1">
                {deplacement.participants.map((participant, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs mr-1 mb-1">
                    {participant}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Créé le:</span>
            <span className="ml-1">{formatDate(deplacement.dateCreation)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Départ:</span>
            <span className="ml-1">{formatDate(deplacement.dateDepart)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{deplacement.description}</p>
      </div>
    );
  };

  return (
    <Layout title="Tous les déplacements" userType={userType}>
      <div className="p-1">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tous les déplacements</h1>
          <p className="text-gray-600">Gestion des déplacements et missions</p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-2 mb-6">
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{deplacements.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Déplacements</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {deplacements.filter(d => !d.isMission).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Missions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {deplacements.filter(d => d.isMission).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des cartes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
          {currentItems.map((deplacement) => (
            <DeplacementCard key={deplacement.id} deplacement={deplacement} />
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
                  <span className="font-medium">{Math.min(endIndex, deplacements.length)}</span> sur{' '}
                  <span className="font-medium">{deplacements.length}</span> résultats
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

        {/* Message si aucun déplacement */}
        {deplacements.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun déplacement</h3>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllDeplacement;
