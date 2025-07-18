from rest_framework import serializers
from .models import Region, Province, Localite, Entite, Parc, Vehicule, TypeCout, CoutVehicule, Deplacement, UtilisationVehicule, ResponsableParc, ChefParcParc, EntiteParc, DeplacementAgent, DeplacementChauffeur, Responsable, Chauffeur, ChefParc
from authentication.serializers import AgentSerializer

# Serializers pour la hiérarchie géographique
class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class ProvinceSerializer(serializers.ModelSerializer):
    # Affiche le nom de la région
    region_nom = serializers.ReadOnlyField(source='region.nom')
    class Meta:
        model = Province
        fields = '__all__'

class LocaliteSerializer(serializers.ModelSerializer):
    # Affiche le nom de la province
    province_nom = serializers.ReadOnlyField(source='province.nom')
    class Meta:
        model = Localite
        fields = '__all__'

# Serializers pour l'organisation administrative
class EntiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entite
        fields = '__all__'

class ParcSerializer(serializers.ModelSerializer):
    # Affiche le nom de la localité
    localite_nom = serializers.ReadOnlyField(source='localite.nom')
    class Meta:
        model = Parc
        fields = '__all__'

# Serializers pour les spécialisations d'Agent (Responsable, Chauffeur, ChefParc)
class ResponsableSerializer(serializers.ModelSerializer):
    agent_details = AgentSerializer(source='agent',read_only=True)
    class Meta:
        model = Responsable
        fields = '__all__'

class ChauffeurSerializer(serializers.ModelSerializer):
    agent_details = AgentSerializer(source='agent', read_only=True)
    class Meta:
        model = Chauffeur
        fields = '__all__'

class ChefParcSerializer(serializers.ModelSerializer):
    agent_details = AgentSerializer(source='agent', read_only=True)
    class Meta:
        model = ChefParc
        fields = '__all__'

# Serializers pour la gestion des véhicules
class VehiculeSerializer(serializers.ModelSerializer):
    date_creation = serializers.DateTimeField(read_only=True)
    date_modification = serializers.DateTimeField(read_only=True)
    dateAcquisition = serializers.DateField(required=False, allow_null=True)
    class Meta:
        model = Vehicule
        fields = '__all__'

class TypeCoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeCout
        fields = '__all__'

class CoutVehiculeSerializer(serializers.ModelSerializer):
    vehicule_immatriculation = serializers.ReadOnlyField(source='vehicule.immatriculation')
    type_cout_nom = serializers.ReadOnlyField(source='type_cout.nom')
    saisi_par_nom = serializers.ReadOnlyField(source='saisi_par.nom')
    class Meta:
        model = CoutVehicule
        fields = '__all__'

# Serializers pour la gestion des déplacements
class DeplacementSerializer(serializers.ModelSerializer):
    #pour afficher les véhicules et agents associés directement dans le déplacement
    utilisations_vehicule = serializers.SerializerMethodField()
    participants_agents = serializers.SerializerMethodField()
    participants_chauffeurs = serializers.SerializerMethodField()
    class Meta:
        model = Deplacement
        fields = '__all__'
    def get_utilisations_vehicule(self, obj):
        # Retourne les détails des utilisations de véhicule pour ce déplacement
        return UtilisationVehiculeSerializer(obj.utilisations_vehicule.all(), many=True).data
    def get_participants_agents(self, obj):
        # Retourne les détails des agents participant à ce déplacement
        return DeplacementAgentSerializer(obj.deplacementagent_set.all(), many=True).data
    def get_participants_chauffeurs(self, obj):
        # Retourne les détails des chauffeurs participant à ce déplacement
        return DeplacementChauffeurSerializer(obj.deplacementchauffeur_set.all(), many=True).data

class UtilisationVehiculeSerializer(serializers.ModelSerializer):
    deplacement_destination = serializers.ReadOnlyField(source='deplacement.destination')
    vehicule_immatriculation = serializers.ReadOnlyField(source='vehicule.immatriculation')
    class Meta:
        model = UtilisationVehicule
        fields = '__all__'

# Serializers pour les tables d'association
class ResponsableParcSerializer(serializers.ModelSerializer):
    responsable_details = serializers.ReadOnlyField(source='responsable.agent.__str__')
    parc_localisation = serializers.ReadOnlyField(source='parc.localisation')
    class Meta:
        model = ResponsableParc
        fields = '__all__'

class ChefParcParcSerializer(serializers.ModelSerializer):
    chef_parc_details = serializers.ReadOnlyField(source='chef_parc.agent.__str__')
    parc_localisation = serializers.ReadOnlyField(source='parc.localisation')
    class Meta:
        model = ChefParcParc
        fields = '__all__'

class EntiteParcSerializer(serializers.ModelSerializer):
    entite_nom = serializers.ReadOnlyField(source='entite.nom')
    parc_localisation = serializers.ReadOnlyField(source='parc.localisation')
    class Meta:
        model = EntiteParc
        fields = '__all__'

class DeplacementAgentSerializer(serializers.ModelSerializer):
    deplacement_destination = serializers.ReadOnlyField(source='deplacement.destination')
    agent_details = AgentSerializer(source='agent', read_only=True)
    class Meta:
        model = DeplacementAgent
        fields = '__all__'

class DeplacementChauffeurSerializer(serializers.ModelSerializer):
    deplacement_destination = serializers.ReadOnlyField(source='deplacement.destination')
    chauffeur_details = ChauffeurSerializer(source='chauffeur', read_only=True)
    class Meta:
        model = DeplacementChauffeur
        fields = '__all__'
