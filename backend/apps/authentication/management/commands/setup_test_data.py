from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal

from authentication.models import Agent, User
from core.models import (
    Entite, Responsable, ChefParc, Chauffeur,
    Vehicule, TypeVehicule, Marque
)

User = get_user_model()


class Command(BaseCommand):
    help = 'Crée des données de test pour le système d\'authentification'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Supprime toutes les données existantes avant de créer les nouvelles',
        )
    
    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Suppression des données existantes...')
            User.objects.all().delete()
            Agent.objects.all().delete()
            Entite.objects.all().delete()
            
        # Créer le superutilisateur
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@parcvehicule.com',
                password='admin123'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Superutilisateur créé: {admin_user.username}')
            )
        
        # Créer des entités
        entite_direction = Entite.objects.get_or_create(
            nom='Direction Générale',
            defaults={
                'type': 'Direction',
                'adresse': '123 Rue Principale',
                'telephone': '+212 5 22 11 22 33'
            }
        )[0]
        
        entite_parc_central = Entite.objects.get_or_create(
            nom='Parc Central',
            defaults={
                'type': 'Parc',
                'adresse': '456 Avenue du Parc',
                'telephone': '+212 5 22 44 55 66'
            }
        )[0]
        
        entite_parc_nord = Entite.objects.get_or_create(
            nom='Parc Nord',
            defaults={
                'type': 'Parc',
                'adresse': '789 Boulevard Nord',
                'telephone': '+212 5 22 77 88 99'
            }
        )[0]
        
        # Créer des agents et utilisateurs
        
        # 1. Responsable
        if not User.objects.filter(username='responsable1').exists():
            user_resp = User.objects.create_user(
                username='responsable1',
                email='responsable@parcvehicule.com',
                password='resp123'
            )
            
            agent_resp = Agent.objects.create(
                user=user_resp,
                matricule='RESP001',
                nom='Alami',
                prenom='Ahmed',
                email='responsable@parcvehicule.com',
                role='Responsable',
                entite=entite_direction
            )
            
            Responsable.objects.create(
                agent=agent_resp,
                niveau_responsabilite='Directeur'
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Responsable créé: {agent_resp.nom} {agent_resp.prenom}')
            )
        
        # 2. Chef de parc 1
        if not User.objects.filter(username='chefparc1').exists():
            user_chef1 = User.objects.create_user(
                username='chefparc1',
                email='chef.central@parcvehicule.com',
                password='chef123'
            )
            
            agent_chef1 = Agent.objects.create(
                user=user_chef1,
                matricule='CHEF001',
                nom='Benali',
                prenom='Fatima',
                email='chef.central@parcvehicule.com',
                role='Chef de parc',
                entite=entite_parc_central
            )
            
            ChefParc.objects.create(
                agent=agent_chef1,
                niveau_autorite='Chef Principal'
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Chef de parc créé: {agent_chef1.nom} {agent_chef1.prenom}')
            )
        
        # 3. Chef de parc 2
        if not User.objects.filter(username='chefparc2').exists():
            user_chef2 = User.objects.create_user(
                username='chefparc2',
                email='chef.nord@parcvehicule.com',
                password='chef123'
            )
            
            agent_chef2 = Agent.objects.create(
                user=user_chef2,
                matricule='CHEF002',
                nom='Tazi',
                prenom='Omar',
                email='chef.nord@parcvehicule.com',
                role='Chef de parc',
                entite=entite_parc_nord
            )
            
            ChefParc.objects.create(
                agent=agent_chef2,
                niveau_autorite='Chef Adjoint'
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Chef de parc créé: {agent_chef2.nom} {agent_chef2.prenom}')
            )
        
        # 4. Chauffeurs avec profils multiples
        chauffeurs_data = [
            {
                'username': 'chauffeur1',
                'email': 'chauffeur1@parcvehicule.com',
                'matricule': 'CHAUF001',
                'nom': 'Idrissi',
                'prenom': 'Youssef',
                'entite': entite_parc_central,
                'numero_permis': 'A123456',
                'type_permis': 'B'
            },
            {
                'username': 'chauffeur2',
                'email': 'chauffeur2@parcvehicule.com',
                'matricule': 'CHAUF002',
                'nom': 'Amrani',
                'prenom': 'Aicha',
                'entite': entite_parc_central,
                'numero_permis': 'B789012',
                'type_permis': 'B'
            },
            {
                'username': 'chauffeur3',
                'email': 'chauffeur3@parcvehicule.com',
                'matricule': 'CHAUF003',
                'nom': 'Berrada',
                'prenom': 'Hassan',
                'entite': entite_parc_nord,
                'numero_permis': 'C345678',
                'type_permis': 'C'
            }
        ]
        
        for chauffeur_data in chauffeurs_data:
            if not User.objects.filter(username=chauffeur_data['username']).exists():
                user_chauffeur = User.objects.create_user(
                    username=chauffeur_data['username'],
                    email=chauffeur_data['email'],
                    password='chauf123'
                )
                
                agent_chauffeur = Agent.objects.create(
                    user=user_chauffeur,
                    matricule=chauffeur_data['matricule'],
                    nom=chauffeur_data['nom'],
                    prenom=chauffeur_data['prenom'],
                    email=chauffeur_data['email'],
                    role='Chauffeur',
                    entite=chauffeur_data['entite']
                )
                
                # Créer le premier profil chauffeur
                Chauffeur.objects.create(
                    agent=agent_chauffeur,
                    numero_permis=chauffeur_data['numero_permis'],
                    date_obtention_permis=date.today() - timedelta(days=365*3),  # Il y a 3 ans
                    type_permis=chauffeur_data['type_permis'],
                    date_expiration_permis=date.today() + timedelta(days=365*2)  # Dans 2 ans
                )
                
                # Créer un deuxième profil chauffeur pour tester les profils multiples
                if chauffeur_data['username'] == 'chauffeur1':
                    Chauffeur.objects.create(
                        agent=agent_chauffeur,
                        numero_permis='A123457',  # Permis différent
                        date_obtention_permis=date.today() - timedelta(days=365*2),  # Il y a 2 ans
                        type_permis='C',  # Type différent
                        date_expiration_permis=date.today() + timedelta(days=365*3)  # Dans 3 ans
                    )
                
                self.stdout.write(
                    self.style.SUCCESS(f'Chauffeur créé: {agent_chauffeur.nom} {agent_chauffeur.prenom}')
                )
        
        # 5. Agent avec profils multiples (Responsable ET Chef de parc)
        if not User.objects.filter(username='agent_multi').exists():
            user_multi = User.objects.create_user(
                username='agent_multi',
                email='multi@parcvehicule.com',
                password='multi123'
            )
            
            agent_multi = Agent.objects.create(
                user=user_multi,
                matricule='MULTI001',
                nom='Dupont',
                prenom='Marie',
                email='multi@parcvehicule.com',
                role='Responsable',
                entite=entite_direction
            )
            
            # Créer profil Responsable
            Responsable.objects.create(
                agent=agent_multi,
                niveau_responsabilite='Regional'
            )
            
            # Créer profil Chef de parc pour le même agent
            ChefParc.objects.create(
                agent=agent_multi,
                niveau_autorite='Multi-sites'
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Agent multi-profils créé: {agent_multi.nom} {agent_multi.prenom}')
            )
        
        # 6. Agent simple (sans profil spécifique)
        if not User.objects.filter(username='agent1').exists():
            user_agent = User.objects.create_user(
                username='agent1',
                email='agent@parcvehicule.com',
                password='agent123'
            )
            
            agent_simple = Agent.objects.create(
                user=user_agent,
                matricule='AGENT001',
                nom='Mansouri',
                prenom='Laila',
                email='agent@parcvehicule.com',
                role='Agent',
                entite=entite_direction
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Agent simple créé: {agent_simple.nom} {agent_simple.prenom}')
            )
        
        self.stdout.write(
            self.style.SUCCESS('\n=== DONNÉES DE TEST CRÉÉES AVEC SUCCÈS ===')
        )
        self.stdout.write('\nComptes créés:')
        self.stdout.write('- Superutilisateur: admin / admin123')
        self.stdout.write('- Responsable: responsable1 / resp123')
        self.stdout.write('- Chef de parc 1: chefparc1 / chef123')
        self.stdout.write('- Chef de parc 2: chefparc2 / chef123')
        self.stdout.write('- Chauffeur 1: chauffeur1 / chauf123 (avec profils multiples)')
        self.stdout.write('- Chauffeur 2: chauffeur2 / chauf123')
        self.stdout.write('- Chauffeur 3: chauffeur3 / chauf123')
        self.stdout.write('- Agent multi-profils: agent_multi / multi123 (Responsable + Chef de parc)')
        self.stdout.write('- Agent simple: agent1 / agent123')
        self.stdout.write('\nUtilisez ces comptes pour tester le système d\'authentification et les profils multiples.')