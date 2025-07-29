import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function CardsGrid() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 3000); // delay before cards appear

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {/* First row */}
      <div
        className={`transition-all duration-700 ease-out ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Card
          title="Gestion Multi-Niveaux"
          description="Gérez la structure de l'organisation à plusieurs niveaux, du central au local."
          image="/hierarchy.png"
        />
      </div>

      <div
        className={`transition-all duration-700 ease-out ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Card
          title="Contrôle d'Accès"
          description="Gérez les autorisations des utilisateurs et limitez l'accès aux fonctionnalités sensibles."
          image="/security.png"
        />
      </div>

      {/* Second row — with extra delay */}
      <div
        className={`transition-all duration-700 ease-out delay-200 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Card
          title="Tableaux de Bord"
          description="Consultez les indicateurs clés et les statistiques de gestion."
          image="/dashboard.png"
        />
      </div>

      <div
        className={`transition-all duration-700 ease-out delay-200 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Card
          title="Suivi des Déplacements"
          description="Suivez les trajets et les mouvements des véhicules."
          image="/tracking.png"
        />
      </div>
    </div>
  );
}
