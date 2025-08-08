import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  Calculator, 
  Car, 
  Fuel, 
  Wrench, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CoutsVehicule = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
  const [selectedVehicule, setSelectedVehicule] = useState('tous');
  const [selectedParc, setSelectedParc] = useState(null);

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Ici vous pouvez ajouter la logique pour recharger les données du parc sélectionné
  };

  // Données d'exemple pour les coûts par véhicule
  const vehiculesData = [
    {
      id: 1,
      immatriculation: 'ABC-123-45',
      marque: 'Toyota',
      modele: 'Corolla',
      type: 'Berline',
      coutTotal: 15420,
      coutCarburant: 8500,
      coutMaintenance: 4200,
      coutAssurance: 2720,
      kilometrage: 25000,
      coutParKm: 0.62,
      evolution: 5.2
    },
    {
      id: 2,
      immatriculation: 'DEF-678-90',
      marque: 'Renault',
      modele: 'Duster',
      type: 'SUV',
      coutTotal: 18750,
      coutCarburant: 11200,
      coutMaintenance: 5100,
      coutAssurance: 2450,
      kilometrage: 28500,
      coutParKm: 0.66,
      evolution: -2.1
    },
    {
      id: 3,
      immatriculation: 'GHI-234-56',
      marque: 'Peugeot',
      modele: 'Partner',
      type: 'Utilitaire',
      coutTotal: 16890,
      coutCarburant: 9800,
      coutMaintenance: 4590,
      coutAssurance: 2500,
      kilometrage: 32000,
      coutParKm: 0.53,
      evolution: 1.8
    }
  ];

  // Données pour le graphique de répartition des coûts
  const repartitionCouts = [
    { name: 'Carburant', value: 29500, color: '#3B82F6' },
    { name: 'Maintenance', value: 13890, color: '#EF4444' },
    { name: 'Assurance', value: 7670, color: '#10B981' },
    { name: 'Autres', value: 3000, color: '#F59E0B' }
  ];

  // Données pour l'évolution mensuelle
  const evolutionMensuelle = [
    { mois: 'Jan', cout: 4200 },
    { mois: 'Fév', cout: 3800 },
    { mois: 'Mar', cout: 4500 },
    { mois: 'Avr', cout: 4100 },
    { mois: 'Mai', cout: 4800 },
    { mois: 'Jun', cout: 4300 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const coutTotalParc = vehiculesData.reduce((total, vehicule) => total + vehicule.coutTotal, 0);
  const coutMoyenParVehicule = coutTotalParc / vehiculesData.length;
  const kilometrageTotalParc = vehiculesData.reduce((total, vehicule) => total + vehicule.kilometrage, 0);
  const coutMoyenParKm = coutTotalParc / kilometrageTotalParc;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coûts par Véhicule</h1>
            <p className="text-gray-600 mt-2">Suivi détaillé des coûts de votre parc automobile</p>
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
            <p className="text-gray-600">Veuillez sélectionner un parc pour analyser les coûts</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
              </div>
          
          <div className="flex gap-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="mois">Ce mois</option>
              <option value="trimestre">Ce trimestre</option>
              <option value="annee">Cette année</option>
            </select>
            
            <select 
              value={selectedVehicule}
              onChange={(e) => setSelectedVehicule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tous">Tous les véhicules</option>
              {vehiculesData.map(vehicule => (
                <option key={vehicule.id} value={vehicule.id}>
                  {vehicule.immatriculation} - {vehicule.marque} {vehicule.modele}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coût Total Parc</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(coutTotalParc)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coût Moyen/Véhicule</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(coutMoyenParVehicule)}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coût/Km Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{coutMoyenParKm.toFixed(2)} MAD</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kilométrage Total</p>
                  <p className="text-2xl font-bold text-gray-900">{kilometrageTotalParc.toLocaleString()} km</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition des coûts */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Coûts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionCouts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {repartitionCouts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle des Coûts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evolutionMensuelle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="cout" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau détaillé des véhicules */}
        <Card>
          <CardHeader>
            <CardTitle>Détail par Véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Véhicule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coût Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carburant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maintenance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coût/Km
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehiculesData.map((vehicule) => (
                    <tr key={vehicule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicule.immatriculation}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicule.marque} {vehicule.modele}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vehicule.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(vehicule.coutTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(vehicule.coutCarburant)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(vehicule.coutMaintenance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicule.coutParKm.toFixed(2)} MAD
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CoutsVehicule;