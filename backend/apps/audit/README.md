# Système d'Audit

Ce module fournit un système d'audit universel pour tracer toutes les modifications apportées aux données de l'application.

## Structure

### Table d'audit
La table `audit_log` enregistre :
- `schema_name` : Nom du schéma de la table
- `table_name` : Nom de la table modifiée
- `operation` : Type d'opération (INSERT, UPDATE, DELETE)
- `user_name` : Utilisateur ayant effectué l'opération
- `timestamp` : Horodatage de l'opération
- `old_values` : Anciennes valeurs (format JSON)
- `new_values` : Nouvelles valeurs (format JSON)
- `ip_address` : Adresse IP du client

### Fonction de trigger
La fonction `audit_trigger_function()` est automatiquement appelée lors des opérations INSERT, UPDATE et DELETE sur les tables configurées.

## Installation

1. Appliquer les migrations :
```bash
python manage.py migrate audit
```

2. Configurer les triggers d'audit :
```bash
python manage.py setup_audit_triggers
```

## Utilisation

Une fois configuré, le système d'audit fonctionne automatiquement. Toutes les modifications sont enregistrées dans la table `audit_log`.

### Consultation des logs
Les logs d'audit peuvent être consultés :
- Via l'interface d'administration Django
- En interrogeant directement le modèle `AuditLog`

```python
from apps.audit.models import AuditLog

# Obtenir tous les logs d'audit
logs = AuditLog.objects.all()

# Filtrer par table
logs_vehicule = AuditLog.objects.filter(table_name='core_vehicule')

# Filtrer par opération
logs_insert = AuditLog.objects.filter(operation='INSERT')
```

## Sécurité

Les logs d'audit sont en lecture seule dans l'interface d'administration pour préserver l'intégrité des données d'audit.