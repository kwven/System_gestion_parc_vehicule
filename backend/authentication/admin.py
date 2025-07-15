from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Agent, User

# Enregistrement du modèle Agent
admin.site.register(Agent)

# Enregistrement du modèle User personnalisé
# Utilise UserAdmin pour conserver les fonctionnalités d'administration par défaut de Django pour les utilisateurs
admin.site.register(User, UserAdmin)