import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';

function Profile() {
  const [userProfile, setUserProfile] = useState({
    username: 'utilisateur.test',
    email: 'utilisateur.test@example.com',
    role: 'Administrateur',
    entity: 'Direction Générale',
    firstName: 'Utilisateur',
    lastName: 'Test',
    matricule: 'MT001',
    dateAffected: '2023-01-15',
    isActive: true,
  });

  // En production, ces données viendraient d'une API
  useEffect(() => {
    // Simuler un appel API pour récupérer les données de profil
    const fetchProfileData = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            username: 'utilisateur.test',
            email: 'utilisateur.test@example.com',
            role: 'Administrateur',
            entity: 'Direction Générale',
            firstName: 'Utilisateur',
            lastName: 'Test',
            matricule: 'MT001',
            dateAffected: '2023-01-15',
            isActive: true,
          });
        }, 500);
      });
    };

    fetchProfileData().then(data => setUserProfile(data));
  }, []);

  return (
    <Layout title="Mon Profil" userType='chef de parc'>
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Mon Profil</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Nom d'utilisateur:</p>
              <p className="text-gray-800 font-medium">{userProfile.username}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email:</p>
              <p className="text-gray-800 font-medium">{userProfile.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Prénom:</p>
              <p className="text-gray-800 font-medium">{userProfile.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Nom:</p>
              <p className="text-gray-800 font-medium">{userProfile.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rôle:</p>
              <p className="text-gray-800 font-medium">{userProfile.role}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Entité:</p>
              <p className="text-gray-800 font-medium">{userProfile.entity}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Matricule:</p>
              <p className="text-gray-800 font-medium">{userProfile.matricule}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Date d'affectation:</p>
              <p className="text-gray-800 font-medium">{userProfile.dateAffected}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Statut:</p>
              <p className={`font-medium ${userProfile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {userProfile.isActive ? 'Actif' : 'Inactif'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
