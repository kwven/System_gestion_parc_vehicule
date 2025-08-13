from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'operation', 'table_name', 'schema_name', 'user_name', 'timestamp', 'ip_address')
    list_filter = ('operation', 'schema_name', 'table_name', 'timestamp')
    search_fields = ('user_name', 'table_name', 'schema_name')
    ordering = ('-timestamp',)
    readonly_fields = ('id', 'schema_name', 'table_name', 'operation', 'user_name', 'timestamp', 'old_values', 'new_values', 'ip_address')
    date_hierarchy = 'timestamp'
    
    def has_add_permission(self, request):
        # Empêcher l'ajout manuel de logs d'audit
        return False
    
    def has_change_permission(self, request, obj=None):
        # Empêcher la modification des logs d'audit
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Empêcher la suppression des logs d'audit
        return False