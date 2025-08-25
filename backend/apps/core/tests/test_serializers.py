from rest_framework.test import APITestCase
from django.urls import reverse
from core.serializers import VehiculeSerializer, DeplacementSerializer,CoutVehiculeSerializer
from core.models import Vehicule, TypeCout, CoutVehicule
from authentication.models import Agent
from core.models import Entite # Nécessaire pour Agent
from django.utils import timezone
import datetime

class VehiculeSerializerTest(APITestCase):
    def setUp(self):
        self.vehicule_data = {
        "immatriculation": "XYZ789",
        "marque": "BMW",
        "modele": "X5",
        "type": "SUV",
        "kilometrage": 50000,
        "dateAcquisition": timezone.now().date()
        }
        self.vehicule = Vehicule.objects.create(**self.vehicule_data)
        self.serializer = VehiculeSerializer(instance=self.vehicule)
    def test_vehicule_serializer_data(self):
        data = self.serializer.data
        self.assertEqual(data["immatriculation"], "XYZ789")
        self.assertEqual(data["kilometrage"], 50000)
    def test_vehicule_serializer_create(self):
        new_vehicule_data = {
        "immatriculation": "ABC123DE",
        "marque": "Audi",
        "modele": "A4",
        "type": "Berline",
        "kilometrage": 10000,
        "dateAcquisition": timezone.now().date().isoformat()
        }
        serializer = VehiculeSerializer(data=new_vehicule_data)
        self.assertTrue(serializer.is_valid())
        vehicule = serializer.save()
        self.assertEqual(vehicule.immatriculation, "ABC123DE")
        self.assertEqual(Vehicule.objects.count(), 2)
class DeplacementSerializerTest(APITestCase):
        def test_deplacement_serializer_create(self):
            deplacement_data = {
            "destination": "Marrakech",
            "dateDepart": timezone.now().isoformat()
            }
            serializer = DeplacementSerializer(data=deplacement_data)
            self.assertTrue(serializer.is_valid())
            deplacement = serializer.save()
            self.assertEqual(deplacement.destination, "Marrakech")
class CoutVehiculeSerializerTest(APITestCase):
    def setUp(self):
        self.vehicule = Vehicule.objects.create(immatriculation="TEST001")
        self.type_cout = TypeCout.objects.create(nom="Maintenance")
        self.entite = Entite.objects.create(nom="Test Entite", type="Direction Générale")
        self.agent = Agent.objects.create(
        matricule="AG002",
        nom="Test",
        prenom="Agent2",
        entite=self.entite,
        motdepasse="password"
        )
        self.cout_data = {
        "vehicule": self.vehicule, ##.id
        "type_cout": self.type_cout, ##id,
        "montant": 250.00,
        "date_cout": timezone.now().date().isoformat(),
        "annee": timezone.now().year,
        "saisi_par": self.agent ##id
        }
        self.cout = CoutVehicule.objects.create(**self.cout_data)
        self.serializer = CoutVehiculeSerializer(instance=self.cout)
    def test_cout_vehicule_serializer_data(self):
        data = self.serializer.data
        self.assertEqual(data["montant"], "250.00")
        self.assertEqual(data["vehicule"], self.vehicule.id)
        self.assertEqual(data["type_cout"], self.type_cout.id)
    def test_cout_vehicule_serializer_create(self):
        new_cout_data = {
        "vehicule": self.vehicule.id,
        "type_cout": self.type_cout.id,
        "montant": 120.50,
        "date_cout": (timezone.now().date() -
        datetime.timedelta(days=1)).isoformat(),
        "annee": timezone.now().year,
        "saisi_par": self.agent.id
        }
        serializer = CoutVehiculeSerializer(data=new_cout_data)
        self.assertTrue(serializer.is_valid())
        cout = serializer.save()
        self.assertEqual(cout.montant, 120.50)
        self.assertEqual(CoutVehicule.objects.count(), 2)