from django.db import models
from django.core.validators import RegexValidator, MinValueValidator,MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid
from authentication.models import Agent 

# --- 1. Hiérarchie géographique ---
# Correspond à la table Region
def validate_non_empty_trimmed(value):
    if not value.strip():
        raise ValidationError("Le nom ne doit pas être vide ou contenir uniquement des espaces.")
class Region(models.Model):
    id = models.AutoField(primary_key=True) # SERIAL PRIMARY KEY -> AutoField
    nom = models.CharField(max_length=100,unique=True,null=False,blank=False,verbose_name="Nom de la région",validators=[validate_non_empty_trimmed])
    class Meta:
        db_table = 'core_region'
        ordering = ['nom']
        verbose_name = 'Région'
        verbose_name_plural = 'Régions'
    def __str__(self):
        return self.nom

# Correspond à la table Province
class Province(models.Model):
    id = models.AutoField(primary_key=True) 
    nom = models.CharField(max_length=100,null=False,blank=False,verbose_name="Nom de la province",validators=[validate_non_empty_trimmed])
    region = models.ForeignKey(Region,on_delete=models.RESTRICT,null=False,blank=False,related_name='provinces',verbose_name="Région parente")
    class Meta:
        db_table = 'core_province'
        ordering = ['nom']
        verbose_name = 'Province'
        verbose_name_plural = 'Provinces'
        unique_together = ('nom', 'region') # CONSTRAINT uk_province_nom_region UNIQUE(nom, region_id)
    def __str__(self):
        return f"{self.nom} ({self.region.nom})"
    
# Correspond à la table Localite
class Localite(models.Model):
    id = models.AutoField(primary_key=True) # SERIAL PRIMARY KEY -> AutoField
    nom = models.CharField(max_length=100,null=False,blank=False,verbose_name="Nom de la localité",validators=[validate_non_empty_trimmed])
    province = models.ForeignKey(Province,on_delete=models.RESTRICT,null=False,blank=False,related_name='localites',verbose_name="Province parente")
    class Meta:
        db_table = 'core_localite'
        ordering = ['nom']
        verbose_name = 'Localité'
        verbose_name_plural = 'Localités'
        unique_together = ('nom', 'province') # CONSTRAINT uk_localite_nom_province UNIQUE (nom, province_id)
    def __str__(self):
        return f"{self.nom} ({self.province.nom})"

# --- 2. Organisation administrative ---

# Correspond à la table Entite
class Entite(models.Model):
    TYPE_CHOICES = [
    ('Cabinet', 'Cabinet'),
    ('Secrétariat Général', 'Secrétariat Général'),
    ('Direction Générale', 'Direction Générale'),
    ('Direction Centrale', 'Direction Centrale'),
    ('Direction Régionale', 'Direction Régionale'),
    ('Direction Provinciale', 'Direction Provinciale'),
    ]
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100,unique=True,null=False,blank=False,verbose_name="Nom de l'entité",validators=[validate_non_empty_trimmed])
    type = models.CharField(max_length=50,choices=TYPE_CHOICES,null=False,blank=False,verbose_name="Type d'entité")
    class Meta:
        db_table = 'core_entite'
        ordering = ['type', 'nom']
        verbose_name = 'Entité'
        verbose_name_plural = 'Entités'
    def __str__(self):
        return f"{self.nom} ({self.get_type_display()})"
    
# Correspond à la table Parc
class Parc(models.Model):
    id = models.AutoField(primary_key=True) 
    localisation = models.CharField(max_length=100, null=True, blank=True,verbose_name="Localisation")
    NIVEAU_CHOICES = [
    ('Principal', 'Principal'),
    ('Secondaire', 'Secondaire'),
    ('Spécialisé', 'Spécialisé'),
    ('Temporaire', 'Temporaire'),
    ]
    niveau = models.CharField(max_length=50,choices=NIVEAU_CHOICES,null=True,blank=True,verbose_name="Niveau du parc")
    localite = models.ForeignKey(Localite,on_delete=models.RESTRICT,null=False,blank=False,related_name='parcs',verbose_name="Localité d'implantation")
    date_creation = models.DateField(default=timezone.now, verbose_name="Date de création") 
    est_actif = models.BooleanField(default=True, verbose_name="Est actif") 
    class Meta:
        db_table = 'core_parc'
        ordering = ['localisation']
        verbose_name = 'Parc'
        verbose_name_plural = 'Parcs'
    def __str__(self):
        return f"Parc à {self.localisation} ({self.localite.nom})"
    
# --- 3. Ressources humaines (Spécialisations d'Agent) ---
# Ces modèles ont une relation OneToOne avec Agent (héritage par proxy ou multi-table)
# Ici, nous utilisons l'héritage multi-table en Django, où chaque spécialisation a sa propre table et une FK vers la PK de Agent.

# Correspond à la table Responsable
class Responsable(models.Model):
    # id INTEGER PRIMARY KEY -> OneToOneField avec Agent(id)
    agent = models.OneToOneField('authentication.Agent',on_delete=models.CASCADE,primary_key=True,related_name='responsable_profile',verbose_name="Agent")
    NIVEAU_RESPONSABILITE_CHOICES = [
    ('Local', 'Local'),
    ('Provincial', 'Provincial'),
    ('Régional', 'Régional'),
    ('National', 'National'),
    ]
    niveau_responsabilite = models.CharField(max_length=50,choices=NIVEAU_RESPONSABILITE_CHOICES,null=True,blank=True,verbose_name="Niveau de responsabilité")
    date_nomination = models.DateField(default=timezone.now, verbose_name="Date de nomination")
    budget_autorise = models.DecimalField(max_digits=12,decimal_places=2,default=0.00,verbose_name="Budget autorisé",validators=[MinValueValidator(0.00)])
    class Meta:
        db_table = 'core_responsable'
        verbose_name = 'Responsable'
        verbose_name_plural = 'Responsables'
    # Contraintes CHECK (gérées par choices et MinValueValidator)
    def __str__(self):
        return f"Responsable {self.agent.nom} {self.agent.prenom}"

# Correspond à la table Chauffeur
class Chauffeur(models.Model):
    # id INTEGER PRIMARY KEY -> OneToOneField avec Agent(id)
    agent = models.OneToOneField('authentication.Agent',on_delete=models.CASCADE,primary_key=True,related_name='chauffeur_profile',verbose_name="Agent")
    numero_permis = models.CharField(max_length=50,unique=True,null=False,blank=False,verbose_name="Numéro de permis")
    date_obtention_permis = models.DateField(null=False,blank=False,verbose_name="Date d'obtention du permis")
    TYPE_PERMIS_CHOICES = [('A', 'A'), ('A1', 'A1'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E','E')]
    type_permis = models.CharField(max_length=10,choices=TYPE_PERMIS_CHOICES,null=True,blank=True,verbose_name="Type de permis",validators=[validate_non_empty_trimmed])
    date_expiration_permis = models.DateField(null=True, blank=True,verbose_name="Date d'expiration du permis")
    nombre_points = models.IntegerField(default=12,verbose_name="Nombre de points",validators=[MinValueValidator(0), MaxValueValidator(12)])
    class Meta:
        db_table = 'core_chauffeur'
        verbose_name = 'Chauffeur'
        verbose_name_plural = 'Chauffeurs'
    # Contraintes CHECK (gérées par null=False, blank=False, choices, et validateurs)
    def __str__(self):
        return f"Chauffeur {self.agent.nom} {self.agent.prenom}"
    def clean(self):
        super().clean()
        if self.date_obtention_permis and self.date_obtention_permis > timezone.now().date():
            raise ValidationError({'date_obtention_permis': "La date d'obtention du permis ne peut pas être dans le futur."})

# Correspond à la table ChefParc
class ChefParc(models.Model):
    # id INTEGER PRIMARY KEY -> OneToOneField avec Agent(id)
    agent = models.OneToOneField('authentication.Agent',on_delete=models.CASCADE,primary_key=True,related_name='chefparc_profile',verbose_name="Agent")
    date_nomination = models.DateField(default=timezone.now, verbose_name="Date de nomination") 
    NIVEAU_AUTORITE_CHOICES = [
    ('Local', 'Local'),
    ('Multi-sites', 'Multi-sites'),
    ('Régional', 'Régional'),]
    niveau_autorite = models.CharField(max_length=50,choices=NIVEAU_AUTORITE_CHOICES,null=True,blank=True,verbose_name="Niveau d'autorité")
    formation_securite = models.BooleanField(default=False,verbose_name="Formation sécurité")
    class Meta:
        db_table = 'core_chefparc'
        verbose_name = 'Chef de Parc'
        verbose_name_plural = 'Chefs de Parc'
    def __str__(self):
        return f"Chef de Parc {self.agent.nom} {self.agent.prenom}"
    def clean(self):
        super().clean()
        if self.date_nomination and self.date_nomination > timezone.now().date():
            raise ValidationError({'date_nomination': "La date de nomination ne peut pas être dans le futur."})
        
# --- 4. Gestion des véhicules ---
# Correspond à la table Vehicule
class Vehicule(models.Model):
    id = models.AutoField(primary_key=True) # SERIAL PRIMARY KEY -> AutoField
    immatriculation = models.CharField(max_length=50,unique=True,null=False,blank=False,verbose_name="Immatriculation",validators=[validate_non_empty_trimmed])
    marque = models.CharField(max_length=50, null=True, blank=True,verbose_name="Marque")
    modele = models.CharField(max_length=50, null=True, blank=True,verbose_name="Modèle")
    TYPE_CHOICES = [
    ('Berline', 'Berline'), ('Break', 'Break'), ('SUV', 'SUV'),
    ('Utilitaire', 'Utilitaire'), ('Camion', 'Camion'), ('Bus', 'Bus'),
    ('Minibus', 'Minibus'), ('Moto', 'Moto')
    ]
    type = models.CharField(max_length=50,choices=TYPE_CHOICES,null=True,blank=True,verbose_name="Type de véhicule")
    isDisponible = models.BooleanField(default=True, verbose_name="Estdisponible") 
    dateAcquisition = models.DateField(null=True, blank=True,verbose_name="Date d'acquisition")
    kilometrage = models.IntegerField(default=0,verbose_name="Kilométrage",validators=[MinValueValidator(0)])
    date_creation = models.DateField(default=timezone.now, verbose_name="Date de création") 
    date_modification = models.DateField(default=timezone.now,verbose_name="Date de dernière modification")
    est_actif = models.BooleanField(default=True, verbose_name="Est actif") 
    class Meta:
        db_table = 'core_vehicule'
        ordering = ['immatriculation']
        verbose_name = 'Véhicule'
        verbose_name_plural = 'Véhicules'
    # Contraintes CHECK (gérées par null=False, blank=False, choices, et validateurs)
    def __str__(self):
        return f"{self.marque} {self.modele} ({self.immatriculation})"
    def clean(self):
        super().clean()
        if self.dateAcquisition and self.dateAcquisition > timezone.now().date():
            raise ValidationError({'dateAcquisition': "La date d'acquisition ne peut pas être dans le futur."})
    def save(self, *args, **kwargs):
        self.date_modification = timezone.now().date()
        super().save(*args, **kwargs)

# Correspond à la table TypeCout
class TypeCout(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100,unique=True,null=False,blank=False,verbose_name="Nom du type de coût",validators=[validate_non_empty_trimmed])
    description = models.CharField(max_length=255, null=True, blank=True,verbose_name="Description")
    CATEGORIE_CHOICES = [
    ('Obligatoire', 'Obligatoire'),
    ('Préventif', 'Préventif'),
    ('Curatif', 'Curatif'),
    ('Administratif', 'Administratif'),
    ('Carburant', 'Carburant'),
    ]
    categorie = models.CharField(max_length=50,choices=CATEGORIE_CHOICES,null=True,blank=True,verbose_name="Catégorie")
    est_recurrent = models.BooleanField(default=False, verbose_name="Est récurrent") 
    date_creation = models.DateField(default=timezone.now, verbose_name="Date de création") 
    est_actif = models.BooleanField(default=True, verbose_name="Est actif")
    class Meta:
        db_table = 'core_type_cout'
        ordering = ['nom']
        verbose_name = 'Type de Coût'
        verbose_name_plural = 'Types de Coûts'
        # Contraintes CHECK (gérées par null=False, blank=False, choices)
    def __str__(self):
        return self.nom

# Correspond à la table CoutVehicule
class CoutVehicule(models.Model):
    id = models.AutoField(primary_key=True)
    vehicule = models.ForeignKey(Vehicule,on_delete=models.CASCADE,null=False,blank=False,related_name='couts',verbose_name="Véhicule concerné")
    type_cout = models.ForeignKey(TypeCout,on_delete=models.RESTRICT,null=False,blank=False,related_name='couts_associes',verbose_name="Type de coût")
    montant = models.DecimalField(max_digits=10,decimal_places=2,null=False,blank=False,verbose_name="Montant",validators=[MinValueValidator(0.00)])
    date_cout = models.DateField(null=False,blank=False,verbose_name="Date du coût")
    annee = models.IntegerField(null=False,blank=False,verbose_name="Année",validators=[MinValueValidator(1900),MaxValueValidator(timezone.now().year + 1)] )
    commentaire = models.CharField(max_length=255, null=True, blank=True,verbose_name="Commentaire")
    date_saisie = models.DateTimeField(auto_now_add=True, verbose_name="Date desaisie")
    saisi_par = models.ForeignKey('authentication.Agent',on_delete=models.SET_NULL,null=True,blank=True,related_name='couts_saisis',verbose_name="Saisi par")
    class Meta:
        db_table = 'core_cout_vehicule'
        ordering = ['-date_cout']
        verbose_name = 'Coût Véhicule'
        verbose_name_plural = 'Coûts Véhicules'
        # Contraintes CHECK (gérées par validateurs)
    def __str__(self):
        return f"Coût {self.type_cout.nom} de {self.montant} pour {self.vehicule.immatriculation}"
    def clean(self):
        super().clean()
        if self.date_cout and self.date_cout > timezone.now().date():
            raise ValidationError({'date_cout': "La date du coût ne peut pas être dans le futur."})
        
# --- 5. GESTION DES DÉPLACEMENTS ---
# Correspond à la table Deplacement
class Deplacement(models.Model):
    id = models.AutoField(primary_key=True)
    destination = models.CharField(max_length=100,null=False,blank=False,verbose_name="Destination",validators=[validate_non_empty_trimmed])
    dateDepart = models.DateTimeField(null=False, blank=False,verbose_name="Date de départ") 
    dateArrivee = models.DateTimeField(null=True, blank=True,verbose_name="Date d'arrivée") 
    isMission = models.BooleanField(default=False, verbose_name="Est une mission") 
    description = models.TextField(null=True, blank=True,verbose_name="Description") 
    STATUT_CHOICES = [
    ('Planifié', 'Planifié'),
    ('En cours', 'En cours'),
    ('Terminé', 'Terminé'),
    ('Annulé', 'Annulé'),
    ]
    statut = models.CharField(max_length=20,choices=STATUT_CHOICES,default='Planifié',verbose_name="Statut")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création") 
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de dernière modification")
    class Meta:
        db_table = 'core_deplacement'
        ordering = ['-dateDepart']
        verbose_name = 'Déplacement'
        verbose_name_plural = 'Déplacements'
    # Contraintes CHECK (gérées par null=False, blank=False, choices)
    def __str__(self):
        return f"Déplacement vers {self.destination} ({self.statut})"
    def clean(self):
        super().clean()
        if self.dateArrivee and self.dateDepart and self.dateArrivee < self.dateDepart:
            raise ValidationError({'dateArrivee': "La date d'arrivée ne peut pas être antérieure à la date de départ."})
    def save(self, *args, **kwargs):
        self.date_modification = timezone.now()
        super().save(*args, **kwargs)

# Correspond à la table UtilisationVehicule
class UtilisationVehicule(models.Model):
    id = models.AutoField(primary_key=True)
    deplacement = models.ForeignKey(Deplacement,on_delete=models.CASCADE,null=False,blank=False,related_name='utilisations_vehicule',verbose_name="Déplacement")
    vehicule = models.ForeignKey(Vehicule,on_delete=models.RESTRICT,null=False,blank=False,related_name='utilisations',verbose_name="Véhicule")
    carburant = models.DecimalField(max_digits=10,decimal_places=2,default=0.0,verbose_name="Carburant",validators=[MinValueValidator(0.00)])
    peages = models.DecimalField(max_digits=10,decimal_places=2,default=0.0,verbose_name="Péages",validators=[MinValueValidator(0.00)])
    kilometres_parcourus = models.IntegerField(null=True,blank=True,verbose_name="Kilomètres parcourus",validators=[MinValueValidator(0)])
    heure_debut = models.DateTimeField(null=True, blank=True,verbose_name="Heure de début")
    heure_fin = models.DateTimeField(null=True, blank=True, verbose_name="Heure de fin")
    class Meta:
        db_table = 'core_utilisation_vehicule'
        ordering = ['deplacement__dateDepart']
        verbose_name = 'Utilisation Véhicule'
        verbose_name_plural = 'Utilisations Véhicules'
    def __str__(self):
        return f"Utilisation de {self.vehicule.immatriculation} pour {self.deplacement.destination}"
    def clean(self):
        super().clean()
        if self.heure_fin and self.heure_debut and self.heure_fin < self.heure_debut:
            raise ValidationError({'heure_fin': "L'heure de fin ne peut pas être antérieure à l'heure de début."})
        
# --- TABLES D'ASSOCIATION (Many-to-Many avec attributs) ---
# Correspond à la table ResponsableParc
class ResponsableParc(models.Model):
    responsable = models.ForeignKey(Responsable,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Responsable")
    parc = models.ForeignKey(Parc,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Parc")
    date_debut = models.DateField(default=timezone.now,null=False,blank=False,verbose_name="Date de début")
    date_fin = models.DateField(null=True, blank=True, verbose_name="Date de fin")
    motif_fin = models.CharField(max_length=100, null=True, blank=True,verbose_name="Motif de fin")
    class Meta:
        db_table = 'core_responsable_parc'
        unique_together = ('responsable', 'parc', 'date_debut') 
        verbose_name = 'Responsable de Parc'
        verbose_name_plural = 'Responsables de Parcs'
    def __str__(self):
        return f"{self.responsable} gère {self.parc} depuis {self.date_debut}"
    def clean(self):
        super().clean()
        if self.date_fin and self.date_debut and self.date_fin < self.date_debut:
            raise ValidationError({'date_fin': "La date de fin ne peut pas être antérieure à la date de début."})
# Correspond à la table ChefParcParc
class ChefParcParc(models.Model):
    chef_parc = models.ForeignKey(ChefParc,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Chef de Parc")
    parc = models.ForeignKey(Parc,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Parc")
    date_nomination = models.DateField(default=timezone.now,null=False,blank=False,verbose_name="Date de nomination")
    date_fin = models.DateField(null=True, blank=True, verbose_name="Date defin")
    class Meta:
        db_table = 'core_chef_parc_parc'
        unique_together = ('chef_parc', 'parc', 'date_nomination')
        verbose_name = 'Affectation Chef de Parc'
        verbose_name_plural = 'Affectations Chefs de Parc'
    def __str__(self):
        return f"{self.chef_parc} dirige {self.parc} depuis {self.date_nomination}"
    def clean(self):
        super().clean()
        if self.date_fin and self.date_nomination and self.date_fin < self.date_nomination:
            raise ValidationError({'date_fin': "La date de fin ne peut pas être antérieure à la date de nomination."})

# Correspond à la table EntiteParc
class EntiteParc(models.Model):
    entite = models.ForeignKey(Entite,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Entité")
    parc = models.ForeignKey(Parc,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Parc")
    date_rattachement = models.DateField(default=timezone.now,null=False,blank=False,verbose_name="Date de rattachement")
    date_fin = models.DateField(null=True, blank=True, verbose_name="Date de fin")
    pourcentage_usage = models.DecimalField(max_digits=5,decimal_places=2,default=100.00,verbose_name="Pourcentage d'usage",validators=[MinValueValidator(0.00), MaxValueValidator(100.00)] )
    class Meta:
        db_table = 'core_entite_parc'
        unique_together = ('entite', 'parc', 'date_rattachement') 
        verbose_name = 'Rattachement Entité-Parc'
        verbose_name_plural = 'Rattachements Entités-Parcs'
    def __str__(self):
        return f"{self.entite} rattaché à {self.parc} depuis {self.date_rattachement}"
    def clean(self):
        super().clean()
        if self.date_fin and self.date_rattachement and self.date_fin < self.date_rattachement:
            raise ValidationError({'date_fin': "La date de fin ne peut pas être antérieure à la date de rattachement."})
        
# Correspond à la table DeplacementAgent
class DeplacementAgent(models.Model):
    deplacement = models.ForeignKey(Deplacement,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Déplacement")
    agent = models.ForeignKey('authentication.Agent',on_delete=models.CASCADE,null=False,blank=False,verbose_name="Agent")
    ROLE_DEPLACEMENT_CHOICES = [
    ('Passager', 'Passager'),
    ('Accompagnateur', 'Accompagnateur'),
    ('Responsable Mission', 'Responsable Mission'),
    ('Organisateur', 'Organisateur'),
    ]
    role_deplacement = models.CharField(max_length=50,choices=ROLE_DEPLACEMENT_CHOICES,null=False,blank=False,verbose_name="Rôle dans le déplacement")
    date_inscription = models.DateTimeField(auto_now_add=True,verbose_name="Date d'inscription")
    class Meta:
        db_table = 'core_deplacement_agent'
        unique_together = ('deplacement', 'agent')
        verbose_name = 'Participant au Déplacement'
        verbose_name_plural = 'Participants aux Déplacements'
    def __str__(self):
        return f"{self.agent} ({self.get_role_deplacement_display()}) pour {self.deplacement}"
    
# Correspond à la table DeplacementChauffeur
class DeplacementChauffeur(models.Model):
    deplacement = models.ForeignKey(Deplacement,on_delete=models.CASCADE, null=False,blank=False,verbose_name="Déplacement")
    chauffeur = models.ForeignKey(Chauffeur,on_delete=models.CASCADE,null=False,blank=False,verbose_name="Chauffeur")
    heures_conduite = models.DecimalField(max_digits=5,decimal_places=2,default=0.0,verbose_name="Heures de conduite",validators=[MinValueValidator(0.0), MaxValueValidator(24.0)])
    est_principal = models.BooleanField(default=False, verbose_name="Estprincipal") 
    class Meta:
        db_table = 'core_deplacement_chauffeur'
        unique_together = ('deplacement', 'chauffeur') 
        verbose_name = 'Chauffeur de Déplacement'
        verbose_name_plural = 'Chauffeurs de Déplacements'
    def __str__(self):
        return f"{self.chauffeur} conduit pour {self.deplacement}"