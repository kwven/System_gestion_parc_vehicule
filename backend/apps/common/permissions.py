from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist


class IsParcRelatedUser(permissions.BasePermission):
    """
    Permission qui vérifie si l'utilisateur a accès au parc associé à l'objet.
    Cette permission est centrale dans le système car elle applique la logique
    d'accès basée sur les parcs supervisés par l'utilisateur.
    """
    
    def has_permission(self, request, view):
        """Vérifie que l'utilisateur est authentifié."""
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Vérifie si l'utilisateur peut accéder à l'objet basé sur le parc associé.
        """
        user = request.user
        
        # Récupérer le parc associé à l'objet
        parc = self._get_parc_from_object(obj, view)
        if not parc:
            return False
        
        # Vérifier l'accès au parc
        return self._user_can_access_parc(user, parc)
    
    def _get_parc_from_object(self, obj, view):
        """
        Extrait le parc associé à un objet selon différentes stratégies.
        """
        # Cas 1: L'objet a directement un attribut parc
        if hasattr(obj, 'parc'):
            return obj.parc
        
        # Cas 2: L'objet est un véhicule ou lié à un véhicule
        if hasattr(obj, 'vehicule') and hasattr(obj.vehicule, 'parc'):
            return obj.vehicule.parc
        
        # Cas 3: L'objet est directement un Parc
        if hasattr(obj, '_meta') and obj._meta.model_name == 'parc':
            return obj
        
        # Cas 4: L'objet est une entité avec des parcs
        if hasattr(obj, 'parcs'):
            # Pour les entités, on vérifie si l'utilisateur a accès à au moins un parc
            user_parcs = self._get_user_accessible_parcs(view.request.user)
            entity_parcs = obj.parcs.all()
            if any(parc in user_parcs for parc in entity_parcs):
                return entity_parcs.first()  # Retourne le premier parc accessible
        
        return None
    
    def _user_can_access_parc(self, user, parc):
        """
        Vérifie si un utilisateur peut accéder à un parc donné.
        Utilise la méthode can_access_parc du modèle CustomUser.
        """
        if hasattr(user, 'can_access_parc'):
            return user.can_access_parc(parc)
        return False
    
    def _get_user_accessible_parcs(self, user):
        """
        Récupère la liste des parcs accessibles à un utilisateur.
        """
        if hasattr(user, 'get_accessible_parcs'):
            return user.get_accessible_parcs()
        return []


class IsResponsible(permissions.BasePermission):
    """
    Permission qui vérifie si l'utilisateur a le rôle de Responsable actif.
    """
    
    def has_permission(self, request, view):
        user = request.user
        return (user and user.is_authenticated and 
                hasattr(user, 'responsable') and 
                user.responsable.is_active)


class IsChefParc(permissions.BasePermission):
    """
    Permission qui vérifie si l'utilisateur a le rôle de Chef de Parc actif.
    """
    
    def has_permission(self, request, view):
        user = request.user
        return (user and user.is_authenticated and 
                hasattr(user, 'chef_parc') and 
                user.chef_parc.is_active)


class IsChauffeur(permissions.BasePermission):
    """
    Permission qui vérifie si l'utilisateur a le rôle de Chauffeur actif.
    """
    
    def has_permission(self, request, view):
        user = request.user
        return (user and user.is_authenticated and 
                hasattr(user, 'chauffeur') and 
                user.chauffeur.is_active)


class CanManageParc(permissions.BasePermission):
    """
    Permission qui vérifie si l'utilisateur peut gérer un parc spécifique.
    Plus restrictive que IsParcRelatedUser, elle vérifie les droits de gestion.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Récupérer le parc
        if hasattr(obj, '_meta') and obj._meta.model_name == 'parc':
            parc = obj
        elif hasattr(obj, 'parc'):
            parc = obj.parc
        else:
            return False
        
        # Vérifier si l'utilisateur est responsable ou chef de ce parc
        if hasattr(user, 'responsable') and user.responsable.is_active:
            if user.responsable.parcs.filter(id=parc.id).exists():
                return True
        
        if hasattr(user, 'chef_parc') and user.chef_parc.is_active:
            if user.chef_parc.parcs.filter(id=parc.id).exists():
                return True
        
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission qui permet la lecture à tous les utilisateurs authentifiés,
    mais la modification seulement au propriétaire de l'objet.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Permissions de lecture pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permissions d'écriture seulement pour le propriétaire
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        
        return False


class ReadOnlyPermission(permissions.BasePermission):
    """
    Permission qui n'autorise que les opérations de lecture.
    """
    
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                request.method in permissions.SAFE_METHODS)
