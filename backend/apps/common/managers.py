from django.db import models


class SoftDeleteManager(models.Manager):
    """
    Manager personnalisé pour les modèles avec suppression logique.
    Par défaut, exclut les objets supprimés des requêtes.
    """
    
    def get_queryset(self):
        """Retourne seulement les objets non supprimés."""
        return super().get_queryset().filter(is_deleted=False)
    
    def with_deleted(self):
        """Retourne tous les objets, y compris ceux supprimés."""
        return super().get_queryset()
    
    def deleted_only(self):
        """Retourne seulement les objets supprimés."""
        return super().get_queryset().filter(is_deleted=True)


class ActiveManager(models.Manager):
    """
    Manager pour les modèles qui ont un champ is_active.
    Par défaut, retourne seulement les objets actifs.
    """
    
    def get_queryset(self):
        """Retourne seulement les objets actifs."""
        return super().get_queryset().filter(is_active=True)
    
    def inactive(self):
        """Retourne seulement les objets inactifs."""
        return super().get_queryset().filter(is_active=False)
    
    def all_objects(self):
        """Retourne tous les objets, actifs et inactifs."""
        return super().get_queryset()


class ParcRelatedManager(models.Manager):
    """
    Manager pour les modèles liés aux parcs.
    Fournit des méthodes pour filtrer par parc et par utilisateur.
    """
    
    def for_user(self, user):
        """
        Retourne les objets accessibles à un utilisateur donné
        basé sur les parcs qu'il peut superviser.
        """
        if not hasattr(user, 'get_accessible_parc_ids'):
            return self.none()
        
        accessible_parc_ids = user.get_accessible_parc_ids()
        return self.filter(parc_id__in=accessible_parc_ids)
    
    def for_parc(self, parc):
        """Retourne les objets liés à un parc spécifique."""
        return self.filter(parc=parc)
    
    def for_parcs(self, parcs):
        """Retourne les objets liés à une liste de parcs."""
        return self.filter(parc__in=parcs)


class TimestampedManager(models.Manager):
    """
    Manager pour les modèles avec horodatage.
    Fournit des méthodes de filtrage par date.
    """
    
    def created_today(self):
        """Retourne les objets créés aujourd'hui."""
        from django.utils import timezone
        today = timezone.now().date()
        return self.filter(created_at__date=today)
    
    def created_this_week(self):
        """Retourne les objets créés cette semaine."""
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        return self.filter(created_at__date__gte=week_start)
    
    def created_this_month(self):
        """Retourne les objets créés ce mois."""
        from django.utils import timezone
        
        today = timezone.now().date()
        month_start = today.replace(day=1)
        return self.filter(created_at__date__gte=month_start)
    
    def updated_since(self, date):
        """Retourne les objets modifiés depuis une date donnée."""
        return self.filter(updated_at__gte=date)


class BaseManager(SoftDeleteManager, ParcRelatedManager, TimestampedManager):
    """
    Manager de base qui combine toutes les fonctionnalités communes.
    Peut être utilisé pour les modèles qui héritent de BaseModel.
    """
    pass
