from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


class TimestampedModel(models.Model):
    """
    Modèle abstrait qui ajoute automatiquement les champs created_at et updated_at.
    Tous les modèles du système héritent de ce modèle pour assurer une traçabilité temporelle.
    """
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")

    class Meta:
        abstract = True


class AuditableModel(TimestampedModel):
    """
    Modèle abstrait qui ajoute les champs de traçabilité utilisateur.
    Permet de savoir qui a créé et qui a modifié en dernier chaque enregistrement.
    """
    created_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.PROTECT,
        related_name='%(class)s_created',
        null=True,
        blank=True,
        verbose_name="Créé par"
    )
    updated_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.PROTECT,
        related_name='%(class)s_updated',
        null=True,
        blank=True,
        verbose_name="Modifié par"
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Surcharge de la méthode save pour automatiquement renseigner
        les champs created_by et updated_by si un utilisateur est fourni.
        """
        user = kwargs.pop('user', None)
        if user:
            if not self.pk:  # Nouvel objet
                self.created_by = user
            self.updated_by = user
        super().save(*args, **kwargs)


class SoftDeleteModel(models.Model):
    """
    Modèle abstrait qui implémente la suppression logique.
    Au lieu de supprimer physiquement les enregistrements, ils sont marqués comme supprimés.
    """
    is_deleted = models.BooleanField(default=False, verbose_name="Supprimé")
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de suppression")
    deleted_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.PROTECT,
        related_name='%(class)s_deleted',
        null=True,
        blank=True,
        verbose_name="Supprimé par"
    )

    class Meta:
        abstract = True

    def delete(self, user=None, *args, **kwargs):
        """
        Suppression logique : marque l'objet comme supprimé au lieu de le supprimer physiquement.
        """
        self.is_deleted = True
        self.deleted_at = timezone.now()
        if user:
            self.deleted_by = user
        self.save()

    def hard_delete(self, *args, **kwargs):
        """
        Suppression physique réelle de l'enregistrement.
        À utiliser avec précaution.
        """
        super().delete(*args, **kwargs)

    def restore(self):
        """
        Restaure un objet supprimé logiquement.
        """
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save()


class BaseModel(AuditableModel, SoftDeleteModel):
    """
    Modèle de base qui combine tous les comportements communs :
    - Horodatage automatique (TimestampedModel via AuditableModel)
    - Traçabilité utilisateur (AuditableModel)
    - Suppression logique (SoftDeleteModel)
    
    La plupart des modèles métier du système hériteront de ce modèle.
    """
    
    class Meta:
        abstract = True
