import React, { useState } from 'react';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Car,
  MapPin,
  Plus,
  Filter,
  Search
} from 'lucide-react';

const Maintenance = () => {
  const [selectedParc, setSelectedParc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [formData, setFormData] = useState({
    vehicule: '',
    type: '',
    dateDebut: '',
    dateFin: '',
    cout: '',
    description: ''
  });

  // Mock data for available vehicles in the selected parc
  const availableVehicles = selectedParc ? [
    { id: 1, immatriculation: 'ABC123', marque: 'Toyota', modele: 'Corolla', annee: 2020 },
    { id: 2, immatriculation: 'DEF456', marque: 'Peugeot', modele: '308', annee: 2019 },
    { id: 3, immatriculation: 'GHI789', marque: 'Renault', modele: 'Clio', annee: 2021 },
    { id: 4, immatriculation: 'JKL012', marque: 'Ford', modele: 'Focus', annee: 2018 },
    { id: 5, immatriculation: 'MNO345', marque: 'Volkswagen', modele: 'Golf', annee: 2020 },
    { id: 6, immatriculation: 'PQR678', marque: 'Citroën', modele: 'C3', annee: 2019 }
  ] : [];

  // Mock data for maintenance records
  const maintenanceRecords = [
    {
      id: 1,
      vehicule: 'Toyota Corolla - ABC123',
      type: 'Révision périodique',
      status: 'en_cours',
      dateDebut: '2024-01-15',
      dateFin: '2024-01-17',
      cout: 450,
      description: 'Révision des 20 000 km'
    },
    {
      id: 2,
      vehicule: 'Peugeot 308 - DEF456',   type: 'Réparation',
      status: 'en_cours',
      dateDebut: '2024-01-20',
      dateFin: '2024-01-22',
      cout: 280,
      description: 'Changement des plaquettes de frein'
    },
    {
      id: 3,
      vehicule: 'Renault Clio - GHI789',
      type: 'Contrôle technique',
      status: 'actif',
      dateDebut: '2024-01-10',
      dateFin: '2024-01-10',
      cout: 85,
      garage: 'Centre de contrôle Sud',
      description: 'Contrôle technique annuel'
    },
    {
      id: 4,
      vehicule: 'Ford Focus - JKL012',
      type: 'Révision périodique',
      status: 'actif',
      dateDebut: '2024-01-18',
      dateFin: '2024-01-19',
      cout: 520,
      description: 'Révision urgente - problème moteur'
    }
  ];

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // TODO: Reload maintenance data for selected parc
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'actif': return <CheckCircle className="h-4 w-4" />;
      case 'en_cours': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'actif': return 'actif';
      case 'en_cours': return 'En cours';
      default: return status;
    }
  };

  // Fonctions de gestion des modales
  const handleAddMaintenance = () => {
    setModalType('add');
    setFormData({
      vehicule: '',
      type: '',
      dateDebut: '',
      dateFin: '',
      cout: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEditMaintenance = (maintenance) => {
    setModalType('edit');
    setSelectedMaintenance(maintenance);
    setFormData({
      vehicule: maintenance.vehicule,
      type: maintenance.type,
      dateDebut: maintenance.dateDebut,
      dateFin: maintenance.dateFin,
      cout: maintenance.cout.toString(),
      description: maintenance.description
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaintenance(null);
    setFormData({
      vehicule: '',
      type: '',
      dateDebut: '',
      dateFin: '',
      cout: '',
      description: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save maintenance
    console.log('Saving maintenance:', formData);
    handleCloseModal();
  };

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.vehicule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: maintenanceRecords.length,
    enCours: maintenanceRecords.filter(r => r.status === 'en_cours').length,
    actif: maintenanceRecords.filter(r => r.status === 'actif').length,
    urgent: maintenanceRecords.filter(r => r.type === 'Réparation' && r.status === 'en_cours').length
  };

  return (
    <Layout title='Maintenance' userType='chef de parc'>
      <div className="p-6 max-w-full overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de la Maintenance</h1>
          <p className="text-gray-600">Gérez les opérations de maintenance des véhicules du parc</p>
        </div>

        {/* Park Selector */}
        <ParcSelector onParcChange={handleParcChange} />

        {/* Selected Park Info */}
        {selectedParc && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="font-semibold text-blue-900">{selectedParc.nom}</h3>
                <p className="text-sm text-blue-700">{selectedParc.entite} • {selectedParc.vehicules} véhicules</p>
              </div>
            </div>
          </div>
        )}

        {!selectedParc ? (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un parc</h3>
            <p className="text-gray-600">Veuillez sélectionner un parc pour gérer la maintenance</p>
          </div>
        ) : (
        <>
        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Maintenances</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-400 mt-1">Toutes opérations</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">En Cours</p>
                <p className="text-3xl font-bold text-orange-600">{stats.enCours}</p>
                <p className="text-xs text-gray-400 mt-1">Opérations actives</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Actifs</p>
                <p className="text-3xl font-bold text-green-600">{stats.actif}</p>
                <p className="text-xs text-gray-400 mt-1">Maintenances terminées</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="en_cours">En cours</option>
                </select>
              </div>
            </div>
            
            {/* Add Button */}
            <button
              onClick={handleAddMaintenance}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle maintenance
            </button>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="bg-white rounded-lg shadow border max-w-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Opérations de maintenance</h2>
          </div>
          
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune maintenance trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">Aucune opération de maintenance ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Véhicule
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de Coût
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coût
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commentaire
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">
                        <div className="font-medium text-gray-900 truncate max-w-32">{record.vehicule}</div>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <div className="text-gray-900 font-medium truncate">{record.type}</div>
                        <div className="text-xs text-gray-500 truncate">{record.description}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{getStatusText(record.status)}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <div className="truncate">Début: {new Date(record.dateDebut).toLocaleDateString('fr-FR')}</div>
                        <div className="truncate">Fin: {new Date(record.dateFin).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">
                        <div className="truncate">{record.cout.toLocaleString()} €</div>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        <div className="truncate max-w-24" title={record.description}>{record.description}</div>
                      </td>
                      <td className="px-3 py-2 text-sm font-medium">
                        <div className="flex flex-col space-y-1">
                          <button 
                            onClick={() => handleEditMaintenance(record)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            Modifier
                          </button>
                          <button className="text-red-600 hover:text-red-900 text-xs">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Modal pour ajouter/modifier une maintenance */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {modalType === 'add' ? 'Ajouter une maintenance' : 'Modifier la maintenance'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Véhicule
                    </label>
                    <select
                      name="vehicule"
                      value={formData.vehicule}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner un véhicule</option>
                      {availableVehicles.map(vehicule => (
                        <option key={vehicule.id} value={`${vehicule.marque} ${vehicule.modele} - ${vehicule.immatriculation}`}>
                          {vehicule.marque} {vehicule.modele} - {vehicule.immatriculation} ({vehicule.annee})
                        </option>
                      ))}
                    </select>
                    {availableVehicles.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Veuillez d'abord sélectionner un parc pour voir les véhicules disponibles
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de maintenance
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Révision périodique">Révision périodique</option>
                      <option value="Réparation">Réparation</option>
                      <option value="Contrôle technique">Contrôle technique</option>
                      <option value="Vidange">Vidange</option>
                      <option value="Changement pneus">Changement pneus</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date début
                      </label>
                      <input
                        type="date"
                        name="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date fin
                      </label>
                      <input
                        type="date"
                        name="dateFin"
                        value={formData.dateFin}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coût (DH)
                    </label>
                    <input
                      type="number"
                      name="cout"
                      value={formData.cout}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description de la maintenance..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {modalType === 'add' ? 'Créer' : 'Modifier'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        </>
        )}
      </div>
    </Layout>
  );
};

export default Maintenance;