#!/bin/bash

# Script d'initialisation pour le système d'audit
echo "Initialisation du système d'audit..."

# Attendre que la base de données soit prête
echo "Attente de la base de données..."

# Appliquer les migrations pour l'audit
echo "Application des migrations d'audit..."
python manage.py migrate audit

# Configurer les triggers d'audit
echo "Configuration des triggers d'audit..."
python manage.py setup_audit_triggers

echo "Système d'audit initialisé avec succès!"