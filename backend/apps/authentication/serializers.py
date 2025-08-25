from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Agent, User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
class AgentSerializer(serializers.ModelSerializer):
    motdepasse = serializers.CharField(write_only=True)
    entite_nom = serializers.SerializerMethodField()
    entite_type = serializers.SerializerMethodField()
    class Meta:
        model = Agent
        fields = [
            'id', 'matricule', 'nom', 'prenom', 'email', 'date_affectation',
            'motdepasse', 'role', 'entite', 'date_creation', 'date_modification',
            'est_actif', 'entite_nom', 'entite_type'
        ]
        read_only_fields = ('date_creation', 'date_modification')
    def get_entite_nom(self, obj):
        return obj.entite.nom if obj.entite else None

    def get_entite_type(self, obj):
        return obj.entite.type if obj.entite else None

    def create(self, validated_data):
        if "motdepasse" in validated_data:
            validated_data["motdepasse"] = make_password(validated_data["motdepasse"])
        return Agent.objects.create(**validated_data)
    def update(self, instance, validated_data):
        # Gérer la mise à jour de l'agent et le hachage du mot de passe
        motdepasse = validated_data.pop('motdepasse', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if motdepasse:
            instance.set_password(motdepasse)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'agent', 'password') # Inclure les champs nécessaires
        extra_kwargs = {
            'password': {'write_only': True},
            'agent': {'required': False, 'allow_null': True},
        }
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        user.set_password(password)  # Hasher le mot de passe
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Ajouter les informations de l'utilisateur et de l'agent
        user = self.user
        data['user_info'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }
        
        # Ajouter les informations de l'agent si disponible
        if hasattr(user, 'agent') and user.agent:
            agent = user.agent
            data['agent_info'] = {
                'id': agent.id,
                'matricule': agent.matricule,
                'nom': agent.nom,
                'prenom': agent.prenom,
                'email': agent.email,
                'role': agent.role,
                'entite': {
                    'id': agent.entite.id,
                    'nom': agent.entite.nom,
                    'type': agent.entite.type
                } if agent.entite else None
            }
            
            # Ajouter les informations de profils multiples selon les rôles
            profile_data = {}
            
            # Identifier tous les rôles de l'agent avec les parcs actifs
            from apps.core.models import ResponsableParc, ChefParcParc
            from django.db import models
            from django.utils import timezone
            
            today = timezone.now().date()
            available_roles = []
            
            # Vérifier si l'agent a un profil responsable (OneToOneField)
            if hasattr(agent, 'responsable') and agent.responsable:
                responsable = agent.responsable
                # Récupérer tous les parcs actifs pour ce responsable
                active_parcs = ResponsableParc.objects.filter(
                    responsable=responsable,
                    date_debut__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                     parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                     available_roles.append({
                         'role_type': 'responsable',
                         'profile_id': responsable.id,
                         'niveau_responsabilite': responsable.niveau_responsabilite,
                         'budget_autorise': float(responsable.budget_autorise),
                         'parc_ids': parc_ids
                     })
            
            # Vérifier si l'agent a un profil chef de parc (OneToOneField)
            if hasattr(agent, 'chef_parc') and agent.chef_parc:
                chef_parc = agent.chef_parc
                # Récupérer tous les parcs actifs pour ce chef de parc
                active_parcs = ChefParcParc.objects.filter(
                    chef_parc=chef_parc,
                    date_nomination__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                     parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                     available_roles.append({
                         'role_type': 'chef_parc',
                         'profile_id': chef_parc.id,
                         'niveau_autorite': chef_parc.niveau_autorite,
                         'formation_securite': chef_parc.formation_securite,
                         'parc_ids': parc_ids
                     })
              
              # Ajouter le profil chauffeur (OneToOneField - pas lié aux parcs)
              if hasattr(agent, 'chauffeur') and agent.chauffeur:
                  chauffeur = agent.chauffeur
                  available_roles.append({
                      'role_type': 'chauffeur',
                      'profile_id': chauffeur.id,
                      'numero_permis': chauffeur.numero_permis,
                      'type_permis': chauffeur.type_permis,
                      'nombre_points': chauffeur.nombre_points
                  })
              
              # Vérifier si l'agent a des rôles spécialisés
              if not available_roles:
                  # Agent simple sans rôles spécialisés - traiter comme admin
                  from rest_framework import serializers
                  raise serializers.ValidationError(
                      "Accès refusé. Seuls les agents avec des rôles spécialisés peuvent accéder au système."
                  )
              
              profile_data['available_roles'] = available_roles
              data['profile_data'] = profile_data
        else:
            data['agent_info'] = None
            data['user_type'] = 'admin'
            data['profile_info'] = {}
        
        return data