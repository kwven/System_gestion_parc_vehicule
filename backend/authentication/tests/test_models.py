from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from authentication.models import Agent, User
from core.models import Entite 
import datetime
import time

class AgentModelTest(TestCase):
    def setUp(self):
    # Créer une entité pour les tests d'agent
        self.entite = Entite.objects.create(nom="Direction Générale",type="Direction Générale")
    def test_agent_creation(self):
        agent = Agent.objects.create(
        matricule="M001",
        nom="Doe",
        prenom="John",
        email="john.doe@example.com",
        entite=self.entite,
        motdepasse="password123")
        self.assertEqual(agent.matricule, "M001")
        self.assertEqual(agent.nom, "Doe")
        self.assertEqual(agent.prenom, "John")
        self.assertEqual(agent.email, "john.doe@example.com")
        self.assertEqual(agent.entite, self.entite)
        self.assertTrue(agent.est_actif)
    def test_agent_date_affectation_future_validation(self):
        # Teste la validation de la date d'affectation (ne doit pas être dans le futur)
        future_date = timezone.now().date() + datetime.timedelta(days=1)
        agent = Agent(
        matricule="M002",
        nom="Smith",
        prenom="Jane",
        email="jane.smith@example.com",
        entite=self.entite,
        motdepasse="password123",
        date_affectation=future_date
        )
        with self.assertRaises(ValidationError) as cm:
            agent.full_clean() # full_clean() appelle clean() et les validateurs de champ
        self.assertIn("La date d'affectation ne peut pas être dans le futur.",str(cm.exception))
    def test_agent_save_updates_modification_date(self):
        agent = Agent.objects.create(
        matricule="M003",
        nom="Brown",
        prenom="Charlie",
        entite=self.entite,
        motdepasse="password123")
        old_date_modification = agent.date_modification
        # Attendre un peu pour s'assurer que la date de modification change
        time.sleep(1)
        agent.nom = "Brown Updated"
        agent.save()
        self.assertGreater(agent.date_modification, old_date_modification)
class UserModelTest(TestCase):
    def setUp(self):
        self.entite = Entite.objects.create(nom="Direction Test",type="Direction Générale")
        self.agent = Agent.objects.create(
        matricule="A001",
        nom="Agent",
        prenom="Test",
        entite=self.entite,
        motdepasse="testpass"
        )
    def test_user_creation(self):
        user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass",
        agent=self.agent
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("testpass"))
        self.assertEqual(user.agent, self.agent)
    def test_user_email_unique(self):
        User.objects.create_user(
        username="user1",
        email="unique@example.com",
        password="pass1",
        agent=self.agent
        )
        with self.assertRaises(Exception): # IntegrityError ou ValidationError
            User.objects.create_user(
            username="user2",
            email="unique@example.com",
            password="pass2",
            agent=self.agent
            )