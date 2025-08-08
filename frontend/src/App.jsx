import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importez vos pages ici
import Login from './pages/auth/Login';
import Home from './pages/Home'; 
import Profile from './pages/auth/Profile'; 
/*deplacemets pages */
import AllDeplacement from './pages/common/AllDeplacement';
import AddDeplacement from './pages/Chef_de_parc/deplacement/AddDeplacement';
import DeplacementDetails from './pages/Chef_de_parc/deplacement/DeplacementDetails';
import ChDeplacement from './pages/Chauffeur/deplacement/ChDeplacement';
import FillTrajet from './pages/Chauffeur/deplacement/FillTrajet';
import ValidateTrajet from './pages/Chef_de_parc/deplacement/ValidateTrajet';
/* vehicules pages*/
import AllVehicule from './pages/common/AllVehicule';
import AddVehicule from './pages/Chef_de_parc/vehicule/AddVehicule';
import ManageVehicule from './pages/Chef_de_parc/vehicule/ManageVehicule';
/*cheufeurs pages */
import AllChauffeur from './pages/common/AllChauffeur';
import ManageChauffeur from './pages/Chef_de_parc/chauffeur/ManageChauffeur';
/* pages financières */
import CoutsVehicule from './pages/Responsable/vehicule/CoutsVehicule';
import BudgetParc from './pages/Responsable/financier/BudgetParc';
import TCOAnalyse from './pages/Responsable/financier/TCOAnalyse';
import FacturationInterne from './pages/Responsable/financier/FacturationInterne';
/* pages gestion parc */
import TableauBordParc from './pages/Responsable/Dashboard/TableauBordParc';
import VueEnsembleParc from './pages/Responsable/Dashboard/VueEnsembleParc';
/* pages responsable */
import Maintenance from './pages/Chef_de_parc/vehicule/Maintenance';
import Accueil from './pages/Accueil';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      {/* deplacemnts routes */}
      <Route path="/deplacements" element={<AllDeplacement />} />
      <Route path="/create-deplacement" element={<AddDeplacement />} />
      <Route path="/validate-trajet" element={<ValidateTrajet />} />
      <Route path="/ch-deplacement" element={<ChDeplacement />} /> 
      <Route path="/deplacements/details/:id" element={<DeplacementDetails />} />
      <Route path="/manage-deplacement" element={<ManageDeplacement />}/> 
      <Route path="/AllDeplacement" element={<AllDeplacement />} />
      <Route path="/fill-trajet" element={<FillTrajet />} />
      {/* vehicules routes */}
      <Route path="/vehicules" element={<AllVehicule />} />
      <Route path="/create-vehicule" element={<AddVehicule />} />
      <Route path="/manage-vehicule" element={<ManageVehicule />} />
      <Route path="/chauffeurs" element={<AllChauffeur />} />
      <Route path="/manage-chauffeur" element={<ManageChauffeur />} />
      <Route path="/vehicule-report" element={<VehiculeReport />} />
      <Route path="/accueil" element={<Accueil />} />
      {/* routes financières */}
      <Route path="/couts-vehicule" element={<CoutsVehicule />} />
      <Route path="/budget-parc" element={<BudgetParc />} />
      <Route path="/tco-analyse" element={<TCOAnalyse />} />
      <Route path="/facturation-interne" element={<FacturationInterne />} />
      {/* routes gestion parc */}
      <Route path="/tableau-bord-parc" element={<TableauBordParc />} />
      <Route path="/vue-ensemble-parc" element={<VueEnsembleParc />} />
      {/* routes responsable */}
      <Route path="/maintenance" element={<Maintenance />} />
    </Routes>
  );
}

export default App;