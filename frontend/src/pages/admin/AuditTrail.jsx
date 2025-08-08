import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import Layout from '../../components/common/Layout';
import {
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  Activity,
  Users,
  Database,
  Calendar,
  Clock,
  User,
  Globe,
  FileText,
  Trash2,
  Edit,
  Plus
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
import axios from 'axios';

const AuditTrail = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperation, setFilterOperation] = useState('all');
  const [filterTable, setFilterTable] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);

  // API endpoints
  const API_BASE_URL = 'http://localhost:8000/api/audit';
  
  // Fonction pour charger les logs d'audit
  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        page_size: pageSize,
        ...(filterTable !== 'all' && { table_name: filterTable }),
        ...(filterOperation !== 'all' && { operation: filterOperation }),
        ...(filterUser !== 'all' && { user_name: filterUser }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await axios.get(`${API_BASE_URL}/logs/`, { params });
      
      setAuditLogs(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
      setError('Erreur lors du chargement des logs d\'audit');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      const [summaryResponse, chartsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/logs/summary/`),
        axios.get(`${API_BASE_URL}/stats/charts/`)
      ]);
      
      setStats({
        totalOperations: summaryResponse.data.total_operations || 0,
        todayOperations: summaryResponse.data.today_operations || 0,
        uniqueUsers: summaryResponse.data.unique_users || 0,
        tablesAudited: summaryResponse.data.unique_tables || 0,
        operationsByType: chartsResponse.data.operations_by_type || [],
        dailyActivity: chartsResponse.data.daily_activity || [],
        topTables: chartsResponse.data.top_tables || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  useEffect(() => {
    loadAuditLogs();
    loadStats();
  }, [currentPage, filterOperation, filterTable, filterUser]);
  
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        loadAuditLogs();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    // Filtrage des logs
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.operation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOperation !== 'all') {
      filtered = filtered.filter(log => log.operation === filterOperation);
    }

    if (filterTable !== 'all') {
      filtered = filtered.filter(log => log.table_name === filterTable);
    }

    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.user_name === filterUser);
    }

    setFilteredLogs(filtered);
  }, [auditLogs, searchTerm, filterOperation, filterTable, filterUser]);

  const getOperationIcon = (operation) => {
    switch (operation) {
      case 'INSERT': return <Plus className="h-4 w-4" />;
      case 'UPDATE': return <Edit className="h-4 w-4" />;
      case 'DELETE': return <Trash2 className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getOperationColor = (operation) => {
    switch (operation) {
      case 'INSERT': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const exportAuditLogs = async () => {
    try {
      const params = {
        ...(filterTable !== 'all' && { table_name: filterTable }),
        ...(filterOperation !== 'all' && { operation: filterOperation }),
        ...(filterUser !== 'all' && { user_name: filterUser }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await axios.get(`${API_BASE_URL}/logs/export/`, {
        params,
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setError('Erreur lors de l\'export des données');
    }
  };

  const uniqueTables = [...new Set(auditLogs.map(log => log.table_name))];
  const uniqueUsers = [...new Set(auditLogs.map(log => log.user_name))];

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
            <p className="text-gray-600 mt-1">Surveillance et traçabilité des opérations système</p>
          </div>
          <Button onClick={exportAuditLogs} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opérations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOperations}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayOperations}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tables Auditées</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.tablesAudited}</p>
                </div>
                <Database className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Type d'Opération</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.operationsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.operationsByType?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité des 7 Derniers Jours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')} />
                  <Line type="monotone" dataKey="operations" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les opérations</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>

              <select
                value={filterTable}
                onChange={(e) => setFilterTable(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les tables</option>
                {uniqueTables.map(table => (
                  <option key={table} value={table}>{table}</option>
                ))}
              </select>

              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les utilisateurs</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs d'Audit ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getOperationColor(log.operation)} flex items-center gap-1`}>
                        {getOperationIcon(log.operation)}
                        {log.operation}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900">{log.table_name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {log.ip_address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de détails */}
        {showDetails && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Détails de l'Audit Log #{selectedLog.id}</h3>
                <Button variant="outline" onClick={() => setShowDetails(false)}>×</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table</label>
                  <p className="text-sm text-gray-900">{selectedLog.table_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opération</label>
                  <Badge className={getOperationColor(selectedLog.operation)}>
                    {selectedLog.operation}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                  <p className="text-sm text-gray-900">{selectedLog.user_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                  <p className="text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
                  <p className="text-sm text-gray-900">{selectedLog.ip_address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schéma</label>
                  <p className="text-sm text-gray-900">{selectedLog.schema_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedLog.old_values && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anciennes Valeurs</label>
                    <pre className="bg-red-50 border border-red-200 rounded p-3 text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.old_values, null, 2)}
                    </pre>
                  </div>
                )}
                
                {selectedLog.new_values && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nouvelles Valeurs</label>
                    <pre className="bg-green-50 border border-green-200 rounded p-3 text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.new_values, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuditTrail;