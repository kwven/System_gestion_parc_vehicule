import React, { useState, useEffect } from 'react';
import { Calendar, BarChart3, TrendingUp, Car, MapPin, Filter, Download } from 'lucide-react';
import Layout from '../../components/common/Layout';
import { LineChart } from '../../components/ui/LineChart';
import { BarChart } from '../../components/ui/BarChart';
import { AreaChart } from '../../components/ui/AreaChart';
import { BarList } from '../../components/ui/BarList';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const DeplacementReport = () => {
    const [userRole, setUserRole] = useState('Direction Centrale'); // À récupérer depuis l'authentification
    const [userCentrale] = useState('Centrale Rabat'); // À récupérer depuis l'authentification
    const [userRegion] = useState('Rabat-Salé-Kénitra'); // À récupérer depuis l'authentification
    
    const [selectedCentrale, setSelectedCentrale] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedLocalite, setSelectedLocalite] = useState('');
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    // Données hiérarchiques simulées
    const hierarchyData = {
        'Centrale Rabat': {
            'Rabat-Salé-Kénitra': {
                'Rabat': ['Agdal', 'Hassan', 'Souissi'],
                'Salé': ['Bettana', 'Laayayda', 'Tabriquet'],
                'Kénitra': ['Centre', 'Saknia', 'Ouled Oujih']
            },
            'Casablanca-Settat': {
                'Casablanca': ['Anfa', 'Sidi Bernoussi', 'Hay Mohammadi'],
                'Settat': ['Centre', 'Ouled Said', 'Ben Ahmed']
            }
        },
        'Centrale Casablanca': {
            'Casablanca-Settat': {
                'Casablanca': ['Anfa', 'Sidi Bernoussi', 'Hay Mohammadi'],
                'Settat': ['Centre', 'Ouled Said', 'Ben Ahmed']
            },
            'Marrakech-Safi': {
                'Marrakech': ['Gueliz', 'Medina', 'Hivernage'],
                'Safi': ['Centre', 'Jrifat', 'Sidi Bouzid']
            }
        }
    };

    // Fonction pour générer les données selon le rôle
    const getTauxDeplacementData = () => {
        const baseData = {
            tauxDeplacementProvinces: [
                { province: 'Rabat', taux: 85 },
                { province: 'Salé', taux: 72 },
                { province: 'Kénitra', taux: 68 },
                { province: 'Casablanca', taux: 91 },
                { province: 'Settat', taux: 76 }
            ],
            tauxDeplacementLocalites: [
                { localite: 'Agdal', taux: 78 },
                { localite: 'Hassan', taux: 82 },
                { localite: 'Souissi', taux: 65 },
                { localite: 'Hay Riad', taux: 89 },
                { localite: 'Centre Ville', taux: 73 }
            ],
            tauxDeplacementRegions: [
                { region: 'Rabat-Salé-Kénitra', taux: 85 },
                { region: 'Casablanca-Settat', taux: 78 },
                { region: 'Marrakech-Safi', taux: 72 },
                { region: 'Fès-Meknès', taux: 68 }
            ],
            tauxDeplacementCentrales: [
                { centrale: 'Centrale Rabat', taux: 82 },
                { centrale: 'Centrale Casablanca', taux: 75 },
                { centrale: 'Centrale Fès', taux: 70 },
                { centrale: 'Centrale Marrakech', taux: 68 }
            ]
        };

        // Filtrer selon le rôle
        if (userRole === 'Direction Régionale') {
            return {
                ...baseData,
                tauxDeplacementProvinces: baseData.tauxDeplacementProvinces.filter(item => 
                    ['Rabat', 'Salé', 'Kénitra'].includes(item.province)
                )
            };
        } else if (userRole === 'Direction Provinciale') {
            return {
                ...baseData,
                tauxDeplacementLocalites: baseData.tauxDeplacementLocalites.filter(item => 
                    ['Agdal', 'Hassan', 'Souissi'].includes(item.localite)
                )
            };
        } else if (userRole === 'Direction Centrale') {
            return {
                ...baseData,
                tauxDeplacementRegions: baseData.tauxDeplacementRegions.filter(item => 
                    ['Rabat-Salé-Kénitra', 'Casablanca-Settat'].includes(item.region)
                )
            };
        }
        return baseData;
    };

    // Fonction pour générer les données de kilométrage selon la période
    const getKilometrageParPeriode = () => {
        if (!startDate || !endDate) {
            return [];
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Si la période est de plus de 60 jours, afficher par mois
        if (diffDays > 60) {
            const months = [];
            const current = new Date(start.getFullYear(), start.getMonth(), 1);
            const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

            while (current <= endMonth) {
                const monthName = current.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
                months.push({
                    periode: monthName,
                    kilometrage: Math.floor(Math.random() * 15000) + 5000 // Simulation
                });
                current.setMonth(current.getMonth() + 1);
            }
            return months;
        } else {
            // Sinon, afficher par jour
            const days = [];
            const current = new Date(start);

            while (current <= end) {
                const dayName = current.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                days.push({
                    periode: dayName,
                    kilometrage: Math.floor(Math.random() * 800) + 200 // Simulation
                });
                current.setDate(current.getDate() + 1);
            }
            return days;
        }
    };

    // Données de démonstration pour les graphiques
    const getMockReportData = () => {
        const tauxData = getTauxDeplacementData();
        return {
            evolutionDeplacements: [
                { date: '2024-01-01', deplacements: 12 },
                { date: '2024-01-02', deplacements: 19 },
                { date: '2024-01-03', deplacements: 15 },
                { date: '2024-01-04', deplacements: 22 },
                { date: '2024-01-05', deplacements: 18 },
                { date: '2024-01-06', deplacements: 25 },
                { date: '2024-01-07', deplacements: 20 }
            ],
            evolutionCouts: [
                { mois: 'Jan', Obligatoire: 15000, Preventif: 8000, Curatif: 12000, Administratif: 5000, Carburant: 25000 },
                { mois: 'Fév', Obligatoire: 18000, Preventif: 9500, Curatif: 10000, Administratif: 5500, Carburant: 28000 },
                { mois: 'Mar', Obligatoire: 16000, Preventif: 11000, Curatif: 14000, Administratif: 6000, Carburant: 30000 },
                { mois: 'Avr', Obligatoire: 20000, Preventif: 8500, Curatif: 9000, Administratif: 5200, Carburant: 32000 }
            ],
            kilometragePeriode: getKilometrageParPeriode(),
            ...tauxData
        };
    };

    useEffect(() => {
        // Initialiser les sélecteurs selon le rôle
        if (userRole === 'Direction Régionale') {
            setSelectedCentrale(userCentrale);
            setSelectedRegion(userRegion);
        } else if (userRole === 'Direction Provinciale') {
            setSelectedCentrale(userCentrale);
            setSelectedRegion(userRegion);
        } else if (userRole === 'Direction Centrale') {
            setSelectedCentrale(userCentrale);
        }
        
        // Définir les dates par défaut (dernier mois)
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(lastMonth.toISOString().split('T')[0]);
    }, [userRole, userCentrale, userRegion]);

    const getCentrales = () => {
        if (userRole === 'Direction Régionale' || userRole === 'Direction Provinciale' || userRole === 'Direction Centrale') {
            return [userCentrale];
        }
        return Object.keys(hierarchyData);
    };

    const getRegions = () => {
        if (!selectedCentrale) return [];
        if (userRole === 'Direction Régionale' || userRole === 'Direction Provinciale') {
            return [userRegion];
        }
        return Object.keys(hierarchyData[selectedCentrale] || {});
    };

    const getProvinces = () => {
        if (!selectedCentrale || !selectedRegion) return [];
        return Object.keys(hierarchyData[selectedCentrale]?.[selectedRegion] || {});
    };

    const getLocalites = () => {
        if (!selectedCentrale || !selectedRegion || !selectedProvince) return [];
        return hierarchyData[selectedCentrale]?.[selectedRegion]?.[selectedProvince] || [];
    };

    const handleCentraleChange = (value) => {
        setSelectedCentrale(value);
        setSelectedRegion('');
        setSelectedProvince('');
        setSelectedLocalite('');
    };

    const handleRegionChange = (value) => {
        setSelectedRegion(value);
        setSelectedProvince('');
        setSelectedLocalite('');
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setSelectedLocalite('');
    };

    const generateReport = async () => {
        if (!startDate || !endDate) {
            alert('Veuillez sélectionner une période');
            return;
        }

        setLoading(true);
        
        // Simulation d'appel API
        setTimeout(() => {
            setReportData(getMockReportData());
            setLoading(false);
        }, 1500);
    };



    return (
        <Layout title="Rapport des Déplacements" userType={userRole}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* En-tête */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Rapport des Déplacements</h1>
                            <p className="text-gray-600">Analyse et statistiques des déplacements</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={generateReport}
                                disabled={loading}
                                variant="primary"
                                loading={loading}
                            >
                                {!loading && <BarChart3 className="h-4 w-4 mr-2" />}
                                {loading ? 'Génération...' : 'Générer le rapport'}
                            </Button>

                        </div>
                    </div>

                    {/* Sélecteur de rôle temporaire pour test */}
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rôle utilisateur (pour test):
                        </label>
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Direction Centrale">Direction Centrale</option>
                            <option value="Direction Régionale">Direction Régionale</option>
                            <option value="Direction Provinciale">Direction Provinciale</option>
                            <option value="Autre">Autre Direction</option>
                        </select>
                    </div>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Sélecteurs hiérarchiques */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                Centrale
                            </label>
                            <select
                                value={selectedCentrale}
                                onChange={(e) => handleCentraleChange(e.target.value)}
                                disabled={userRole === 'Responsable' || userRole === 'Chef de Parc'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Toutes les centrales</option>
                                {getCentrales().map(centrale => (
                                    <option key={centrale} value={centrale}>{centrale}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Région
                            </label>
                            <select
                                value={selectedRegion}
                                onChange={(e) => handleRegionChange(e.target.value)}
                                disabled={userRole === 'Responsable' || userRole === 'Chef de Parc'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Toutes les régions</option>
                                {getRegions().map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Province
                            </label>
                            <select
                                value={selectedProvince}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Toutes les provinces</option>
                                {getProvinces().map(province => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Localité
                            </label>
                            <select
                                value={selectedLocalite}
                                onChange={(e) => setSelectedLocalite(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Toutes les localités</option>
                                {getLocalites().map(localite => (
                                    <option key={localite} value={localite}>{localite}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sélection de période */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                Date de début
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de fin
                            </label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Graphiques */}
                {reportData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Évolution du nombre de déplacements */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                                Évolution des déplacements
                            </h3>
                            <AreaChart
                                className="h-80"
                                data={reportData.evolutionDeplacements}
                                index="date"
                                categories={["deplacements"]}
                                colors={["blue"]}
                                valueFormatter={(value) => `${value} déplacements`}
                                yAxisWidth={60}
                                showLegend={false}
                            />
                        </div>

                        {/* Évolution des coûts */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                                Évolution des coûts par type
                            </h3>
                            <BarChart
                                className="h-80"
                                data={reportData.evolutionCouts}
                                index="mois"
                                categories={["Obligatoire", "Preventif", "Curatif", "Administratif", "Carburant"]}
                                colors={["blue", "emerald", "amber", "orange", "green"]}
                                valueFormatter={(value) => `${value.toLocaleString()} DH`}
                                stack={true}
                                yAxisWidth={80}
                            />
                        </div>

                        {/* Kilométrage parcouru par période */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Car className="h-5 w-5 mr-2 text-purple-500" />
                                Kilométrage parcouru par période
                            </h3>
                            {reportData.kilometragePeriode && reportData.kilometragePeriode.length > 0 ? (
                                <BarChart
                                    className="h-80"
                                    data={reportData.kilometragePeriode}
                                    index="periode"
                                    categories={["kilometrage"]}
                                    colors={["purple"]}
                                    valueFormatter={(value) => `${value.toLocaleString()} km`}
                                    yAxisWidth={80}
                                    showLegend={false}
                                />
                            ) : (
                                <div className="h-80 flex items-center justify-center text-gray-500">
                                    Veuillez sélectionner une période pour afficher les données
                                </div>
                            )}
                        </div>

                        {/* Taux de déplacement */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Filter className="h-5 w-5 mr-2 text-orange-500" />
                                {userRole === 'Direction Centrale' ? 'Taux de déplacement par région' :
                                 userRole === 'Direction Régionale' ? 'Taux de déplacement par province' :
                                 userRole === 'Direction Provinciale' ? 'Taux de déplacement par localité' :
                                 'Taux de déplacement par centrale'}
                            </h3>
                            {userRole === 'Direction Centrale' ? (
                                <BarChart
                                    className="h-80"
                                    data={reportData.tauxDeplacementRegions}
                                    index="region"
                                    categories={["taux"]}
                                    colors={["blue"]}
                                    valueFormatter={(value) => `${value}%`}
                                    yAxisWidth={80}
                                    showLegend={false}
                                />
                            ) : userRole === 'Direction Régionale' ? (
                                <BarChart
                                    className="h-80"
                                    data={reportData.tauxDeplacementProvinces}
                                    index="province"
                                    categories={["taux"]}
                                    colors={["purple"]}
                                    valueFormatter={(value) => `${value}%`}
                                    yAxisWidth={80}
                                    showLegend={false}
                                />
                            ) : userRole === 'Direction Provinciale' ? (
                                <BarChart
                                    className="h-80"
                                    data={reportData.tauxDeplacementLocalites}
                                    index="localite"
                                    categories={["taux"]}
                                    colors={["orange"]}
                                    valueFormatter={(value) => `${value}%`}
                                    yAxisWidth={80}
                                    showLegend={false}
                                />
                            ) : (
                                <BarChart
                                    className="h-80"
                                    data={reportData.tauxDeplacementCentrales}
                                    index="centrale"
                                    categories={["taux"]}
                                    colors={["green"]}
                                    valueFormatter={(value) => `${value}%`}
                                    yAxisWidth={80}
                                    showLegend={false}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Message si aucun rapport généré */}
                {!reportData && !loading && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport généré</h3>
                        <p className="text-gray-500 mb-6">
                            Sélectionnez vos critères de filtrage et cliquez sur "Générer le rapport" pour afficher les statistiques.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DeplacementReport;