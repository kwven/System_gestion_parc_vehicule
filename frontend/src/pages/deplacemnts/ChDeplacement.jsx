import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';

export default function ChDeplacement() {
    const [deplacements, setDeplacements] = useState([]);
    const [chauffeurId] = useState(1); // ID du chauffeur connecté (à récupérer depuis l'authentification)
    const [loading, setLoading] = useState(true);

    // Données de démonstration - à remplacer par des appels API
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
            motif: "Réunion d'affaires"
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
            statut: "termine",
            passagers: "M. Hassan",
            distance: "210 km",
            motif: "Transport VIP"
        },
        {
            id: 3,
            chauffeurId: 1,
            destination: "Casablanca - Marrakech",
            dateDepart: "2024-01-20",
            heureDepart: "07:00",
            dateRetour: "2024-01-20",
            heureRetour: "20:00",
            vehicule: "BMW 5 Series - DEF456",
            statut: "planifie",
            passagers: "Délégation commerciale",
            distance: "240 km",
            motif: "Conférence"
        },
        {
            id: 4,
            chauffeurId: 2, // Autre chauffeur - ne doit pas apparaître
            destination: "Tanger - Tétouan",
            dateDepart: "2024-01-12",
            heureDepart: "10:00",
            dateRetour: "2024-01-12",
            heureRetour: "16:00",
            vehicule: "Audi A6 - GHI789",
            statut: "termine",
            passagers: "M. Omar",
            distance: "65 km",
            motif: "Transport personnel"
        }
    ];

    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            // Filtrer les déplacements pour le chauffeur connecté uniquement
            const mesDeplacements = mockDeplacements.filter(dep => dep.chauffeurId === chauffeurId);
            setDeplacements(mesDeplacements);
            setLoading(false);
        }, 1000);
    }, [chauffeurId]);

    // Séparer les déplacements planifiés et terminés
    const deplacementsPlanifies = deplacements.filter(dep => dep.statut === 'planifie');
    const deplacementsTermines = deplacements.filter(dep => dep.statut === 'termine');

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const DeplacementCard = ({ deplacement, isPlanifie }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ${
            isPlanifie ? 'border-blue-500' : 'border-green-500'
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{deplacement.destination}</h3>
                    <p className="text-sm text-gray-600">{deplacement.motif}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPlanifie 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                }`}>
                    {isPlanifie ? 'Planifié' : 'Terminé'}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Date:</span> {formatDate(deplacement.dateDepart)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Départ:</span> {deplacement.heureDepart}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Retour:</span> {deplacement.heureRetour}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Véhicule:</span> {deplacement.vehicule}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Passagers:</span> {deplacement.passagers}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Distance:</span> {deplacement.distance}
                    </p>
                </div>
            </div>
            
            {isPlanifie && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
                            Voir détails
                        </button>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">
                            Contacter admin
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Déplacements</h1>
                    <p className="text-gray-600">Consultez vos déplacements planifiés et votre historique</p>
                </div>

                {/* Notification pour les déplacements planifiés */}
                {deplacementsPlanifies.length > 0 && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Rappel:</span> Vous avez {deplacementsPlanifies.length} déplacement(s) planifié(s). N'oubliez pas de vérifier les détails.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section des déplacements planifiés */}
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
                                <DeplacementCard 
                                    key={deplacement.id} 
                                    deplacement={deplacement} 
                                    isPlanifie={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun déplacement planifié</h3>
                            <p className="text-gray-500">Vous n'avez actuellement aucun déplacement planifié.</p>
                        </div>
                    )}
                </div>

                {/* Section de l'historique */}
                <div>
                    <div className="flex items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Historique des Déplacements</h2>
                        <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {deplacementsTermines.length}
                        </span>
                    </div>
                    
                    {deplacementsTermines.length > 0 ? (
                        <div className="space-y-4">
                            {deplacementsTermines.map(deplacement => (
                                <DeplacementCard 
                                    key={deplacement.id} 
                                    deplacement={deplacement} 
                                    isPlanifie={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun historique</h3>
                            <p className="text-gray-500">Vous n'avez encore effectué aucun déplacement.</p>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </Layout>
    );
}