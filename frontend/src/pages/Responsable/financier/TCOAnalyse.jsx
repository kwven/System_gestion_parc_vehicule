import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Car,
  Calendar,
  DollarSign,
  BarChart3,
  Info,
  AlertCircle,
  Fuel,
  Wrench,
  Shield,
  FileText,
  MapPin,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';

const TCOAnalyse = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('12');
  const [selectedParc, setSelectedParc] = useState(null);

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
  };

  // Types de coûts basés sur le modèle TypeCout
  const typesCouts = [
    { id: 1, nom: 'Assurance', description: 'Prime d\'assurance annuelle', categorie: 'Obligatoire', est_recurrent: true, icon: Shield, color: '#3B82F6' },
    { id: 2, nom: 'Maintenance préventive', description: 'Révisions et entretiens programmés', categorie: 'Préventif', est_recurrent: true, icon: Wrench, color: '#10B981' },
    { id: 3, nom: 'Réparation d\'urgence', description: 'Réparations non planifiées', categorie: 'Curatif', est_recurrent: false, icon: AlertCircle, color: '#EF4444' },
    { id: 4, nom: 'Carburant', description: 'Coût du carburant', categorie: 'Carburant', est_recurrent: true, icon: Fuel, color: '#F59E0B' },
    { id: 5, nom: 'Contrôle technique', description: 'Contrôle technique obligatoire', categorie: 'Obligatoire', est_recurrent: true, icon: FileText, color: '#8B5CF6' },
    { id: 6, nom: 'Pneumatiques', description: 'Changement des pneus', categorie: 'Préventif', est_recurrent: false, icon: Settings, color: '#06B6D4' },
    { id: 7, nom: 'Franchise sinistre', description: 'Franchise en cas de sinistre', categorie: 'Administratif', est_recurrent: false, icon: FileText, color: '#84CC16' },
    { id: 8, nom: 'Taxe circulation', description: 'Taxe annuelle de circulation', categorie: 'Obligatoire', est_recurrent: true, icon: Car, color: '#F97316' },
    { id: 9, nom: 'Péage autoroute', description: 'Frais de péage', categorie: 'Carburant', est_recurrent: false, icon: MapPin, color: '#EC4899' },
    { id: 10, nom: 'Parking', description: 'Frais de stationnement', categorie: 'Administratif', est_recurrent: false, icon: MapPin, color: '#6366F1' }
  ];

  // Données d'exemple pour les véhicules avec coûts détaillés
  const vehiculesData = [
    {
      id: '1',
      immatriculation: 'ABC-123-45',
      marque: 'Toyota',
      modele: 'Corolla',
      annee: 2020,
      kilometrage: 75000,
      valeurAchat: 180000, // Valeur d'achat estimée
      valeurActuelle: 135000,
      couts: {
        'Assurance': { montant: 8500, frequence: 'annuel' },
        'Maintenance préventive': { montant: 12000, frequence: 'annuel' },
        'Réparation d\'urgence': { montant: 4500, frequence: 'ponctuel' },
        'Carburant': { montant: 28000, frequence: 'annuel' },
        'Contrôle technique': { montant: 800, frequence: 'annuel' },
        'Pneumatiques': { montant: 3200, frequence: 'ponctuel' },
        'Franchise sinistre': { montant: 1500, frequence: 'ponctuel' },
        'Taxe circulation': { montant: 2400, frequence: 'annuel' },
        'Péage autoroute': { montant: 3600, frequence: 'variable' },
        'Parking': { montant: 1800, frequence: 'variable' }
      }
    },
    {
      id: '2',
      immatriculation: 'DEF-678-90',
      marque: 'Renault',
      modele: 'Duster',
      annee: 2019,
      kilometrage: 95000,
      valeurAchat: 220000,
      valeurActuelle: 145000,
      couts: {
        'Assurance': { montant: 9200, frequence: 'annuel' },
        'Maintenance préventive': { montant: 14500, frequence: 'annuel' },
        'Réparation d\'urgence': { montant: 6800, frequence: 'ponctuel' },
        'Carburant': { montant: 35000, frequence: 'annuel' },
        'Contrôle technique': { montant: 800, frequence: 'annuel' },
        'Pneumatiques': { montant: 4200, frequence: 'ponctuel' },
        'Franchise sinistre': { montant: 2000, frequence: 'ponctuel' },
        'Taxe circulation': { montant: 2800, frequence: 'annuel' },
        'Péage autoroute': { montant: 4200, frequence: 'variable' },
        'Parking': { montant: 2100, frequence: 'variable' }
      }
    },
    {
      id: '3',
      immatriculation: 'GHI-234-56',
      marque: 'Peugeot',
      modele: 'Partner',
      annee: 2021,
      kilometrage: 45000,
      valeurAchat: 160000,
      valeurActuelle: 128000,
      couts: {
        'Assurance': { montant: 7800, frequence: 'annuel' },
        'Maintenance préventive': { montant: 9500, frequence: 'annuel' },
        'Réparation d\'urgence': { montant: 2200, frequence: 'ponctuel' },
        'Carburant': { montant: 24000, frequence: 'annuel' },
        'Contrôle technique': { montant: 800, frequence: 'annuel' },
        'Pneumatiques': { montant: 2800, frequence: 'ponctuel' },
        'Franchise sinistre': { montant: 0, frequence: 'ponctuel' },
        'Taxe circulation': { montant: 2200, frequence: 'annuel' },
        'Péage autoroute': { montant: 2800, frequence: 'variable' },
        'Parking': { montant: 1400, frequence: 'variable' }
      }
    }
  ];

  const selectedVehicleData = vehiculesData.find(v => v.id === selectedVehicle) || vehiculesData[0];

  // Calcul du TCO
  const calculerTCO = (vehicule, periode) => {
    const periodeAnnees = parseInt(periode) / 12;
    const depreciation = vehicule.valeurAchat - vehicule.valeurActuelle;
    
    let coutTotal = 0;
    let coutAnnuel = 0;
    
    Object.entries(vehicule.couts).forEach(([type, cout]) => {
      if (cout.frequence === 'annuel') {
        coutAnnuel += cout.montant;
      } else if (cout.frequence === 'ponctuel') {
        coutTotal += cout.montant; // Coût ponctuel sur la période
      } else if (cout.frequence === 'variable') {
        coutAnnuel += cout.montant; // Traité comme annuel pour simplifier
      }
    });
    
    const coutTotalPeriode = (coutAnnuel * periodeAnnees) + coutTotal + depreciation;
    const coutParMois = coutTotalPeriode / parseInt(periode);
    const coutParKm = vehicule.kilometrage > 0 ? coutTotalPeriode / (vehicule.kilometrage * periodeAnnees) : 0;
    
    return {
      coutTotal: coutTotalPeriode,
      coutAnnuel,
      coutParMois,
      coutParKm,
      depreciation
    };
  };

  const tcoData = selectedVehicleData ? calculerTCO(selectedVehicleData, selectedPeriod) : null;

  // Données pour les graphiques
  const repartitionCouts = selectedVehicleData ? Object.entries(selectedVehicleData.couts).map(([type, cout]) => {
    const typeInfo = typesCouts.find(t => t.nom === type);
    return {
      nom: type,
      montant: cout.montant,
      categorie: typeInfo?.categorie || 'Autre',
      color: typeInfo?.color || '#6B7280'
    };
  }) : [];

  // Évolution des coûts par catégorie
  const evolutionCouts = [
    { mois: 'Jan', Obligatoire: 2800, Préventif: 1200, Curatif: 800, Carburant: 2800, Administratif: 300 },
    { mois: 'Fév', Obligatoire: 2800, Préventif: 1500, Curatif: 1200, Carburant: 2600, Administratif: 250 },
    { mois: 'Mar', Obligatoire: 2800, Préventif: 2200, Curatif: 600, Carburant: 2900, Administratif: 400 },
    { mois: 'Avr', Obligatoire: 2800, Préventif: 1800, Curatif: 1500, Carburant: 2750, Administratif: 350 },
    { mois: 'Mai', Obligatoire: 2800, Préventif: 1400, Curatif: 900, Carburant: 2850, Administratif: 200 },
    { mois: 'Jun', Obligatoire: 2800, Préventif: 1600, Curatif: 1100, Carburant: 2700, Administratif: 450 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategorieColor = (categorie) => {
    const colors = {
      'Obligatoire': '#3B82F6',
      'Préventif': '#10B981',
      'Curatif': '#EF4444',
      'Carburant': '#F59E0B',
      'Administratif': '#8B5CF6'
    };
    return colors[categorie] || '#6B7280';
  };

  return (
    <Layout title="Total Cost of Ownership" userType='Responsable'>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyse TCO</h1>
            <p className="text-gray-600 mt-2">Analyse détaillée du coût total de possession basée sur les types de coûts réels</p>
          </div>
        </div>

        {/* Sélecteur de parc */}
        <ParcSelector 
          selectedParc={selectedParc}
          onParcChange={handleParcChange}
        />

        {selectedParc && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">{selectedParc.nom}</h3>
                <p className="text-sm text-blue-700">{selectedParc.entite} • {selectedParc.vehicules} véhicules</p>
              </div>
            </div>
          </div>
        )}

        {!selectedParc ? (
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un parc</h3>
            <p className="text-gray-600">Veuillez sélectionner un parc pour analyser le TCO</p>
          </div>
        ) : (
          <>
            {/* Contrôles */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Véhicule</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculesData.map(vehicule => (
                      <SelectItem key={vehicule.id} value={vehicule.id}>
                        {vehicule.immatriculation} - {vehicule.marque} {vehicule.modele}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Période d'analyse</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 mois</SelectItem>
                    <SelectItem value="12">1 an</SelectItem>
                    <SelectItem value="24">2 ans</SelectItem>
                    <SelectItem value="36">3 ans</SelectItem>
                    <SelectItem value="60">5 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedVehicle && tcoData && (
              <>
                {/* Résumé TCO */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">TCO Total</p>
                          <p className="text-2xl font-bold">{formatCurrency(tcoData.coutTotal)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-medium">Coût par mois</p>
                          <p className="text-2xl font-bold">{formatCurrency(tcoData.coutParMois)}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">Coût par km</p>
                          <p className="text-2xl font-bold">{formatCurrency(tcoData.coutParKm)}</p>
                        </div>
                        <Car className="h-8 w-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Répartition des coûts par type */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Répartition des coûts par type</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={repartitionCouts}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="montant"
                            label={({nom, montant}) => `${nom}: ${formatCurrency(montant)}`}
                          >
                            {repartitionCouts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Répartition par catégorie */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Coûts par catégorie</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={repartitionCouts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="nom" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            fontSize={12}
                          />
                          <YAxis formatter={(value) => `${value/1000}k`} />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Bar 
                            dataKey="montant" 
                            fill={(entry) => getCategorieColor(entry.categorie)}
                          >
                            {repartitionCouts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getCategorieColor(entry.categorie)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Évolution des coûts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Évolution des coûts par catégorie</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={evolutionCouts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis formatter={(value) => `${value/1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Area type="monotone" dataKey="Obligatoire" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Préventif" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Curatif" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Carburant" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Administratif" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Détail des types de coûts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5" />
                      <span>Détail des types de coûts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typesCouts.map((type) => {
                        const cout = selectedVehicleData.couts[type.nom];
                        const Icon = type.icon;
                        return (
                          <div key={type.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                                <Icon className="h-4 w-4" style={{ color: type.color }} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{type.nom}</h4>
                                <p className="text-xs text-gray-500">{type.categorie}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                            {cout && (
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                  {formatCurrency(cout.montant)}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                  {cout.frequence}
                                </span>
                              </div>
                            )}
                            {type.est_recurrent && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Récurrent
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default TCOAnalyse;