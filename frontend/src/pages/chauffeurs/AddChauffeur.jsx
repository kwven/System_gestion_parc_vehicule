import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { User, Mail, Hash, Calendar, CreditCard, Award, Save, X, CheckCircle, XCircle, Building } from 'lucide-react';

const AddChauffeur = ({ userType = 'chef de parc' }) => {
  const [formData, setFormData] = useState({
    // Données Agent
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    date_affectation: '',
    motdepasse: '',
    role: 'Chauffeur',
    entite_id: '',
    est_actif: true,
    // Données Chauffeur
    numero_permis: '',
    date_obtention_permis: '',
    type_permis: '',
    date_expiration_permis: '',
    nombre_points: 12
  });

  const [errors, setErrors] = useState({});
  const [entites, setEntites] = useState([]);

  const typePermisOptions = [
    { value: 'A', label: 'A - Motocyclettes' },
    { value: 'A1', label: 'A1 - Motocyclettes légères' },
    { value: 'B', label: 'B - Véhicules légers' },
    { value: 'C', label: 'C - Poids lourds' },
    { value: 'D', label: 'D - Transport en commun' },
    { value: 'E', label: 'E - Remorques' }
  ];

  useEffect(() => {
    // Simulate fetching entites
    setEntites([
      { id: 1, nom: 'Cabinet', type: 'Cabinet' },
      { id: 2, nom: 'Secrétariat Général', type: 'Secrétariat Général' },
      { id: 3, nom: 'Direction Générale', type: 'Direction Générale' },
      { id: 4, nom: 'Direction Centrale', type: 'Direction Centrale' },
      { id: 5, nom: 'Direction Régionale', type: 'Direction Régionale' },
      { id: 6, nom: 'Direction Provinciale', type: 'Direction Provinciale' },
    ]);
    // Set default date_affectation to today
    setFormData(prev => ({
      ...prev,
      date_affectation: new Date().toISOString().split('T')[0]
    }));
  }, []);

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

    // Validation Agent
    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est obligatoire';
    } else if (!/^[A-Za-z0-9_]+$/.test(formData.matricule)) {
      newErrors.matricule = 'Le matricule doit contenir uniquement des lettres, chiffres et underscores';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.date_affectation) {
      newErrors.date_affectation = 'La date d\'affectation est obligatoire';
    } else {
      const affectationDate = new Date(formData.date_affectation);
      const today = new Date();
      if (affectationDate > today) {
        newErrors.date_affectation = 'La date d\'affectation ne peut pas être dans le futur';
      }
    }

    if (!formData.motdepasse.trim()) {
      newErrors.motdepasse = 'Le mot de passe est obligatoire';
    } else if (formData.motdepasse.length < 6) {
      newErrors.motdepasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.entite_id) {
      newErrors.entite_id = 'L\'entité d\'affectation est obligatoire';
    }

    // Validation Chauffeur
    if (!formData.numero_permis.trim()) {
      newErrors.numero_permis = 'Le numéro de permis est obligatoire';
    }

    if (!formData.date_obtention_permis) {
      newErrors.date_obtention_permis = 'La date d\'obtention du permis est obligatoire';
    } else {
      const obtentionDate = new Date(formData.date_obtention_permis);
      const today = new Date();
      if (obtentionDate > today) {
        newErrors.date_obtention_permis = 'La date d\'obtention ne peut pas être dans le futur';
      }
    }

    if (!formData.type_permis) {
      newErrors.type_permis = 'Le type de permis est obligatoire';
    }

    if (formData.date_expiration_permis) {
      const expirationDate = new Date(formData.date_expiration_permis);
      const obtentionDate = new Date(formData.date_obtention_permis);
      if (expirationDate <= obtentionDate) {
        newErrors.date_expiration_permis = 'La date d\'expiration doit être postérieure à la date d\'obtention';
      }
    }

    if (formData.nombre_points < 0 || formData.nombre_points > 12) {
      newErrors.nombre_points = 'Le nombre de points doit être entre 0 et 12';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const chauffeurData = {
      agent: {
        matricule: formData.matricule.trim(),
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim() || null,
        date_affectation: formData.date_affectation,
        motdepasse: formData.motdepasse,
        role: formData.role,
        entite_id: parseInt(formData.entite_id),
        est_actif: formData.est_actif
      },
      chauffeur: {
        numero_permis: formData.numero_permis.trim(),
        date_obtention_permis: formData.date_obtention_permis,
        type_permis: formData.type_permis,
        date_expiration_permis: formData.date_expiration_permis || null,
        nombre_points: parseInt(formData.nombre_points)
      }
    };

    console.log('Données du chauffeur:', chauffeurData);
    
    // Here you would typically send the data to your API
    alert('Chauffeur créé avec succès!');
    
    // Reset form
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      date_affectation: new Date().toISOString().split('T')[0],
      motdepasse: '',
      role: 'Chauffeur',
      entite_id: '',
      est_actif: true,
      numero_permis: '',
      date_obtention_permis: '',
      type_permis: '',
      date_expiration_permis: '',
      nombre_points: 12
    });
    setErrors({});
  };

  return (
    <Layout title="Créer un chauffeur" userType={userType}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Nouveau Chauffeur</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Informations Agent */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Personnelles</h2>
              
              {/* Matricule */}
              <div className="mb-4">
                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="inline h-4 w-4 mr-1" />
                  Matricule *
                </label>
                <input
                  type="text"
                  id="matricule"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.matricule ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: CH001, CHAUF_001"
                />
                {errors.matricule && (
                  <p className="mt-1 text-sm text-red-600">{errors.matricule}</p>
                )}
              </div>

              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom de famille"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Prénom"
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>
              </div>

              {/* Email et Date d'affectation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@exemple.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="date_affectation" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date d'affectation *
                  </label>
                  <input
                    type="date"
                    id="date_affectation"
                    name="date_affectation"
                    value={formData.date_affectation}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date_affectation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_affectation && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_affectation}</p>
                  )}
                </div>
              </div>

              {/* Mot de passe et Entité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="motdepasse" className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="inline h-4 w-4 mr-1" />
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    id="motdepasse"
                    name="motdepasse"
                    value={formData.motdepasse}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.motdepasse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Minimum 6 caractères"
                  />
                  {errors.motdepasse && (
                    <p className="mt-1 text-sm text-red-600">{errors.motdepasse}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="entite_id" className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Entité d'affectation *
                  </label>
                  <select
                    id="entite_id"
                    name="entite_id"
                    value={formData.entite_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.entite_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez une entité</option>
                    {entites.map(entite => (
                      <option key={entite.id} value={entite.id}>
                        {entite.nom} ({entite.type})
                      </option>
                    ))}
                  </select>
                  {errors.entite_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.entite_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section Informations Permis */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Permis de Conduire</h2>
              
              {/* Numéro de permis et Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="numero_permis" className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline h-4 w-4 mr-1" />
                    Numéro de permis *
                  </label>
                  <input
                    type="text"
                    id="numero_permis"
                    name="numero_permis"
                    value={formData.numero_permis}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.numero_permis ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: P123456789"
                  />
                  {errors.numero_permis && (
                    <p className="mt-1 text-sm text-red-600">{errors.numero_permis}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type_permis" className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline h-4 w-4 mr-1" />
                    Type de permis *
                  </label>
                  <select
                    id="type_permis"
                    name="type_permis"
                    value={formData.type_permis}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type_permis ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez un type</option>
                    {typePermisOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.type_permis && (
                    <p className="mt-1 text-sm text-red-600">{errors.type_permis}</p>
                  )}
                </div>
              </div>

              {/* Dates d'obtention et d'expiration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date_obtention_permis" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date d'obtention *
                  </label>
                  <input
                    type="date"
                    id="date_obtention_permis"
                    name="date_obtention_permis"
                    value={formData.date_obtention_permis}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date_obtention_permis ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_obtention_permis && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_obtention_permis}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="date_expiration_permis" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    id="date_expiration_permis"
                    name="date_expiration_permis"
                    value={formData.date_expiration_permis}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date_expiration_permis ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_expiration_permis && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_expiration_permis}</p>
                  )}
                </div>
              </div>

              {/* Nombre de points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre_points" className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline h-4 w-4 mr-1" />
                    Nombre de points
                  </label>
                  <input
                    type="number"
                    id="nombre_points"
                    name="nombre_points"
                    value={formData.nombre_points}
                    onChange={handleInputChange}
                    min="0"
                    max="12"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre_points ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombre_points && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre_points}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Statut actif */}
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
                  Chauffeur actif
                </span>
              </label>
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
                Créer le chauffeur
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddChauffeur;