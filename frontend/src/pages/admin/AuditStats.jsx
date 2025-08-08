import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import Layout from '../../components/common/Layout';
import {
  BarChart2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Download,
  Filter,
  PieChart as PieChartIcon,
  Search,
  Table,
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
  Line,
  Legend
} from 'recharts';
import axios from 'axios';

const AuditStats = () => {
  const [auditStats, setAuditStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTable, setFilterTable] = useState('all');
  const [filterOperation, setFilterOperation] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [sortConfig, setSortConfig] = useState({ key: 'audit_date', direction: 'desc' });
  const [summaryStats, setSummaryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoints
  const API_BASE_URL = 'http://localhost:8000/api/audit';
  
  // Fonction pour charger les statistiques d'audit
  const loadAuditStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        date_range: dateRange,
        search: searchTerm,
        table_filter: filterTable !== 'all' ? filterTable : undefined,
        operation_filter: filterOperation !== 'all' ? filterOperation : undefined
      };
      
      const response = await axios.get(`${API_BASE_URL}/stats/`, { params });
      setAuditStats(response.data.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditStats();
  }, [dateRange, filterTable, filterOperation]);
  
  // Fonction de rafraîchissement
  const handleRefresh = () => {
    loadAuditStats();
  };

  useEffect(() => {
    // Filtrage des statistiques
    let filtered = auditStats;

    if (searchTerm) {
      filtered = filtered.filter(stat => 
        stat.table_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTable !== 'all') {
      filtered = filtered.filter(stat => stat.table_name === filterTable);
    }

    if (filterOperation !== 'all') {
      filtered = filtered.filter(stat => stat.operation === filterOperation);
    }

    // Tri des données
    filtered = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredStats(filtered);

    // Calcul des statistiques récapitulatives
    const summary = {
      totalOperations: filtered.reduce((sum, stat) => sum + stat.operation_count, 0),
      operationsByType: {},
      operationsByTable: {},
      operationsByDate: {}
    };

    // Regroupement par type d'opération
    filtered.forEach(stat => {
      if (!summary.operationsByType[stat.operation]) {
        summary.operationsByType[stat.operation] = 0;
      }
      summary.operationsByType[stat.operation] += stat.operation_count;
    });

    // Regroupement par table
    filtered.forEach(stat => {
      if (!summary.operationsByTable[stat.table_name]) {
        summary.operationsByTable[stat.table_name] = 0;
      }
      summary.operationsByTable[stat.table_name] += stat.operation_count;
    });

    // Regroupement par date
    filtered.forEach(stat => {
      if (!summary.operationsByDate[stat.audit_date]) {
        summary.operationsByDate[stat.audit_date] = 0;
      }
      summary.operationsByDate[stat.audit_date] += stat.operation_count;
    });

    // Conversion pour les graphiques
    summary.operationsByTypeChart = Object.entries(summary.operationsByType).map(([name, value]) => ({
      name,
      value,
      color: name === 'INSERT' ? '#10B981' : name === 'UPDATE' ? '#F59E0B' : '#EF4444'
    }));

    summary.operationsByTableChart = Object.entries(summary.operationsByTable)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    summary.operationsByDateChart = Object.entries(summary.operationsByDate)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setSummaryStats(summary);
  }, [auditStats, searchTerm, filterTable, filterOperation, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getOperationColor = (operation) => {
    switch (operation) {
      case 'INSERT': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportStats = async () => {
    try {
      const params = {
        date_range: dateRange,
        search: searchTerm,
        table_filter: filterTable !== 'all' ? filterTable : undefined,
        operation_filter: filterOperation !== 'all' ? filterOperation : undefined,
        format: 'csv'
      };
      
      const response = await axios.get(`${API_BASE_URL}/stats/export/`, {
        params,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_stats_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export des données');
    }
  };

  const uniqueTables = [...new Set(auditStats.map(stat => stat.table_name))];

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques d'Audit</h1>
            <p className="text-gray-600 mt-1">Analyse des opérations d'audit par jour, table et type</p>
          </div>
          <Button onClick={exportStats} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>

        {/* Statistiques récapitulatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opérations</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryStats.totalOperations || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tables Auditées</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueTables.length}</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Période</p>
                  <p className="text-2xl font-bold text-gray-900">{dateRange} jours</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Répartition par Type d'Opération
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={summaryStats.operationsByTypeChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {summaryStats.operationsByTypeChart?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} opérations`, 'Nombre']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Top 5 Tables par Activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={summaryStats.operationsByTableChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} opérations`, 'Nombre']} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des Opérations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={summaryStats.operationsByDateChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [`${value} opérations`, 'Nombre']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                  placeholder="Rechercher une table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
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
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">90 derniers jours</option>
                <option value="365">365 derniers jours</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des statistiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Statistiques Détaillées ({filteredStats.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('audit_date')}
                    >
                      <div className="flex items-center gap-1">
                        Date {getSortIcon('audit_date')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('table_name')}
                    >
                      <div className="flex items-center gap-1">
                        Table {getSortIcon('table_name')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('operation')}
                    >
                      <div className="flex items-center gap-1">
                        Opération {getSortIcon('operation')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('operation_count')}
                    >
                      <div className="flex items-center gap-1">
                        Nombre {getSortIcon('operation_count')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(stat.audit_date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stat.table_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Badge className={getOperationColor(stat.operation)}>
                          {stat.operation}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stat.operation_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuditStats;