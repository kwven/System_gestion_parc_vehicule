from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from authentication.serializers import AgentSerializer, UserSerializer
from authentication.models import Agent, User
from core.models import Entite # Nécessaire pour Agent

class AgentSerializerTest(APITestCase):
    def setUp(self):
        self.entite = Entite.objects.create(nom="Direction Générale",
        type="Direction Générale")
        self.agent_data = {
        "matricule": "S001",
        "nom": "Smith",
        "prenom": "Alice",
        "email": "alice.smith@example.com",
        "entite": self.entite.id,
        "motdepasse": "securepass"
        }
        agent_create_data = self.agent_data.copy()
        agent_create_data["entite"] = self.entite 
        self.agent = Agent.objects.create(**agent_create_data)
        self.serializer = AgentSerializer(instance=self.agent)
    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
        data.keys(),
        ["id", "matricule", "nom", "prenom", "email", "date_affectation", "role", "entite", "date_creation", "date_modification", "est_actif","entite_nom", "entite_type"])
    def test_agent_serializer_data(self):
        data = self.serializer.data
        self.assertEqual(data["matricule"], "S001")
        self.assertEqual(data["nom"], "Smith")
        self.assertEqual(data["entite"], self.entite.id)
    def test_agent_serializer_create(self):
        new_agent_data = {
        "matricule": "S002",
        "nom": "Brown",
        "prenom": "Bob",
        "email": "bob.brown@example.com",
        "entite": self.entite.id,
        "motdepasse": "anotherpass"
        }
        serializer = AgentSerializer(data=new_agent_data)
        serializer.is_valid()
        print(serializer.errors)
        self.assertTrue(serializer.is_valid())
        agent = serializer.save()
        self.assertEqual(agent.matricule, "S002")
        self.assertEqual(Agent.objects.count(), 2)
    def test_agent_serializer_validation_error(self):
        invalid_data = self.agent_data.copy()
        invalid_data["matricule"] = "" # Matricule vide
        serializer = AgentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("matricule", serializer.errors)

class UserSerializerTest(APITestCase):
    def setUp(self):
        # Création d'une entité
        self.entite = Entite.objects.create(nom="Test Entite", type="Cabinet")
        # Création d’un agent initial pour l’utilisateur principal
        self.agent = Agent.objects.create(
            matricule="AG001",
            nom="Test",
            prenom="Agent",
            entite=self.entite,
            motdepasse="password"
        )
        # Données utilisateur initial
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass",
            "agent": self.agent
        }

        # Création d’un utilisateur lié à l’agent
        self.user = User.objects.create_user(**self.user_data)
        self.serializer = UserSerializer(instance=self.user)

    def test_user_serializer_data(self):
        data = self.serializer.data
        self.assertEqual(data["username"], "testuser")
        self.assertEqual(data["email"], "test@example.com")
        self.assertEqual(data["agent"], self.agent.id)

    def test_user_serializer_create(self):
        # Création d’un second agent pour éviter conflit OneToOne
        second_agent = Agent.objects.create(
            matricule="AG002",
            nom="Second",
            prenom="Agent",
            entite=self.entite,
            motdepasse="anotherpass"
        )
        new_user_data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass",
            "agent": second_agent.id
        }
        serializer = UserSerializer(data=new_user_data)
        is_valid = serializer.is_valid()
        print(serializer.errors)  # Pour debug si nécessaire
        self.assertTrue(is_valid)

        user = serializer.save()
        self.assertEqual(user.username, "newuser")
        self.assertEqual(User.objects.count(), 2)