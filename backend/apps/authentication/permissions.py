from rest_framework import permissions
from django.contrib.auth.models import User
from .models import Agent
from core.models import Responsable, ChefParc, Chauffeur


class IsResponsable(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur a sélectionné le rôle responsable actif.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        # Vérifier le rôle actif dans la session
        active_role = request.session.get('active_role')
        if not active_role:
            return False
        
        return active_role.get('role_type') == 'responsable'


class IsChefParc(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur a sélectionné le rôle chef de parc actif.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        # Vérifier le rôle actif dans la session
        active_role = request.session.get('active_role')
        if not active_role:
            return False
        
        return active_role.get('role_type') == 'chef_parc'


class IsChauffeur(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur a sélectionné le rôle chauffeur actif.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        # Vérifier le rôle actif dans la session
        active_role = request.session.get('active_role')
        if not active_role:
            return False
        
        return active_role.get('role_type') == 'chauffeur'


# Alias pour compatibilité avec l'ancien code
class IsChefDeParc(IsChefParc):
    pass


class IsAdminSuperieur(permissions.BasePermission):
    """
    Vérifie si l'utilisateur est Admin supérieur
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


class IsResponsableOrChefParc(permissions.BasePermission):
    """
    Permission pour les responsables ou chefs de parc.
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
            
        if hasattr(request.user, 'agent') and request.user.agent:
            agent = request.user.agent
            return (hasattr(agent, 'responsable_profile') or 
                   hasattr(agent, 'chefparc_profile'))
        
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre seulement aux propriétaires d'un objet de le modifier.
    """
    
    def has_object_permission(self, request, view, obj):
        # Permissions de lecture pour tous les utilisateurs authentifiés
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permissions d'écriture seulement pour le propriétaire de l'objet
        if hasattr(obj, 'agent'):
            return obj.agent.user == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class CanManageAgents(permissions.BasePermission):
    """
    Permission pour gérer les agents (création, modification, suppression).
    Réservée aux super utilisateurs et responsables.
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
            
        if hasattr(request.user, 'agent') and request.user.agent:
            return hasattr(request.user.agent, 'responsable_profile')
        
        return False


class CanAssignRoles(permissions.BasePermission):
    """
    Permission pour assigner des rôles aux agents.
    Réservée aux super utilisateurs uniquement.
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser