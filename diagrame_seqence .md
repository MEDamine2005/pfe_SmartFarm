# Diagrammes de Sequence - Smart Farm

هاد الملف فيه diagrammes de sequence ديال المشروع كامل، مقسمين حسب الحالات الرئيسية باش يكونو واضحين فالتقرير/العرض.

> ملاحظة: الدياگرام مكتوب بـ Mermaid. إلا ما بانش مرسوم فـ VS Code، ثبت extension بحال **Markdown Preview Mermaid Support**.

---

## 1. Demarrage General du Systeme

```mermaid
sequenceDiagram
    autonumber
    actor Agriculteur
    actor Administrateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant DB as Base de donnees
    participant Arduino as Arduino UNO R3
    participant ESP as ESP8266 WiFi
    participant Capteurs as Capteurs
    participant Pompe as Pompe + Relais

    Arduino->>Capteurs: Initialiser DHT22, humidite sol, LDR, niveau eau
    Arduino->>ESP: Commandes AT + connexion WiFi
    ESP-->>Arduino: WiFi connecte

    Agriculteur->>Frontend: Ouvrir application
    Frontend->>API: GET /api/health
    API-->>Frontend: status = ok

    Administrateur->>Frontend: Ouvrir espace admin
    Frontend->>API: GET /api/health
    API-->>Frontend: API disponible
```

---

## 2. Authentification Utilisateur

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant User as users
    participant Token as api_tokens
    participant DB as Base de donnees

    Utilisateur->>Frontend: Saisir email + password
    Frontend->>API: POST /api/auth/login
    API->>User: Chercher user par email
    User->>DB: SELECT users WHERE email
    DB-->>User: user trouve
    API->>API: Verifier password Hash::check

    alt Identifiants valides
        API->>Token: Creer token API
        Token->>DB: INSERT api_tokens
        API-->>Frontend: token + user
        Frontend->>Frontend: Sauvegarder token
        Frontend-->>Utilisateur: Redirection dashboard
    else Identifiants invalides
        API-->>Frontend: 422 Invalid credentials
        Frontend-->>Utilisateur: Afficher erreur
    end
```

---

## 3. Verification Session / Profil Connecte

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Middleware as api.token Middleware
    participant Token as api_tokens
    participant User as users
    participant DB as Base de donnees

    Utilisateur->>Frontend: Entrer au dashboard
    Frontend->>API: GET /api/auth/me avec Bearer Token
    API->>Middleware: Verifier token
    Middleware->>Token: Chercher token_hash
    Token->>DB: SELECT api_tokens
    DB-->>Token: token + user_id

    alt Token valide
        Middleware->>User: Charger utilisateur
        User->>DB: SELECT users
        DB-->>User: donnees utilisateur
        API-->>Frontend: user connecte
        Frontend-->>Utilisateur: Afficher interface selon role
    else Token absent/expire
        API-->>Frontend: 401 Unauthenticated
        Frontend-->>Utilisateur: Retour login
    end
```

---

## 4. Envoi des Donnees Capteurs par la Maquette

```mermaid
sequenceDiagram
    autonumber
    participant DHT as DHT22
    participant Soil as Capteur humidite sol
    participant LDR as LDR
    participant Water as Capteur niveau eau
    participant Arduino as Arduino UNO R3
    participant ESP as ESP8266
    participant API as Laravel API
    participant IoT as IotController
    participant Systeme as SystemeIoT
    participant Capteurs as capteurs
    participant DB as Base de donnees

    Arduino->>DHT: Lire temperature + humidite air
    Arduino->>Soil: Lire humidite_sol via A0
    Arduino->>LDR: Lire luminosite via A1
    Arduino->>Water: Lire niveau_eau via A2
    Arduino->>Arduino: Convertir valeurs analogiques en %
    Arduino->>ESP: Envoyer JSON + X-IOT-KEY
    ESP->>API: POST /api/iot/readings
    API->>IoT: storeReadings()
    IoT->>IoT: Verifier X-IOT-KEY

    alt Cle IoT valide
        IoT->>Systeme: updateOrCreate arduino_id + esp8266_id
        Systeme->>DB: INSERT/UPDATE SystemeIoT
        IoT->>Capteurs: Creer readings temperature, humidite_air, humidite_sol, luminosite, niveau_eau
        Capteurs->>DB: INSERT capteurs
        IoT-->>API: readings_saved + commande pompe
        API-->>ESP: 201 JSON
        ESP-->>Arduino: Reponse backend
    else Cle IoT invalide
        API-->>ESP: 401 Invalid IoT key
        ESP-->>Arduino: Refus envoi
    end
```

---

## 5. Surveillance Dashboard - Dernieres Valeurs

```mermaid
sequenceDiagram
    autonumber
    actor Agriculteur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Middleware as api.token Middleware
    participant Capteurs as capteurs
    participant DB as Base de donnees

    Agriculteur->>Frontend: Ouvrir Dashboard / Capteurs
    Frontend->>API: GET /api/sensors avec Bearer Token
    API->>Middleware: Verifier token
    Middleware-->>API: Utilisateur authentifie
    API->>Capteurs: Charger dernieres valeurs par type
    Capteurs->>DB: SELECT capteurs ORDER BY timestamp DESC
    DB-->>Capteurs: temperature, humidite_air, humidite_sol, luminosite, niveau_eau
    API-->>Frontend: JSON latest sensors
    Frontend-->>Agriculteur: Afficher cards + indicateurs
```

---

## 6. Historique des Capteurs

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Capteurs as capteurs
    participant DB as Base de donnees

    Utilisateur->>Frontend: Choisir periode 24h / 7d / 30d
    Frontend->>API: GET /api/sensors/history?range=periode
    API->>API: Convertir range en nombre d'heures
    API->>Capteurs: Chercher lectures depuis date limite
    Capteurs->>DB: SELECT WHERE timestamp >= limite
    DB-->>Capteurs: liste lectures
    API-->>Frontend: historique capteurs
    Frontend-->>Utilisateur: Afficher graphique
```

---

## 7. Irrigation Manuelle - Activer Pompe

```mermaid
sequenceDiagram
    autonumber
    actor Agriculteur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Irrigation as IrrigationController
    participant Regle as reglerIrrigation
    participant PompeDB as pompe
    participant DB as Base de donnees
    participant ESP as ESP8266
    participant Arduino as Arduino UNO R3
    participant Relais as Module Relais 5V
    participant Pompe as Pompe miniature

    Agriculteur->>Frontend: Cliquer Activer pompe
    Frontend->>API: POST /api/irrigation action=activer
    API->>Irrigation: control()
    Irrigation->>Regle: Update active=true
    Regle->>DB: UPDATE reglerIrrigation
    Irrigation->>PompeDB: Update etat=true
    PompeDB->>DB: UPDATE pompe
    API-->>Frontend: pompe_etat=true
    Frontend-->>Agriculteur: Etat pompe ON

    ESP->>API: GET /api/iot/command
    API-->>ESP: pompe_etat=true
    ESP-->>Arduino: Commande ON
    Arduino->>Relais: Activer relais
    Relais->>Pompe: Alimenter pompe
```

---

## 8. Irrigation Manuelle - Desactiver Pompe

```mermaid
sequenceDiagram
    autonumber
    actor Agriculteur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Irrigation as IrrigationController
    participant Regle as reglerIrrigation
    participant PompeDB as pompe
    participant ESP as ESP8266
    participant Arduino as Arduino UNO R3
    participant Relais as Module Relais 5V
    participant Pompe as Pompe miniature

    Agriculteur->>Frontend: Cliquer Desactiver pompe
    Frontend->>API: POST /api/irrigation action=dasactiver
    API->>Irrigation: control()
    Irrigation->>Regle: active=false
    Irrigation->>PompeDB: etat=false
    API-->>Frontend: pompe_etat=false
    Frontend-->>Agriculteur: Etat pompe OFF

    ESP->>API: GET /api/iot/command
    API-->>ESP: pompe_etat=false
    ESP-->>Arduino: Commande OFF
    Arduino->>Relais: Desactiver relais
    Relais->>Pompe: Couper alimentation
```

---

## 9. Irrigation Automatique Selon Humidite du Sol

```mermaid
sequenceDiagram
    autonumber
    actor Agriculteur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Irrigation as IrrigationController
    participant Regle as reglerIrrigation
    participant Arduino as Arduino UNO R3
    participant ESP as ESP8266
    participant IoT as IotController
    participant Capteurs as capteurs
    participant PompeDB as pompe
    participant Relais as Relais
    participant Pompe as Pompe miniature

    Agriculteur->>Frontend: Activer mode automatique + seuil humidite
    Frontend->>API: POST /api/irrigation action=executer, seuil_humidite=40
    API->>Irrigation: control()
    Irrigation->>Regle: active=true, seuil_humidite=40
    API-->>Frontend: regle sauvegardee

    Arduino->>Arduino: Lire humidite_sol
    Arduino->>ESP: Envoyer humidite_sol
    ESP->>API: POST /api/iot/readings
    API->>IoT: Comparer humidite_sol avec seuil
    IoT->>Capteurs: Enregistrer lecture

    alt humidite_sol < seuil et niveau_eau suffisant
        IoT->>PompeDB: etat=true
        API-->>ESP: pompe_etat=true
        ESP-->>Arduino: ON
        Arduino->>Relais: Activer
        Relais->>Pompe: Pompe demarre
    else humidite_sol >= seuil
        IoT->>PompeDB: etat=false
        API-->>ESP: pompe_etat=false
        ESP-->>Arduino: OFF
        Arduino->>Relais: Desactiver
    end
```

---

## 10. Protection Niveau d'Eau Faible

```mermaid
sequenceDiagram
    autonumber
    participant Water as Capteur niveau eau
    participant Arduino as Arduino UNO R3
    participant ESP as ESP8266
    participant API as Laravel API
    participant IoT as IotController
    participant Alerte as alerte
    participant PompeDB as pompe
    participant Relais as Relais
    participant Pompe as Pompe miniature
    actor Agriculteur
    participant Frontend as React Frontend

    Arduino->>Water: Lire niveau_eau
    Arduino->>ESP: JSON niveau_eau
    ESP->>API: POST /api/iot/readings
    API->>IoT: Verifier niveau_eau

    alt niveau_eau < 15%
        IoT->>PompeDB: etat=false
        IoT->>Alerte: Creer alerte type=danger
        API-->>ESP: pompe_etat=false
        ESP-->>Arduino: OFF
        Arduino->>Relais: Couper pompe
        Relais->>Pompe: Stop
    else niveau_eau normal
        API-->>ESP: commande normale
    end

    Agriculteur->>Frontend: Ouvrir alertes
    Frontend->>API: GET /api/alerts
    API-->>Frontend: Alerte niveau eau faible
    Frontend-->>Agriculteur: Afficher danger
```

---

## 11. Gestion des Alertes

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Alerte as alerte
    participant DB as Base de donnees

    Utilisateur->>Frontend: Ouvrir page Alertes
    Frontend->>API: GET /api/alerts
    API->>Alerte: Charger alertes
    Alerte->>DB: SELECT alerte ORDER BY timestamp DESC
    DB-->>Alerte: liste alertes
    API-->>Frontend: alertes

    Utilisateur->>Frontend: Marquer une alerte comme lue
    Frontend->>API: PATCH /api/alerts/{id}/read
    API->>Alerte: lue=true
    Alerte->>DB: UPDATE alerte
    API-->>Frontend: alerte modifiee

    Utilisateur->>Frontend: Supprimer alerte
    Frontend->>API: DELETE /api/alerts/{id}
    API->>Alerte: delete()
    Alerte->>DB: DELETE alerte
    API-->>Frontend: 204 No Content
```

---

## 12. Donnees Meteo

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Meteo as donnerMeteo
    participant DB as Base de donnees

    Utilisateur->>Frontend: Ouvrir page Meteo
    Frontend->>API: GET /api/weather
    API->>Meteo: Derniere meteo
    Meteo->>DB: SELECT donnerMeteo ORDER BY timestamp DESC LIMIT 1
    DB-->>Meteo: temperature, himidite, precipitation
    API-->>Frontend: donnees meteo
    Frontend-->>Utilisateur: Afficher widget meteo

    Utilisateur->>Frontend: Ajouter/mettre a jour meteo
    Frontend->>API: POST /api/weather
    API->>Meteo: Creer donnerMeteo
    Meteo->>DB: INSERT donnerMeteo
    API-->>Frontend: meteo sauvegardee
```

---

## 13. Chat IA

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Chat as ChatController
    participant ChatIA as ChatIA
    participant DB as Base de donnees

    Utilisateur->>Frontend: Ecrire question
    Frontend->>API: POST /api/chat message
    API->>Chat: analyser question
    Chat->>Chat: Generer reponse selon mots-cles
    Chat->>ChatIA: Sauvegarder question + reponse
    ChatIA->>DB: INSERT ChatIA
    API-->>Frontend: reponse ChatIA
    Frontend-->>Utilisateur: Afficher reponse

    Utilisateur->>Frontend: Ouvrir historique chat
    Frontend->>API: GET /api/chat
    API->>ChatIA: Charger derniers messages
    ChatIA->>DB: SELECT ChatIA ORDER BY timestamp
    DB-->>ChatIA: historique
    API-->>Frontend: historique chat
```

---

## 14. Administration - Gestion Utilisateurs

```mermaid
sequenceDiagram
    autonumber
    actor Administrateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant AdminMW as admin Middleware
    participant User as users
    participant Agr as agriculteur
    participant Adm as administrateur
    participant DB as Base de donnees

    Administrateur->>Frontend: Ouvrir page utilisateurs
    Frontend->>API: GET /api/admin/users
    API->>AdminMW: Verifier role=administrateur

    alt Role administrateur
        API->>User: Charger users avec agriculteur/administrateur
        User->>DB: SELECT users + relations
        DB-->>User: liste utilisateurs
        API-->>Frontend: utilisateurs
        Frontend-->>Administrateur: Afficher tableau
    else Role non admin
        API-->>Frontend: 403 Admin access required
    end

    Administrateur->>Frontend: Creer utilisateur
    Frontend->>API: POST /api/admin/users
    API->>User: INSERT users
    alt role=agriculteur
        API->>Agr: INSERT agriculteur phone + ferme_id
    else role=administrateur
        API->>Adm: INSERT administrateur
    end
    API-->>Frontend: utilisateur cree
```

---

## 15. Administration - Systeme IoT

```mermaid
sequenceDiagram
    autonumber
    actor Administrateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Systeme as SystemeIoT
    participant DB as Base de donnees

    Administrateur->>Frontend: Ouvrir page SystemeIoT
    Frontend->>API: GET /api/admin/SystemeIoT
    API->>Systeme: Charger devices
    Systeme->>DB: SELECT SystemeIoT
    DB-->>Systeme: arduino_id, esp8266_id, etat
    API-->>Frontend: liste devices
    Frontend-->>Administrateur: Afficher etat maquette

    Administrateur->>Frontend: Modifier etat device
    Frontend->>API: PATCH /api/admin/SystemeIoT/{id}
    API->>Systeme: update arduino_id/esp8266_id/etat
    Systeme->>DB: UPDATE SystemeIoT
    API-->>Frontend: device modifie
```

---

## 16. Administration - Rapports

```mermaid
sequenceDiagram
    autonumber
    actor Administrateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant User as users
    participant Agr as agriculteur
    participant Adm as administrateur
    participant Alerte as alerte
    participant Capteurs as capteurs
    participant Pompe as pompe
    participant Repport as Repport
    participant DB as Base de donnees

    Administrateur->>Frontend: Ouvrir page Rapports
    Frontend->>API: GET /api/admin/reports
    API->>User: Compter users
    User->>DB: COUNT users
    API->>Agr: Compter agriculteurs
    Agr->>DB: COUNT agriculteur
    API->>Adm: Compter administrateurs
    Adm->>DB: COUNT administrateur
    API->>Alerte: Compter alertes non lues
    Alerte->>DB: COUNT alerte WHERE lue=false
    API->>Capteurs: Dernier capteur + count
    Capteurs->>DB: SELECT/COUNT capteurs
    API->>Pompe: Compter pompes actives
    Pompe->>DB: COUNT pompe WHERE etat=true
    API->>Repport: Compter Repport
    Repport->>DB: COUNT Repport
    API-->>Frontend: statistiques rapport
    Frontend-->>Administrateur: Afficher dashboard admin
```

---

## 17. Deconnexion

```mermaid
sequenceDiagram
    autonumber
    actor Utilisateur
    participant Frontend as React Frontend
    participant API as Laravel API
    participant Token as api_tokens
    participant DB as Base de donnees

    Utilisateur->>Frontend: Cliquer logout
    Frontend->>API: POST /api/auth/logout avec Bearer Token
    API->>Token: Supprimer token courant
    Token->>DB: DELETE api_tokens WHERE token_hash
    API-->>Frontend: Logged out
    Frontend->>Frontend: Supprimer token local
    Frontend-->>Utilisateur: Retour login
```

---

## 18. Resume des Acteurs et Responsabilites

| Acteur / Composant | Role |
|---|---|
| Agriculteur | Consulte capteurs, alertes, meteo, chat, controle irrigation |
| Administrateur | Gere utilisateurs, SystemeIoT, rapports |
| React Frontend | Interface utilisateur et appels API |
| Laravel API | Authentification, logique metier, validation, controle irrigation |
| Arduino UNO R3 | Lecture capteurs et commande relais |
| ESP8266 | Connexion WiFi et communication HTTP avec Laravel |
| Capteurs | DHT22, humidite sol, LDR, niveau eau |
| Pompe + Relais | Execution physique de l'irrigation |
| Base de donnees | Stockage users, capteurs, alertes, pompe, regles, IoT, rapports |