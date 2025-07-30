import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Eye, 
  EyeOff,
  Camera,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react';

const Settings = ({ userType }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profil utilisateur
    profile: {
      nom: 'Ahmed Benali',
      email: 'ahmed.benali@company.com',
      telephone: '+212 6 12 34 56 78',
      adresse: 'Casablanca, Maroc',
      photo: null,
      ancienMotDePasse: '',
      nouveauMotDePasse: '',
      confirmerMotDePasse: ''
    },
    // Notifications
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      deplacementApprouve: true,
      deplacementRejete: true,
      nouveauDeplacement: true,
      maintenanceVehicule: true,
      alerteCarburant: true,
      rapportHebdomadaire: false
    },
    // Sécurité
    security: {
      authentificationDeuxFacteurs: false,
      sessionTimeout: 30,
      historiqueConnexions: true,
      alerteConnexionSuspecte: true
    },
    // Préférences système
    system: {
      langue: 'fr',
      fuseau: 'Africa/Casablanca',
      theme: 'light',
      formatDate: 'dd/mm/yyyy',
      devise: 'MAD',
      uniteDistance: 'km'
    },
    // Paramètres de l'entreprise
    company: {
      nomEntreprise: 'Société de Transport',
      adresseEntreprise: 'Casablanca, Maroc',
      telephoneEntreprise: '+212 5 22 12 34 56',
      emailEntreprise: 'contact@transport.ma',
      siteWeb: 'www.transport.ma',
      logo: null,
      couleurPrimaire: '#3B82F6',
      couleurSecondaire: '#1E40AF'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'system', name: 'Système', icon: Globe },
    { id: 'company', name: 'Entreprise', icon: Database }
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Paramètres sauvegardés avec succès!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (section, field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange(section, field, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h3>
        
        {/* Photo de profil */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {settings.profile.photo ? (
                <img src={settings.profile.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
              <Camera className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFileUpload('profile', 'photo', e)}
              />
            </label>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-800">{settings.profile.nom}</h4>
            <p className="text-gray-600">{userType}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input
              type="text"
              value={settings.profile.nom}
              onChange={(e) => handleInputChange('profile', 'nom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              value={settings.profile.telephone}
              onChange={(e) => handleInputChange('profile', 'telephone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={settings.profile.adresse}
              onChange={(e) => handleInputChange('profile', 'adresse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Changement de mot de passe */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Changer le mot de passe</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ancien mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.profile.ancienMotDePasse}
                onChange={(e) => handleInputChange('profile', 'ancienMotDePasse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={settings.profile.nouveauMotDePasse}
              onChange={(e) => handleInputChange('profile', 'nouveauMotDePasse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.profile.confirmerMotDePasse}
                onChange={(e) => handleInputChange('profile', 'confirmerMotDePasse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Préférences de notification</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Notifications par email</h4>
              <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Notifications SMS</h4>
              <p className="text-sm text-gray-600">Recevoir les notifications par SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Notifications push</h4>
              <p className="text-sm text-gray-600">Recevoir les notifications push dans le navigateur</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Types de notifications</h3>
        
        <div className="space-y-4">
          {[
            { key: 'deplacementApprouve', label: 'Déplacement approuvé', desc: 'Notification quand un déplacement est approuvé' },
            { key: 'deplacementRejete', label: 'Déplacement rejeté', desc: 'Notification quand un déplacement est rejeté' },
            { key: 'nouveauDeplacement', label: 'Nouveau déplacement', desc: 'Notification pour les nouveaux déplacements' },
            { key: 'maintenanceVehicule', label: 'Maintenance véhicule', desc: 'Alertes de maintenance des véhicules' },
            { key: 'alerteCarburant', label: 'Alerte carburant', desc: 'Alertes de niveau de carburant bas' },
            { key: 'rapportHebdomadaire', label: 'Rapport hebdomadaire', desc: 'Rapport hebdomadaire des activités' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key]}
                  onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Paramètres de sécurité</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Authentification à deux facteurs</h4>
              <p className="text-sm text-gray-600">Ajouter une couche de sécurité supplémentaire</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.authentificationDeuxFacteurs}
                onChange={(e) => handleInputChange('security', 'authentificationDeuxFacteurs', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Délai d'expiration de session (minutes)</label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
              <option value={480}>8 heures</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Historique des connexions</h4>
              <p className="text-sm text-gray-600">Conserver l'historique des connexions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.historiqueConnexions}
                onChange={(e) => handleInputChange('security', 'historiqueConnexions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Alerte connexion suspecte</h4>
              <p className="text-sm text-gray-600">Être alerté en cas de connexion suspecte</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.alerteConnexionSuspecte}
                onChange={(e) => handleInputChange('security', 'alerteConnexionSuspecte', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Préférences système</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
            <select
              value={settings.system.langue}
              onChange={(e) => handleInputChange('system', 'langue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
            <select
              value={settings.system.fuseau}
              onChange={(e) => handleInputChange('system', 'fuseau', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
              <option value="Europe/Paris">Paris (GMT+1)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
            <select
              value={settings.system.theme}
              onChange={(e) => handleInputChange('system', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
            <select
              value={settings.system.formatDate}
              onChange={(e) => handleInputChange('system', 'formatDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
            <select
              value={settings.system.devise}
              onChange={(e) => handleInputChange('system', 'devise', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MAD">Dirham marocain (MAD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar américain (USD)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unité de distance</label>
            <select
              value={settings.system.uniteDistance}
              onChange={(e) => handleInputChange('system', 'uniteDistance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="km">Kilomètres</option>
              <option value="miles">Miles</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de l'entreprise</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'entreprise</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {settings.company.logo ? (
                  <img src={settings.company.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Choisir un fichier
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload('company', 'logo', e)}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG jusqu'à 2MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
            <input
              type="text"
              value={settings.company.nomEntreprise}
              onChange={(e) => handleInputChange('company', 'nomEntreprise', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
            <input
              type="url"
              value={settings.company.siteWeb}
              onChange={(e) => handleInputChange('company', 'siteWeb', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de l'entreprise</label>
            <input
              type="email"
              value={settings.company.emailEntreprise}
              onChange={(e) => handleInputChange('company', 'emailEntreprise', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone de l'entreprise</label>
            <input
              type="tel"
              value={settings.company.telephoneEntreprise}
              onChange={(e) => handleInputChange('company', 'telephoneEntreprise', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de l'entreprise</label>
            <textarea
              value={settings.company.adresseEntreprise}
              onChange={(e) => handleInputChange('company', 'adresseEntreprise', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur primaire</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.company.couleurPrimaire}
                onChange={(e) => handleInputChange('company', 'couleurPrimaire', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.company.couleurPrimaire}
                onChange={(e) => handleInputChange('company', 'couleurPrimaire', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur secondaire</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.company.couleurSecondaire}
                onChange={(e) => handleInputChange('company', 'couleurSecondaire', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.company.couleurSecondaire}
                onChange={(e) => handleInputChange('company', 'couleurSecondaire', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'security': return renderSecurityTab();
      case 'system': return renderSystemTab();
      case 'company': return renderCompanyTab();
      default: return renderProfileTab();
    }
  };

  return (
    <Layout title="Paramètres" userType={userType}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et paramètres du système</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar des onglets */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 mr-3 ${
                          activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="lg:w-3/4">
              {renderTabContent()}
              
              {/* Boutons d'action */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 inline mr-2" />
                  )}
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>

              {/* Message de sauvegarde */}
              {saveMessage && (
                <div className={`mt-4 p-4 rounded-md ${
                  saveMessage.includes('succès') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;