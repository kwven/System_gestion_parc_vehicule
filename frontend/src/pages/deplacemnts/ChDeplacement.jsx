import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Car, Users, MapPin, Play, Square, CheckCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import Layout from '../../components/common/Layout';

export default function ChDeplacement() {
    const navigate = useNavigate();
    const location = useLocation();
    const [deplacements, setDeplacements] = useState([]);
    const [chauffeurId] = useState(1); // ID du chauffeur connecté (à récupérer depuis l'authentification)
    const [loading, setLoading] = useState(true);
    const [showStartModal, setShowStartModal] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [selectedDeplacement, setSelectedDeplacement] = useState(null);
    const [startKilometrage, setStartKilometrage] = useState('');
    const [message, setMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Données de démonstration avec nouveaux champs
    const mockDeplacements = [
        {
            id: 1,
            chauffeurId: 1,
            destination: "Casablanca - Rabat",
            dateDepart: "2024-01-15",
            heureDepart: "08:00",
            dateRetour: "2024-01-15",
            heureRetour: "18:00",
            vehicule: "Toyota Camry - ABC123",
            statut: "planifie",
            passagers: "M. Ahmed, Mme. Fatima",
            distance: "87 km",
            motif: "Réunion d'affaires",
            kilometrageDepart: null,
            heureDebutReel: null
        },
        {
            id: 2,
            chauffeurId: 1,
            destination: "Rabat - Fès",
            dateDepart: "2024-01-10",
            heureDepart: "09:00",
            dateRetour: "2024-01-10",
            heureRetour: "17:30",
            vehicule: "Mercedes E-Class - XYZ789",
            statut: "en_cours",
            passagers: "M. Hassan",
            distance: "210 km",
            motif: "Transport VIP",
            kilometrageDepart: 45230,
            heureDebutReel: "09:15"
        },
        {
            id: 3,
            chauffeurId: 1,
            destination: "Casablanca - Marrakech",
            dateDepart: "2024-01-08",
            heureDepart: "07:00",
            dateRetour: "2024-01-08",
            heureRetour: "20:00",
            vehicule: "BMW 5 Series - DEF456",
            statut: "termine",
            passagers: "Délégation commerciale",
            distance: "240 km",
            motif: "Conférence",
            kilometrageDepart: 32100,
            kilometrageArrivee: 32340,
            carburantConsomme: 28.5,
            peages: 45,
            description: "Trajet sans incident"
        },
        {
            id: 4,
            chauffeurId: 1,
            destination: "Rabat - Tanger",
            dateDepart: "2024-01-05",
            heureDepart: "08:30",
            dateRetour: "2024-01-05",
            heureRetour: "19:00",
            vehicule: "Audi A6 - GHI789",
            statut: "termine",
            passagers: "M. Khalid, Mme. Aicha",
            distance: "320 km",
            motif: "Mission officielle",
            kilometrageDepart: 28500,
            kilometrageArrivee: 28820,
            carburantConsomme: 35.2,
            peages: 60,
            description: "Trajet réussi"
        },
        {
            id: 5,
            chauffeurId: 1,
            destination: "Fès - Meknès",
            dateDepart: "2024-01-03",
            heureDepart: "10:00",
            dateRetour: "2024-01-03",
            heureRetour: "16:30",
            vehicule: "Peugeot 508 - JKL012",
            statut: "termine",
            passagers: "Équipe technique",
            distance: "60 km",
            motif: "Maintenance",
            kilometrageDepart: 15200,
            kilometrageArrivee: 15260,
            carburantConsomme: 8.5,
            peages: 0,
            description: "Mission technique accomplie"
        },
        {
            id: 6,
            chauffeurId: 1,
            destination: "Agadir - Essaouira",
            dateDepart: "2024-01-01",
            heureDepart: "09:00",
            dateRetour: "2024-01-01",
            heureRetour: "18:00",
            vehicule: "Renault Talisman - MNO345",
            statut: "termine",
            passagers: "Groupe touristique",
            distance: "175 km",
            motif: "Excursion",
            kilometrageDepart: 22100,
            kilometrageArrivee: 22275,
            carburantConsomme: 18.7,
            peages: 25,
            description: "Excursion réussie"
        },
        {
            id: 7,
            chauffeurId: 1,
            destination: "Casablanca - El Jadida",
            dateDepart: "2023-12-28",
            heureDepart: "14:00",
            dateRetour: "2023-12-28",
            heureRetour: "20:00",
            vehicule: "Volkswagen Passat - PQR678",
            statut: "termine",
            passagers: "M. Omar",
            distance: "100 km",
            motif: "Rendez-vous client",
            kilometrageDepart: 18900,
            kilometrageArrivee: 19000,
            carburantConsomme: 12.3,
            peages: 15,
            description: "Rendez-vous client réussi"
        }
    ];

    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            const mesDeplacements = mockDeplacements.filter(dep => dep.chauffeurId === chauffeurId);
            setDeplacements(mesDeplacements);
            setLoading(false);
        }, 1000);

        // Afficher le message de succès s'il y en a un
        if (location.state?.message) {
            setMessage({
                text: location.state.message,
                type: location.state.type || 'success'
            });
            // Effacer le message après 5 secondes
            setTimeout(() => setMessage(null), 5000);
        }
    }, [chauffeurId, location.state]);

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
            case 'planifie': return 'border-blue-500';
            case 'en_cours': return 'border-orange-500';
            case 'termine': return 'border-green-500';
            default: return 'border-gray-500';
        }
    };

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'planifie': return 'bg-blue-100 text-blue-800';
            case 'en_cours': return 'bg-orange-100 text-orange-800';
            case 'termine': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'planifie': return 'Planifié';
            case 'en_cours': return 'En cours';
            case 'termine': return 'Terminé';
            default: return 'Inconnu';
        }
    };

    const handleStartTrip = (deplacement) => {
        setSelectedDeplacement(deplacement);
        setShowStartModal(true);
    };

    const handleEndTrip = (deplacement) => {
        // Navigation vers la page de finalisation du trajet
        navigate('/fill-trajet', { 
            state: { 
                deplacement: deplacement 
            }
        });
    };

    const confirmStartTrip = () => {
        if (!startKilometrage) {
            alert('Veuillez entrer le kilométrage de départ');
            return;
        }

        // Mettre à jour le déplacement
        const updatedDeplacements = deplacements.map(dep => {
            if (dep.id === selectedDeplacement.id) {
                return {
                    ...dep,
                    statut: 'en_cours',
                    kilometrageDepart: parseFloat(startKilometrage),
                    heureDebutReel: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                };
            }
            return dep;
        });

        setDeplacements(updatedDeplacements);
        setShowStartModal(false);
        setSelectedDeplacement(null);
        setStartKilometrage('');
        setMessage({ text: 'Trajet commencé avec succès!', type: 'success' });
        setTimeout(() => setMessage(null), 5000);
    };

    const confirmEndTrip = () => {
        // Cette fonction ne sera plus utilisée car on navigue vers FillTrajet
        setShowEndModal(false);
        setSelectedDeplacement(null);
    };

    // Séparer les déplacements par statut
    const deplacementsPlanifies = deplacements.filter(dep => dep.statut === 'planifie');
    const deplacementsEnCours = deplacements.filter(dep => dep.statut === 'en_cours');
    const deplacementsTermines = deplacements.filter(dep => dep.statut === 'termine');

    // Pagination pour l'historique
    const totalPages = Math.ceil(deplacementsTermines.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDeplacementsTermines = deplacementsTermines.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const DeplacementCard = ({ deplacement }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ${getStatusColor(deplacement.statut)}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{deplacement.destination}</h3>
                    <p className="text-sm text-gray-600">{deplacement.motif}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(deplacement.statut)}`}>
                    {getStatusText(deplacement.statut)}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-medium">Date:</span> {formatDate(deplacement.dateDepart)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Heure de Départ:</span> {deplacement.heureDepart}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        <span className="font-medium">Véhicule:</span> {deplacement.vehicule}
                    </p>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-medium">Passagers:</span> {deplacement.passagers}
                    </p>
                </div>
            </div>
            
            {/* Informations de trajet pour les déplacements terminés */}
            {deplacement.statut === 'termine' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Informations de trajet</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Kilométrage départ:</span>
                            <p className="font-medium">{deplacement.kilometrageDepart?.toLocaleString()} km</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Kilométrage arrivée:</span>
                            <p className="font-medium">{deplacement.kilometrageArrivee?.toLocaleString()} km</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Carburant:</span>
                            <p className="font-medium">{deplacement.carburantConsomme} L</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Péages:</span>
                            <p className="font-medium">{deplacement.peages} DH</p>
                        </div>
                        {deplacement.heureRetour && (
                        <p className="text-sm text-gray-800 mb-1">
                            <span className="text-gray-500">Heure de Retour:</span> {deplacement.heureRetour}
                        </p>
                    )}
                    </div>
                    {deplacement.description && (
                        <div className="mt-2">
                            <span className="text-gray-500 text-sm">Description:</span>
                            <p className="text-sm text-gray-700">{deplacement.description}</p>
                        </div>
                    )}
                </div>
            )}
            
            {/* Actions selon le statut */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                    {deplacement.statut === 'planifie' && (
                        <>
                            <button 
                                onClick={() => handleStartTrip(deplacement)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Commencer le trajet
                            </button>
                        </>
                    )}
                    {deplacement.statut === 'en_cours' && (
                        <>
                            <button 
                                onClick={() => handleEndTrip(deplacement)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm flex items-center"
                            >
                                <Square className="h-4 w-4 mr-2" />
                                Terminer le trajet
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <Layout title="Mes Déplacements" userType="Chauffeur">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Mes Déplacements" userType="Chauffeur">
            <div className="max-w-6xl mx-auto">
                {/* Message de notification */}
                {message && (
                    <div className={`mb-6 p-4 rounded-md ${
                        message.type === 'success' 
                            ? 'bg-green-50 border border-green-200 text-green-700' 
                            : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {message.text}
                        </div>
                    </div>
                )}

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Déplacements</h1>
                    <p className="text-gray-600">Gérez vos déplacements planifiés et consultez votre historique</p>
                </div>

                {/* Déplacements en cours */}
                {deplacementsEnCours.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Trajets en cours</h2>
                            <span className="ml-3 bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {deplacementsEnCours.length}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {deplacementsEnCours.map(deplacement => (
                                <DeplacementCard key={deplacement.id} deplacement={deplacement} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Déplacements planifiés */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Déplacements Planifiés</h2>
                        <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {deplacementsPlanifies.length}
                        </span>
                    </div>
                    
                    {deplacementsPlanifies.length > 0 ? (
                        <div className="space-y-4">
                            {deplacementsPlanifies.map(deplacement => (
                                <DeplacementCard key={deplacement.id} deplacement={deplacement} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun déplacement planifié</h3>
                            <p className="text-gray-500">Vous n'avez actuellement aucun déplacement planifié.</p>
                        </div>
                    )}
                </div>

                {/* Historique des déplacements */}
                <div>
                    <div className="flex items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Historique des Déplacements</h2>
                        <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {deplacementsTermines.length}
                        </span>
                    </div>
                    
                    {deplacementsTermines.length > 0 ? (
                        <div className="space-y-4">
                            {currentDeplacementsTermines.map(deplacement => (
                                <DeplacementCard key={deplacement.id} deplacement={deplacement} />
                            ))}
                            
                            {/* Contrôles de pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {startIndex + 1} à {Math.min(endIndex, deplacementsTermines.length)} sur {deplacementsTermines.length} déplacements
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="flex items-center"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Précédent
                                        </Button>
                                        
                                        {[...Array(totalPages)].map((_, index) => {
                                            const page = index + 1;
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="min-w-[40px]"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center"
                                        >
                                            Suivant
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun historique</h3>
                            <p className="text-gray-500">Vous n'avez encore effectué aucun déplacement.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de début de trajet */}
            {showStartModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Commencer le trajet</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Destination: {selectedDeplacement?.destination}
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kilométrage de départ *
                                </label>
                                <input
                                    type="number"
                                    value={startKilometrage}
                                    onChange={(e) => setStartKilometrage(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Entrez le kilométrage actuel"
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={confirmStartTrip}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Confirmer
                                </button>
                                <button
                                    onClick={() => {
                                        setShowStartModal(false);
                                        setSelectedDeplacement(null);
                                        setStartKilometrage('');
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}