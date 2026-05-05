HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

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

## 👨‍💻 Auteur

- **MOHAMED AMINE KERMOUNE**
- 📧 2005070700322@ofppt-edu.ma

---

## 📜 Licence

Ce projet est développé dans un cadre académique et éducatif.  
Toute réutilisation doit citer l’auteur.




 e9286f37faf7a5875708b5b877226261dd978cdf
