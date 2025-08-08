import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  Car, 
  Users, 
  MapPin, 
  Fuel,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const VueEnsembleParc = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
  const [selectedParc, setSelectedParc] = useState(null);

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Ici vous pouvez ajouter la logique pour recharger les données du parc sélectionné
  };

  // Données d'exemple pour le parc
  const statsParc = {
    totalVehicules: 45,
    vehiculesActifs: 38,
    vehiculesEnMaintenance: 4,
    vehiculesDisponibles: 34,
    totalChauffeurs: 52,
    chauffeursActifs: 41,
    chauffeursDisponibles: 11,
    totalDeplacements: 156,
    kilometrageMensuel: 28500,
    consommationCarburant: 3200,
    coutMensuel: 125000
  };

  // Répartition des véhicules par type
  const repartitionVehicules = [
    { type: 'Berlines', nombre: 18, pourcentage: 40, couleur: '#3B82F6' },
    { type: 'SUV', nombre: 12, pourcentage: 27, couleur: '#10B981' },
    { type: 'Utilitaires', nombre: 8, pourcentage: 18, couleur: '#F59E0B' },
    { type: 'Camionnettes', nombre: 5, pourcentage: 11, couleur: '#EF4444' },
    { type: 'Autres', nombre: 2, pourcentage: 4, couleur: '#8B5CF6' }
  ];

  // Statut des véhicules
  const statutVehicules = [
    { statut: 'En mission', nombre: 28, couleur: '#3B82F6' },
    { statut: 'Disponibles', nombre: 10, couleur: '#10B981' },
    { statut: 'Maintenance', nombre: 4, couleur: '#F59E0B' },
    { statut: 'Hors service', nombre: 3, couleur: '#EF4444' }
  ];

  // Évolution du kilométrage
  const evolutionKilometrage = [
    { mois: 'Oct', kilometrage: 25000, consommation: 2800 },
    { mois: 'Nov', kilometrage: 27500, consommation: 3100 },
    { mois: 'Déc', kilometrage: 23000, consommation: 2600 },
    { mois: 'Jan', kilometrage: 28500, consommation: 3200 },
    { mois: 'Fév', kilometrage: 31000, consommation: 3500 },
    { mois: 'Mar', kilometrage: 29000, consommation: 3300 }
  ];

  // Performance par véhicule (top 10)
  const performanceVehicules = [
    { immatriculation: 'ABC-123-45', kilometrage: 2500, missions: 18, efficacite: 95 },
    { immatriculation: 'DEF-678-90', kilometrage: 2200, missions: 16, efficacite: 92 },
    { immatriculation: 'GHI-234-56', kilometrage: 2800, missions: 20, efficacite: 90 },
    { immatriculation: 'JKL-789-01', kilometrage: 1900, missions: 14, efficacite: 88 },
    { immatriculation: 'MNO-345-67', kilometrage: 2100, missions: 15, efficacite: 87 },
    { immatriculation: 'PQR-890-12', kilometrage: 1800, missions: 13, efficacite: 85 },
    { immatriculation: 'STU-456-78', kilometrage: 2300, missions: 17, efficacite: 83 },
    { immatriculation: 'VWX-012-34', kilometrage: 1700, missions: 12, efficacite: 82 },
    { immatriculation: 'YZA-567-89', kilometrage: 2000, missions: 14, efficacite: 80 },
    { immatriculation: 'BCD-123-45', kilometrage: 1600, missions: 11, efficacite: 78 }
  ];

  // Alertes et notifications
  const alertes = [
    {
      type: 'maintenance',
      vehicule: 'ABC-123-45',
      message: 'Maintenance programmée dans 3 jours',
      priorite: 'moyenne',
      date: '2024-02-15'
    },
    {
      type: 'assurance',
      vehicule: 'DEF-678-90',
      message: 'Assurance expire dans 15 jours',
      priorite: 'haute',
      date: '2024-02-28'
    },
    {
      type: 'controle_technique',
      vehicule: 'GHI-234-56',
      message: 'Contrôle technique à renouveler',
      priorite: 'haute',
      date: '2024-02-20'
    },
    {
      type: 'carburant',
      vehicule: 'JKL-789-01',
      message: 'Niveau de carburant faible',
      priorite: 'basse',
      date: '2024-02-12'
    }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'assurance': return <AlertTriangle className="h-4 w-4" />;
      case 'controle_technique': return <CheckCircle className="h-4 w-4" />;
      case 'carburant': return <Fuel className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'text-red-600 bg-red-100';
      case 'moyenne': return 'text-orange-600 bg-orange-100';
      case 'basse': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout title="Vue d'Ensemble" userType="Responsable">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vue d'Ensemble du Parc</h1>
            <p className="text-gray-600 mt-2">Tableau de bord complet de votre parc de véhicules</p>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">3 derniers mois</option>
              <option value="365">12 derniers mois</option>
            </select>
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
                <Car className="h-5 w-5 text-blue-600" />
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
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un parc</h3>
            <p className="text-gray-600">Veuillez sélectionner un parc pour afficher la vue d'ensemble</p>
          </div>
        ) : (
        <>
         {/* Indicateurs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Véhicules</p>
                  <p className="text-2xl font-bold text-gray-900">{statsParc.totalVehicules}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {statsParc.vehiculesActifs} actifs
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chauffeurs</p>
                  <p className="text-2xl font-bold text-gray-900">{statsParc.totalChauffeurs}</p>
                  <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                    <Activity className="h-3 w-3" />
                    {statsParc.chauffeursDisponibles} disponibles
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kilométrage Mensuel</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(statsParc.kilometrageMensuel)} km</p>
                  <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {statsParc.totalDeplacements} missions
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coût Mensuel</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(statsParc.coutMensuel)}</p>
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <Fuel className="h-3 w-3" />
                    {formatNumber(statsParc.consommationCarburant)}L carburant
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition des véhicules par type */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Type de Véhicule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionVehicules}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="nombre"
                      label={({ type, pourcentage }) => `${type}: ${pourcentage}%`}
                    >
                      {repartitionVehicules.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Statut des véhicules */}
          <Card>
            <CardHeader>
              <CardTitle>Statut des Véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statutVehicules.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.couleur }}></div>
                      <span className="font-medium">{item.statut}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{item.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {((item.nombre / statsParc.totalVehicules) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Évolution du kilométrage et consommation */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Kilométrage et Consommation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionKilometrage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="kilometrage"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    name="Kilométrage"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="consommation"
                    stroke="#EF4444"
                    strokeWidth={3}
                    name="Consommation (L)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance des véhicules et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top véhicules performants */}
          <Card>
            <CardHeader>
              <CardTitle>Véhicules les Plus Performants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceVehicules.slice(0, 5).map((vehicule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{vehicule.immatriculation}</p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(vehicule.kilometrage)} km • {vehicule.missions} missions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${vehicule.efficacite}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{vehicule.efficacite}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertes et notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertes et Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertes.map((alerte, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`p-2 rounded-lg ${getAlertColor(alerte.priorite)}`}>
                      {getAlertIcon(alerte.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alerte.vehicule}</p>
                      <p className="text-sm text-gray-600">{alerte.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alerte.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alerte.priorite === 'haute' ? 'bg-red-100 text-red-800' :
                      alerte.priorite === 'moyenne' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alerte.priorite}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </div>
    </Layout>
  );
};

export default VueEnsembleParc;