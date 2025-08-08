import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  Car, 
  Users, 
  MapPin, 
  DollarSign,
  Clock,
  Calendar,
  Activity,
  Eye,
  RefreshCw,
  Building2,
  Check,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

const TableauBordParc = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('semaine');
  const [selectedParc, setSelectedParc] = useState('tous');

  // Fonction pour générer les données selon la période sélectionnée
  const getDataByPeriod = () => {
    switch (selectedPeriod) {
      case 'week':
        // Données par jour pour cette semaine
        return [
          { label: 'Lun', missions: 32, kilometrage: 1180, cout: 4800 },
          { label: 'Mar', missions: 28, kilometrage: 1050, cout: 4200 },
          { label: 'Mer', missions: 35, kilometrage: 1320, cout: 5400 },
          { label: 'Jeu', missions: 30, kilometrage: 1150, cout: 4900 },
          { label: 'Ven', missions: 38, kilometrage: 1450, cout: 5800 },
          { label: 'Sam', missions: 22, kilometrage: 850, cout: 3600 },
          { label: 'Dim', missions: 18, kilometrage: 680, cout: 2900 }
        ];
      case 'month':
        // Données par semaine pour ce mois
        return [
          { label: 'S1', missions: 180, kilometrage: 6500, cout: 26000 },
          { label: 'S2', missions: 195, kilometrage: 7200, cout: 28800 },
          { label: 'S3', missions: 210, kilometrage: 7800, cout: 31200 },
          { label: 'S4', missions: 185, kilometrage: 6900, cout: 27600 }
        ];
      case 'year':
        // Données par mois pour cette année
        return [
          { label: 'Jan', missions: 720, kilometrage: 26000, cout: 104000 },
          { label: 'Fév', missions: 680, kilometrage: 24500, cout: 98000 },
          { label: 'Mar', missions: 750, kilometrage: 27500, cout: 110000 },
          { label: 'Avr', missions: 820, kilometrage: 29000, cout: 116000 },
          { label: 'Mai', missions: 780, kilometrage: 28200, cout: 112800 },
          { label: 'Jun', missions: 850, kilometrage: 30500, cout: 122000 },
          { label: 'Jul', missions: 900, kilometrage: 32000, cout: 128000 },
          { label: 'Aoû', missions: 880, kilometrage: 31200, cout: 124800 },
          { label: 'Sep', missions: 790, kilometrage: 28800, cout: 115200 },
          { label: 'Oct', missions: 760, kilometrage: 27600, cout: 110400 },
          { label: 'Nov', missions: 720, kilometrage: 26400, cout: 105600 },
          { label: 'Déc', missions: 680, kilometrage: 25200, cout: 100800 }
        ];
      default:
        return [
          { label: 'Lun', missions: 32, kilometrage: 1180, cout: 4800 },
          { label: 'Mar', missions: 28, kilometrage: 1050, cout: 4200 },
          { label: 'Mer', missions: 35, kilometrage: 1320, cout: 5400 },
          { label: 'Jeu', missions: 30, kilometrage: 1150, cout: 4900 },
          { label: 'Ven', missions: 38, kilometrage: 1450, cout: 5800 },
          { label: 'Sam', missions: 22, kilometrage: 850, cout: 3600 },
          { label: 'Dim', missions: 18, kilometrage: 680, cout: 2900 }
        ];
    }
  };

  // Fonction pour obtenir le titre du graphique selon la période
  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'week': return 'Activités de la Semaine (par jour)';
      case 'month': return 'Activités du Mois (par semaine)';
      case 'year': return 'Activités de l\'Année (par mois)';
      default: return 'Activités de la Semaine';
    }
  };

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Ici vous pouvez ajouter la logique pour recharger les données du parc sélectionné
  };

  // Données en temps réel du parc
  const statsTempsReel = {
    vehiculesTotal: 45,
    vehiculesEnMission: 28,
    vehiculesDisponibles: 10,
    vehiculesEnMaintenance: 4,
    vehiculesHorsService: 3,
    chauffeursActifs: 41,
    chauffeursDisponibles: 11,
    missionsAujourdhui: 35,
    kilometrageJour: 1250,
    consommationJour: 145,
    coutJour: 5200
  };

  // Missions en cours
  const missionsEnCours = [
    {
      id: 'M-2024-156',
      vehicule: 'ABC-123-45',
      chauffeur: 'Ahmed Benali',
      destination: 'Casablanca - Rabat',
      heureDepart: '08:30',
      heureArriveeEstimee: '10:15',
      statut: 'en_cours',
      progression: 65
    },
    {
      id: 'M-2024-157',
      vehicule: 'DEF-678-90',
      chauffeur: 'Fatima Zahra',
      destination: 'Salé - Kénitra',
      heureDepart: '09:00',
      heureArriveeEstimee: '10:30',
      statut: 'en_cours',
      progression: 45
    },
    {
      id: 'M-2024-158',
      vehicule: 'GHI-234-56',
      chauffeur: 'Mohamed Alami',
      destination: 'Rabat Centre',
      heureDepart: '09:30',
      heureArriveeEstimee: '11:00',
      statut: 'planifie',
      progression: 0
    },
    {
      id: 'M-2024-160',
      vehicule: 'MNO-345-67',
      chauffeur: 'Youssef Idrissi',
      destination: 'Casablanca - Mohammedia',
      heureDepart: '07:30',
      heureArriveeEstimee: '08:45',
      statut: 'termine',
      progression: 100
    }
  ];

  // Obtenir les données dynamiques selon la période sélectionnée
  const chartData = getDataByPeriod();

  // Répartition des véhicules par statut
  const repartitionStatuts = [
    { statut: 'En mission', nombre: 28, couleur: '#3B82F6' },
    { statut: 'Disponibles', nombre: 10, couleur: '#10B981' },
    { statut: 'Maintenance', nombre: 4, couleur: '#F59E0B' },
    { statut: 'Hors service', nombre: 3, couleur: '#EF4444' }
  ];

  // Consommation carburant par type de véhicule
  const consommationParType = [
    { type: 'Berlines', consommation: 45, pourcentage: 31 },
    { type: 'SUV', consommation: 38, pourcentage: 26 },
    { type: 'Utilitaires', consommation: 35, pourcentage: 24 },
    { type: 'Camionnettes', consommation: 27, pourcentage: 19 }
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

  const getStatutBadge = (statut) => {
    const config = {
      'en_cours': { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Activity },
      'planifie': { label: 'Planifié', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'termine': { label: 'Terminé', color: 'bg-green-100 text-green-800', icon: Check }
    };
    
    const statusConfig = config[statut] || config['planifie'];
    const IconComponent = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <IconComponent className="h-3 w-3" />
        {statusConfig.label}
      </span>
    );
  };

  const getMaintenanceUrgence = (urgence) => {
    switch (urgence) {
      case 'haute': return 'text-red-600 bg-red-100';
      case 'moyenne': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* En-tête avec actions rapides */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Parc</h1>
            <p className="text-gray-600 mt-2">Vue d'ensemble en temps réel de votre parc de véhicules</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Cette semaine (par jour)</option>
              <option value="month">Ce mois (par semaine)</option>
              <option value="year">Cette année (par mois)</option>
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
                <Building2 className="h-5 w-5 text-blue-600" />
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
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un parc</h3>
            <p className="text-gray-600">Veuillez sélectionner un parc pour afficher le tableau de bord</p>
          </div>
        ) : (
        <div>
         {/* Indicateurs temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Véhicules en Mission</p>
                  <p className="text-2xl font-bold text-blue-600">{statsTempsReel.vehiculesEnMission}</p>
                  <p className="text-sm text-gray-500 mt-1">sur {statsTempsReel.vehiculesTotal} véhicules</p>
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
                  <p className="text-sm font-medium text-gray-600">Chauffeurs Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{statsTempsReel.chauffeursActifs}</p>
                  <p className="text-sm text-gray-500 mt-1">{statsTempsReel.chauffeursDisponibles} disponibles</p>
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
                  <p className="text-sm font-medium text-gray-600">Kilométrage</p>
                  <p className="text-2xl font-bold text-orange-600">{formatNumber(statsTempsReel.kilometrageJour)} km</p>
                  <p className="text-sm text-gray-500 mt-1">{statsTempsReel.missionsAujourdhui} missions</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coût</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(statsTempsReel.coutJour)}</p>
                  <p className="text-sm text-gray-500 mt-1">{statsTempsReel.consommationJour}L carburant</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activités selon la période sélectionnée */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">{getChartTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        name === 'missions' ? `${value} missions` :
                        name === 'kilometrage' ? `${value} km` :
                        `${formatCurrency(value)}`,
                        name === 'missions' ? 'Missions' :
                        name === 'kilometrage' ? 'Kilométrage' : 'Coût'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="missions"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="missions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition des statuts */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Statut des Véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionStatuts}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      dataKey="nombre"
                      label={({ statut, nombre }) => `${statut}: ${nombre}`}
                      labelLine={false}
                    >
                      {repartitionStatuts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphique supplémentaire pour le kilométrage et coût */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Évolution du kilométrage */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Évolution du Kilométrage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} km`, 'Kilométrage']}
                    />
                    <Line
                      type="monotone"
                      dataKey="kilometrage"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Évolution des coûts */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Évolution des Coûts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [formatCurrency(value), 'Coût']}
                    />
                    <Bar
                      dataKey="cout"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missions en cours et maintenances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Missions en cours */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                <span>Missions en Cours</span>
                <span className="text-sm font-normal text-gray-500">{missionsEnCours.length} actives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missionsEnCours.map((mission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-blue-600">{mission.id}</p>
                        {getStatutBadge(mission.statut)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {mission.vehicule} • {mission.chauffeur}
                      </p>
                      <p className="text-sm text-gray-500">
                        {mission.destination}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Départ: {mission.heureDepart}</span>
                        <span>Arrivée: {mission.heureArriveeEstimee}</span>
                      </div>
                      {mission.statut === 'en_route' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${mission.progression}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{mission.progression}% complété</p>
                        </div>
                      )}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consommation par type de véhicule */}
        <Card>
          <CardHeader>
            <CardTitle>Consommation Carburant par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consommationParType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}L`, 'Consommation']} />
                  <Bar dataKey="consommation" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </div>
        </div>
        )}
      </div>
    </Layout>
  );
};

export default TableauBordParc;