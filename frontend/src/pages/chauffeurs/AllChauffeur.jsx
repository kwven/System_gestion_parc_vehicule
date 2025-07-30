import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Calendar, MapPin, Users, User, ChevronLeft, ChevronRight} from 'lucide-react';

const AllChauffeur = ({userType}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [chauffeurs, setChauffeurs] = useState([]);
  const itemsPerPage = 4;

  // Données d'exemple - à remplacer par un appel API
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        nom: "Ahmed",
        prenom: "Alili",
        email: "ahmed.alili@example.com",
        numero_permis: "123456",
        type_permis: "A",
        date_expiration_permis: "2025-01-01",
        nombre_points: 10,
        date_affectation: "2024-01-01",
        est_actif: true,
      },
      {
        id: 2,
        nom: "Yassine",
        prenom: "Bouzid",
        email: "yassine.bouzid@example.com",
        numero_permis: "654321",
        type_permis: "B",
        date_expiration_permis: "2025-01-01",
        nombre_points: 15,
        date_affectation: "2024-01-02",
        est_actif: true,
      },
      {
        id: 3,
        nom: "Hicham",
        prenom: "El Fekry",
        email: "hicham.el-fekry@example.com",
        numero_permis: "111222",
        type_permis: "A",
        date_expiration_permis: "2025-01-01",
        nombre_points: 12,
        date_affectation: "2024-01-03",
        est_actif: true,
      },
      {
        id: 4,
        nom: "Ayoub",
        prenom: "El Moussa",
        email: "ayoub.el-moussa@example.com",
        numero_permis: "333444",
        type_permis: "A",
        date_expiration_permis: "2025-01-01",
        nombre_points: 18,
        date_affectation: "2024-01-04",
        est_actif: true,
      },
      {
        id: 5,
        nom: "Ismail",
        prenom: "El Haddadi",
        email: "ismail.el-haddadi@example.com",
        numero_permis: "555666",
        type_permis: "A",
        date_expiration_permis: "2025-01-01",
        nombre_points: 14,
        date_affectation: "2024-01-05",
        est_actif: true,
      },
      {
        id: 6,
        nom: "Nabil",
        prenom: "El Mhiri",
        email: "nabil.el-mhiri@example.com",
        numero_permis: "777888",
        type_permis: "A",
        date_expiration_permis: "2025-01-01",
        nombre_points: 16,
        date_affectation: "2024-01-06",
        est_actif: false,
      }
    ];
    setChauffeurs(mockData);
  }, []);

  // Calcul de la pagination
  const totalPages = Math.ceil(chauffeurs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = chauffeurs.slice(startIndex, endIndex);

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

  const ChauffeurCard = ({ chauffeur }) => {
    return (
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-300">
        {/* En-tête avec type et destination */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              chauffeur.est_actif
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {chauffeur.est_actif ? 'Actif' : 'Inactif'}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2 flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              {chauffeur.nom} {chauffeur.prenom}
            </h3>
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Email:</span>
            <span className="ml-1">{chauffeur.email}</span>
          </div>
        </div>
        {/* type_permis */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Type de permis:</span>
            <span className="ml-1">{chauffeur.type_permis}</span>
          </div>
        </div>
        {/* numero_permis */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Numero de permis:</span>
            <span className="ml-1">{chauffeur.numero_permis}</span>
          </div>
        </div>
        {/* date_expiration_permis */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">Date d'expiration:</span>
            <span className="ml-1">{formatDate(chauffeur.date_expiration_permis)}</span>
          </div>
        </div>
        {/* Date d'Acquisition */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Date d'affectation:</span>
            <span className="ml-1">{formatDate(chauffeur.date_affectation)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Tous les chauffeurs" userType={userType}>
      <div className="p-1">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tous les chauffeurs</h1>
          <p className="text-gray-600">Gestion des chauffeurs</p>
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
                <p className="text-2xl font-semibold text-gray-900">{chauffeurs.length}</p>
              </div>
            </div>
          </div>
            {/* chauffeur disponible*/}
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">disponible</p>
                <p className="text-2xl font-semibold text-gray-900">{chauffeurs.filter(v => v.est_actif).length}</p>
              </div>
            </div>
          </div>
          {/* chauffeur non disponible*/}
          <div className="bg-white p-3 rounded-2xl shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">non disponible</p>
                <p className="text-2xl font-semibold text-gray-900">{chauffeurs.filter(v => !v.est_actif).length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grille des cartes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
          {currentItems.map((chauffeur) => (
            <ChauffeurCard key={chauffeur.id} chauffeur={chauffeur} />
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
                  <span className="font-medium">{Math.min(endIndex,chauffeurs.length)}</span> sur{' '}
                  <span className="font-medium">{chauffeurs.length}</span> résultats
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

        {/* Message si aucun chauffeur */}
        {chauffeurs.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun chauffeur</h3>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllChauffeur;
