from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps


class Command(BaseCommand):
    help = 'Configure les triggers d\'audit pour toutes les tables'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Obtenir toutes les tables des modèles Django
            tables_to_audit = []
            
            for model in apps.get_models():
                # Exclure la table audit_log elle-même
                if model._meta.db_table != 'audit_log':
                    tables_to_audit.append(model._meta.db_table)
            
            self.stdout.write(f"Configuration des triggers d'audit pour {len(tables_to_audit)} tables...")
            
            for table_name in tables_to_audit:
                try:
                    # Supprimer le trigger existant s'il existe
                    cursor.execute(f"""
                        DROP TRIGGER IF EXISTS audit_trigger ON {table_name};
                    """)
                    
                    # Créer le nouveau trigger
                    cursor.execute(f"""
                        CREATE TRIGGER audit_trigger
                        AFTER INSERT OR UPDATE OR DELETE ON {table_name}
                        FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
                    """)
                    
                    self.stdout.write(
                        self.style.SUCCESS(f'Trigger d\'audit configuré pour la table: {table_name}')
                    )
                    
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Erreur lors de la configuration du trigger pour {table_name}: {e}')
                    )
            
            self.stdout.write(
                self.style.SUCCESS('Configuration des triggers d\'audit terminée!')
            )