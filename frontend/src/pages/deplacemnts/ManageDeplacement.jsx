import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';

export default function ManageDeplacement() {
    const [deplacements, setDeplacements] = useState([]);
    const [filteredDeplacements, setFilteredDeplacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, planifie, en_cours, termine, annule
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
    }, [deplacements, searchTerm, filterStatus]);

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

        // Filtrage par statut
        if (filterStatus !== 'all') {
            filtered = filtered.filter(dep => dep.statut === filterStatus);
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Recherche */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rechercher
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Destination, chauffeur, motif..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Filtre par statut */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filtrer par statut
                                </label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="planifie">Planifié</SelectItem>
                                        <SelectItem value="en_cours">En cours</SelectItem>
                                        <SelectItem value="termine">Terminé</SelectItem>
                                        <SelectItem value="annule">Annulé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Statistiques */}
                            <div className="flex items-end">
                                <div className="text-sm text-gray-600">
                                    <p>Total: {filteredDeplacements.length} déplacements</p>
                                    <div className="grid grid-cols-2 gap-1 mt-1">
                                        <p>Planifiés: {filteredDeplacements.filter(d => d.statut === 'planifie').length}</p>
                                        <p>En cours: {filteredDeplacements.filter(d => d.statut === 'en_cours').length}</p>
                                        <p>Terminés: {filteredDeplacements.filter(d => d.statut === 'termine').length}</p>
                                        <p>Annulés: {filteredDeplacements.filter(d => d.statut === 'annule').length}</p>
                                    </div>
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
                                                <Select 
                                                    value={deplacement.statut} 
                                                    onValueChange={(value) => handleStatusChange(deplacement.id, value)}
                                                    disabled={deplacement.statut === 'termine'}
                                                >
                                                    <SelectTrigger className={`text-xs px-2 py-1 min-w-[100px] ${
                                                        deplacement.statut === 'termine' 
                                                            ? 'bg-gray-100 cursor-not-allowed' 
                                                            : ''
                                                    }`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="planifie">Planifié</SelectItem>
                                                        <SelectItem value="en_cours">En cours</SelectItem>
                                                        <SelectItem value="termine">Terminé</SelectItem>
                                                        <SelectItem value="annule">Annulé</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        onClick={() => handleEdit(deplacement)}
                                                        disabled={deplacement.statut === 'termine'}
                                                        variant="ghost"
                                                        className={`p-0 h-auto ${
                                                            deplacement.statut === 'termine'
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-blue-600 hover:text-blue-900'
                                                        }`}
                                                    >
                                                        Modifier
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(deplacement.id)}
                                                        disabled={deplacement.statut === 'termine'}
                                                        variant="ghost"
                                                        className={`p-0 h-auto ${
                                                            deplacement.statut === 'termine'
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                    >
                                                        Supprimer
                                                    </Button>
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
                                    <Input
                                        type="text"
                                        value={editingDeplacement.destination}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            destination: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Motif
                                    </label>
                                    <Input
                                        type="text"
                                        value={editingDeplacement.motif}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            motif: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de départ
                                    </label>
                                    <Input
                                        type="date"
                                        value={editingDeplacement.dateDepart}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            dateDepart: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure de départ
                                    </label>
                                    <Input
                                        type="time"
                                        value={editingDeplacement.heureDepart}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            heureDepart: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de retour
                                    </label>
                                    <Input
                                        type="date"
                                        value={editingDeplacement.dateRetour}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            dateRetour: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure de retour
                                    </label>
                                    <Input
                                        type="time"
                                        value={editingDeplacement.heureRetour}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            heureRetour: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passagers
                                    </label>
                                    <Input
                                        type="text"
                                        value={editingDeplacement.passagers}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            passagers: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Distance
                                    </label>
                                    <Input
                                        type="text"
                                        value={editingDeplacement.distance}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            distance: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coût
                                    </label>
                                    <Input
                                        type="text"
                                        value={editingDeplacement.cout}
                                        onChange={(e) => setEditingDeplacement({
                                            ...editingDeplacement,
                                            cout: e.target.value
                                        })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingDeplacement(null);
                                    }}
                                    variant="secondary"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSaveEdit}
                                    variant="primary"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}