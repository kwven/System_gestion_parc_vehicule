import React, { useState } from 'react';
import { Calendar, Car, MapPin, Wrench, DollarSign, CheckCircle, Clock, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DatePicker } from '../components/ui/DatePicker';
import { useAuth, useParkData, useChefParcData, useChauffeurData, useResponsableData } from '../hooks/useAuth';
import Layout from '../components/common/Layout';

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend > 0 ? '+' : ''}{trend}% ce mois
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

// Composant pour les notifications
const NotificationCard = ({ type, message, count = null }) => {
  const getNotificationStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getNotificationStyle()} flex items-center space-x-3`}>
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium">
          {count && <span className="font-bold">{count} </span>}
          {message}
        </p>
      </div>
    </div>
  );
};

const Accueil = () => {
  const { user, loading: authLoading, switchRole } = useAuth();
  const parkData = useParkData();
  const chefParcData = useChefParcData();
  const chauffeurData = useChauffeurData();
  const responsableData = useResponsableData();
  const [selectedDate, setSelectedDate] = useState(new Date());
    
  // Composant de sélection de rôle pour les tests
  const RoleSelector = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Mode test - Changer de rôle:</span>
        </div>
        <div className="flex space-x-2">
          {['Responsable', 'chef de parc', 'chauffeur'].map((role) => (
            <Button
              key={role}
              variant={user?.role === role ? 'primary' : 'secondary'}
              onClick={() => switchRole(role)}
              className="text-xs px-3 py-1"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  if (authLoading || !user) {
    return (
      <Layout title="Chargement..." userType="Responsable">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }
  // Fonction pour déterminer le contenu selon le rôle
  const renderRoleBasedContent = () => {
    if (user.role === 'Responsable') {
      return (
        <div className="space-y-6">
          {/* Message d'accueil Responsable */}
          <div className="bg-gradient-to-r to-blue-900 from-blue-600 rounded-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Bienvenue {user.name}</h1>
            <p className="text-blue-100">Tableau de bord de supervision du parc</p>
          </div>

          {/* Cartes des parcs - Métriques du jour */}
          {[
            { name: 'Parc Central - Rabat', vehicles: 45, drivers: 32, trips: 8, maintenance: 3, validated: 6 },
            { name: 'Parc Nord - Salé', vehicles: 28, drivers: 20, trips: 5, maintenance: 1, validated: 4 },
            { name: 'Parc Sud - Témara', vehicles: 35, drivers: 25, trips: 7, maintenance: 2, validated: 5 }
          ].map((parc, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Car className="h-6 w-6 mr-2 text-blue-600" />
                {parc.name} - Données du jour
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total véhicules"
                  value={parc.vehicles}
                  icon={Car}
                  color="blue"
                />
                <StatCard
                  title="Nombre de chauffeurs"
                  value={parc.drivers}
                  icon={CheckCircle}
                  color="green"
                />
                <StatCard
                  title="Déplacements aujourd'hui"
                  value={parc.trips}
                  icon={MapPin}
                  color="purple"
                />
                <StatCard
                  title="Véhicules en maintenance"
                  value={parc.maintenance}
                  icon={Wrench}
                  color="orange"
                />
              </div>
              
              {/* Déplacements validés */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <StatCard
                  title="Déplacements validés aujourd'hui"
                  value={parc.validated}
                  icon={CheckCircle}
                  color="green"
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (user.role === 'chef de parc') {
      return (
        <div className="space-y-6">
          {/* Message d'accueil Chef de Parc */}
          <div className="bg-gradient-to-r to-blue-900 from-blue-600 rounded-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Bienvenue {user.name}</h1>
            <p className="text-purple-100">Tableau de bord de gestion des déplacements</p>
          </div>

          {/* Statistiques Chef de Parc */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Déplacements validés aujourd'hui"
              value="6"
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              title="Déplacements en attente"
              value="3"
              icon={Clock}
              color="yellow"
            />
            <StatCard
              title="Déplacements planifiés aujourd'hui"
              value="5"
              icon={Calendar}
              color="blue"
            />
          </div>

          {/* Notifications Chef de Parc */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
            {chefParcData.newTripsToValidate > 0 ? (
              <NotificationCard
                type="warning"
                message="déplacements à valider."
                count={chefParcData.newTripsToValidate}
              />
            ) : (
              <NotificationCard
                type="success"
                message="Aucun déplacement à valider pour le moment."
              />
            )}
          </div>
        </div>
      );
    }

    if (user.role === 'chauffeur') {
      return (
        <div className="space-y-6">
          {/* Message d'accueil Chauffeur */}
          <div className="bg-gradient-to-r to-blue-900 from-blue-600 rounded-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Bonjour {user.name}</h1>
            <p className="text-green-100">Votre tableau de bord personnel</p>
          </div>

          {/* Notifications Chauffeur */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
            
            {chauffeurData.validatedTripsThisMonth > 0 && (
              <NotificationCard
                type="success"
                message="de vos déplacements ont été validés."
                count={chauffeurData.validatedTripsThisMonth}
              />
            )}
            
            {chauffeurData.newTripToComplete ? (
              <NotificationCard
                type="info"
                message="Vous avez un nouveau déplacement à compléter."
              />
            ) : (
              <NotificationCard
                type="success"
                message="Aucune nouvelle activité pour le moment."
              />
            )}
          </div>
        </div>
        
      );
    }
    // Pour tous les autres utilisateurs (Administrateur, Gestionnaire, etc.)
    return (
      <div className="space-y-6">
        {/* Message d'accueil général */}
        <div className="bg-gradient-to-r to-blue-900 from-blue-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Bienvenue {user.name}</h1>
          <p className="text-blue-100">Tableau de bord du parc automobile</p>
        </div>

        {/* Filtre par date */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold text-gray-800">Données du parc</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Sélectionner une période"
              />
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total véhicules"
            value={parkData.totalVehicles}
            icon={Car}
            color="blue"
          />
          <StatCard
            title="Déplacements ce mois"
            value={parkData.monthlyTrips}
            icon={MapPin}
            color="green"
            trend={8}
          />
          <StatCard
            title="Véhicules en maintenance"
            value={parkData.vehiclesInMaintenance}
            icon={Wrench}
            color="orange"
          />
          <StatCard
            title="Coût carburant (€)"
            value={parkData.monthlyFuelCost.toLocaleString()}
            icon={DollarSign}
            color="red"
            trend={-5}
          />
        </div>

        {/* Statistiques secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Coût global du parc (€)"
            value={parkData.totalParkCost.toLocaleString()}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="En attente de validation"
            value={parkData.pendingValidationTrips}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Déplacements validés"
            value={parkData.validatedTrips}
            icon={CheckCircle}
            color="green"
          />
        </div>
      </div>
      
    );
  };

  return (
    <Layout title="Page d'accueil" userType={user.role}>
      <RoleSelector />
      {renderRoleBasedContent()}
    </Layout>
  );
};

export default Accueil;
