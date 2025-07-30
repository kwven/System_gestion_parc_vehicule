import React from 'react';
import Navbar from '../components/common/Navbar';
function About() {
  return (
      <div>
      <Navbar />
      <div className="container mx-auto p-4 mt-10 items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">À Propos de Notre Système</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            Le Système de Gestion de Parc de Véhicules est une application robuste et intuitive conçue pour optimiser la gestion de votre flotte. Que vous soyez une entreprise, une administration ou une organisation, notre solution vous aide à suivre vos véhicules, gérer les déplacements, contrôler les coûts et assurer une maintenance efficace.
          </p>
          <p className="text-gray-700 mb-4">
            Développé avec les dernières technologies (Django pour le backend, React pour le frontend, PostgreSQL pour la base de données, et Docker pour la conteneurisation), il offre une plateforme performante, sécurisée et évolutive.
          </p>
          <p className="text-gray-700">
            Notre objectif est de simplifier la complexité de la gestion de flotte, vous permettant de vous concentrer sur vos opérations principales tout en réduisant les coûts et en améliorant l'efficacité.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;