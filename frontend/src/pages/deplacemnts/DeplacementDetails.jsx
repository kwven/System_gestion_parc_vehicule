import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, Car, Users, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Layout from '../../components/common/Layout';
import { Button } from '../../components/ui/Button';

const DeplacementDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deplacement, setDeplacement] = useState(null);
    const [loading, setLoading] = useState(true);

    // Données de démonstration
    const mockDeplacements = [
        {
            id: 1,
            chauffeurNom: "Ahmed Benali",
            chauffeurTelephone: "+212 6 12 34 56 78",
            destination: "Casablanca - Rabat",
            dateDepart: "2024-01-15",
            heureDepart: "08:00",
            dateRetour: "2024-01-15",
            heureRetour: "18:00",
            vehicule: "Toyota Camry - ABC123",
            statut: "en_attente",
            passagers: "M. Ahmed, Mme. Fatima",
            motif: "Réunion d'affaires",
            distance: "87 km",
            description: "Transport pour réunion importante avec les partenaires de Casablanca",
            dateCreation: "2024-01-10",
            validePar: null,
            dateValidation: null,
            commentaireValidation: null
        },
        {
            id: 2,
            chauffeurNom: "Hassan Alami",
            chauffeurTelephone: "+212 6 87 65 43 21",
            destination: "Rabat - Fès",
            dateDepart: "2024-01-12",
            heureDepart: "09:00",
            dateRetour: "2024-01-12",
            heureRetour: "17:30",
            vehicule: "Mercedes E-Class - XYZ789",
            statut: "approuve",
            passagers: "M. Hassan",
            motif: "Transport VIP",
            distance: "210 km",
            description: "Transport VIP pour délégation officielle",
            dateCreation: "2024-01-08",
            validePar: "Direction Régionale",
            dateValidation: "2024-01-09",
            commentaireValidation: "Demande approuvée - Transport prioritaire"
        },
        {
            id: 3,
            chauffeurNom: "Omar Tazi",
            chauffeurTelephone: "+212 6 11 22 33 44",
            destination: "Casablanca - Marrakech",
            dateDepart: "2024-01-08",
            heureDepart: "07:00",
            dateRetour: "2024-01-08",
            heureRetour: "20:00",
            vehicule: "BMW 5 Series - DEF456",
            statut: "rejete",
            passagers: "Délégation commerciale",
            motif: "Conférence",
            distance: "240 km",
            description: "Transport pour conférence annuelle",
            dateCreation: "2024-01-05",
            validePar: "Direction Centrale",
            dateValidation: "2024-01-06",
            commentaireValidation: "Demande rejetée - Véhicule non disponible à cette date"
        }
    ];

    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            const foundDeplacement = mockDeplacements.find(dep => dep.id === parseInt(id));
            setDeplacement(foundDeplacement);
            setLoading(false);
        }, 1000);
    }, [id]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'approuve':
                return 'bg-green-100 text-green-800';
            case 'rejete':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'en_attente':
                return 'En attente';
            case 'approuve':
                return 'Approuvé';
            case 'rejete':
                return 'Rejeté';
            default:
                return statut;
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'en_attente':
                return <AlertCircle className="h-5 w-5" />;
            case 'approuve':
                return <CheckCircle className="h-5 w-5" />;
            case 'rejete':
                return <XCircle className="h-5 w-5" />;
            default:
                return <AlertCircle className="h-5 w-5" />;
        }
    };

    if (loading) {
        return (
            <Layout title="Détails du Déplacement">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    if (!deplacement) {
        return (
            <Layout title="Détails du Déplacement">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Déplacement non trouvé</h3>
                        <p className="text-gray-500 mb-4">Le déplacement demandé n'existe pas ou a été supprimé.</p>
                        <Button onClick={() => navigate('/deplacements/validate')} variant="primary">
                            Retour à la liste
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Détails du Déplacement">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="mb-6">
                    <Button
                        onClick={() => navigate('/deplacements/validate')}
                        variant="secondary"
                        className="mb-4 flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la liste
                    </Button>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Détails du Déplacement</h1>
                            <p className="text-gray-600">Demande #{deplacement.id}</p>
                        </div>
                        <div className={`flex items-center px-3 py-2 rounded-full ${getStatusColor(deplacement.statut)}`}>
                            {getStatusIcon(deplacement.statut)}
                            <span className="ml-2 font-medium">{getStatusText(deplacement.statut)}</span>
                        </div>
                    </div>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Informations du trajet */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2" />
                            Informations du Trajet
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Destination</label>
                                <p className="text-gray-900">{deplacement.destination}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Distance</label>
                                <p className="text-gray-900">{deplacement.distance}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Motif</label>
                                <p className="text-gray-900">{deplacement.motif}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <p className="text-gray-900">{deplacement.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Informations temporelles */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Planification
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date de départ</label>
                                <p className="text-gray-900">{formatDate(deplacement.dateDepart)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Heure de départ</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {deplacement.heureDepart}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Heure de retour</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {deplacement.heureRetour}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date de création</label>
                                <p className="text-gray-900">{formatDate(deplacement.dateCreation)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations du chauffeur et véhicule */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Chauffeur */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Chauffeur
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nom</label>
                                <p className="text-gray-900">{deplacement.chauffeurNom}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                                <p className="text-gray-900">{deplacement.chauffeurTelephone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Véhicule et passagers */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Car className="h-5 w-5 mr-2" />
                            Véhicule & Passagers
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Véhicule</label>
                                <p className="text-gray-900">{deplacement.vehicule}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    Passagers
                                </label>
                                <p className="text-gray-900">{deplacement.passagers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations de validation */}
                {(deplacement.statut === 'approuve' || deplacement.statut === 'rejete') && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Informations de Validation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Validé par</label>
                                <p className="text-gray-900">{deplacement.validePar}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date de validation</label>
                                <p className="text-gray-900">{formatDate(deplacement.dateValidation)}</p>
                            </div>
                            {deplacement.commentaireValidation && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Commentaire</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{deplacement.commentaireValidation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DeplacementDetails;