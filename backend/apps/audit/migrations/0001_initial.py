from django.db import migrations, models
from django.contrib.postgres.fields import JSONField


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('schema_name', models.CharField(max_length=50)),
                ('table_name', models.CharField(max_length=50)),
                ('operation', models.CharField(max_length=10)),
                ('user_name', models.CharField(max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('old_values', JSONField(blank=True, null=True)),
                ('new_values', JSONField(blank=True, null=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
            ],
            options={
                'db_table': 'audit_log',
                'ordering': ['-timestamp'],
            },
        ),
        migrations.RunSQL(
            sql="""
            -- Trigger d'audit générique 
            CREATE OR REPLACE FUNCTION audit_trigger_function() 
            RETURNS TRIGGER AS $$ 
            BEGIN 
                INSERT INTO audit_log ( 
                    schema_name, table_name, operation, user_name, 
                    old_values, new_values, ip_address 
                ) VALUES ( 
                    TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP, current_user, 
                    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END, 
                    CASE WHEN TG_OP = 'INSERT' THEN row_to_json(NEW) 
                         WHEN TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END, 
                    inet_client_addr() 
                ); 
                RETURN COALESCE(NEW, OLD); 
            END; 
            $$ LANGUAGE plpgsql;
            """,
            reverse_sql="DROP FUNCTION IF EXISTS audit_trigger_function() CASCADE;"
        ),
    ]