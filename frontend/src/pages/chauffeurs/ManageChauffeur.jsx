import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Search, Edit, UserX, UserCheck, Eye, Save, X } from 'lucide-react';

const ManageChauffeur = () => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [filteredChauffeurs, setFilteredChauffeurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingChauffeur, setEditingChauffeur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    numero_permis: '',
    type_permis: '',
    date_expiration_permis: '',
    nombre_points: '',
    est_actif: true
  });

  // Données simulées des chauffeurs
  useEffect(() => {
    const mockChauffeurs = [
      {
        id: 1,
        matricule: 'CH001',
        nom: 'Benali',
        prenom: 'Ahmed',
        email: 'ahmed.benali@example.com',
        numero_permis: 'P123456789',
        type_permis: 'B',
        date_expiration_permis: '2025-12-31',
        nombre_points: 12,
        est_actif: true
      },
      {
        id: 2,
        matricule: 'CH002',
        nom: 'Mansouri',
        prenom: 'Fatima',
        email: 'fatima.mansouri@example.com',
        numero_permis: 'P987654321',
        type_permis: 'C',
        date_expiration_permis: '2024-08-15',
        nombre_points: 10,
        est_actif: true
      },
      {
        id: 3,
        matricule: 'CH003',
        nom: 'Khelifi',
        prenom: 'Mohamed',
        email: 'mohamed.khelifi@example.com',
        numero_permis: 'P456789123',
        type_permis: 'D',
        date_expiration_permis: '2026-03-20',
        nombre_points: 8,
        est_actif: false
      },
      {
        id: 4,
        matricule: 'CH004',
        nom: 'Bouaziz',
        prenom: 'Leila',
        email: 'leila.bouaziz@example.com',
        numero_permis: 'P789123456',
        type_permis: 'B',
        date_expiration_permis: '2025-06-10',
        nombre_points: 12,
        est_actif: true
      }
    ];
    setChauffeurs(mockChauffeurs);
    setFilteredChauffeurs(mockChauffeurs);
  }, []);

  // Filtrage des chauffeurs
  useEffect(() => {
    const filtered = chauffeurs.filter(chauffeur =>
      chauffeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChauffeurs(filtered);
  }, [searchTerm, chauffeurs]);

  const handleEdit = (chauffeur) => {
    setEditingChauffeur(chauffeur);
    setFormData({
      matricule: chauffeur.matricule,
      nom: chauffeur.nom,
      prenom: chauffeur.prenom,
      email: chauffeur.email,
      numero_permis: chauffeur.numero_permis,
      type_permis: chauffeur.type_permis,
      date_expiration_permis: chauffeur.date_expiration_permis,
      nombre_points: chauffeur.nombre_points,
      est_actif: chauffeur.est_actif
    });
    setShowModal(true);
  };

  const handleToggleStatus = (id) => {
    setChauffeurs(prev => prev.map(chauffeur =>
      chauffeur.id === id
        ? { ...chauffeur, est_actif: !chauffeur.est_actif }
        : chauffeur
    ));
  };

  const handleSave = () => {
    if (editingChauffeur) {
      setChauffeurs(prev => prev.map(chauffeur =>
        chauffeur.id === editingChauffeur.id
          ? { ...chauffeur, ...formData }
          : chauffeur
      ));
    }
    setShowModal(false);
    setEditingChauffeur(null);
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      numero_permis: '',
      type_permis: '',
      date_expiration_permis: '',
      nombre_points: '',
      est_actif: true
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingChauffeur(null);
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      numero_permis: '',
      type_permis: '',
      date_expiration_permis: '',
      nombre_points: '',
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

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gérer les Chauffeurs</h1>
          <p className="text-gray-600">Modifiez les informations des chauffeurs et gérez leur statut</p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, matricule ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tableau des chauffeurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chauffeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
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
                {filteredChauffeurs.map((chauffeur) => (
                  <tr key={chauffeur.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {chauffeur.prenom.charAt(0)}{chauffeur.nom.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {chauffeur.prenom} {chauffeur.nom}
                          </div>
                          <div className="text-sm text-gray-500">{chauffeur.matricule}</div>
                          <div className="text-sm text-gray-500">{chauffeur.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chauffeur.numero_permis}</div>
                      <div className="text-sm text-gray-500">Type {chauffeur.type_permis}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{chauffeur.date_expiration_permis}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        chauffeur.nombre_points >= 10 ? 'bg-green-100 text-green-800' :
                        chauffeur.nombre_points >= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {chauffeur.nombre_points} points
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        chauffeur.est_actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {chauffeur.est_actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(chauffeur)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(chauffeur.id)}
                          className={`p-1 rounded ${
                            chauffeur.est_actif
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={chauffeur.est_actif ? 'Désactiver' : 'Activer'}
                        >
                          {chauffeur.est_actif ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
                    Modifier les informations du chauffeur
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
                      Matricule
                    </label>
                    <input
                      type="text"
                      name="matricule"
                      value={formData.matricule}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de permis
                    </label>
                    <input
                      type="text"
                      name="numero_permis"
                      value={formData.numero_permis}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de permis
                    </label>
                    <select
                      name="type_permis"
                      value={formData.type_permis}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="A">A - Moto</option>
                      <option value="B">B - Voiture</option>
                      <option value="C">C - Camion</option>
                      <option value="D">D - Bus</option>
                      <option value="E">E - Remorque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'expiration
                    </label>
                    <input
                      type="date"
                      name="date_expiration_permis"
                      value={formData.date_expiration_permis}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de points
                    </label>
                    <input
                      type="number"
                      name="nombre_points"
                      value={formData.nombre_points}
                      onChange={handleInputChange}
                      min="0"
                      max="12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="est_actif"
                        checked={formData.est_actif}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Chauffeur actif</span>
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

export default ManageChauffeur;