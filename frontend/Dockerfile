# Utiliser une image Node basée sur Debian (plus complète que Alpine)
FROM node:22-bullseye

# Variables d'environnement
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --prefer-offline --no-audit

# Copier le code source
COPY . .

# Exposer le port Vite (par défaut 5173)
EXPOSE 5173

# Lancer le serveur de dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]