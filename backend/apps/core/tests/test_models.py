from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
import datetime
from core.models import Region, Province,Entite,Vehicule,TypeCout, CoutVehicule, Deplacement
from authentication.models import Agent # Import nécessaire 

class RegionModelTest(TestCase):
    def test_region_creation(self):
        region = Region.objects.create(nom="Région Test")
        self.assertEqual(region.nom, "Région Test")
    def test_region_nom_unique(self):
        Region.objects.create(nom="Unique Region")
        with self.assertRaises(Exception): # IntegrityError
            Region.objects.create(nom="Unique Region")
class ProvinceModelTest(TestCase):
    def setUp(self):
        self.region = Region.objects.create(nom="Région Test")
    def test_province_creation(self):
        province = Province.objects.create(nom="Province Test",
        region=self.region)
        self.assertEqual(province.nom, "Province Test")
        self.assertEqual(province.region, self.region)
    def test_province_unique_together(self):
        Province.objects.create(nom="Dup Province", region=self.region)
        with self.assertRaises(Exception): # IntegrityError
            Province.objects.create(nom="Dup Province", region=self.region)
class VehiculeModelTest(TestCase):
    def test_vehicule_creation(self):
        vehicule = Vehicule.objects.create(
        immatriculation="AB123CD",
        marque="Renault",
        modele="Clio",
        type="Berline",
        kilometrage=10000)
        self.assertEqual(vehicule.immatriculation, "AB123CD")
        self.assertEqual(vehicule.kilometrage, 10000)
        self.assertTrue(vehicule.isDisponible)
    def test_vehicule_date_acquisition_future_validation(self):
        future_date = timezone.now().date() + datetime.timedelta(days=1)
        vehicule = Vehicule(
        immatriculation="XY456ZW",
        marque="Peugeot",
        modele="308",
        dateAcquisition=future_date
        )
        with self.assertRaises(ValidationError) as cm:
            vehicule.full_clean()
        self.assertIn("La date d'acquisition ne peut pas être dans le futur.",str(cm.exception))
    def test_vehicule_save_updates_modification_date(self):
        vehicule = Vehicule.objects.create(
        immatriculation="EF789GH",
        marque="Ford",
        modele="Focus"
        )
        old_date_modification = vehicule.date_modification
        import time
        time.sleep(1)
        vehicule.kilometrage = 15000
        vehicule.save()
        self.assertGreater(vehicule.date_modification, old_date_modification)
class DeplacementModelTest(TestCase):
    def test_deplacement_creation(self):
        deplacement = Deplacement.objects.create(
        destination="Casablanca",
        dateDepart=timezone.now()
        )
        self.assertEqual(deplacement.destination, "Casablanca")
        self.assertEqual(deplacement.statut, "Planifié")
    def test_deplacement_date_arrivee_before_depart_validation(self):
        depart = timezone.now()
        arrivee = depart - datetime.timedelta(hours=1)
        deplacement = Deplacement(
        destination="Rabat",
        dateDepart=depart,
        dateArrivee=arrivee
        )
        with self.assertRaises(ValidationError) as cm:
            deplacement.full_clean()
        self.assertIn("La date d'arrivée ne peut pas être antérieure à la date de départ.", str(cm.exception))
class CoutVehiculeModelTest(TestCase):
    def setUp(self):
        self.vehicule = Vehicule.objects.create(immatriculation="V001")
        self.type_cout = TypeCout.objects.create(nom="Carburant")
        self.entite = Entite.objects.create(nom="Entite Test", type="Direction Générale")
        self.agent = Agent.objects.create(
        matricule="A001",
        nom="Agent",
        prenom="Test",
        entite=self.entite,
        motdepasse="testpass")
    def test_cout_vehicule_creation(self):
        cout = CoutVehicule.objects.create(
        vehicule=self.vehicule,
        type_cout=self.type_cout,
        montant=150.75,
        date_cout=timezone.now().date(),
        annee=timezone.now().year,
        saisi_par=self.agent)
        self.assertEqual(cout.montant, 150.75)
        self.assertEqual(cout.vehicule, self.vehicule)
    def test_cout_vehicule_montant_negative_validation(self):
        cout = CoutVehicule(
        vehicule=self.vehicule,
        type_cout=self.type_cout,
        montant=-10.00,
        date_cout=timezone.now().date(),
        annee=timezone.now().year)
        with self.assertRaises(ValidationError) as cm:
            cout.full_clean()
        self.assertIn("Assurez-vous que cette valeur est supérieure ou égale à", str(cm.exception))