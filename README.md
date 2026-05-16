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

## Lancement complet Web + Backend + Maquette IoT

### 1. Backend Laravel

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --host=0.0.0.0 --port=8000
```

Important dans `backend/.env` :

```env
APP_URL=http://localhost:8000
DB_DATABASE=smart_farm
DB_USERNAME=root
DB_PASSWORD=
IOT_DEVICE_KEY=smart-farm-iot-2026
```

Comptes demo :

- `farmer@smartfarm.local` / `1234`
- `admin@smartfarm.local` / `1234`

### 2. Frontend React

Dans un autre terminal :

```bash
npm install
npm run dev
```

Si besoin, cree `.env` dans la racine du projet :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Ouvre ensuite l'application sur l'URL Vite affichee, generalement :

```text
http://localhost:5173
```

### 3. Code ESP-12E 8266

Le code ESP-12E 8266 pret pour la maquette se trouve ici :

```text
arduino/smart_farm_esp12e_8266/smart_farm_esp12e_8266.ino
```

Avant de televerser, modifie ces valeurs :

```cpp
const char* ssid = "mart_farm";
const char* password = "12345678";
const char* serverName = "http://IP_DE_TON_PC:8000/api/iot/readings";
```

Pour trouver `IP_DE_TON_PC` sous Windows :

```powershell
ipconfig
```

Prends l'adresse `IPv4` de la carte WiFi, par exemple `192.168.43.205`. Le PC et l'ESP-12E doivent etre sur le meme WiFi.

### 4. Branchement de la maquette

| Module | ESP-12E 8266 |
| --- | --- |
| DHT22 data | D4 |
| Relais pompe IN | D5 |
| Humidite sol AO | A0 |
| LDR digital | D1 |
| Niveau eau digital | D2 |
| GND commun | GND ESP + GND alimentation capteurs |

Notes importantes :

- ESP-12E doit etre alimente correctement selon ta carte: beaucoup de cartes NodeMCU acceptent `5V USB`, mais la puce travaille en `3.3V`.
- Le relais dans ce code est active avec `LOW` et desactive avec `HIGH`.
- Lance Laravel avec `--host=0.0.0.0` pour que l'ESP-12E puisse joindre ton PC.
- Si Windows Firewall demande une autorisation pour PHP/Laravel, accepte le reseau prive.

### 5. Test rapide sans ESP

Tu peux tester l'endpoint IoT depuis le PC :

```bash
curl -X POST http://127.0.0.1:8000/api/iot/readings ^
  -H "Content-Type: application/json" ^
  -d "{\"temperature\":27.5,\"humidite_air\":60,\"humidite_sol\":35,\"luminosite\":1,\"niveau_eau\":1}"
```

Si la reponse contient `readings_saved`, la liaison backend IoT est correcte.

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




 
