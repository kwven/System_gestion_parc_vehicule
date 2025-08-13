from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.auth import get_user_model
#Table d'audit universelle pour tracer toutes les modifications
User = get_user_model()

class AuditLog(models.Model):
    id = models.AutoField(primary_key=True)
    schema_name = models.CharField(null=False,max_length=50)
    table_name = models.CharField(null=False,max_length=50)
    operation = models.CharField(null=False,max_length=10)
    user_name = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    old_values = JSONField(null=True, blank=True)
    new_values = JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'audit_log'
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.operation} on {self.schema_name}.{self.table_name} by {self.user_name}"