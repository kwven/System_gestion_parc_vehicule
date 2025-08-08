import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';

const BudgetParc = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedParc, setSelectedParc] = useState(null);

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Ici vous pouvez ajouter la logique pour recharger les données du parc sélectionné
  };

  // Données d'exemple pour le budget du parc
  const budgetData = {
    budgetTotal: 250000,
    depenseActuelle: 187500,
    pourcentageUtilise: 75,
    budgetRestant: 62500,
    previsionFinAnnee: 235000
  };

  // Répartition du budget par catégorie
  const budgetParCategorie = [
    {
      categorie: 'Carburant',
      budgetAlloue: 100000,
      depenseActuelle: 78500,
      pourcentage: 78.5,
      statut: 'normal',
      color: '#3B82F6'
    },
    {
      categorie: 'Maintenance',
      budgetAlloue: 80000,
      depenseActuelle: 65200,
      pourcentage: 81.5,
      statut: 'attention',
      color: '#F59E0B'
    },
    {
      categorie: 'Assurance',
      budgetAlloue: 45000,
      depenseActuelle: 32800,
      pourcentage: 72.9,
      statut: 'normal',
      color: '#10B981'
    },
    {
      categorie: 'Autres',
      budgetAlloue: 25000,
      depenseActuelle: 11000,
      pourcentage: 44.0,
      statut: 'bon',
      color: '#8B5CF6'
    }
  ];

  // Évolution mensuelle du budget
  const evolutionMensuelle = [
    { mois: 'Jan', budget: 20833, depense: 18200, cumule: 18200 },
    { mois: 'Fév', budget: 20833, depense: 19500, cumule: 37700 },
    { mois: 'Mar', budget: 20833, depense: 21800, cumule: 59500 },
    { mois: 'Avr', budget: 20833, depense: 20100, cumule: 79600 },
    { mois: 'Mai', budget: 20833, depense: 22400, cumule: 102000 },
    { mois: 'Jun', budget: 20833, depense: 19800, cumule: 121800 },
    { mois: 'Jul', budget: 20833, depense: 21200, cumule: 143000 },
    { mois: 'Aoû', budget: 20833, depense: 20300, cumule: 163300 },
    { mois: 'Sep', budget: 20833, depense: 24200, cumule: 187500 }
  ];

  // Prévisions pour les mois restants
  const previsions = [
    { mois: 'Oct', prevision: 22000 },
    { mois: 'Nov', prevision: 21500 },
    { mois: 'Déc', prevision: 20000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'bon': return 'text-green-600 bg-green-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'attention': return 'text-orange-600 bg-orange-100';
      case 'critique': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'bon': return <CheckCircle className="h-4 w-4" />;
      case 'normal': return <Target className="h-4 w-4" />;
      case 'attention': return <AlertTriangle className="h-4 w-4" />;
      case 'critique': return <XCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <Layout title="Budget du Parc" userType="Responsable">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget du Parc</h1>
            <p className="text-gray-600 mt-2">Suivi et gestion du budget alloué à votre parc automobile</p>
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
                <DollarSign className="h-5 w-5 text-blue-600" />
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
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un parc</h3>
            <p className="text-gray-600">Veuillez sélectionner un parc pour gérer le budget</p>
          </div>
        ) : (
          <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Budget du Parc</h1>
              <p className="text-gray-600 mt-2">Suivi et gestion du budget alloué à votre parc automobile</p>
            </div>
          
          <div className="flex gap-4">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        {/* Indicateurs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetData.budgetTotal)}</p>
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
                  <p className="text-sm font-medium text-gray-600">Dépensé</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetData.depenseActuelle)}</p>
                  <p className="text-sm text-gray-500">{budgetData.pourcentageUtilise}% utilisé</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Restant</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(budgetData.budgetRestant)}</p>
                  <p className="text-sm text-gray-500">{100 - budgetData.pourcentageUtilise}% disponible</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle du Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evolutionMensuelle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="cumule" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      name="Dépenses cumulées"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="#10B981" 
                      strokeDasharray="5 5"
                      name="Budget mensuel"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition du Budget par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetParCategorie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categorie, pourcentage }) => `${categorie} ${pourcentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="depenseActuelle"
                    >
                      {budgetParCategorie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
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

export default BudgetParc;