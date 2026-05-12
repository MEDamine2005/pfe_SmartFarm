# 🌱 SMART FARM - IoT Agriculture Management System

## 📌 Description

Dans le cadre de la modernisation du secteur agricole, l’intégration des technologies numériques devient essentielle pour améliorer la productivité et optimiser l’utilisation des ressources naturelles.

Le projet **Smart Farm** vise à concevoir un système intelligent basé sur **l’Internet des Objets (IoT)**, combiné avec une **application Web** et une **application Mobile**, permettant de surveiller et contrôler une exploitation agricole à distance.

Le système intègre également des services externes tels que :

- **WeatherAPI** : récupération des données météorologiques en temps réel.
- **Google Earth Engine** : analyse d’images satellitaires afin d’améliorer la prise de décision agricole.

L’objectif principal est d’assurer une meilleure gestion de l’irrigation, de la fertilisation, et du suivi général des cultures en utilisant des technologies modernes.

---

## 🚀 Fonctionnalités principales

- Gestion des parcelles agricoles (surface, type de sol, cultures).
- Suivi des capteurs IoT (humidité, température, etc.).
- Automatisation et planification de l’irrigation.
- Intégration météo via **WeatherAPI**.
- Analyse satellitaire via **Google Earth Engine**.
- Tableau de bord intelligent avec statistiques.
- Gestion des utilisateurs (Admin / Agriculteur).
- API REST sécurisée pour l’application mobile.
- Authentification sécurisée avec **Laravel Sanctum**.

---

## 🛠️ Technologies utilisées

### Backend
- Laravel 10
- PHP 8.2

### Frontend
- React 18
- Tailwind CSS

### Base de données
- MySQL 8

### Authentification
- Laravel Sanctum

---

## ✅ Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé :

- PHP >= 8.1
- Composer
- Node.js >= 18
- npm ou yarn
- MySQL 8
- Git

---

## ⚙️ Installation

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/votre-repo/projet.git
cd projet
```

### 2️⃣ Installer les dépendances backend

```bash
composer install
```

### 3️⃣ Configurer le fichier `.env`

```bash
cp .env.example .env
php artisan key:generate
```

Configurer ensuite votre base de données dans `.env` :

```env
DB_DATABASE=smartfarm
DB_USERNAME=root
DB_PASSWORD=
```

### 4️⃣ Lancer les migrations et seeders

```bash
php artisan migrate --seed
```

### 5️⃣ Installer les dépendances frontend

```bash
npm install
npm run build
```

### 6️⃣ Démarrer le serveur Laravel

```bash
php artisan serve
```

Le projet sera accessible sur :

```
http://localhost:8000
```

---

## 📂 Structure du projet

```
/app        -> Logique métier (Models, Controllers, Services)
/database   -> Migrations et Seeders
/resources  -> Vues, assets frontend
/routes     -> Définition des routes API et Web
/tests      -> Tests unitaires et fonctionnels
/public     -> Fichiers publics (images, build frontend)
```

---

## 📑 Documentation API

La documentation de l’API est disponible sur :

```
http://localhost:8000/api/documentation
```

---

## 🔐 Authentification

Le projet utilise **Laravel Sanctum** pour :

- Authentification API sécurisée
- Gestion des tokens utilisateurs
- Accès protégé aux endpoints

---

## 📌 Variables d’environnement importantes

Exemple de configuration dans `.env` :

```env
APP_NAME=SmartFarm
APP_URL=http://localhost:8000

WEATHER_API_KEY=your_weatherapi_key
GOOGLE_EARTH_ENGINE_KEY=your_google_key
```

---

## 🧪 Tests

Pour exécuter les tests :

```bash
php artisan test
```

---

## Captures d'ecran du systeme

### Espace Agriculteur

#### Login
![Login agriculteur](screen_shote/farmer/loginpage.png)

#### Tableau de bord
![Tableau de bord agriculteur](screen_shote/farmer/table_de_bord.png)
![Tableau de bord agriculteur 1](screen_shote/farmer/table_de_bord1.png)
![Tableau de bord agriculteur 2](screen_shote/farmer/table_de_board2.png)

#### Capteurs
![Page capteurs 1](screen_shote/farmer/page_capteurs1.png)
![Page capteurs 2](screen_shote/farmer/page_capteurs2.png)

#### Irrigation
![Irrigation agriculteur 1](screen_shote/farmer/irrigation1.png)
![Irrigation agriculteur 2](screen_shote/farmer/irrigation2.png)

#### Meteo
![Meteo agriculteur](screen_shote/farmer/meteo.png)
![Meteo agriculteur 1](screen_shote/farmer/meteo1.png)
![Meteo agriculteur 2](screen_shote/farmer/meteo2.png)

#### Chat IA
![Chat IA agriculteur](screen_shote/farmer/CHATia.png)
![Chat IA agriculteur 1](screen_shote/farmer/CHATia1.png)
![Chat IA agriculteur 2](screen_shote/farmer/CHATia2.png)

#### Parametres
![Parametres agriculteur](screen_shote/farmer/parametre.png)
![Parametres agriculteur 1](screen_shote/farmer/parametre1.png)

### Espace Administrateur

#### Gestion des utilisateurs
![Gestion utilisateurs](screen_shote/admin/utilisateure.png)

#### Systeme IoT
![Systeme IoT](screen_shote/admin/iot.png)
![Donnees IoT](screen_shote/admin/donnes_iot.png)
![Donnees IoT 1](screen_shote/admin/donnes_iot1.png)
![Donnees IoT 2](screen_shote/admin/donner_iot2.png)

#### Irrigation automatique
![Irrigation automatique admin](screen_shote/admin/irrigation_auto.png)

#### Rapports
![Rapports admin](screen_shote/admin/rapport.png)

---

## 👨‍💻 Auteur

- **MOHAMED AMINE KERMOUNE**
- 📧 2005070700322@ofppt-edu.ma

---

## 📜 Licence

Ce projet est développé dans un cadre académique et éducatif.  
Toute réutilisation doit citer l’auteur.




 e9286f37faf7a5875708b5b877226261dd978cdf
