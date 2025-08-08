# Dockerfile pour le frontend React avec Vite
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer toutes les dépendances (dev et production pour le développement)
RUN npm ci

# Copier le code source
COPY . .

# Exposer le port 5173 (port par défaut de Vite)
EXPOSE 5173

# Commande pour démarrer le serveur de développement
CMD ["npm", "run", "dev"]