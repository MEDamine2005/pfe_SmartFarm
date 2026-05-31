# Chapitre 4 — Tests et validation

## 4.1 Stratégie de test

La stratégie de test du projet **Smart Farm** repose sur une approche en pyramide adaptée à une application full-stack IoT :

| Niveau | Objectif | Outils |
|--------|----------|--------|
| **Tests unitaires** | Valider des composants isolés | PHPUnit (Laravel) |
| **Tests fonctionnels / API** | Valider les parcours métier (auth, capteurs, IoT, irrigation) | PHPUnit Feature tests |
| **Tests d’intégration** | Vérifier la chaîne Frontend ↔ API ↔ Base de données | Tests manuels + Postman / navigateur |
| **Tests matériels** | Valider l’ESP8266 et les capteurs | Moniteur série Arduino, observation relais |
| **Analyse qualité** | Détecter bugs, code smells, dette technique | **SonarQube** + SonarScanner |

**Périmètre testé automatiquement (backend)** :
- Santé de l’API (`/api/health`)
- Authentification (login, token, routes protégées)
- Capteurs (dernières valeurs, historique)
- IoT ESP8266 (envoi readings, clé device, commande pompe)
- Irrigation (activation / désactivation, mode automatique)

**Périmètre validé manuellement** :
- Interface React (navigation, rôles farmer/admin, toasts)
- Connexion WiFi ESP8266 → API Laravel sur IP locale
- Affichage temps réel des données après envoi IoT

---

## 4.2 Tests fonctionnels

### 4.2.1 Matrice des tests API (PHPUnit)

| ID | Fonctionnalité | Endpoint | Résultat attendu |
|----|----------------|----------|------------------|
| TF-01 | Santé API | `GET /api/health` | 200, `status: ok` |
| TF-02 | Login valide | `POST /api/auth/login` | 200 + token |
| TF-03 | Login invalide | `POST /api/auth/login` | 422 |
| TF-04 | Route protégée sans token | `GET /api/sensors` | 401 |
| TF-05 | Capteurs authentifié | `GET /api/sensors` | 200 + données |
| TF-06 | Historique capteurs | `GET /api/sensors/history` | 200 + liste |
| TF-07 | Envoi IoT | `POST /api/iot/readings` | 201, 5 capteurs en BDD |
| TF-08 | Clé IoT invalide | `GET /api/iot/command` | 401 |
| TF-09 | Irrigation ON/OFF | `POST /api/irrigation` | pompe activée / désactivée |
| TF-10 | Irrigation auto seuil | `POST /api/iot/readings` | `pompe_etat: true` si sol < seuil |

### 4.2.2 Scénarios fonctionnels interface (manuel)

| ID | Scénario | Étapes | Critère de succès |
|----|----------|--------|-------------------|
| UI-01 | Connexion fermier | Login farmer@smartfarm.local | Dashboard affiché |
| UI-02 | Connexion admin | Login admin@smartfarm.local | Menu administration |
| UI-03 | Actualisation capteurs | Bouton refresh header | Valeurs mises à jour |
| UI-04 | Contrôle irrigation | Activer / arrêter pompe | Toast + état pompe |
| UI-05 | Alertes | Réception alerte IoT | Toast + panneau alertes |

### 4.2.3 Scénario IoT (maquette)

1. ESP8266 connecté au WiFi `mart_farm`
2. Envoi POST vers `http://IP_PC:8000/api/iot/readings` toutes les 15 s
3. Vérification Serial Monitor : code HTTP 201
4. Vérification frontend : humidité / température mises à jour
5. Si sol sec + mode auto : relais activé (`pompe_etat: true`)

---

## 4.3 Résultats des tests

### Exécution PHPUnit

```bash
cd backend
php artisan test
```

**Fichiers de tests** (`backend/tests/Feature/`) :
- `ExampleTest.php` — health check
- `AuthApiTest.php` — authentification
- `SensorApiTest.php` — capteurs
- `IotApiTest.php` — module ESP8266
- `IrrigationApiTest.php` — irrigation

**Derniere execution** : **13 tests reussis**, 35 assertions (PHPUnit, SQLite en memoire).

**Commande avec couverture (pour SonarQube)** :

```bash
cd backend
php artisan test --coverage-clover=build/coverage/clover.xml
```

Ou depuis la racine :

```powershell
.\scripts\run-tests-and-sonar.ps1
```

### Analyse SonarQube

**Prérequis** :
1. Serveur SonarQube (Docker ou installation locale) : https://www.sonarqube.org/
2. SonarScanner CLI : https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/

**Configuration** : fichier `sonar-project.properties` à la racine du projet.

**Lancer l’analyse** :

```bash
# 1. Tests + couverture
cd backend && php artisan test --coverage-clover=build/coverage/clover.xml

# 2. Analyse (depuis la racine smart-farm-web)
sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=VOTRE_TOKEN
```

**Métriques typiques observées dans SonarQube** :
- **Bugs** et **Vulnerabilities** (OWASP, injection, secrets)
- **Code Smells** (complexité, duplication)
- **Coverage** (% lignes couvertes par PHPUnit)
- **Duplications** entre fichiers React / PHP

*(Insérer ici une capture d’écran du tableau de bord SonarQube après votre première analyse.)*

---

## 4.4 Validation du projet

### 4.4.1 Critères de validation fonctionnelle

| Critère | Statut | Preuve |
|---------|--------|--------|
| Authentification farmer / admin | Validé | Tests TF-02 à TF-04 |
| Réception données ESP8266 | Validé | Tests TF-07, TF-10 |
| Affichage capteurs sur le web | Validé | Tests TF-05, UI-03 |
| Commande pompe (auto + manuel) | Validé | TF-09, TF-10 |
| Gestion des alertes | Validé | Création alerte IoT + UI-05 |
| Espace administration | Validé | Tests manuels admin |

### 4.4.2 Critères de validation technique

| Critère | Statut |
|---------|--------|
| API REST documentée (`backend/SMART_FARM_API.md`) | OK |
| Séparation Frontend / Backend / IoT | OK |
| Persistance MySQL | OK |
| Tests automatisés passants | OK (PHPUnit) |
| Analyse qualité SonarQube configurée | OK (`sonar-project.properties`) |

### 4.4.3 Limites et améliorations futures

- Pas de tests E2E automatisés (Cypress / Playwright) sur le frontend
- Météo : données en base, WeatherAPI non branchée en production
- Chatbot : réponses par mots-clés, pas de LLM externe
- Couverture de code : à augmenter sur les contrôleurs Admin et Weather

### 4.4.4 Conclusion

Le projet **Smart Farm** répond aux objectifs du cahier des charges : collecte IoT, stockage, visualisation web, irrigation intelligente et alertes. Les **tests fonctionnels PHPUnit** valident le cœur métier de l’API, et **SonarQube** permet un suivi continu de la qualité du code pour le rapport et la soutenance.

---

## Annexe — Commandes rapides

```bash
# Tests
cd backend && php artisan test

# Build frontend
npm run build

# SonarQube (après installation)
sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=XXX
```
