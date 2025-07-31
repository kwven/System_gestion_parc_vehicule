import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';

const ToValidate = ({ userType }) => {
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filteredRequests, setFilteredRequests] = useState([]);

    // Mock data for demonstration - replace with API calls
    const mockRequests = [
        {
            id: 1,
            chauffeurNom: "Ahmed Benali",
            destination: "Casablanca - Rabat",
            dateDepart: "2024-01-20",
            heureDepart: "08:00",
            dateRetour: "2024-01-20",
            heureRetour: "18:00",
            motif: "Réunion d'affaires",
            passagers: "M. Ahmed, Mme. Fatima",
            vehiculeRequis: "Berline",
            priorite: "normale",
            statut: "en_attente",
            dateCreation: "2024-01-15",
            commentaire: "Réunion importante avec les partenaires",
            distance: "87 km",
            coutEstime: "450 DH"
        },
        {
            id: 2,
            chauffeurNom: "Hassan Alami",
            destination: "Rabat - Fès",
            dateDepart: "2024-01-22",
            heureDepart: "09:00",
            dateRetour: "2024-01-22",
            heureRetour: "17:30",
            motif: "Transport VIP",
            passagers: "Délégation ministérielle",
            vehiculeRequis: "Luxe",
            priorite: "urgente",
            statut: "en_attente",
            dateCreation: "2024-01-16",
            commentaire: "Transport officiel - protocole strict",
            distance: "210 km",
            coutEstime: "850 DH"
        },
        {
            id: 3,
            chauffeurNom: "Omar Tazi",
            destination: "Casablanca - Marrakech",
            dateDepart: "2024-01-25",
            heureDepart: "07:00",
            dateRetour: "2024-01-25",
            heureRetour: "20:00",
            motif: "Conférence",
            passagers: "Équipe commerciale (4 personnes)",
            vehiculeRequis: "Minibus",
            priorite: "normale",
            statut: "approuve",
            dateCreation: "2024-01-14",
            commentaire: "Participation à la conférence annuelle",
            distance: "240 km",
            coutEstime: "950 DH"
        },
        {
            id: 4,
            chauffeurNom: "Fatima Zahra",
            destination: "Agadir - Essaouira",
            dateDepart: "2024-01-18",
            heureDepart: "10:00",
            dateRetour: "2024-01-18",
            heureRetour: "16:00",
            motif: "Inspection",
            passagers: "Équipe d'audit",
            vehiculeRequis: "SUV",
            priorite: "normale",
            statut: "rejete",
            dateCreation: "2024-01-12",
            commentaire: "Inspection des installations régionales",
            distance: "175 km",
            coutEstime: "700 DH",
            motifRejet: "Véhicule non disponible à cette date"
        }
    ];

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setPendingRequests(mockRequests);
            setFilteredRequests(mockRequests);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        filterRequests();
    }, [pendingRequests, searchTerm, filterStatus]);

    const filterRequests = () => {
        let filtered = pendingRequests;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(request =>
                request.chauffeurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.motif.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(request => request.statut === filterStatus);
        }

        setFilteredRequests(filtered);
    };

    const handleApprove = (id) => {
        const updatedRequests = pendingRequests.map(request =>
            request.id === id ? { ...request, statut: 'approuve' } : request
        );
        setPendingRequests(updatedRequests);
    };

    const handleReject = (id, motifRejet) => {
        const updatedRequests = pendingRequests.map(request =>
            request.id === id ? { ...request, statut: 'rejete', motifRejet } : request
        );
        setPendingRequests(updatedRequests);
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'en_attente': return 'bg-yellow-100 text-yellow-800';
            case 'approuve': return 'bg-green-100 text-green-800';
            case 'rejete': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'en_attente': return 'En attente';
            case 'approuve': return 'Approuvé';
            case 'rejete': return 'Rejeté';
            default: return statut;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <Layout title="Demandes de validation" userType={userType}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Demandes de validation" userType={userType}>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Demandes de Validation</h1>
                        <p className="text-gray-600">Gérez les demandes de déplacement en attente de validation</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">En attente</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {pendingRequests.filter(r => r.statut === 'en_attente').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Approuvées</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {pendingRequests.filter(r => r.statut === 'approuve').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-red-100 text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Rejetées</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {pendingRequests.filter(r => r.statut === 'rejete').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rechercher
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Chauffeur, destination, motif..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
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
                                        <SelectItem value="en_attente">En attente</SelectItem>
                                        <SelectItem value="approuve">Approuvé</SelectItem>
                                        <SelectItem value="rejete">Rejeté</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <div className="text-sm text-gray-600">
                                    <p>Total: {filteredRequests.length} demandes</p>
                                    <p>En attente: {filteredRequests.filter(r => r.statut === 'en_attente').length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Demandeur
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Destination
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
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
                                    {filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.chauffeurNom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.motif}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.destination}</div>
                                                <div className="text-sm text-gray-500">{request.passagers}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(request.dateDepart)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {request.heureDepart} - {request.heureRetour}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    getStatusColor(request.statut)
                                                }`}>
                                                    {getStatusText(request.statut)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {request.statut === 'en_attente' && (
                                                        <>
                                                            <Button
                                                                onClick={() => handleApprove(request.id)}
                                                                variant="ghost"
                                                                className="text-green-600 hover:text-green-900 p-0 h-auto"
                                                            >
                                                                Approuver
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    const motif = prompt('Motif du rejet:');
                                                                    if (motif) handleReject(request.id, motif);
                                                                }}
                                                                variant="ghost"
                                                                className="text-red-600 hover:text-red-900 p-0 h-auto"
                                                            >
                                                                Rejeter
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button 
                                                        onClick={() => navigate(`/deplacements/details/${request.id}`)}
                                                        variant="ghost" 
                                                        className="text-blue-600 hover:text-blue-900 p-0 h-auto"
                                                    >
                                                        Détails
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredRequests.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
                                <p className="text-gray-500">Aucune demande ne correspond aux critères de recherche.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ToValidate;
