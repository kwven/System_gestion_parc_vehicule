from rest_framework.permissions import BasePermission

# Vérifie si l'utilisateur est connecté et a le rôle "Responsable"
class IsResponsable(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'agent') and request.user.agent.role == "Responsable"

# Vérifie si l'utilisateur est connecté et a le rôle "Chauffeur"
class IsChauffeur(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'agent') and request.user.agent.role == "Chauffeur"

# Vérifie si l'utilisateur est connecté et a le rôle "Chef de parc"
class IsChefDeParc(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'agent') and request.user.agent.role == "Chef de parc"

# Vérifie si l'utilisateur est Admin supérieur
class IsAdminSuperieur(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser