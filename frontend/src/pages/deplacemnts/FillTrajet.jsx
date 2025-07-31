import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Clock, Fuel, CreditCard, MapPin, Save, ArrowLeft, Calendar } from 'lucide-react';
import Layout from '../../components/common/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const FillTrajet = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deplacement } = location.state || {};

    const [formData, setFormData] = useState({
        kilometrageArrivee: '',
        carburantConsomme: '',
        peages: '',
        heurRetour: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        commentaires: ''
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

        if (!formData.heureFinReelle) {
            newErrors.heureFinReelle = 'L\'heure d\'arrivée est requise';
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
            console.log('Données du trajet:', {
                deplacementId: deplacement?.id,
                ...formData
            });

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
            <Layout title="Erreur" userType="Chauffeur">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Aucun déplacement sélectionné</p>
                        <Button 
                            onClick={() => navigate('/ch-deplacement')}
                            variant="primary"
                        >
                            Retour aux déplacements
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Finaliser le trajet" userType="Chauffeur">
            <div className="max-w-4xl mx-auto">
                {/* En-tête avec informations du déplacement */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Finaliser le trajet</h2>
                        <Button
                            onClick={() => navigate('/ch-deplacement')}
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
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
                        {/* Kilométrage d'arrivée */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="h-4 w-4 inline mr-2" />
                                Kilométrage d'arrivée *
                            </label>
                            <Input
                                type="number"
                                name="kilometrageArrivee"
                                value={formData.kilometrageArrivee}
                                onChange={handleInputChange}
                                hasError={!!errors.kilometrageArrivee}
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
                            <Input
                                type="number"
                                name="carburantConsomme"
                                value={formData.carburantConsomme}
                                onChange={handleInputChange}
                                hasError={!!errors.carburantConsomme}
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
                            <Input
                                type="number"
                                name="peages"
                                value={formData.peages}
                                onChange={handleInputChange}
                                hasError={!!errors.peages}
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
                            <Input
                                type="time"
                                name="heureFinReelle"
                                value={formData.heureFinReelle}
                                onChange={handleInputChange}
                                hasError={!!errors.heureFinReelle}
                            />
                            {errors.heureFinReelle && (
                                <p className="text-red-500 text-sm mt-1">{errors.heureFinReelle}</p>
                            )}
                        </div>
                        {/* date d'arrivée */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="h-4 w-4 inline mr-2" />
                                Date d'arrivée *
                            </label>
                            <Input
                                type="date"
                                name="dateArrivee"
                                value={formData.dateArrivee}
                                onChange={handleInputChange}
                                hasError={!!errors.dateArrivee}
                            />
                            {errors.dateArrivee && (
                                <p className="text-red-500 text-sm mt-1">{errors.dateArrivee}</p>
                            )}
                        </div>
                        {/* Erreur de soumission */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-red-600 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div className="flex space-x-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                variant="primary"
                                className="bg-green-500 hover:bg-green-600"
                            >
                                {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
                                {isSubmitting ? 'Enregistrement...' : 'Terminer le trajet'}
                            </Button>
                            
                            <Button
                                type="button"
                                onClick={() => navigate('/ch-deplacement')}
                                variant="secondary"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default FillTrajet;