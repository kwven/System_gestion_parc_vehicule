from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from apps.authentication.models import Agent, User
from apps.core.models import Entite 
from datetime import date, timedelta

class AgentAPITest(APITestCase):
    def setUp(self):
        self.entite = Entite.objects.create(nom="Direction Test",type="Direction Générale")
        self.agent_data = {
        "matricule": "API001",
        "nom": "Test",
        "prenom": "Agent",
        "email": "api.test@example.com",
        "entite": self.entite,
        "motdepasse": "testpass",
        }
        self.agent = Agent.objects.create(**self.agent_data)
        self.list_url = reverse("agent-list")
        self.detail_url = reverse("agent-detail", kwargs={"pk": self.agent.id})
        # Créer un utilisateur pour l'authentification des tests
        self.user = User.objects.create_user(username="adminuser",
        email="admin@example.com", password="adminpass")
        self.client.force_authenticate(user=self.user) 
    def test_list_agents(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["matricule"], self.agent.matricule)
    def test_create_agent(self):
        new_agent_data = {
        "matricule": "API002",
        "nom": "New",
        "prenom": "Agent",
        "email": "new.agent@example.com",
        "entite": self.entite.id,
        "motdepasse": "newpass",
        "date_affectation":date.today() - timedelta(days=1),
        }
        response = self.client.post(self.list_url, new_agent_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Agent.objects.count(), 2)
        created_agent = Agent.objects.get(matricule="API002")
        self.assertEqual(created_agent.nom, "New")  
    def test_retrieve_agent(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["matricule"], self.agent.matricule)
    def test_update_agent(self):
        updated_data = {
            "matricule": self.agent.matricule,
            "nom": "Updated Doe",
            "prenom": self.agent.prenom,
            "email": self.agent.email,
            "entite": self.entite.id,
            "motdepasse": self.agent.motdepasse}
        updated_data["nom"] = "Updated Doe"
        response = self.client.put(self.detail_url, updated_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.agent.refresh_from_db()
        self.assertEqual(self.agent.nom, "Updated Doe")
    def test_delete_agent(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Agent.objects.count(), 0)
class UserAPITest(APITestCase):
    def setUp(self):
        self.entite = Entite.objects.create(nom="Test Entite", type="Cabinet")
        self.agent = Agent.objects.create(
        matricule="AG001",
        nom="Test",
        prenom="Agent",
        entite=self.entite,
        motdepasse="password",
        date_affectation=date.today() - timedelta(days=1),
        )
        self.user = User.objects.create_user(username="testuser",
        email="test@example.com", password="testpass", agent=self.agent)
        self.list_url = reverse("user-list")
        self.detail_url = reverse("user-detail", kwargs={"pk": self.user.id})
        # Authentification pour les tests
        self.admin_user = User.objects.create_user(username="admin",
        email="admin@admin.com", password="adminpass", is_staff=True,is_superuser=True)
        self.client.force_authenticate(user=self.admin_user)
    def test_list_users(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    def test_create_user(self):
        users_before = User.objects.count()
        new_agent = Agent.objects.create(
        matricule="API003",
        nom="Testuser",
        prenom="Agent",
        email="api.test@example.com",
        entite=self.entite,
        motdepasse="testpass",)
        new_user_data = {
        "username": "newuser",
        "email": "new@example.com",
        "password": "newpass123",
        "agent": new_agent.id
        }
        response = self.client.post(self.list_url, new_user_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), users_before + 1)
    def test_jwt_token_obtain(self):
        # Test de l'obtention de token JWT
        response = self.client.post('/api/auth/token/', {"username": "testuser",
        "password": "testpass"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
    def test_jwt_token_refresh(self):
        # Obtenir un token d'abord
        obtain_response = self.client.post('/api/auth/token/', {"username": "testuser", "password": "testpass"}, format='json')
        refresh_token = obtain_response.data["refresh"]
        # Rafraîchir le token
        refresh_response = self.client.post('/api/auth/token/refresh/', {"refresh":refresh_token}, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)