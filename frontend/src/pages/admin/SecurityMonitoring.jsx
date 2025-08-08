import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import {
  Shield,
  AlertTriangle,
  Eye,
  Users,
  Activity,
  Clock,
  Database,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
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
  Area,
  AreaChart
} from 'recharts';

const SecurityMonitoring = () => {
  const [securityData, setSecurityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoints
  const API_BASE_URL = 'http://localhost:8000/api/audit';
  
  // Fonction pour charger les données de sécurité
  const loadSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/security/`);
      setSecurityData(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données de sécurité:', error);
      setError('Erreur lors du chargement des données de sécurité');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour charger les alertes
  const loadAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/security/alerts/`);
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    }
  };
  
  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/charts/`);
      
      // Transformer les données pour correspondre au format attendu
      const data = response.data;
      setStats({
        totalUsers: Object.keys(data.top_users || {}).length,
        activeUsers: Object.keys(data.top_users || {}).length,
        highRiskActivities: data.high_risk_count || 0,
        totalOperations: Object.values(data.operations_by_type || {}).reduce((a, b) => a + b, 0),
        riskDistribution: data.risk_distribution || [],
        userActivity: data.top_users || [],
        timelineData: data.activity_timeline || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  useEffect(() => {
    loadSecurityData();
    loadAlerts();
    loadStats();
  }, []);
  
  // Fonction de rafraîchissement
  const handleRefresh = () => {
    loadSecurityData();
    loadAlerts();
    loadStats();
  };

  useEffect(() => {
    // Filtrage des données
    let filtered = securityData;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.table_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(item => item.risk_level === filterRisk);
    }

    setFilteredData(filtered);
  }, [securityData, searchTerm, filterRisk]);

  const getRiskLevel = (count, operation) => {
    if (operation === 'DELETE' && count > 50) return 'high';
    if (operation === 'UPDATE' && count > 100) return 'high';
    if (count > 80) return 'medium';
    return 'normal';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'medium': return <Minus className="h-4 w-4" />;
      case 'normal': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  const exportSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      alerts,
      securityData: filteredData
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Surveillance de Sécurité
            </h1>
            <p className="text-gray-600 mt-1">Monitoring des activités et détection des anomalies</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Actualiser
            </Button>
            <Button onClick={exportSecurityReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Rapport de Sécurité
            </Button>
          </div>
        </div>

        {/* Alertes de sécurité */}
        {alerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes de Sécurité ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(alert.severity)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {alert.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {alert.table}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques de sécurité */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}/{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activités à Risque</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highRiskActivities}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opérations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOperations}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes Actives</p>
                  <p className="text-2xl font-bold text-orange-600">{alerts.length}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques de surveillance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Risques</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.riskDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activité par Utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="user" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="operations" fill={(entry) => {
                    const risk = entry.risk;
                    return risk === 'high' ? '#EF4444' : risk === 'medium' ? '#F59E0B' : '#10B981';
                  }} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Timeline d'activité */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline d'Activité (Aujourd'hui)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="operations" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="alerts" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres de Surveillance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher utilisateur ou table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les niveaux de risque</option>
                <option value="high">Risque élevé</option>
                <option value="medium">Risque moyen</option>
                <option value="normal">Risque normal</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Dernières 24h</option>
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des activités surveillées */}
        <Card>
          <CardHeader>
            <CardTitle>Activités Surveillées ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getRiskColor(item.risk_level)} flex items-center gap-1`}>
                        {getRiskIcon(item.risk_level)}
                        {item.risk_level.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900">{item.user_name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {item.table_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {item.operation}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {item.operation_count} opérations
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(item.last_access)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.risk_level === 'high' && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SecurityMonitoring;