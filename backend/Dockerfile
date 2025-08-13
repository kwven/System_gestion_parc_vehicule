FROM python:3.11-slim
WORKDIR /app
# Installation des dépendances système
RUN apt-get update && apt-get install -y \
postgresql-client \
&& rm -rf /var/lib/apt/lists/*
# Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copie du code
COPY . .
# Port d'exposition
EXPOSE 8000
# Copie et rend le script exécutable
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh
# Commande par défaut : Utilise le script wait-for-db.sh avec 'db' comme hôte
CMD ["/wait-for-db.sh", "db", "python", "manage.py", "runserver","0.0.0.0:8000"]