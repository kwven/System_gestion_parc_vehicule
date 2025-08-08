import { useState, useEffect } from 'react';

// Hook personnalisé pour gérer l'authentification et les rôles
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de la récupération des données utilisateur
    // En production, ceci ferait appel à votre API d'authentification
    const simulateAuth = () => {
      setTimeout(() => {
        // Vous pouvez changer ces données pour tester différents rôles
        const mockUser = {
          id: 1,
          name: 'Ahmed Benali',
          email: 'ahmed.benali@example.com',
          role: 'Administrateur', // Changez ici: 'Administrateur', 'Chef de Parc', 'Chauffeur', 'Gestionnaire'
          avatar: '/api/placeholder/40/40',
          permissions: {
            canViewAllData: true,
            canValidateTrips: false,
            canCreateTrips: true,
            canManageVehicles: true
          }
        };
        setUser(mockUser);
        setLoading(false);
      }, 1000);
    };

    simulateAuth();
  }, []);

  const login = (credentials) => {
    // Logique de connexion
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 1,
          name: credentials.name || 'Utilisateur',
          email: credentials.email,
          role: credentials.role || 'Administrateur',
          avatar: '/api/placeholder/40/40'
        };
        setUser(mockUser);
        resolve(mockUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
        permissions: getRolePermissions(newRole)
      });
    }
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case 'Administrateur':
        return {
          canViewAllData: true,
          canValidateTrips: true,
          canCreateTrips: true,
          canManageVehicles: true,
          canManageUsers: true
        };
      case 'Chef de Parc':
        return {
          canViewAllData: false,
          canValidateTrips: true,
          canCreateTrips: false,
          canManageVehicles: false,
          canManageUsers: false
        };
      case 'Chauffeur':
        return {
          canViewAllData: false,
          canValidateTrips: false,
          canCreateTrips: true,
          canManageVehicles: false,
          canManageUsers: false
        };
      case 'Gestionnaire':
        return {
          canViewAllData: true,
          canValidateTrips: false,
          canCreateTrips: true,
          canManageVehicles: true,
          canManageUsers: false
        };
      case 'Responsable':
        return {
          canViewAllData: true,
          canValidateTrips: true,
          canCreateTrips: false,
          canManageVehicles: false,
          canManageUsers: false
        };
      default:
        return {
          canViewAllData: false,
          canValidateTrips: false,
          canCreateTrips: false,
          canManageVehicles: false,
          canManageUsers: false
        };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user,
    hasPermission: (permission) => user?.permissions?.[permission] || false
  };
};

// Hook pour les données du parc (simulation)
export const useParkData = () => {
  const [data, setData] = useState({
    totalVehicles: 45,
    monthlyTrips: 128,
    vehiclesInMaintenance: 3,
    monthlyFuelCost: 15420,
    totalParkCost: 245000,
    pendingValidationTrips: 7,
    validatedTrips: 121,
    loading: true
  });

  useEffect(() => {
    // Simulation du chargement des données
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, loading: false }));
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setData(prev => ({ ...prev, loading: true }));
    setTimeout(() => {
      // Simulation de nouvelles données
      setData({
        totalVehicles: 45 + Math.floor(Math.random() * 5),
        monthlyTrips: 128 + Math.floor(Math.random() * 20),
        vehiclesInMaintenance: Math.floor(Math.random() * 8),
        monthlyFuelCost: 15420 + Math.floor(Math.random() * 2000),
        totalParkCost: 245000 + Math.floor(Math.random() * 10000),
        pendingValidationTrips: Math.floor(Math.random() * 15),
        validatedTrips: 121 + Math.floor(Math.random() * 10),
        loading: false
      });
    }, 1000);
  };

  return { ...data, refreshData };
};

// Hook pour les données spécifiques au chef de parc
export const useChefParcData = () => {
  const [data, setData] = useState({
    validatedTrips: 121,
    unvalidatedTrips: 7,
    plannedTrips: 15,
    newTripsToValidate: 7,
    loading: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, loading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return data;
};

// Hook pour les données spécifiques au chauffeur
export const useChauffeurData = () => {
  const [data, setData] = useState({
    validatedTripsThisMonth: 5,
    newTripToComplete: true,
    totalTripsCreated: 23,
    loading: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, loading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return data;
};

// Hook pour les données spécifiques au responsable
export const useResponsableData = () => {
  const [data, setData] = useState({
    totalVehicles: 45,
    totalDrivers: 32,
    tripsToday: 8,
    vehiclesInMaintenance: 3,
    validatedTripsToday: 6,
    loading: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, loading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setData(prev => ({ ...prev, loading: true }));
    setTimeout(() => {
      // Simulation de nouvelles données pour le jour
      setData({
        totalVehicles: 45,
        totalDrivers: 32,
        tripsToday: Math.floor(Math.random() * 15) + 5,
        vehiclesInMaintenance: Math.floor(Math.random() * 6),
        validatedTripsToday: Math.floor(Math.random() * 10) + 3,
        loading: false
      });
    }, 1000);
  };

  return { ...data, refreshData };
};