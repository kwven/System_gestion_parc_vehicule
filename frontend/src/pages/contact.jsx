import React from 'react';
import Layout from '../components/common/Layout';

function Help() {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Centre d'Aide</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Comment utiliser le système ?</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">1. Connexion</h4>
              <p className="text-gray-600">Utilisez vos identifiants fournis par l'administrateur pour vous connecter au système.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">2. Navigation</h4>
              <p className="text-gray-600">Utilisez le menu de navigation pour accéder aux différentes sections : véhicules, déplacements, rapports, etc.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">3. Gestion des véhicules</h4>
              <p className="text-gray-600">Ajoutez, modifiez et suivez l'état de vos véhicules depuis la section "Véhicules".</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">4. Planification des déplacements</h4>
              <p className="text-gray-600">Créez et gérez les déplacements, assignez des véhicules et des chauffeurs.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">5. Suivi des coûts</h4>
              <p className="text-gray-600">Enregistrez et analysez les coûts liés à votre flotte (carburant, maintenance, etc.).</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Besoin d'aide supplémentaire ?</h3>
            <p className="text-blue-700 mb-2">
              <strong>Email :</strong> admin@example.com
            </p>
            <p className="text-blue-700">
              <strong>Téléphone :</strong> +212 5XX XX XX XX
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Help;
