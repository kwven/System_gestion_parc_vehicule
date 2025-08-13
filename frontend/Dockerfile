# Dockerfile pour le frontend React avec Vite
FROM node:18-alpine

# Variables d'environnement
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer toutes les dépendances avec cache optimisé
RUN npm ci --prefer-offline --no-audit

# Copier le code source
COPY . .

# Exposer le port 5173 (port par défaut de Vite)
EXPOSE 5173

# Commande pour démarrer le serveur de développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]