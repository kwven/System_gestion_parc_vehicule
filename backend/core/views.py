from rest_framework import viewsets
from .models import Region, Province, Localite, Entite, Parc, Vehicule, TypeCout, CoutVehicule, Deplacement, UtilisationVehicule, ResponsableParc, ChefParcParc, EntiteParc, DeplacementAgent, DeplacementChauffeur, Responsable, Chauffeur, ChefParc
from .serializers import RegionSerializer, ProvinceSerializer, LocaliteSerializer, EntiteSerializer, ParcSerializer, VehiculeSerializer, TypeCoutSerializer, CoutVehiculeSerializer, DeplacementSerializer, UtilisationVehiculeSerializer, ResponsableParcSerializer, ChefParcParcSerializer, EntiteParcSerializer, DeplacementAgentSerializer, DeplacementChauffeurSerializer, ResponsableSerializer, ChauffeurSerializer, ChefParcSerializer
#pour les logiques métier spécifiques
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import models

# ViewSets pour la hiérarchie géographique
class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer

class LocaliteViewSet(viewsets.ModelViewSet):
    queryset = Localite.objects.all()
    serializer_class = LocaliteSerializer

# ViewSets pour l'organisation administrative
class EntiteViewSet(viewsets.ModelViewSet):
    queryset = Entite.objects.all()
    serializer_class = EntiteSerializer

class ParcViewSet(viewsets.ModelViewSet):
    queryset = Parc.objects.all()
    serializer_class = ParcSerializer

# ViewSets pour les spécialisations d'Agent
class ResponsableViewSet(viewsets.ModelViewSet):
    queryset = Responsable.objects.all()
    serializer_class = ResponsableSerializer

class ChauffeurViewSet(viewsets.ModelViewSet):
    queryset = Chauffeur.objects.all()
    serializer_class = ChauffeurSerializer

class ChefParcViewSet(viewsets.ModelViewSet):
    queryset = ChefParc.objects.all()
    serializer_class = ChefParcSerializer

# ViewSets pour la gestion des véhicules
class VehiculeViewSet(viewsets.ModelViewSet):
    queryset = Vehicule.objects.all()
    serializer_class = VehiculeSerializer

class TypeCoutViewSet(viewsets.ModelViewSet):
    queryset = TypeCout.objects.all()
    serializer_class = TypeCoutSerializer

class CoutVehiculeViewSet(viewsets.ModelViewSet):
    queryset = CoutVehicule.objects.all()
    serializer_class = CoutVehiculeSerializer

# ViewSets pour la gestion des déplacements
class DeplacementViewSet(viewsets.ModelViewSet):
    queryset = Deplacement.objects.all()
    serializer_class = DeplacementSerializer

class UtilisationVehiculeViewSet(viewsets.ModelViewSet):
    queryset = UtilisationVehicule.objects.all()
    serializer_class = UtilisationVehiculeSerializer

# ViewSets pour les tables d'association
class ResponsableParcViewSet(viewsets.ModelViewSet):
    queryset = ResponsableParc.objects.all()
    serializer_class = ResponsableParcSerializer

class ChefParcParcViewSet(viewsets.ModelViewSet):
    queryset = ChefParcParc.objects.all()
    serializer_class = ChefParcParcSerializer

class EntiteParcViewSet(viewsets.ModelViewSet):
    queryset = EntiteParc.objects.all()
    serializer_class = EntiteParcSerializer

class DeplacementAgentViewSet(viewsets.ModelViewSet):
    queryset = DeplacementAgent.objects.all()
    serializer_class = DeplacementAgentSerializer

class DeplacementChauffeurViewSet(viewsets.ModelViewSet):
    queryset = DeplacementChauffeur.objects.all()
    serializer_class = DeplacementChauffeurSerializer

# Vues pour les logiques métier spécifiques
class DeplacementViewSet(viewsets.ModelViewSet):
    queryset = Deplacement.objects.all()
    serializer_class = DeplacementSerializer

    @action(detail=True, methods=["post"], url_path="assign-vehicle")
    def assign_vehicle(self, request, pk=None):
        """
        Assigne un véhicule à un déplacement.
        Corps de la requête : { "vehicule_id": <id>, "kilometres_parcourus": <km>, ... }
        """
        deplacement = self.get_object()
        vehicule_id = request.data.get("vehicule_id")
        if not vehicule_id:
            return Response({"error": "L'ID du véhicule est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            vehicule = Vehicule.objects.get(id=vehicule_id)
        except Vehicule.DoesNotExist:
            return Response({"error": "Véhicule non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        # Créer l'utilisation du véhicule
        utilisation_data = request.data
        utilisation_data["deplacement"] = deplacement.id
        utilisation_data["vehicule"] = vehicule.id
        utilisation_serializer = UtilisationVehiculeSerializer(data=utilisation_data)
        if utilisation_serializer.is_valid():
            utilisation_serializer.save()
            return Response(utilisation_serializer.data, status=status.HTTP_201_CREATED)
        return Response(utilisation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="assign-agent")
    def assign_agent(self, request, pk=None):
        """
        Assigne un agent à un déplacement.
        Corps de la requête : { "agent_id": <id>, "role_deplacement": "<role>" }
        """
        deplacement = self.get_object()
        agent_id = request.data.get("agent_id")
        if not agent_id:
            return Response({"error": "L'ID de l'agent est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            agent = Agent.objects.get(id=agent_id)
        except Agent.DoesNotExist:
            return Response({"error": "Agent non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        # Créer l'affectation de l'agent
        deplacement_agent_data = request.data
        deplacement_agent_data["deplacement"] = deplacement.id
        deplacement_agent_data["agent"] = agent.id
        deplacement_agent_serializer = DeplacementAgentSerializer(data=deplacement_agent_data)
        if deplacement_agent_serializer.is_valid():
            deplacement_agent_serializer.save()
            return Response(deplacement_agent_serializer.data, status=status.HTTP_201_CREATED)
        return Response(deplacement_agent_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="assign-chauffeur")
    def assign_chauffeur(self, request, pk=None):
        """
        Assigne un chauffeur à un déplacement.
        Corps de la requête : { "chauffeur_id": <id>, "heures_conduite": <heures>, ... }
        """
        deplacement = self.get_object()
        chauffeur_id = request.data.get("chauffeur_id")
        if not chauffeur_id:
            return Response({"error": "L'ID du chauffeur est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chauffeur = Chauffeur.objects.get(agent_id=chauffeur_id)
        except Chauffeur.DoesNotExist:
            return Response({"error": "Chauffeur non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        # Créer l'affectation du chauffeur
        deplacement_chauffeur_data = request.data
        deplacement_chauffeur_data["deplacement"] = deplacement.id
        deplacement_chauffeur_data["chauffeur"] = chauffeur.agent_id
        deplacement_chauffeur_serializer = DeplacementChauffeurSerializer(data=deplacement_chauffeur_data)
        if deplacement_chauffeur_serializer.is_valid():
            deplacement_chauffeur_serializer.save()
            return Response(deplacement_chauffeur_serializer.data, status=status.HTTP_201_CREATED)
        return Response(deplacement_chauffeur_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CoutVehiculeViewSet(viewsets.ModelViewSet):
    queryset = CoutVehicule.objects.all()
    serializer_class = CoutVehiculeSerializer

    @action(detail=False, methods=["get"], url_path="rapports-couts")
    def rapports_couts(self, request):
        """
        Génère des rapports de coûts agrégés.
        Paramètres de requête :
        - vehicule_id (optionnel) : Filtrer par véhicule.
        - type_cout_id (optionnel) : Filtrer par type de coût.
        - annee (optionnel) : Filtrer par année.
        - mois (optionnel) : Filtrer par mois.
        """
        queryset = self.get_queryset()

        vehicule_id = request.query_params.get("vehicule_id")
        type_cout_id = request.query_params.get("type_cout_id")
        annee = request.query_params.get("annee")
        mois = request.query_params.get("mois")

        if vehicule_id:
            queryset = queryset.filter(vehicule_id=vehicule_id)
        if type_cout_id:
            queryset = queryset.filter(type_cout_id=type_cout_id)
        if annee:
            queryset = queryset.filter(annee=annee)
        if mois:
            queryset = queryset.filter(date_cout__month=mois)

        # Agrégation des coûts
        rapport = queryset.values("type_cout__nom", "vehicule__immatriculation", "annee").annotate(
            total_montant=models.Sum("montant")
        ).order_by("annee", "type_cout__nom", "vehicule__immatriculation")

        return Response(rapport, status=status.HTTP_200_OK)