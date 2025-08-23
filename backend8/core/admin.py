from django.contrib import admin
from .models import Region, Province, Localite, Entite, Parc, Vehicule, TypeCout, CoutVehicule, Deplacement, UtilisationVehicule, ResponsableParc, ChefParcParc, EntiteParc, DeplacementAgent, DeplacementChauffeur, Responsable, Chauffeur, ChefParc

# Enregistrement des modèles pour l'administration Django
admin.site.register(Region)
admin.site.register(Province)
admin.site.register(Localite)
admin.site.register(Entite)
admin.site.register(Parc)
admin.site.register(Vehicule)
admin.site.register(TypeCout)
admin.site.register(CoutVehicule)
admin.site.register(Deplacement)
admin.site.register(UtilisationVehicule)
admin.site.register(ResponsableParc)
admin.site.register(ChefParcParc)
admin.site.register(EntiteParc)
admin.site.register(DeplacementAgent)
admin.site.register(DeplacementChauffeur)
admin.site.register(Responsable)
admin.site.register(Chauffeur)
admin.site.register(ChefParc)

