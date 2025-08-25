from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from core.models import Vehicule, Deplacement, TypeCout, CoutVehicule,UtilisationVehicule
from authentication.models import Agent, User
from core.models import Entite, Chauffeur # Import nécessaire
from django.utils import timezone
import datetime
from decimal import Decimal

class VehiculeAPITest(APITestCase):
    def setUp(self):
        self.vehicule_data = {
        "immatriculation": "API_VEH001",
        "marque": "Toyota",
        "modele": "Corolla",
        "type": "Berline",
        "kilometrage": 10000
        }
        self.vehicule = Vehicule.objects.create(**self.vehicule_data)
        self.list_url = reverse("vehicule-list")
        self.detail_url = reverse("vehicule-detail", kwargs={"pk":
        self.vehicule.id})
        self.user = User.objects.create_user(username="testadmin",
        email="testadmin@example.com", password="testpass", is_staff=True,
        is_superuser=True)
        self.client.force_authenticate(user=self.user)
    def test_list_vehicules(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    def test_create_vehicule(self):
        new_vehicule_data = {
        "immatriculation": "API_VEH002",
        "marque": "Honda",
        "modele": "Civic",
        "type": "Berline",
        "kilometrage": 5000
        }
        response = self.client.post(self.list_url, new_vehicule_data,
        format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicule.objects.count(), 2)
class DeplacementAPITest(APITestCase):
    def setUp(self):
        self.deplacement_data = {
        "destination": "Fes",
        "dateDepart": timezone.now().isoformat()
        }
        self.deplacement = Deplacement.objects.create(**self.deplacement_data)
        self.list_url = reverse("deplacement-list")
        self.detail_url = reverse("deplacement-detail", kwargs={"pk":
        self.deplacement.id})
        self.user = User.objects.create_user(username="testadmin2",
        email="testadmin2@example.com", password="testpass", is_staff=True,is_superuser=True)
        self.client.force_authenticate(user=self.user)
    def test_assign_vehicle_to_deplacement(self):
        vehicule = Vehicule.objects.create(immatriculation="ASS_VEH001")
        assign_url = reverse("deplacement-assign-vehicle", kwargs={"pk":self.deplacement.id})
        response = self.client.post(assign_url, {"vehicule_id": vehicule.id,"carburant": 30.0, "kilometres_parcourus": 100}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UtilisationVehicule.objects.count(), 1)
        self.assertEqual(UtilisationVehicule.objects.first().vehicule,vehicule)
    def test_assign_chauffeur_to_deplacement(self):
        entite = Entite.objects.create(nom="Entite Chauffeur", type="Direction Générale")
        agent = Agent.objects.create(matricule="CH001", nom="Chauffeur",
        prenom="Test", entite=entite, motdepasse="pass")
        chauffeur = Chauffeur.objects.create(agent=agent, numero_permis="P001",
        date_obtention_permis="2020-01-01")
        assign_url = reverse("deplacement-assign-chauffeur", kwargs={"pk":
        self.deplacement.id})
        response = self.client.post(assign_url, {"chauffeur_id":
        chauffeur.agent.id, "heures_conduite": 8.0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.deplacement.deplacementchauffeur_set.count(), 1)
        self.assertEqual(self.deplacement.deplacementchauffeur_set.first().chauffeur,chauffeur)
class CoutVehiculeAPITest(APITestCase):
    def setUp(self):
        self.vehicule = Vehicule.objects.create(immatriculation="COST_VEH001")
        self.type_cout = TypeCout.objects.create(nom="Réparation")
        self.entite = Entite.objects.create(nom="Entite Cout", type="Direction Générale")
        self.agent = Agent.objects.create(matricule="AG_COST", nom="Cost",
        prenom="Agent", entite=self.entite, motdepasse="pass")
        CoutVehicule.objects.create(
        vehicule=self.vehicule,
        type_cout=self.type_cout,
        montant=Decimal("100.00"),
        date_cout="2024-01-15",
        annee=2024,
        saisi_par=self.agent
        )
        CoutVehicule.objects.create(
        vehicule=self.vehicule,
        type_cout=self.type_cout,
        montant=Decimal("200.00"),
        date_cout="2024-02-20",
        annee=2024,
        saisi_par=self.agent
        )
        CoutVehicule.objects.create(
        vehicule=self.vehicule,
        type_cout=self.type_cout,
        montant=Decimal("50.00"),
        date_cout="2023-11-10",
        annee=2023,
        saisi_par=self.agent
        )
        self.user = User.objects.create_user(username="costadmin",
        email="costadmin@example.com", password="testpass", is_staff=True,
        is_superuser=True)
        self.client.force_authenticate(user=self.user)
    def test_rapports_couts_by_year(self):
        rapport_url = reverse("coutvehicule-rapports-couts")
        response = self.client.get(rapport_url + "?annee=2024")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["total_montant"], Decimal("300.00")) 
        self.assertEqual(response.data[0]["annee"], 2024)
    def test_rapports_couts_by_vehicule_and_type(self):
        rapport_url = reverse("coutvehicule-rapports-couts")
        response = self.client.get(rapport_url + f"?vehicule_id={self.vehicule.id}&type_cout_id={self.type_cout.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) # 2023 et 2024
        # Vérifier les totaux pour chaque année
        response_data_list = [
            {
                "type_cout__nom": item["type_cout__nom"],
                "vehicule__immatriculation": item["vehicule__immatriculation"],
                "annee": item["annee"],
                "total_montant": Decimal(str(item["total_montant"])) # Convertir en Decimal
            }
            for item in response.data
        ]
        self.assertIn({"type_cout__nom": "Réparation", "vehicule__immatriculation": "COST_VEH001", "annee": 2023, "total_montant": Decimal("50.00")}, response_data_list)
        self.assertIn({"type_cout__nom": "Réparation", "vehicule__immatriculation": "COST_VEH001", "annee": 2024, "total_montant": Decimal("300.00")}, response_data_list)
       