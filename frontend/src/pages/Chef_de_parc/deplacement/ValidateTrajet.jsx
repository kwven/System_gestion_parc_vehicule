import React, { useState, useEffect } from 'react';
import Layout from '../../../components/common/Layout';
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Eye, 
  Car, 
  User, 
  MapPin, 
  Clock, 
  Fuel, 
  Route, 
  CreditCard,
  Calendar,
  Save,
  X,
  Building
} from 'lucide-react';

const ValidateTrajet = ({ userType = 'chef de parc' }) => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState('tous'); // tous, en_attente, valide, rejete
  const [selectedParc, setSelectedParc] = useState('tous');

  // Liste des parcs disponibles
  const parcs = [
    { id: 1, nom: 'Parc Casablanca', location: 'Casablanca' },
    { id: 2, nom: 'Parc Rabat', location: 'Rabat' },
    { id: 3, nom: 'Parc Marrakech', location: 'Marrakech' }
  ];

  // Mock data - Remplacer par des appels API réels
  useEffect(() => {
    const mockTrajets = [
      {
        id: 1,
        chauffeurNom: 'Ahmed Benali',
        chauffeurId: 1,
        vehicule: 'Toyota Corolla - ABC123',
        destination: 'Rabat - Casablanca',
        dateDepart: '2024-01-20',
        heureDepart: '08:00',
        dateFin: '2024-01-20',
        heureFin: '12:30',
        kilometrageDepart: 45230,
        kilometrageArrivee: 45320,
        kilometrageParcouru: 90,
        carburantDepart: 45,
        carburantArrivee: 35,
        carburantConsomme: 10,
        peages: 25,
        autresDepenses: 15,
        statut: 'en_attente',
        dateCreation: '2024-01-20T12:35:00',
        parcId: 1
      },
      {
        id: 2,
        chauffeurNom: 'Hassan Alami',
        chauffeurId: 2,
        vehicule: 'Peugeot 308 - DEF456',
        destination: 'Casablanca - Marrakech',
        dateDepart: '2024-01-19',
        heureDepart: '07:30',
        dateFin: '2024-01-19',
        heureFin: '11:45',
        kilometrageDepart: 67890,
        kilometrageArrivee: 68130,
        kilometrageParcouru: 240,
        carburantDepart: 50,
        carburantArrivee: 28,
        carburantConsomme: 22,
        peages: 45,
        autresDepenses: 30,
        statut: 'valide',
        dateCreation: '2024-01-19T11:50:00',
        parcId: 2
      },
      {
        id: 3,
        chauffeurNom: 'Omar Tazi',
        chauffeurId: 3,
        vehicule: 'Renault Clio - GHI789',
        destination: 'Rabat - Fès',
        dateDepart: '2024-01-18',
        heureDepart: '09:00',
        dateFin: '2024-01-18',
        heureFin: '13:15',
        kilometrageDepart: 23450,
        kilometrageArrivee: 23650,
        kilometrageParcouru: 200,
        carburantDepart: 40,
        carburantArrivee: 22,
        carburantConsomme: 18,
        peages: 35,
        autresDepenses: 20,
        statut: 'en_attente',
        dateCreation: '2024-01-18T13:20:00',
        parcId: 3
      },
      {
        id: 4,
        chauffeurNom: 'Youssef Alami',
        chauffeurId: 4,
        vehicule: 'Dacia Logan - JKL012',
        destination: 'Casablanca - Agadir',
        dateDepart: '2024-01-16',
        heureDepart: '06:00',
        dateFin: '2024-01-16',
        heureFin: '09:30',
        kilometrageDepart: 15000,
        kilometrageArrivee: 15280,
        kilometrageParcouru: 280,
        carburantDepart: 50,
        carburantArrivee: 18,
        carburantConsomme: 32,
        peages: 40,
        autresDepenses: 25,
        statut: 'en_attente',
        dateCreation: '2024-01-16T09:35:00',
        parcId: 1
      }
    ];
    
    setTimeout(() => {
      setTrajets(mockTrajets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTrajets = trajets.filter(trajet => {
    const statusMatch = filter === 'tous' || trajet.statut === filter;
    const parcMatch = selectedParc === 'tous' || trajet.parcId === parseInt(selectedParc);
    return statusMatch && parcMatch;
  });

  const getParcName = (parcId) => {
    const parc = parcs.find(p => p.id === parcId);
    return parc ? parc.nom : 'Parc inconnu';
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'valide':
        return 'bg-green-100 text-green-800';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'valide':
        return 'Validé';

      default:
        return statut;
    }
  };

  const handleValidate = (trajetId) => {
    setTrajets(prev => prev.map(trajet => 
      trajet.id === trajetId 
        ? { ...trajet, statut: 'valide' }
        : trajet
    ));
  };



  const handleEdit = (trajet) => {
    setSelectedTrajet(trajet);
    setEditData({ ...trajet });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setTrajets(prev => prev.map(trajet => 
      trajet.id === editData.id 
        ? { ...editData }
        : trajet
    ));
    setShowEditModal(false);
    setSelectedTrajet(null);
    setEditData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const TrajetCard = ({ trajet }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {trajet.chauffeurNom}
          </h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <Car className="h-4 w-4 mr-1" />
            {trajet.vehicule}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutBadge(trajet.statut)}`}>
          {getStatutText(trajet.statut)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Building className="h-4 w-4 mr-2 text-blue-600" />
          <span className="font-medium">Parc:</span>
          <span className="ml-1">{getParcName(trajet.parcId)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-green-600" />
          <span className="font-medium">Destination:</span>
          <span className="ml-1">{trajet.destination}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          <span className="font-medium">Date:</span>
          <span className="ml-1">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-purple-600" />
          <span className="font-medium">Horaires:</span>
          <span className="ml-1">{trajet.heureDepart} - {trajet.heureFin}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Route className="h-5 w-5 mx-auto text-blue-600 mb-1" />
          <p className="text-xs text-gray-600">Kilométrage</p>
          <p className="font-semibold">{trajet.kilometrageParcouru} km</p>
        </div>
        
        <div className="text-center">
          <Fuel className="h-5 w-5 mx-auto text-green-600 mb-1" />
          <p className="text-xs text-gray-600">Carburant</p>
          <p className="font-semibold">{trajet.carburantConsomme} L</p>
        </div>
        
        <div className="text-center">
          <CreditCard className="h-5 w-5 mx-auto text-orange-600 mb-1" />
          <p className="text-xs text-gray-600">Péages</p>
          <p className="font-semibold">{trajet.peages} DH</p>
        </div>
        
        <div className="text-center">
          <CreditCard className="h-5 w-5 mx-auto text-red-600 mb-1" />
          <p className="text-xs text-gray-600">Autres</p>
          <p className="font-semibold">{trajet.autresDepenses} DH</p>
        </div>
      </div>



      <div className="flex justify-end space-x-2">
        {trajet.statut === 'en_attente' && (
          <>
            <button
              onClick={() => handleEdit(trajet)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </button>
            <button
              onClick={() => handleValidate(trajet.id)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Valider
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout title="Validation des trajets" userType={userType}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Validation des trajets" userType={userType}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validation des Trajets</h1>
          <p className="text-gray-600">Validez ou modifiez les données de trajets saisies par les chauffeurs</p>
        </div>

        {/* Sélecteur de parc */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-gray-500 mr-2" />
              <label className="text-sm font-medium text-gray-700">Parc:</label>
            </div>
            <select
              value={selectedParc}
              onChange={(e) => setSelectedParc(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">Tous les parcs</option>
              {parcs.map(parc => (
                <option key={parc.id} value={parc.id}>
                  {parc.nom} - {parc.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trajets.filter(t => t.statut === 'en_attente').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trajets.filter(t => t.statut === 'valide').length}
                </p>
              </div>
            </div>
          </div>
          

          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Route className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{trajets.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('tous')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'tous' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('en_attente')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'en_attente' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('valide')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'valide' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Validés
            </button>

          </div>
        </div>

        {/* Liste des trajets */}
        <div>
          {filteredTrajets.length > 0 ? (
            filteredTrajets.map(trajet => (
              <TrajetCard key={trajet.id} trajet={trajet} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Route className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun trajet trouvé</h3>
              <p className="text-gray-500">Aucun trajet ne correspond aux critères sélectionnés.</p>
            </div>
          )}
        </div>

        {/* Modal de modification */}
        {showEditModal && selectedTrajet && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Modifier le trajet - {selectedTrajet.chauffeurNom}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilométrage parcouru (km)
                    </label>
                    <input
                      type="number"
                      name="kilometrageParcouru"
                      value={editData.kilometrageParcouru}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carburant consommé (L)
                    </label>
                    <input
                      type="number"
                      name="carburantConsomme"
                      value={editData.carburantConsomme}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Péages (DH)
                    </label>
                    <input
                      type="number"
                      name="peages"
                      value={editData.peages}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Autres dépenses (DH)
                    </label>
                    <input
                      type="number"
                      name="autresDepenses"
                      value={editData.autresDepenses}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                

                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <X className="inline h-4 w-4 mr-1" />
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="inline h-4 w-4 mr-1" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ValidateTrajet;