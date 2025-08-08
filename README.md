# Système de Gestion de Parc Véhicule

Guide de démarrage rapide pour développeurs

##  Démarrage du Backend (Django)

### 1. Configuration de l'environnement

```bash
# Cloner le projet
cd System_gestion_parc_vehicule/backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur Linux/Mac :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```
# changer .env
supprimer l’extension .example d’un fichier pour que les variables d’environnement soient prises en compte, ça veut dire qu’il faut renommer le fichier .env.example en .env

### 2. Configuration de la base de données

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser
```

### 3. Démarrer le serveur de développement

```bash
# Lancer le serveur Django
python manage.py runserver
```

Le backend sera accessible sur : **http://localhost:8000**

### 4. Tester le Backend

```bash
# Exécuter tous les tests
python manage.py test

# Tester un module spécifique
python manage.py test core
python manage.py test authentication

# Vérifier la couverture de code (optionnel)
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### 5. Accès à l'interface d'administration

Rendez-vous sur **http://localhost:8000/admin** et connectez-vous avec le superutilisateur créé.

## 🎨 Démarrage du Frontend (React)

 **Note importante** : Le frontend n'est pas encore entièrement configuré et nécessite des ajustements.

### 1. Installation des dépendances

```bash
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances npm
npm install
```

### 2. Démarrer le serveur de développement

```bash
# Lancer le serveur React
npm run dev
```

Le frontend sera accessible sur : **http://localhost:5173**


##  Résolution des problèmes courants

### Backend
- **Erreur de base de données** : Vérifiez que PostgreSQL est démarré
- **Erreur de migration** : Supprimez les fichiers de migration et recréez-les
- **Port occupé** : Changez le port avec `python manage.py runserver 8001`

### Frontend
- **Erreur npm install** : Supprimez `node_modules` et `package-lock.json`, puis relancez `npm install`
- **Port occupé** : Le serveur Vite changera automatiquement de port
- **Erreurs de build** : Vérifiez les imports et la syntaxe avec `npm run lint`

