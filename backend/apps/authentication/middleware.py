from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status


class ActiveRoleMiddleware(MiddlewareMixin):
    """
    Middleware pour gérer le rôle actif de l'agent dans les requêtes.
    Ajoute les informations du rôle actif à l'objet request.
    """
    
    def process_request(self, request):
        """
        Ajouter les informations du rôle actif à la requête.
        """
        # Initialiser les attributs du rôle actif
        request.active_role = None
        request.active_role_type = None
        request.active_profile_id = None
        request.active_parc = None
        
        # Vérifier si l'utilisateur est authentifié et a un rôle actif
        if hasattr(request, 'user') and request.user.is_authenticated:
            active_role_data = request.session.get('active_role')
            
            if active_role_data:
                request.active_role = active_role_data
                request.active_role_type = active_role_data.get('role_type')
                request.active_profile_id = active_role_data.get('profile_id')
                request.active_parc = active_role_data.get('parc_actuel')
        
        return None
    
    def process_response(self, request, response):
        """
        Traitement de la réponse (optionnel).
        """
        return response


class RequireActiveRoleMiddleware(MiddlewareMixin):
    """
    Middleware pour exiger qu'un rôle actif soit sélectionné pour certaines vues.
    """
    
    # URLs qui nécessitent un rôle actif
    PROTECTED_PATHS = [
        '/api/core/',  # Toutes les vues core nécessitent un rôle actif
        '/api/vehicules/',
        '/api/parcs/',
        '/api/deplacements/',
    ]
    
    # URLs exemptées de cette vérification
    EXEMPT_PATHS = [
        '/api/auth/token/',
        '/api/auth/profile/',
        '/api/auth/select-role/',
        '/api/auth/register/',
        '/admin/',
    ]
    
    def process_request(self, request):
        """
        Vérifier si un rôle actif est requis pour cette requête.
        """
        # Ignorer les requêtes non-API
        if not request.path.startswith('/api/'):
            return None
        
        # Vérifier si le chemin est exempté
        for exempt_path in self.EXEMPT_PATHS:
            if request.path.startswith(exempt_path):
                return None
        
        # Vérifier si le chemin nécessite un rôle actif
        requires_active_role = False
        for protected_path in self.PROTECTED_PATHS:
            if request.path.startswith(protected_path):
                requires_active_role = True
                break
        
        if not requires_active_role:
            return None
        
        # Vérifier si l'utilisateur est authentifié
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return None  # Laissez l'authentification être gérée par DRF
        
        # Vérifier si un rôle actif est sélectionné
        active_role = request.session.get('active_role')
        if not active_role:
            return JsonResponse({
                'error': 'Aucun rôle actif sélectionné. Veuillez sélectionner un rôle',
                'code': 'NO_ACTIVE_ROLE'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return None