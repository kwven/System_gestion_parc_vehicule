import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Search, Edit, Car, Save, X, Calendar, Gauge } from 'lucide-react';

const ManageVehicule = ({ userType }) => {
  const [vehicules, setVehicules] = useState([]);
  const [filteredVehicules, setFilteredVehicules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicule, setEditingVehicule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    immatriculation: '',
    marque: '',
    modele: '',
    type: '',
    dateAcquisition: '',
    kilometrage: '',
    isDisponible: true,
    est_actif: true
  });

  // Données simulées des véhicules
  useEffect(() => {
    const mockVehicules = [
      {
        id: 1,
        immatriculation: '123-TUN-456',
        marque: 'Toyota',
        modele: 'Corolla',
        type: 'Berline',
        dateAcquisition: '2022-01-15',
        kilometrage: 45000,
        isDisponible: true,
        est_actif: true
      },
      {
        id: 2,
        immatriculation: '789-TUN-012',
        marque: 'Peugeot',
        modele: 'Partner',
        type: 'Utilitaire',
        dateAcquisition: '2021-06-20',
        kilometrage: 78000,
        isDisponible: false,
        est_actif: true
      },
      {
        id: 3,
        immatriculation: '345-TUN-678',
        marque: 'Mercedes',
        modele: 'Sprinter',
        type: 'Minibus',
        dateAcquisition: '2020-03-10',
        kilometrage: 120000,
        isDisponible: true,
        est_actif: false
      },
      {
        id: 4,
        immatriculation: '901-TUN-234',
        marque: 'Renault',
        modele: 'Clio',
        type: 'Berline',
        dateAcquisition: '2023-08-05',
        kilometrage: 15000,
        isDisponible: true,
        est_actif: true
      },
      {
        id: 5,
        immatriculation: '567-TUN-890',
        marque: 'Iveco',
        modele: 'Daily',
        type: 'Camion',
        dateAcquisition: '2019-11-12',
        kilometrage: 200000,
        isDisponible: false,
        est_actif: true
      }
    ];
    setVehicules(mockVehicules);
    setFilteredVehicules(mockVehicules);
  }, []);

  // Filtrage des véhicules
  useEffect(() => {
    const filtered = vehicules.filter(vehicule =>
      vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicules(filtered);
  }, [searchTerm, vehicules]);

  const handleEdit = (vehicule) => {
    setEditingVehicule(vehicule);
    setFormData({
      immatriculation: vehicule.immatriculation,
      marque: vehicule.marque,
      modele: vehicule.modele,
      type: vehicule.type,
      dateAcquisition: vehicule.dateAcquisition,
      kilometrage: vehicule.kilometrage,
      isDisponible: vehicule.isDisponible,
      est_actif: vehicule.est_actif
    });
    setShowModal(true);
  };

  const handleToggleDisponibilite = (id) => {
    setVehicules(prev => prev.map(vehicule =>
      vehicule.id === id
        ? { ...vehicule, isDisponible: !vehicule.isDisponible }
        : vehicule
    ));
  };

  const handleToggleStatus = (id) => {
    setVehicules(prev => prev.map(vehicule =>
      vehicule.id === id
        ? { ...vehicule, est_actif: !vehicule.est_actif }
        : vehicule
    ));
  };

  const handleSave = () => {
    if (editingVehicule) {
      setVehicules(prev => prev.map(vehicule =>
        vehicule.id === editingVehicule.id
          ? { ...vehicule, ...formData }
          : vehicule
      ));
    }
    setShowModal(false);
    setEditingVehicule(null);
    setFormData({
      immatriculation: '',
      marque: '',
      modele: '',
      type: '',
      dateAcquisition: '',
      kilometrage: '',
      isDisponible: true,
      est_actif: true
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingVehicule(null);
    setFormData({
      immatriculation: '',
      marque: '',
      modele: '',
      type: '',
      dateAcquisition: '',
      kilometrage: '',
      isDisponible: true,
      est_actif: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getTypeColor = (type) => {
    const colors = {
      'Berline': 'bg-blue-100 text-blue-800',
      'SUV': 'bg-green-100 text-green-800',
      'Camion': 'bg-orange-100 text-orange-800',
      'Bus': 'bg-purple-100 text-purple-800',
      'Minibus': 'bg-indigo-100 text-indigo-800',
      'Utilitaire': 'bg-yellow-100 text-yellow-800',
      'Moto': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout title="Gestion des véhicules" userType={userType}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gérer les Véhicules</h1>
          <p className="text-gray-600">Modifiez les informations des véhicules et gérez leur disponibilité</p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par immatriculation, marque, modèle ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tableau des véhicules */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acquisition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kilométrage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponibilité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicules.map((vehicule) => (
                  <tr key={vehicule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Car className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicule.immatriculation}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicule.marque} {vehicule.modele}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(vehicule.type)}`}>
                        {vehicule.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {vehicule.dateAcquisition}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Gauge className="h-4 w-4 mr-1 text-gray-400" />
                        {vehicule.kilometrage.toLocaleString()} km
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicule.isDisponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicule.isDisponible ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicule.est_actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicule.est_actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(vehicule)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleDisponibilite(vehicule.id)}
                          className={`p-1 rounded ${
                            vehicule.isDisponible
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={vehicule.isDisponible ? 'Rendre indisponible' : 'Rendre disponible'}
                        >
                          {vehicule.isDisponible ? <Car className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de modification */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Modifier les informations du véhicule
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Immatriculation
                    </label>
                    <input
                      type="text"
                      name="immatriculation"
                      value={formData.immatriculation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      type="text"
                      name="marque"
                      value={formData.marque}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modèle
                    </label>
                    <input
                      type="text"
                      name="modele"
                      value={formData.modele}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Berline">Berline</option>
                      <option value="SUV">SUV</option>
                      <option value="Camion">Camion</option>
                      <option value="Bus">Bus</option>
                      <option value="Minibus">Minibus</option>
                      <option value="Utilitaire">Utilitaire</option>
                      <option value="Moto">Moto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'acquisition
                    </label>
                    <input
                      type="date"
                      name="dateAcquisition"
                      value={formData.dateAcquisition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilométrage
                    </label>
                    <input
                      type="number"
                      name="kilometrage"
                      value={formData.kilometrage}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDisponible"
                        checked={formData.isDisponible}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Véhicule disponible</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="est_actif"
                        checked={formData.est_actif}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Véhicule actif</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
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

export default ManageVehicule;
