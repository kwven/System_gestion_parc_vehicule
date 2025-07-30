import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';

export default function ManageDeplacement() {
    const [deplacements, setDeplacements] = useState([]);
    const [filteredDeplacements, setFilteredDeplacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, month, year
    const [selectedDate, setSelectedDate] = useState('');
    const [editingDeplacement, setEditingDeplacement] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Données de démonstration - à remplacer par des appels API
    const mockDeplacements = [
        {
            id: 1,
            chauffeurId: 1,
            chauffeurNom: "Ahmed Benali",
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
            cout: "450 DH"
        },
        {
            id: 2,
            chauffeurId: 2,
            chauffeurNom: "Hassan Alami",
            destination: "Rabat - Fès",
            dateDepart: "2024-01-10",
            heureDepart: "09:00",
            dateRetour: "2024-01-10",
            heureRetour: "17:30",
            vehicule: "Mercedes E-Class - XYZ789",
            statut: "termine",
            passagers: "M. Hassan",
            distance: "210 km",
            motif: "Transport VIP",
            cout: "850 DH"
        },
        {
            id: 3,
            chauffeurId: 1,
            chauffeurNom: "Ahmed Benali",
            destination: "Casablanca - Marrakech",
            dateDepart: "2024-01-20",
            heureDepart: "07:00",
            dateRetour: "2024-01-20",
            heureRetour: "20:00",
            vehicule: "BMW 5 Series - DEF456",
            statut: "planifie",
            passagers: "Délégation commerciale",
            distance: "240 km",
            motif: "Conférence",
            cout: "950 DH"
        },
        {
            id: 4,
            chauffeurId: 3,
            chauffeurNom: "Omar Tazi",
            destination: "Tanger - Tétouan",
            dateDepart: "2023-12-12",
            heureDepart: "10:00",
            dateRetour: "2023-12-12",
            heureRetour: "16:00",
            vehicule: "Audi A6 - GHI789",
            statut: "termine",
            passagers: "M. Omar",
            distance: "65 km",
            motif: "Transport personnel",
            cout: "320 DH"
        },
        {
            id: 5,
            chauffeurId: 2,
            chauffeurNom: "Hassan Alami",
            destination: "Agadir - Essaouira",
            dateDepart: "2024-01-25",
            heureDepart: "08:30",
            dateRetour: "2024-01-25",
            heureRetour: "19:00",
            vehicule: "Volkswagen Passat - JKL012",
            statut: "en_cours",
            passagers: "Famille Bennani",
            distance: "175 km",
            motif: "Tourisme",
            cout: "700 DH"
        }
    ];

    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            setDeplacements(mockDeplacements);
            setFilteredDeplacements(mockDeplacements);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        filterDeplacements();
    }, [deplacements, searchTerm, filterPeriod, selectedDate]);

    const filterDeplacements = () => {
        let filtered = deplacements;

        // Filtrage par terme de recherche
        if (searchTerm) {
            filtered = filtered.filter(dep => 
                dep.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dep.chauffeurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dep.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dep.vehicule.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par période
        if (filterPeriod !== 'all') {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();
            const currentDate = today.toISOString().split('T')[0];

            filtered = filtered.filter(dep => {
                const depDate = new Date(dep.dateDepart);
                
                switch (filterPeriod) {
                    case 'today':
                        return dep.dateDepart === currentDate;
                    case 'month':
                        return depDate.getFullYear() === currentYear && depDate.getMonth() === currentMonth;
                    case 'year':
                        return depDate.getFullYear() === currentYear;
                    case 'custom':
                        if (selectedDate) {
                            return dep.dateDepart === selectedDate;
                        }
                        return true;
                    default:
                        return true;
                }
            });
        }

        setFilteredDeplacements(filtered);
    };

    const handleEdit = (deplacement) => {
        if (deplacement.statut === 'termine') {
            alert('Impossible de modifier un déplacement terminé!');
            return;
        }
        setEditingDeplacement({ ...deplacement });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        const updatedDeplacements = deplacements.map(dep => 
            dep.id === editingDeplacement.id ? editingDeplacement : dep
        );
        setDeplacements(updatedDeplacements);
        setShowEditModal(false);
        setEditingDeplacement(null);
    };

    const handleDelete = (id) => {
        const deplacement = deplacements.find(dep => dep.id === id);
        if (deplacement.statut === 'termine') {
            alert('Impossible de supprimer un déplacement terminé!');
            return;
        }
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce déplacement?')) {
            setDeplacements(deplacements.filter(dep => dep.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        const updatedDeplacements = deplacements.map(dep => 
            dep.id === id ? { ...dep, statut: newStatus } : dep
        );
        setDeplacements(updatedDeplacements);
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'planifie': return 'bg-blue-100 text-blue-800';
            case 'en_cours': return 'bg-yellow-100 text-yellow-800';
            case 'termine': return 'bg-green-100 text-green-800';
            case 'annule': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'planifie': return 'Planifié';
            case 'en_cours': return 'En cours';
            case 'termine': return 'Terminé';
            case 'annule': return 'Annulé';
            default: return statut;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Déplacements</h1>
                        <p className="text-gray-600">Gérez et modifiez les déplacements du parc automobile</p>
                    </div>

                    {/* Filtres et recherche */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Recherche */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rechercher
                                </label>
                                <input
                                    type="text"
                                    placeholder="Destination, chauffeur, motif..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Filtre par période */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Période
                                </label>
                                <select
                                    value={filterPeriod}
                                    onChange={(e) => setFilterPeriod(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Toutes les périodes</option>
                                    <option value="today">Aujourd'hui</option>
                                    <option value="month">Ce mois</option>
                                    <option value="year">Cette année</option>
                                    <option value="custom">Date personnalisée</option>
                                </select>
                            </div>

                            {/* Date personnalisée */}
                            {filterPeriod === 'custom' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {/* Statistiques */}
                            <div className="flex items-end">
                                <div className="text-sm text-gray-600">
                                    <p>Total: {filteredDeplacements.length} déplacements</p>
                                    <p>Planifiés: {filteredDeplacements.filter(d => d.statut === 'planifie').length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau des déplacements */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Destination
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chauffeur
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Véhicule
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coût
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredDeplacements.map((deplacement) => (
                                        <tr key={deplacement.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {deplacement.destination}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {deplacement.motif}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {deplacement.chauffeurNom}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(deplacement.dateDepart)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {deplacement.heureDepart} - {deplacement.heureRetour}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {deplacement.vehicule}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    getStatusColor(deplacement.statut)
                                                }`}>
                                                    {getStatusText(deplacement.statut)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {deplacement.cout}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(deplacement)}
                                                        disabled={deplacement.statut === 'termine'}
                                                        className={`${
                                                            deplacement.statut === 'termine'
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-blue-600 hover:text-blue-900'
                                                        }`}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(deplacement.id)}
                                                        disabled={deplacement.statut === 'termine'}
                                                        className={`${
                                                            deplacement.statut === 'termine'
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                    >
                                                        Supprimer
                                                    </button>
                                                    {deplacement.statut !== 'termine' && (
                                                        <select
                                                            value={deplacement.statut}
                                                            onChange={(e) => handleStatusChange(deplacement.id, e.target.value)}
                                                            className="text-xs border border-gray-300 rounded px-2 py-1"
                                                        >
                                                            <option value="planifie">Planifié</option>
                                                            <option value="en_cours">En cours</option>
                                                            <option value="termine">Terminé</option>
                                                            <option value="annule">Annulé</option>
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredDeplacements.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun déplacement trouvé</h3>
                                <p className="text-gray-500">Aucun déplacement ne correspond aux critères de recherche.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de modification */}
            {showEditModal && editingDeplacement && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Modifier le déplacement
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDeplacement.destination}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            destination: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Motif
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDeplacement.motif}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            motif: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de départ
                                    </label>
                                    <input
                                        type="date"
                                        value={editingDeplacement.dateDepart}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            dateDepart: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure de départ
                                    </label>
                                    <input
                                        type="time"
                                        value={editingDeplacement.heureDepart}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            heureDepart: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de retour
                                    </label>
                                    <input
                                        type="date"
                                        value={editingDeplacement.dateRetour}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            dateRetour: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure de retour
                                    </label>
                                    <input
                                        type="time"
                                        value={editingDeplacement.heureRetour}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            heureRetour: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passagers
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDeplacement.passagers}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            passagers: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Distance
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDeplacement.distance}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            distance: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coût
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDeplacement.cout}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            cout: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingDeplacement(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}