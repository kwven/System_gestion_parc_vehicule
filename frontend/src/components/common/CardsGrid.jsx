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
          description="Optimisez vos ressources."
          image="/bus.png"
        />
      </div>

      <div
        className={`transition-all duration-700 ease-out ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Card
          title="Contrôle d'Accès"
          description="Sécurisez l'accès aux véhicules."
          image="/control.png"
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
          description="Analysez les données facilement."
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
          description="Surveillez vos trajets."
          image="/suivi.png"
        />
      </div>
    </div>
  );
}
