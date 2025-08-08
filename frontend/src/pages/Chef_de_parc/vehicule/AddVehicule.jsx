import React, { useState } from 'react';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { Car, Hash, Building, Settings, Calendar, Gauge, Save, X, CheckCircle, XCircle } from 'lucide-react';

const AddVehicule = ({ userType = 'chef de parc' }) => {
  const [selectedParc, setSelectedParc] = useState(null);
  const [formData, setFormData] = useState({
    immatriculation: '',
    marque: '',
    modele: '',
    type: '',
    isDisponible: true,
    dateAcquisition: '',
    kilometrage: 0,
    est_actif: true
  });

  const [errors, setErrors] = useState({});

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Reset form data when parc changes
    setFormData({
      immatriculation: '',
      marque: '',
      modele: '',
      type: '',
      isDisponible: true,
      dateAcquisition: '',
      kilometrage: 0,
      est_actif: true
    });
    setErrors({});
  };

  const typeVehiculeOptions = [
    { value: 'Berline', label: 'Berline' },
    { value: 'Break', label: 'Break' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Utilitaire', label: 'Utilitaire' },
    { value: 'Camion', label: 'Camion' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Minibus', label: 'Minibus' },
    { value: 'Moto', label: 'Moto' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedParc) {
      newErrors.parc = 'Le parc est requis';
    }

    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = 'L\'immatriculation est requise';
    }

    if (!formData.marque.trim()) {
      newErrors.marque = 'La marque est obligatoire';
    }

    if (!formData.modele.trim()) {
      newErrors.modele = 'Le modèle est obligatoire';
    }

    if (!formData.type) {
      newErrors.type = 'Le type de véhicule est obligatoire';
    }

    if (!formData.dateAcquisition) {
      newErrors.dateAcquisition = 'La date d\'acquisition est obligatoire';
    } else {
      const acquisitionDate = new Date(formData.dateAcquisition);
      const today = new Date();
      if (acquisitionDate > today) {
        newErrors.dateAcquisition = 'La date d\'acquisition ne peut pas être dans le futur';
      }
    }

    if (formData.kilometrage < 0) {
      newErrors.kilometrage = 'Le kilométrage ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const vehiculeData = {
      immatriculation: formData.immatriculation.trim().toUpperCase(),
      marque: formData.marque.trim(),
      modele: formData.modele.trim(),
      type: formData.type,
      isDisponible: formData.isDisponible,
      dateAcquisition: formData.dateAcquisition,
      kilometrage: parseInt(formData.kilometrage),
      est_actif: formData.est_actif,
      parcId: selectedParc.id
    };

    console.log('Données du véhicule:', vehiculeData);
    
    // Here you would typically send the data to your API
    alert('Véhicule créé avec succès!');
    
    // Reset form
    setFormData({
      immatriculation: '',
      marque: '',
      modele: '',
      type: '',
      isDisponible: true,
      dateAcquisition: '',
      kilometrage: 0,
      est_actif: true
    });
  };

  const handleReset = () => {
    setFormData({
      immatriculation: '',
      marque: '',
      modele: '',
      type: '',
      isDisponible: true,
      dateAcquisition: '',
      kilometrage: 0,
      est_actif: true
    });
    setErrors({});
  };

  return (
    <Layout title="Ajouter un véhicule" userType={userType}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Sélection du parc */}
        <ParcSelector 
          selectedParc={selectedParc} 
          onParcChange={handleParcChange}
          userType={userType}
          error={errors.parc}
        />
        
        {selectedParc && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex items-center mb-6">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Ajouter un nouveau véhicule - {selectedParc.nom}</h1>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Immatriculation */}
            <div>
              <label htmlFor="immatriculation" className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Immatriculation *
              </label>
              <input
                type="text"
                id="immatriculation"
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                  errors.immatriculation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 123456-A-12"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.immatriculation && (
                <p className="mt-1 text-sm text-red-600">{errors.immatriculation}</p>
              )}
            </div>

            {/* Marque et Modèle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="marque" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Marque *
                </label>
                <input
                  type="text"
                  id="marque"
                  name="marque"
                  value={formData.marque}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.marque ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Toyota, Renault, Mercedes"
                />
                {errors.marque && (
                  <p className="mt-1 text-sm text-red-600">{errors.marque}</p>
                )}
              </div>

              <div>
                <label htmlFor="modele" className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="inline h-4 w-4 mr-1" />
                  Modèle *
                </label>
                <input
                  type="text"
                  id="modele"
                  name="modele"
                  value={formData.modele}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.modele ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Corolla, Clio, Sprinter"
                />
                {errors.modele && (
                  <p className="mt-1 text-sm text-red-600">{errors.modele}</p>
                )}
              </div>
            </div>

            {/* Type de véhicule */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="inline h-4 w-4 mr-1" />
                Type de véhicule *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un type</option>
                {typeVehiculeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Date d'acquisition et Kilométrage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateAcquisition" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date d'acquisition *
                </label>
                <input
                  type="date"
                  id="dateAcquisition"
                  name="dateAcquisition"
                  value={formData.dateAcquisition}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateAcquisition ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateAcquisition && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateAcquisition}</p>
                )}
              </div>

              <div>
                <label htmlFor="kilometrage" className="block text-sm font-medium text-gray-700 mb-2">
                  <Gauge className="inline h-4 w-4 mr-1" />
                  Kilométrage de début
                </label>
                <input
                  type="number"
                  id="kilometrage"
                  name="kilometrage"
                  value={formData.kilometrage}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.kilometrage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.kilometrage && (
                  <p className="mt-1 text-sm text-red-600">{errors.kilometrage}</p>
                )}
              </div>
            </div>

            {/* Statuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isDisponible"
                    checked={formData.isDisponible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.isDisponible ? (
                      <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />
                    ) : (
                      <XCircle className="inline h-4 w-4 mr-1 text-red-600" />
                    )}
                    Véhicule disponible
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="est_actif"
                    checked={formData.est_actif}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.est_actif ? (
                      <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />
                    ) : (
                      <XCircle className="inline h-4 w-4 mr-1 text-red-600" />
                    )}
                    Véhicule actif
                  </span>
                </label>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <X className="inline h-4 w-4 mr-1" />
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Save className="inline h-4 w-4 mr-1" />
                Créer le véhicule
              </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddVehicule;