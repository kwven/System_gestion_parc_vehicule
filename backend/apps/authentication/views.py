from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Agent, User
from .serializers import AgentSerializer, UserSerializer, CustomTokenObtainPairSerializer
from .permissions import IsResponsable, IsChefDeParc, IsChauffeur
from django.db import models
from django.contrib.auth import authenticate
from apps.core.models import Responsable, ChefParc, Chauffeur

class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = (AllowAny,)

# Vue pour l'enregistrement d'un nouvel utilisateur (si nécessaire)
class RegisterUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vue pour obtenir les informations du profil utilisateur connecté
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Récupérer les informations détaillées de l'utilisateur connecté"""
        user = request.user
        
        # Informations de base de l'utilisateur
        user_data = {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'date_joined': user.date_joined
            }
        }
        
        # Informations de l'agent si disponible
        if hasattr(user, 'agent') and user.agent:
            agent = user.agent
            user_data['agent'] = {
                'id': agent.id,
                'matricule': agent.matricule,
                'nom': agent.nom,
                'prenom': agent.prenom,
                'email': agent.email,
                'date_affectation': agent.date_affectation,
                'role': agent.role,
                'entite': {
                    'id': agent.entite.id,
                    'nom': agent.entite.nom,
                    'type': agent.entite.type
                } if agent.entite else None
            }
            
            # Ajouter les informations de profils multiples selon les rôles
            profile_data = {}
            
            # Identifier les rôles disponibles avec les parcs actifs
             from apps.core.models import ResponsableParc, ChefParcParc
             from django.db import models
             from django.utils import timezone
             
             today = timezone.now().date()
             available_roles = []
            
            # Vérifier si l'agent a un profil responsable (OneToOneField)
            if hasattr(agent, 'responsable') and agent.responsable:
                responsable = agent.responsable
                # Récupérer tous les parcs actifs pour ce responsable
                active_parcs = ResponsableParc.objects.filter(
                    responsable=responsable,
                    date_debut__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                    parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                    available_roles.append({
                         'role_type': 'responsable',
                         'profile_id': responsable.id,
                         'niveau_responsabilite': responsable.niveau_responsabilite,
                         'budget_autorise': responsable.budget_autorise,
                         'parc_ids': parc_ids
                     })
            
            # Vérifier si l'agent a un profil chef de parc (OneToOneField)
            if hasattr(agent, 'chef_parc') and agent.chef_parc:
                chef_parc = agent.chef_parc
                # Récupérer tous les parcs actifs pour ce chef de parc
                active_parcs = ChefParcParc.objects.filter(
                    chef_parc=chef_parc,
                    date_nomination__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                    parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                    available_roles.append({
                         'role_type': 'chef_parc',
                         'profile_id': chef_parc.id,
                         'niveau_autorite': chef_parc.niveau_autorite,
                         'formation_securite': chef_parc.formation_securite,
                         'parc_ids': parc_ids
                     })
               
               # Ajouter le profil chauffeur (OneToOneField - pas lié aux parcs)
               if hasattr(agent, 'chauffeur') and agent.chauffeur:
                   chauffeur = agent.chauffeur
                   available_roles.append({
                       'role_type': 'chauffeur',
                       'profile_id': chauffeur.id,
                       'numero_permis': chauffeur.numero_permis,
                       'type_permis': chauffeur.type_permis,
                   })
               
               # Vérifier si l'agent a des rôles spécialisés
               if not available_roles:
                   return Response(
                       {'error': 'Accès refusé. Seuls les agents avec des rôles spécialisés (Responsable, Chef de Parc, Chauffeur) peuvent accéder au système.'},
                       status=status.HTTP_403_FORBIDDEN
                   )
               
               profile_data['available_roles'] = available_roles
            
            user_data['profiles'] = profile_data
        else:
            user_data['agent'] = None
            user_data['profiles'] = {'admin': True}
        
        return Response(user_data, status=status.HTTP_200_OK)

# Vue pour assigner des rôles aux agents (réservée aux super utilisateurs)
#Elle permet de transformer un Agent en Responsable, Chef de parc ou Chauffeur
class AssignRoleView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Vérifier que l'utilisateur est un super utilisateur
        if not request.user.is_superuser:
            return Response(
                {'error': 'Seuls les super utilisateurs peuvent assigner des rôles'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        agent_id = request.data.get('agent_id')
        role_type = request.data.get('role_type')  # 'responsable', 'chef_parc', 'chauffeur'
        role_data = request.data.get('role_data', {})
        
        if not agent_id or not role_type:
            return Response(
                {'error': 'agent_id et role_type sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            agent = Agent.objects.get(id=agent_id)
        except Agent.DoesNotExist:
            return Response(
                {'error': 'Agent non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Créer le profil selon le type de rôle (permettre les rôles multiples)
        if role_type == 'responsable':
            # Vérifier si l'agent a déjà un profil responsable
            if hasattr(agent, 'responsable') and agent.responsable:
                return Response(
                    {'error': 'Cet agent a déjà un profil responsable. Un agent ne peut avoir qu\'un seul rôle responsable.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            niveau_responsabilite = role_data.get('niveau_responsabilite')
            
            responsable = Responsable.objects.create(
                agent=agent,
                niveau_responsabilite=niveau_responsabilite,
                budget_autorise=role_data.get('budget_autorise', 0.00)
            )
            return Response(
                {'message': f'Agent {agent.nom} {agent.prenom} assigné comme responsable ({niveau_responsabilite})'},
                status=status.HTTP_201_CREATED
            )
            
        elif role_type == 'chef_parc':
            # Vérifier si l'agent a déjà un profil chef de parc
            if hasattr(agent, 'chef_parc') and agent.chef_parc:
                return Response(
                    {'error': 'Cet agent a déjà un profil chef de parc. Un agent ne peut avoir qu\'un seul rôle chef de parc.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            niveau_autorite = role_data.get('niveau_autorite')
            
            chef_parc = ChefParc.objects.create(
                agent=agent,
                niveau_autorite=niveau_autorite,
                formation_securite=role_data.get('formation_securite', False)
            )
            return Response(
                {'message': f'Agent {agent.nom} {agent.prenom} assigné comme chef de parc ({niveau_autorite})'},
                status=status.HTTP_201_CREATED
            )
            
        elif role_type == 'chauffeur':
            # Vérifier si l'agent a déjà un profil chauffeur
            if hasattr(agent, 'chauffeur') and agent.chauffeur:
                return Response(
                    {'error': 'Cet agent a déjà un profil chauffeur. Un agent ne peut avoir qu\'un seul rôle chauffeur.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            numero_permis = role_data.get('numero_permis')
            date_obtention_permis = role_data.get('date_obtention_permis')
            
            if not numero_permis or not date_obtention_permis:
                return Response(
                    {'error': 'numero_permis et date_obtention_permis sont requis pour un chauffeur'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            chauffeur = Chauffeur.objects.create(
                agent=agent,
                numero_permis=numero_permis,
                date_obtention_permis=date_obtention_permis,
                type_permis=role_data.get('type_permis'),
                date_expiration_permis=role_data.get('date_expiration_permis'),
                nombre_points=role_data.get('nombre_points', 12)
            )
            return Response(
                {'message': f'Agent {agent.nom} {agent.prenom} assigné comme chauffeur (permis {numero_permis})'},
                status=status.HTTP_201_CREATED
            )
        
        else:
            return Response(
                {'error': 'Type de rôle invalide. Utilisez: responsable, chef_parc, ou chauffeur'},
                status=status.HTTP_400_BAD_REQUEST
            )

class GetAvailableRolesView(APIView):
    """
    Vue pour récupérer tous les rôles disponibles pour l'agent connecté.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Récupérer tous les rôles disponibles pour l'agent connecté.
        """
        try:
            user = request.user
            
            # Vérifier que l'utilisateur a un agent associé
            if not hasattr(user, 'agent') or not user.agent:
                return Response({
                    'error': 'Aucun agent associé à cet utilisateur'
                }, status=status.HTTP_404_NOT_FOUND)
            
            agent = user.agent
            
            # Construire la liste de tous les rôles disponibles pour cet agent
            from apps.core.models import ResponsableParc, ChefParcParc
            from django.db import models
            from django.utils import timezone
            
            today = timezone.now().date()
            available_roles = []
            
            # Collecter le rôle responsable (un seul profil possible)
            if hasattr(agent, 'responsable') and agent.responsable:
                responsable = agent.responsable
                active_parcs = ResponsableParc.objects.filter(
                    responsable=responsable,
                    date_debut__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                    parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                    available_roles.append({
                        'role_type': 'responsable',
                        'profile_id': responsable.id,
                        'nom': agent.nom,
                        'prenom': agent.prenom,
                        'entite': getattr(agent, 'entite', None),
                        'niveau_responsabilite': responsable.niveau_responsabilite,
                        'budget_autorise': responsable.budget_autorise,
                        'parc_ids': parc_ids,
                    })
            
            # Collecter le rôle chef de parc (un seul profil possible)
            if hasattr(agent, 'chef_parc') and agent.chef_parc:
                chef_parc = agent.chef_parc
                active_parcs = ChefParcParc.objects.filter(
                    chef_parc=chef_parc,
                    date_nomination__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                    parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                    available_roles.append({
                        'role_type': 'chef_parc',
                        'profile_id': chef_parc.id,
                        'nom': agent.nom,
                        'prenom': agent.prenom,
                        'entite': getattr(agent, 'entite', None),
                        'niveau_autorite': chef_parc.niveau_autorite,
                        'formation_securite': chef_parc.formation_securite,
                        'parc_ids': parc_ids,
                    })
            
            # Collecter le rôle chauffeur (un seul profil possible)
            if hasattr(agent, 'chauffeur') and agent.chauffeur:
                chauffeur = agent.chauffeur
                available_roles.append({
                    'role_type': 'chauffeur',
                    'profile_id': chauffeur.id,
                    'nom': agent.nom,
                    'prenom': agent.prenom,
                    'entite': getattr(agent, 'entite', None),
                    'numero_permis': chauffeur.numero_permis,
                    'date_obtention_permis': chauffeur.date_obtention_permis,
                    'type_permis': chauffeur.type_permis,
                    'date_expiration_permis': chauffeur.date_expiration_permis,
                    'nombre_points': chauffeur.nombre_points
                })
            
            # Vérifier que l'agent a au moins un rôle spécialisé
            if not available_roles:
                return Response({
                    'error': 'Accès refusé. Seuls les agents avec des rôles spécialisés peuvent accéder au système.',
                    'available_roles': []
                }, status=status.HTTP_403_FORBIDDEN)
            
            return Response({
                'available_roles': available_roles,
                'agent_info': {
                    'id': agent.id,
                    'matricule': agent.matricule,
                    'nom': agent.nom,
                    'prenom': agent.prenom,
                    'email': agent.email,
                    'entite': {
                        'id': agent.entite.id,
                        'nom': agent.entite.nom,
                        'type': agent.entite.type
                    } if agent.entite else None
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Erreur lors de la récupération des rôles: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SelectActiveRoleView(APIView):
    """
    Vue pour permettre à l'agent de sélectionner son rôle actif pour la session.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Sélectionner le rôle actif pour la session courante.
        
        Body parameters:
        - role_type: 'responsable', 'chef_parc', ou 'chauffeur'
        - profile_id: ID du profil spécifique
        """
        try:
            role_type = request.data.get('role_type')
            profile_id = request.data.get('profile_id')
            
            if not role_type or not profile_id:
                return Response({
                    'error': 'role_type et profile_id sont requis'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Vérifier que l'utilisateur a un agent associé
            try:
                agent = request.user.agent
            except Agent.DoesNotExist:
                return Response({
                    'error': 'Aucun agent trouvé pour cet utilisateur'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Construire la liste de tous les rôles disponibles pour cet agent
            from apps.core.models import ResponsableParc, ChefParcParc
            from django.db import models
            from django.utils import timezone
            
            today = timezone.now().date()
            available_roles = []
            
            # Collecter le rôle responsable (un seul profil possible)
            if hasattr(agent, 'responsable') and agent.responsable:
                responsable = agent.responsable
                active_parcs = ResponsableParc.objects.filter(
                    responsable=responsable,
                    date_debut__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                    parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                    available_roles.append({
                        'role_type': 'responsable',
                        'profile_id': responsable.id,
                        'nom': agent.nom,
                        'prenom': agent.prenom,
                        'entite': getattr(agent, 'entite', None),
                        'niveau_responsabilite': responsable.niveau_responsabilite,
                        'budget_autorise': responsable.budget_autorise,
                        'parc_ids': parc_ids,
                    })
            
            # Collecter le rôle chef de parc (un seul profil possible)
            if hasattr(agent, 'chef_parc') and agent.chef_parc:
                chef_parc = agent.chef_parc
                active_parcs = ChefParcParc.objects.filter(
                    chef_parc=chef_parc,
                    date_nomination__lte=today
                ).filter(
                    models.Q(date_fin__isnull=True) | models.Q(date_fin__gte=today)
                )
                
                if active_parcs.exists():
                    parc_ids = list(active_parcs.values_list('parc_id', flat=True))
                    available_roles.append({
                        'role_type': 'chef_parc',
                        'profile_id': chef_parc.id,
                        'nom': agent.nom,
                        'prenom': agent.prenom,
                        'entite': getattr(agent, 'entite', None),
                        'niveau_autorite': chef_parc.niveau_autorite,
                        'formation_securite': chef_parc.formation_securite,
                        'parc_ids': parc_ids,
                    })
            
            # Collecter le rôle chauffeur (un seul profil possible)
            if hasattr(agent, 'chauffeur') and agent.chauffeur:
                chauffeur = agent.chauffeur
                available_roles.append({
                    'role_type': 'chauffeur',
                    'profile_id': chauffeur.id,
                    'nom': agent.nom,
                    'prenom': agent.prenom,
                    'entite': getattr(agent, 'entite', None),
                    'numero_permis': chauffeur.numero_permis,
                    'date_obtention_permis': chauffeur.date_obtention_permis,
                    'type_permis': chauffeur.type_permis,
                    'date_expiration_permis': chauffeur.date_expiration_permis,
                    'nombre_points': chauffeur.nombre_points
                })
            
            # Valider que le rôle sélectionné existe dans la liste des rôles disponibles
            selected_role_data = None
            for role in available_roles:
                if role['role_type'] == role_type and role['profile_id'] == profile_id:
                    selected_role_data = role
                    break
            
            # Vérifier si un rôle valide a été trouvé
            if selected_role_data is None:
                return Response({
                    'error': 'Rôle invalide ou non autorisé pour cet agent',
                    'available_roles': available_roles
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Vérifier que l'agent a au moins un rôle spécialisé (restriction d'accès)
            if not available_roles:
                return Response({
                    'error': 'Accès refusé. Seuls les agents avec des rôles spécialisés peuvent accéder au système.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Stocker le rôle sélectionné dans la session
            request.session['active_role'] = selected_role_data
            request.session.save()
            
            return Response({
                'message': 'Rôle actif sélectionné avec succès',
                'active_role': selected_role_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Erreur lors de la sélection du rôle: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request):
        """
        Récupérer le rôle actif actuel de la session.
        """
        active_role = request.session.get('active_role')
        
        if active_role:
            return Response({
                'active_role': active_role
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'Aucun rôle actif sélectionné'
            }, status=status.HTTP_200_OK)
