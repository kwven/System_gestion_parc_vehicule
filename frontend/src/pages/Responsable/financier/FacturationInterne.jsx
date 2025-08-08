import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Layout from '../../../components/common/Layout';
import ParcSelector from '../../../components/common/ParcSelector';
import { 
  FileText, 
  Download, 
  Send, 
  Eye,
  Plus,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
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
  Line
} from 'recharts';

const FacturationInterne = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParc, setSelectedParc] = useState(null);

  const handleParcChange = (parc) => {
    setSelectedParc(parc);
    // Ici vous pouvez ajouter la logique pour recharger les données du parc sélectionné
  };

  // Données d'exemple pour les factures
  const facturesData = [
    {
      id: 'FACT-2024-001',
      entite: 'Direction Commerciale',
      periode: '2024-01',
      montantTotal: 45000,
      nombreDeplacements: 28,
      kilometrage: 3500,
      statut: 'payee',
      dateEmission: '2024-01-31',
      dateEcheance: '2024-02-15',
      datePaiement: '2024-02-10',
      services: [
        { type: 'Transport personnel', montant: 25000, quantite: 15 },
        { type: 'Livraisons', montant: 15000, quantite: 10 },
        { type: 'Missions externes', montant: 5000, quantite: 3 }
      ]
    },
    {
      id: 'FACT-2024-002',
      entite: 'Direction Technique',
      periode: '2024-01',
      montantTotal: 32000,
      nombreDeplacements: 18,
      kilometrage: 2800,
      statut: 'en_attente',
      dateEmission: '2024-01-31',
      dateEcheance: '2024-02-15',
      datePaiement: null,
      services: [
        { type: 'Interventions techniques', montant: 20000, quantite: 12 },
        { type: 'Transport matériel', montant: 12000, quantite: 6 }
      ]
    },
    {
      id: 'FACT-2024-003',
      entite: 'Direction Administrative',
      periode: '2024-01',
      montantTotal: 18000,
      nombreDeplacements: 12,
      kilometrage: 1500,
      statut: 'brouillon',
      dateEmission: null,
      dateEcheance: null,
      datePaiement: null,
      services: [
        { type: 'Déplacements administratifs', montant: 15000, quantite: 10 },
        { type: 'Courrier express', montant: 3000, quantite: 2 }
      ]
    },
    {
      id: 'FACT-2024-004',
      entite: 'Direction RH',
      periode: '2024-01',
      montantTotal: 28000,
      nombreDeplacements: 22,
      kilometrage: 2200,
      statut: 'envoyee',
      dateEmission: '2024-01-31',
      dateEcheance: '2024-02-15',
      datePaiement: null,
      services: [
        { type: 'Recrutement', montant: 18000, quantite: 15 },
        { type: 'Formation externe', montant: 10000, quantite: 7 }
      ]
    }
  ];

  // Données pour les graphiques
  const repartitionParEntite = facturesData.map(f => ({
    entite: f.entite.replace('Direction ', ''),
    montant: f.montantTotal / 1000,
    deplacements: f.nombreDeplacements
  }));

  const evolutionFacturation = [
    { mois: 'Oct 2023', montant: 95000 },
    { mois: 'Nov 2023', montant: 108000 },
    { mois: 'Déc 2023', montant: 87000 },
    { mois: 'Jan 2024', montant: 123000 },
    { mois: 'Fév 2024', montant: 135000 },
    { mois: 'Mar 2024', montant: 142000 }
  ];

  const repartitionStatuts = [
    { statut: 'Payées', nombre: 1, couleur: '#10B981' },
    { statut: 'En attente', nombre: 1, couleur: '#F59E0B' },
    { statut: 'Envoyées', nombre: 1, couleur: '#3B82F6' },
    { statut: 'Brouillons', nombre: 1, couleur: '#6B7280' }
  ];

  const tarifsPredefinies = [
    { service: 'Transport personnel', tarifKm: 8.5, tarifHeure: 120 },
    { service: 'Livraisons', tarifKm: 6.0, tarifHeure: 80 },
    { service: 'Missions externes', tarifKm: 10.0, tarifHeure: 150 },
    { service: 'Interventions techniques', tarifKm: 9.0, tarifHeure: 140 },
    { service: 'Transport matériel', tarifKm: 7.5, tarifHeure: 100 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'payee': { label: 'Payée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'envoyee': { label: 'Envoyée', color: 'bg-blue-100 text-blue-800', icon: Send },
      'brouillon': { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: FileText }
    };
    
    const config = statusConfig[statut] || statusConfig['brouillon'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const filteredFactures = facturesData.filter(facture => {
    const matchesStatus = selectedStatus === 'all' || facture.statut === selectedStatus;
    const matchesSearch = facture.entite.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facture.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalFacturation = facturesData.reduce((sum, f) => sum + f.montantTotal, 0);
  const totalDeplacements = facturesData.reduce((sum, f) => sum + f.nombreDeplacements, 0);
  const facturesPayees = facturesData.filter(f => f.statut === 'payee').length;
  const tauxPaiement = (facturesPayees / facturesData.length * 100).toFixed(1);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facturation Interne</h1>
            <p className="text-gray-600 mt-2">Gestion de la facturation des services de transport entre entités</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Facture
            </button>
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
                <FileText className="h-5 w-5 text-blue-600" />
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
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un parc</h3>
            <p className="text-gray-600">Veuillez sélectionner un parc pour gérer la facturation</p>
          </div>
        ) : (
          <>

        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Facturation Totale</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFacturation)}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% vs mois dernier
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Nombre de Factures</p>
                  <p className="text-2xl font-bold text-gray-900">{facturesData.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Ce mois-ci</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Déplacements</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDeplacements}</p>
                  <p className="text-sm text-gray-500 mt-1">Facturés</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Paiement</p>
                  <p className="text-2xl font-bold text-gray-900">{tauxPaiement}%</p>
                  <p className="text-sm text-gray-500 mt-1">{facturesPayees}/{facturesData.length} factures</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par entité */}
          <Card>
            <CardHeader>
              <CardTitle>Facturation par Entité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repartitionParEntite}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="entite" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}k MAD`, 'Montant']} />
                    <Bar dataKey="montant" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition des statuts */}
          <Card>
            <CardHeader>
              <CardTitle>Statut des Factures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionStatuts}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="nombre"
                      label={({ statut, nombre }) => `${statut}: ${nombre}`}
                    >
                      {repartitionStatuts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Évolution de la facturation */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la Facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionFacturation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line 
                    type="monotone" 
                    dataKey="montant" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Factures</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="brouillon">Brouillons</option>
                <option value="envoyee">Envoyées</option>
                <option value="en_attente">En attente</option>
                <option value="payee">Payées</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">N° Facture</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Entité</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Période</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Montant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Déplacements</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Échéance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFactures.map((facture) => (
                    <tr key={facture.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{facture.id}</td>
                      <td className="py-3 px-4">{facture.entite}</td>
                      <td className="py-3 px-4">{facture.periode}</td>
                      <td className="py-3 px-4 font-semibold">{formatCurrency(facture.montantTotal)}</td>
                      <td className="py-3 px-4">{facture.nombreDeplacements}</td>
                      <td className="py-3 px-4">{getStatusBadge(facture.statut)}</td>
                      <td className="py-3 px-4">
                        {facture.dateEcheance ? 
                          new Date(facture.dateEcheance).toLocaleDateString('fr-FR') : 
                          '-'
                        }
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <Download className="h-4 w-4" />
                          </button>
                          {facture.statut === 'brouillon' && (
                            <button className="p-1 text-orange-600 hover:bg-orange-100 rounded">
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tarifs prédéfinis */}
        <Card>
          <CardHeader>
            <CardTitle>Tarifs de Facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tarifsPredefinies.map((tarif, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{tarif.service}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Tarif/km:</span>
                      <span className="font-medium">{tarif.tarifKm} MAD</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Tarif/heure:</span>
                      <span className="font-medium">{tarif.tarifHeure} MAD</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
         </Card>
         </>
         )}
       </div>
     </Layout>
  );
};

export default FacturationInterne;