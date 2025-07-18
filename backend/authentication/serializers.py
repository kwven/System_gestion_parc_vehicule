from rest_framework import serializers
from .models import Agent, User
from django.contrib.auth.hashers import make_password
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