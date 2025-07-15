from rest_framework import serializers
from .models import Agent, User
class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'agent', 'first_name', 'last_name') # Inclure les champs nécessaires
        read_only_fields = ('username',) # Le nom d'utilisateur peut être en lecture seule si vous utilisez l'email comme identifiant