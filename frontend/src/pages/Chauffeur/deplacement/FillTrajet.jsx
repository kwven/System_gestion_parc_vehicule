import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Clock, Fuel, CreditCard, MapPin, Save, ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import Layout from '../../../components/common/Layout';

const FillTrajet = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deplacement } = location.state || {};

    // Types de coûts disponibles
    const typesCouts = [
        { id: 1, nom: 'Carburant', description: 'Coût du carburant', categorie: 'Carburant', est_recurrent: true },
        { id: 2, nom: 'Pneumatiques', description: 'Changement des pneus', categorie: 'Préventif', est_recurrent: false },
        { id: 3, nom: 'Péage autoroute', description: 'Frais de péage', categorie: 'Carburant', est_recurrent: false },
        { id: 4, nom: 'Parking', description: 'Frais de stationnement', categorie: 'Administratif', est_recurrent: false }
    ];

    const [formData, setFormData] = useState({
        kilometrageArrivee: '',
        carburantConsomme: '',
        peages: '',
        heureDepart: '',
        heureFinReelle: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        commentaires: '',
        // Champs pour le type de coût
        typeCoutId: '',
        dateCout: '',
        montantCout: '',
        anneeCout: new Date().getFullYear(),
        commentaireCout: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.kilometrageArrivee) {
            newErrors.kilometrageArrivee = 'Le kilométrage d\'arrivée est requis';
        } else if (isNaN(formData.kilometrageArrivee) || parseFloat(formData.kilometrageArrivee) < 0) {
            newErrors.kilometrageArrivee = 'Veuillez entrer un kilométrage valide';
        } else if (deplacement?.kilometrageDepart && parseFloat(formData.kilometrageArrivee) <= deplacement.kilometrageDepart) {
            newErrors.kilometrageArrivee = `Le kilométrage d'arrivée doit être supérieur à ${deplacement.kilometrageDepart} km`;
        }

        if (!formData.carburantConsomme) {
            newErrors.carburantConsomme = 'La consommation de carburant est requise';
        } else if (isNaN(formData.carburantConsomme) || parseFloat(formData.carburantConsomme) < 0) {
            newErrors.carburantConsomme = 'Veuillez entrer une consommation valide';
        }

        if (!formData.peages) {
            newErrors.peages = 'Le montant des péages est requis';
        } else if (isNaN(formData.peages) || parseFloat(formData.peages) < 0) {
            newErrors.peages = 'Veuillez entrer un montant valide';
        }

        if (!formData.heureDepart) {
            newErrors.heureDepart = 'L\'heure de départ est requise';
        }

        if (!formData.heureFinReelle) {
            newErrors.heureFinReelle = 'L\'heure d\'arrivée est requise';
        }

        // Validation pour le type de coût si sélectionné
        if (formData.typeCoutId) {
            if (!formData.dateCout) {
                newErrors.dateCout = 'La date du coût est requise';
            }
            if (!formData.montantCout) {
                newErrors.montantCout = 'Le montant du coût est requis';
            } else if (isNaN(formData.montantCout) || parseFloat(formData.montantCout) < 0) {
                newErrors.montantCout = 'Veuillez entrer un montant valide';
            }
            if (!formData.anneeCout) {
                newErrors.anneeCout = 'L\'année du coût est requise';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulation d'une API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Ici, vous feriez l'appel API pour sauvegarder les données
            const dataToSubmit = {
                deplacementId: deplacement?.id,
                ...formData
            };

            // Ajouter les données de coût seulement si un type de coût est sélectionné
            if (formData.typeCoutId) {
                const selectedTypeCout = typesCouts.find(type => type.id === parseInt(formData.typeCoutId));
                dataToSubmit.coutVehicule = {
                    typeCout: selectedTypeCout,
                    dateCout: formData.dateCout,
                    montant: parseFloat(formData.montantCout),
                    annee: parseInt(formData.anneeCout),
                    commentaire: formData.commentaireCout
                };
            }

            console.log('Données du trajet:', dataToSubmit);

            // Redirection vers la page des déplacements avec un message de succès
            navigate('/ch-deplacement', { 
                state: { 
                    message: 'Trajet terminé avec succès!',
                    type: 'success'
                }
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setErrors({ submit: 'Une erreur est survenue lors de la sauvegarde' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateDistance = () => {
        if (deplacement?.kilometrageDepart && formData.kilometrageArrivee) {
            return parseFloat(formData.kilometrageArrivee) - deplacement.kilometrageDepart;
        }
        return 0;
    };

    if (!deplacement) {
        return (
            <Layout title="Erreur" userType="chauffeur">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Aucun déplacement sélectionné</p>
                        <button 
                            onClick={() => navigate('/ch-deplacement')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Retour aux déplacements
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Finaliser le trajet" userType="chauffeur">
            <div className="max-w-4xl mx-auto">
                {/* En-tête avec informations du déplacement */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900">Finaliser le trajet</h1>
                        </div>
                        <button
                            onClick={() => navigate('/Ch-Deplacement')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Destination:</span> {deplacement.destination}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Véhicule:</span> {deplacement.vehicule}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">heure depart:</span> {deplacement.heureDepart}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Départ réel:</span> {deplacement.heureDebutReel}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Kilométrage départ:</span> {deplacement.kilometrageDepart?.toLocaleString()} km
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Passagers:</span> {deplacement.passagers}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulaire de fin de trajet */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Informations de fin de trajet</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Heure de départ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="h-4 w-4 inline mr-2" />
                                Heure de départ *
                            </label>
                            <input
                                type="time"
                                name="heureDepart"
                                value={formData.heureDepart}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.heureDepart ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.heureDepart && (
                                <p className="text-red-500 text-sm mt-1">{errors.heureDepart}</p>
                            )}
                        </div>

                        {/* Kilométrage d'arrivée */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="h-4 w-4 inline mr-2" />
                                Kilométrage d'arrivée *
                            </label>
                            <input
                                type="number"
                                name="kilometrageArrivee"
                                value={formData.kilometrageArrivee}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.kilometrageArrivee ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Entrez le kilométrage actuel"
                                min="0"
                                step="0.1"
                            />
                            {errors.kilometrageArrivee && (
                                <p className="text-red-500 text-sm mt-1">{errors.kilometrageArrivee}</p>
                            )}
                            {formData.kilometrageArrivee && deplacement.kilometrageDepart && (
                                <p className="text-green-600 text-sm mt-1">
                                    Distance parcourue: {calculateDistance().toFixed(1)} km
                                </p>
                            )}
                        </div>

                        {/* Consommation de carburant */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Fuel className="h-4 w-4 inline mr-2" />
                                Carburant consommé (litres) *
                            </label>
                            <input
                                type="number"
                                name="carburantConsomme"
                                value={formData.carburantConsomme}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.carburantConsomme ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Entrez la consommation en litres"
                                min="0"
                                step="0.1"
                            />
                            {errors.carburantConsomme && (
                                <p className="text-red-500 text-sm mt-1">{errors.carburantConsomme}</p>
                            )}
                        </div>

                        {/* Péages */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CreditCard className="h-4 w-4 inline mr-2" />
                                Péages (DH) *
                            </label>
                            <input
                                type="number"
                                name="peages"
                                value={formData.peages}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.peages ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Entrez le montant des péages"
                                min="0"
                                step="0.01"
                            />
                            {errors.peages && (
                                <p className="text-red-500 text-sm mt-1">{errors.peages}</p>
                            )}
                        </div>

                        {/* Heure d'arrivée */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="h-4 w-4 inline mr-2" />
                                Heure d'arrivée *
                            </label>
                            <input
                                type="time"
                                name="heureFinReelle"
                                value={formData.heureFinReelle}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.heureFinReelle ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.heureFinReelle && (
                                <p className="text-red-500 text-sm mt-1">{errors.heureFinReelle}</p>
                            )}
                        </div>
                        {/* Type de coût (optionnel) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="h-4 w-4 inline mr-2" />
                                Type de coût (optionnel)
                            </label>
                            <select
                                name="typeCoutId"
                                value={formData.typeCoutId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Aucun coût supplémentaire</option>
                                {typesCouts.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.nom} - {type.categorie}
                                    </option>
                                ))}
                            </select>
                            {formData.typeCoutId && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Description:</strong> {typesCouts.find(t => t.id === parseInt(formData.typeCoutId))?.description}
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        <strong>Récurrent:</strong> {typesCouts.find(t => t.id === parseInt(formData.typeCoutId))?.est_recurrent ? 'Oui' : 'Non'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Détails du coût si un type est sélectionné */}
                        {formData.typeCoutId && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <h4 className="font-medium text-gray-800">Détails du coût</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Date du coût */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="h-4 w-4 inline mr-2" />
                                            Date du coût *
                                        </label>
                                        <input
                                            type="date"
                                            name="dateCout"
                                            value={formData.dateCout}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.dateCout ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.dateCout && (
                                            <p className="text-red-500 text-sm mt-1">{errors.dateCout}</p>
                                        )}
                                    </div>

                                    {/* Montant */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="h-4 w-4 inline mr-2" />
                                            Montant (DH) *
                                        </label>
                                        <input
                                            type="number"
                                            name="montantCout"
                                            value={formData.montantCout}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.montantCout ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Entrez le montant"
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.montantCout && (
                                            <p className="text-red-500 text-sm mt-1">{errors.montantCout}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Année */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="h-4 w-4 inline mr-2" />
                                        Année *
                                    </label>
                                    <input
                                        type="number"
                                        name="anneeCout"
                                        value={formData.anneeCout}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.anneeCout ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        min="2020"
                                        max="2030"
                                    />
                                    {errors.anneeCout && (
                                        <p className="text-red-500 text-sm mt-1">{errors.anneeCout}</p>
                                    )}
                                </div>

                                {/* Commentaire du coût */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commentaire
                                    </label>
                                    <textarea
                                        name="commentaireCout"
                                        value={formData.commentaireCout}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Commentaire optionnel sur ce coût..."
                                    />
                                </div>
                            </div>
                        )}
                        {/* Erreur de soumission */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-red-600 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center px-6 py-2 rounded-md text-white font-medium ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Terminer le trajet
                                    </>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/ch-deplacement')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                        </div>
            </div>
        </Layout>
    );
};

export default FillTrajet;