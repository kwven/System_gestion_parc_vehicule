import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { Calendar, MapPin, Users, User, FileText, Clock, Save, X, Plus, Trash2, Building } from 'lucide-react';

const AddDeplacement = ({ userType = 'chef de parc' }) => {
  const [selectedParc, setSelectedParc] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    isMission: false,
    dateDepart: '',
    dateArrivee: '',
    chauffeurId: '',
    description: '',
    participants: []
  });

  const [errors, setErrors] = useState({});

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Reset form data when parc changes
    setFormData({
      destination: '',
      isMission: false,
      dateDepart: '',
      dateArrivee: '',
      chauffeurId: '',
      description: '',
      participants: []
    });
    setErrors({});
  };
  const [chauffeurs, setChauffeurs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [participantRole, setParticipantRole] = useState('Passager');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);

  // Mock data pour les chauffeurs par parc
  const getChauffeursParParc = (parcId) => {
    const allChauffeurs = {
      1: [ // Parc Central Rabat
        { id: 1, nom: 'Dupont', prenom: 'Jean', numero_permis: 'AB123456' },
        { id: 2, nom: 'Martin', prenom: 'Pierre', numero_permis: 'CD789012' },
        { id: 3, nom: 'Bernard', prenom: 'Marie', numero_permis: 'EF345678' }
      ],
      2: [ // Parc Régional Casablanca
        { id: 4, nom: 'Alami', prenom: 'Aicha', numero_permis: 'GH901234' },
        { id: 5, nom: 'Tazi', prenom: 'Youssef', numero_permis: 'IJ567890' }
      ],
      3: [ // Parc Provincial Fès
        { id: 6, nom: 'Fassi', prenom: 'Nadia', numero_permis: 'KL234567' },
        { id: 7, nom: 'Alaoui', prenom: 'Hassan', numero_permis: 'MN890123' }
      ]
    };
    return allChauffeurs[parcId] || [];
  };

  // Mock data - Replace with actual API calls
  useEffect(() => {
    if (selectedParc) {
      // Simulate fetching chauffeurs for selected parc
      setChauffeurs(getChauffeursParParc(selectedParc.id));

      // Simulate fetching agents for participants
      setAgents([
        { id: 1, nom: 'Durand', prenom: 'Sophie', fonction: 'Responsable', ville: 'Rabat' },
        { id: 2, nom: 'Moreau', prenom: 'Luc', fonction: 'Agent', ville: 'Casablanca' },
        { id: 3, nom: 'Petit', prenom: 'Anne', fonction: 'Secrétaire', ville: 'Fès' },
        { id: 4, nom: 'Roux', prenom: 'Paul', fonction: 'Technicien', ville: 'Marrakech' },
        { id: 5, nom: 'Benali', prenom: 'Fatima', fonction: 'Responsable', ville: 'Tanger' },
        { id: 6, nom: 'Alami', prenom: 'Hassan', fonction: 'Agent', ville: 'Agadir' },
        { id: 7, nom: 'Tazi', prenom: 'Nadia', fonction: 'Secrétaire', ville: 'Meknès' },
        { id: 8, nom: 'Idrissi', prenom: 'Omar', fonction: 'Technicien', ville: 'Oujda' }
      ]);
    }
  }, [selectedParc]);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      const filtered = agents.filter(agent => 
        `${agent.prenom} ${agent.nom}`.toLowerCase().includes(value.toLowerCase()) ||
        agent.ville.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAgents(filtered);
      setShowDropdown(true);
    } else {
      setFilteredAgents([]);
      setShowDropdown(false);
    }
  };

  const selectAgent = (agent) => {
    setSelectedParticipant(agent.id.toString());
    setSearchTerm(`${agent.prenom} ${agent.nom} - ${agent.ville}`);
    setShowDropdown(false);
  };

  const addParticipant = () => {
    if (!selectedParticipant) return;
    
    const agent = agents.find(a => a.id === parseInt(selectedParticipant));
    if (!agent) return;

    // Check if participant already added
    if (formData.participants.some(p => p.agentId === agent.id)) {
      alert('Ce participant est déjà ajouté à la liste.');
      return;
    }

    const newParticipant = {
      agentId: agent.id,
      nom: agent.nom,
      prenom: agent.prenom,
      fonction: agent.fonction,
      ville: agent.ville,
      role: participantRole
    };

    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant]
    }));

    setSelectedParticipant('');
    setSearchTerm('');
    setParticipantRole('Passager');
  };

  const removeParticipant = (agentId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.agentId !== agentId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'La destination est obligatoire';
    }

    if (!formData.dateDepart) {
      newErrors.dateDepart = 'La date de départ est obligatoire';
    }

    if (!formData.dateArrivee) {
      newErrors.dateArrivee = 'La date d\'arrivée est obligatoire';
    } else if (formData.dateDepart && formData.dateArrivee < formData.dateDepart) {
      newErrors.dateArrivee = 'La date d\'arrivée doit être postérieure ou égale à la date de départ';
    }

    if (!formData.chauffeurId) {
      newErrors.chauffeurId = 'Le choix du chauffeur est obligatoire';
    }

    if (!selectedParc) {
      newErrors.parc = 'Le parc est requis';
    }

    if (formData.isMission && !formData.description.trim()) {
      newErrors.description = 'La description est obligatoire pour une mission';
    }

    if (formData.isMission && formData.participants.length === 0) {
      newErrors.participants = 'Au moins un participant est requis pour une mission';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const deplacementData = {
      destination: formData.destination,
      dateDepart: formData.dateDepart,
      dateArrivee: formData.dateArrivee,
      isMission: formData.isMission,
      description: formData.description,
      chauffeurId: parseInt(formData.chauffeurId),
      parcId: selectedParc.id,
      participants: formData.participants
    };

    console.log('Données du déplacement:', deplacementData);
    
    // Here you would typically send the data to your API
    alert('Déplacement créé avec succès!');
    
    // Reset form
    setFormData({
      destination: '',
      isMission: false,
      dateDepart: '',
      dateArrivee: '',
      chauffeurId: '',
      description: '',
      participants: []
    });
  };

  const handleReset = () => {
    setFormData({
      destination: '',
      isMission: false,
      dateDepart: '',
      dateArrivee: '',
      chauffeurId: '',
      description: '',
      participants: []
    });
    setErrors({});
  };

  return (
    <Layout title="Créer un déplacement" userType={userType}>
      <div className="max-w-4xl mx-auto">
        {/* Sélection du parc */}
        <ParcSelector 
          selectedParc={selectedParc} 
          onParcChange={handleParcChange}
          userType={userType}
        />
        
        {selectedParc && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex items-center mb-6">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Nouveau Déplacement - {selectedParc.nom}</h1>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destination *
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.destination ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Entrez la destination du déplacement"
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
              )}
            </div>

            {/* Type de déplacement */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isMission"
                  checked={formData.isMission}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Il s'agit d'une mission officielle
                </span>
              </label>
            </div>

            {/* Date de départ et date d'arrivée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date de départ *
                </label>
                <input
                  type="date"
                  id="dateDepart"
                  name="dateDepart"
                  value={formData.dateDepart}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateDepart ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateDepart && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateDepart}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateArrivee" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date d'arrivée *
                </label>
                <input
                  type="date"
                  id="dateArrivee"
                  name="dateArrivee"
                  value={formData.dateArrivee}
                  onChange={handleInputChange}
                  min={formData.dateDepart || new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateArrivee ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateArrivee && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateArrivee}</p>
                )}
              </div>
            </div>



            {/* Choix du chauffeur */}
            <div>
              <label htmlFor="chauffeurId" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Chauffeur assigné *
              </label>
              <select
                id="chauffeurId"
                name="chauffeurId"
                value={formData.chauffeurId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.chauffeurId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un chauffeur</option>
                {chauffeurs.map(chauffeur => (
                  <option key={chauffeur.id} value={chauffeur.id}>
                    {chauffeur.prenom} {chauffeur.nom} - Permis: {chauffeur.numero_permis}
                  </option>
                ))}
              </select>
              {errors.chauffeurId && (
                <p className="mt-1 text-sm text-red-600">{errors.chauffeurId}</p>
              )}
            </div>

            {/* Participants (seulement pour les missions) */}
            {formData.isMission && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Participants à la mission *
                </label>
                
                {/* Ajouter un participant */}
                 <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-md">
                   <div className="flex-1 min-w-48 relative" ref={searchInputRef}>
                     <input
                       type="text"
                       value={searchTerm}
                       onChange={handleSearchChange}
                       placeholder="Tapez le nom ou la ville de l'agent..."
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       onFocus={() => {
                          if (filteredAgents.length > 0) setShowDropdown(true);
                        }}
                        autoComplete="off"
                     />
                     
                     {/* Dropdown avec autocomplétion */}
                     {showDropdown && filteredAgents.length > 0 && (
                       <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                         {filteredAgents.map(agent => (
                           <div
                             key={agent.id}
                             onClick={() => selectAgent(agent)}
                             className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                           >
                             <div className="font-medium text-gray-900">
                               {agent.prenom} {agent.nom}
                             </div>
                             <div className="text-sm text-gray-600">
                               {agent.fonction} - {agent.ville}
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                  
                  <select
                    value={participantRole}
                    onChange={(e) => setParticipantRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Passager">Passager</option>
                    <option value="Accompagnateur">Accompagnateur</option>
                    <option value="Responsable Mission">Responsable Mission</option>
                    <option value="Organisateur">Organisateur</option>
                  </select>
                  
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Liste des participants */}
                {formData.participants.length > 0 && (
                  <div className="space-y-2">
                    {formData.participants.map((participant, index) => (
                      <div key={participant.agentId} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                        <div>
                          <span className="font-medium">
                            {participant.prenom} {participant.nom}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                             ({participant.fonction}) - {participant.ville} - {participant.role}
                           </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeParticipant(participant.agentId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.participants && (
                  <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Description {formData.isMission && '*'}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.isMission ? "Décrivez l'objectif et les détails de la mission..." : "Description optionnelle du déplacement..."}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
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
                Créer le déplacement
              </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddDeplacement;
