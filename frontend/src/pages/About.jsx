import React from 'react';
import Navbar from '../components/common/Navbar';
import { Car, Users, BarChart3, Shield, MapPin, Fuel, Calendar, DollarSign, Settings, TrendingUp } from 'lucide-react';

function About() {
  const features = [
    {
      icon: <Car className="h-8 w-8 text-blue-500" />,
      title: "Gestion de Flotte",
      description: "Gérez efficacement votre parc de véhicules avec un suivi complet de l'état, de la maintenance et des performances de chaque véhicule."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Gestion des Chauffeurs",
      description: "Administrez les chauffeurs, leurs permis, leurs affectations et suivez leurs performances en temps réel."
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Planification des Déplacements",
      description: "Planifiez et organisez les déplacements avec une interface intuitive pour optimiser l'utilisation des véhicules."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      title: "Rapports et Analyses",
      description: "Générez des rapports détaillés et des analyses pour prendre des décisions éclairées sur votre flotte."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      title: "Contrôle des Coûts",
      description: "Suivez et analysez tous les coûts liés à votre flotte : carburant, maintenance, assurance et plus encore."
    },
    {
      icon: <Fuel className="h-8 w-8 text-yellow-500" />,
      title: "Gestion du Carburant",
      description: "Monitorer la consommation de carburant, optimiser les coûts et réduire l'empreinte environnementale."
    },
    {
      icon: <MapPin className="h-8 w-8 text-indigo-500" />,
      title: "Suivi Géographique",
      description: "Suivez les déplacements par région, province et localité avec une hiérarchie géographique complète."
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-500" />,
      title: "Sécurité et Permissions",
      description: "Système de rôles et permissions avancé pour contrôler l'accès aux données selon les niveaux hiérarchiques."
    },
    {
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      title: "Configuration Flexible",
      description: "Adaptez le système à vos besoins spécifiques avec des paramètres configurables et une interface personnalisable."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-pink-500" />,
      title: "Dashboard Interactif",
      description: "Visualisez vos données avec des graphiques interactifs et des tableaux de bord personnalisés par rôle."
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Système de Gestion de <span className="text-blue-600">Parc de Véhicules</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une solution complète et moderne pour optimiser la gestion de votre flotte automobile. 
              Simplifiez vos opérations, réduisez vos coûts et améliorez votre efficacité.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Fonctionnalités Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-gray-800 ml-3">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Avantages de Notre Solution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                  Efficacité Opérationnelle
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Réduction des temps d'arrêt grâce à une maintenance préventive
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Optimisation des itinéraires et des affectations de véhicules
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Automatisation des processus administratifs
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <DollarSign className="h-6 w-6 text-blue-500 mr-3" />
                  Réduction des Coûts
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Contrôle précis de la consommation de carburant
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Planification optimale de la maintenance
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Réduction des coûts administratifs
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              Fournir une solution technologique avancée qui transforme la gestion de flotte en un processus 
              simple, efficace et rentable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;