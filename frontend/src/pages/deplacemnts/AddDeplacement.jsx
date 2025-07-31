import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/common/Layout';
import { Calendar, MapPin, Users, User, FileText, Clock, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Checkbox } from '../../components/ui/Checkbox';

const AddDeplacement = ({ userType = 'chef de parc' }) => {
  const [formData, setFormData] = useState({
    destination: '',
    isMission: false,
    dateDepart: '',
    heureDepart: '',
    chauffeurId: '',
    description: '',
    participants: []
  });

  const [errors, setErrors] = useState({});
  const [chauffeurs, setChauffeurs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [participantRole, setParticipantRole] = useState('Passager');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate fetching chauffeurs
    setChauffeurs([
      { id: 1, nom: 'Dupont', prenom: 'Jean', numero_permis: 'AB123456' },
      { id: 2, nom: 'Martin', prenom: 'Pierre', numero_permis: 'CD789012' },
      { id: 3, nom: 'Bernard', prenom: 'Marie', numero_permis: 'EF345678' }
    ]);

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
  }, []);

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

    if (!formData.heureDepart) {
      newErrors.heureDepart = 'L\'heure de départ est obligatoire';
    }

    if (!formData.chauffeurId) {
      newErrors.chauffeurId = 'Le choix du chauffeur est obligatoire';
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

    // Combine date and time
    const dateTimeDepart = `${formData.dateDepart}T${formData.heureDepart}:00`;

    const deplacementData = {
      destination: formData.destination,
      dateDepart: dateTimeDepart,
      isMission: formData.isMission,
      description: formData.description,
      chauffeurId: parseInt(formData.chauffeurId),
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
      heureDepart: '',
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
      heureDepart: '',
      chauffeurId: '',
      description: '',
      participants: []
    });
    setErrors({});
  };

  return (
    <Layout title="Créer un déplacement" userType={userType}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <MapPin className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Nouveau Déplacement</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destination *
              </label>
              <Input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                hasError={!!errors.destination}
                placeholder="Entrez la destination du déplacement"
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
              )}
            </div>

            {/* Type de déplacement */}
            <div>
              <label className="flex items-center space-x-3">
                <Checkbox
                  name="isMission"
                  checked={formData.isMission}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMission: checked }))}
                />
                <span className="text-sm font-medium text-gray-700">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Il s'agit d'une mission officielle
                </span>
              </label>
            </div>

            {/* Date et heure de départ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date de départ *
                </label>
                <Input
                  type="date"
                  id="dateDepart"
                  name="dateDepart"
                  value={formData.dateDepart}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  hasError={!!errors.dateDepart}
                />
                {errors.dateDepart && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateDepart}</p>
                )}
              </div>

              <div>
                <label htmlFor="heureDepart" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Heure de départ *
                </label>
                <Input
                  type="time"
                  id="heureDepart"
                  name="heureDepart"
                  value={formData.heureDepart}
                  onChange={handleInputChange}
                  hasError={!!errors.heureDepart}
                />
                {errors.heureDepart && (
                  <p className="mt-1 text-sm text-red-600">{errors.heureDepart}</p>
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
                        <Button
                          type="button"
                          onClick={() => removeParticipant(participant.agentId)}
                          variant="ghost"
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                hasError={!!errors.description}
                placeholder={formData.isMission ? "Décrivez l'objectif et les détails de la mission..." : "Description optionnelle du déplacement..."}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                onClick={handleReset}
                variant="secondary"
              >
                <X className="inline h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                <Save className="inline h-4 w-4 mr-1" />
                Créer le déplacement
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddDeplacement;
