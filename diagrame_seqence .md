# Diagrammes de Sequence — Smart Farm

4 scenarios principaux du systeme Smart Farm, representes avec **Mermaid**.

> Pour visualiser : ouvrir ce fichier en **Markdown Preview** (extension Mermaid recommandee).

### Acteurs du systeme

| Composant | Role |
|-----------|------|
| **Utilisateur** | Agriculteur ou administrateur |
| **Application Web** | Interface React |
| **Backend** | API Laravel |
| **Base de donnees** | MySQL |
| **Systeme IoT** | ESP8266 + capteurs + relais pompe |
| **WeatherAPI** | API externe meteo (optionnel) |
| **Chatbot IA** | Recommandations agricoles |

---

## Scenario 1 — Consultation des donnees de la ferme

L'utilisateur se connecte et consulte le tableau de bord. L'application Web recupere les dernieres valeurs capteurs stockees par le module IoT.

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant Web as Application Web (React)
    participant API as Backend (Laravel)
    participant DB as MySQL

    U->>Web: Saisir email + mot de passe
    Web->>API: POST /api/auth/login
    API->>DB: Verifier user + creer token
    DB-->>API: Utilisateur valide
    API-->>Web: token + role
    Web-->>U: Redirection dashboard

    U->>Web: Consulter capteurs / historique
    Web->>API: GET /api/sensors
    API->>DB: SELECT dernieres lectures
    DB-->>API: temperature, humidite_air, humidite_sol, luminosite, niveau_eau
    API-->>Web: JSON capteurs

    Web->>API: GET /api/sensors/history?range=24h
    API->>DB: SELECT capteurs par periode
    DB-->>API: historique
    API-->>Web: donnees graphiques

    Web-->>U: Afficher cards, graphiques et widgets
```

---

## Scenario 2 — Collecte IoT et enregistrement des capteurs

Le module ESP8266 lit les capteurs, envoie les donnees au backend, qui les enregistre et met a jour l'etat du device.

```mermaid
sequenceDiagram
    autonumber
    participant Cap as Capteurs
    participant IoT as ESP8266
    participant API as Backend (Laravel)
    participant DB as MySQL

    Cap->>IoT: Lire DHT22, sol (A0), LDR (D1), eau (D2)
    IoT->>IoT: Convertir valeurs en pourcentages

    IoT->>API: POST /api/iot/readings<br/>device_id + X-IOT-KEY
    API->>API: Verifier cle IoT

    alt Cle valide
        API->>DB: INSERT capteurs (5 types)
        API->>DB: UPDATE SystemeIoT (online)
        API->>API: Analyser humidite_sol et niveau_eau
        API-->>IoT: 201 + pompe_etat
        IoT->>IoT: Appliquer commande relais (D5)
    else Cle invalide
        API-->>IoT: 401 Unauthorized
    end
```

---

## Scenario 3 — Irrigation automatique (humidite faible)

Si l'humidite du sol est inferieure au seuil configure, le backend active la pompe via le systeme IoT.

```mermaid
sequenceDiagram
    autonumber
    participant IoT as ESP8266
    participant API as Backend (Laravel)
    participant DB as MySQL
    participant Relais as Relais + Pompe

    IoT->>API: POST /api/iot/readings<br/>humidite_sol = 28%
    API->>DB: SELECT reglerIrrigation (seuil = 40%)
    DB-->>API: mode auto actif

    alt humidite_sol < seuil ET niveau_eau >= 15%
        API->>DB: UPDATE pompe etat = true
        API->>DB: INSERT alerte (warning)
        API-->>IoT: pompe_etat = true
        IoT->>Relais: Activer relais — irrigation ON
    else humidite_sol >= seuil
        API->>DB: UPDATE pompe etat = false
        API-->>IoT: pompe_etat = false
        IoT->>Relais: Desactiver relais — irrigation OFF
    end

    Note over IoT,Relais: L'utilisateur peut aussi commander<br/>manuellement via POST /api/irrigation
```

---

## Scenario 4 — Meteo, alertes et chatbot

Le systeme affiche la meteo, notifie l'utilisateur en cas d'alerte, et genere des recommandations via le chatbot.

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant Web as Application Web (React)
    participant API as Backend (Laravel)
    participant DB as MySQL
    participant Meteo as WeatherAPI
    participant Bot as Chatbot IA

    Web->>API: GET /api/weather
    API->>DB: SELECT donnerMeteo

    opt Synchronisation externe
        API->>Meteo: GET previsions
        Meteo-->>API: temperature, precipitation
        API->>DB: INSERT donnerMeteo
    end

    DB-->>API: donnees meteo
    API-->>Web: JSON meteo
    Web-->>U: Widget meteo (Dashboard)

    Web->>API: GET /api/alerts
    API->>DB: SELECT alertes non lues
    DB-->>API: liste alertes
    API-->>Web: alertes
    Web-->>U: Toast + panneau alertes

    U->>Web: Question (irrigation, meteo, capteurs)
    Web->>API: POST /api/chat
    API->>DB: Lire contexte capteurs + regles
    API->>Bot: Generer recommandation
    Bot-->>API: reponse
    API->>DB: INSERT ChatIA
    API-->>Web: reponse chatbot
    Web-->>U: Afficher conseil agricole
```
