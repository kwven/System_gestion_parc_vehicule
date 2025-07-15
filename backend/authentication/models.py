from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, EmailValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid

# Modèle Agent (classe mère pour les employés)

class Agent(models.Model):
    id = models.AutoField(primary_key=True) # SERIAL PRIMARY KEY -> AutoField
    matricule = models.CharField(max_length=50,unique=True,null=False,blank=False,verbose_name="Matricule",
    validators=[
    RegexValidator(r'^[A-Za-z0-9]+$', 'Le matricule doit contenir uniquement des lettres et des chiffres.'),
    RegexValidator(r'^\S+$', 'Le matricule ne doit pas contenirnd\'espaces.'),])
    nom = models.CharField(max_length=100, null=False, blank=False,verbose_name="Nom")
    prenom = models.CharField(max_length=100, null=False, blank=False,verbose_name="Prénom")
    email = models.EmailField(max_length=100,unique=True,null=True,blank=True,verbose_name="Email",validators=[EmailValidator()])
    date_affectation = models.DateField(null=False,default=timezone.now,verbose_name="Date d'affectation")
    motdepasse = models.CharField(max_length=100, null=False, blank=False,verbose_name="Mot de passe") # À hasher en production
    role = models.CharField(max_length=50, null=True, blank=True,verbose_name="Rôle fonctionnel") # VARCHAR(50)
    entite = models.ForeignKey('core.Entite',on_delete=models.RESTRICT,null=False,blank=False,related_name='agents',verbose_name="Entité d'affectation")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création") 
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de dernière modification")
    est_actif = models.BooleanField(default=True, verbose_name="Est actif") #BOOLEAN DEFAULT TRUE
    class Meta:
        db_table = 'authentication_agent'
        verbose_name = 'Agent'
        verbose_name_plural = 'Agents'
        ordering = ['nom', 'prenom']
    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.matricule})"
    def clean(self):
        super().clean()
        if self.date_affectation and self.date_affectation > timezone.now().date():
            raise ValidationError({'date_affectation': "La date d'affectation ne peut pas être dans le futur."})
    # Pour gérer la mise à jour automatique de date_modification comme le
    # trigger SQL
    def save(self, *args, **kwargs):
        self.date_modification = timezone.now()
        super().save(*args, **kwargs)

# Modèle User personnalisé (pour l'authentification Django)
# Hérite de AbstractUser pour les fonctionnalités d'authentification de Django
class User(AbstractUser):
    # Utilisation de l'AutoField par défaut de Django pour la PK, ou UUIDField si préféré
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Lien OneToOne avec le modèle Agent pour les informations métier
    # Un Agent peut être associé à un compte utilisateur pour la connexion
    agent = models.OneToOneField(Agent,
    on_delete=models.CASCADE, # Si l'agent est supprimé, le compte utilisateur l'est aussi
    null=True,
    blank=True,
    related_name='user_account',
    verbose_name="Compte Agent associé"
    )
    # Le champ 'email' est déjà présent dans AbstractUser, mais nous le rendons unique
    email = models.EmailField(unique=True, verbose_name="Adresse email de connexion")
    class Meta:
        db_table = 'authentication_user'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    def __str__(self):
        return self.email