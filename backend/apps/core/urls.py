from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, ProvinceViewSet, LocaliteViewSet, EntiteViewSet, ParcViewSet, VehiculeViewSet, TypeCoutViewSet, CoutVehiculeViewSet, DeplacementViewSet, UtilisationVehiculeViewSet, ResponsableParcViewSet, ChefParcParcViewSet, VehiculeParcViewSet, EntiteParcViewSet, DeplacementAgentViewSet, DeplacementChauffeurViewSet, ResponsableViewSet, ChauffeurViewSet, ChefParcViewSet

router = DefaultRouter()
router.register(r'regions', RegionViewSet)
router.register(r'provinces', ProvinceViewSet)
router.register(r'localites', LocaliteViewSet)
router.register(r'entites', EntiteViewSet)
router.register(r'parcs', ParcViewSet)
router.register(r'vehicules', VehiculeViewSet)
router.register(r'type-couts', TypeCoutViewSet)
router.register(r'couts-vehicule', CoutVehiculeViewSet)
router.register(r'deplacements', DeplacementViewSet)
router.register(r'utilisations-vehicule', UtilisationVehiculeViewSet)
router.register(r'responsables-parc', ResponsableParcViewSet)
router.register(r'chefs-parc-parc', ChefParcParcViewSet)
router.register(r'vehicules-parc', VehiculeParcViewSet)
router.register(r'entites-parc', EntiteParcViewSet)
router.register(r'deplacements-agent', DeplacementAgentViewSet)
router.register(r'deplacements-chauffeur', DeplacementChauffeurViewSet)
router.register(r'responsables', ResponsableViewSet)
router.register(r'chauffeurs', ChauffeurViewSet)
router.register(r'chefs-parc', ChefParcViewSet)

urlpatterns = [
    path('', include(router.urls)),
]