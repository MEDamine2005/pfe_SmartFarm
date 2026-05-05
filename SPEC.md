# SPEC.md - Smart Farm Web Application

## 1. Concept & Vision

**Smart Farm** est une plateforme de gestion agricole intelligente qui transforme la surveillance et le contrôle des exploitations agricoles. L'interface évoque une **station de contrôle futuriste** avec des immersives et une interaction fluide. L'expérience utilisateur est pensée pour ressembler à un tableau de bord de mission spatiale - chaque donnée est une information vitale, chaque action est précise et instantanée.

L'application combine la robustesse d'un système industriel avec l'élégance d'une interface moderne, créant une sensation de **contrôle total** et de **connexion intime** avec sa ferme.

## 2. Design Language

### Aesthetic Direction
**"Mission Control meets Organic Farming"** - Une fusion entre l'esthétique des centres de commande spatial et la chaleur naturelle de l'agriculture. Inspiré des interfaces de la NASA avec des touches de vert et d'orange rappelant les champs et le soleil.

### Color Palette
- **Primary (Vert Foncé):** #1B4D3E - La forêt, la vie, la croissance
- **Secondary (Vert Clair):** #4ADE80 - La fraîcheur, les jeunes pousses
- **Accent (Ambre):** #F59E0B - Le soleil, l'énergie, les alertes positives
- **Warning (Orange):** #EF4444 - Les alertes, les actions critiques
- **Background Principal:** #0F172A - Profond, professionnel
- **Background Secondaire:** #1E293B - Élégant, lisible
- **Background Card:** #334155 - Information, support
- **Text Primary:** #F8FAFC - Claire, lisible
- **Text Secondary:** #94A3B8 - Subtile, informative

### Typography
- **Headings:** "Space Grotesk" - Sci-fi moderne, technique mais accessible
- **Body:** "Inter" - Lisibilité optimale pour les données
- **Mono (données):** "JetBrains Mono" - Données techniques, valeurs

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 8px (cards), 12px (modals), 24px (large containers)
- Shadows: subtle glow effects with color matching

### Motion Philosophy
- **Entrées:** Fade + slide up, 300ms ease-out, staggered 50ms
- **Hover:** Scale 1.02, glow effect, 200ms
- **Transitions de données:** Smooth value interpolation, 500ms
- **Actions:** Ripple effect, 150ms
- **Alertes:** Pulse animation, subtle glow

### Visual Assets
- **Icons:** Lucide React - cohérent, lisible, moderne
- **Graphiques:** Recharts avec animations fluides
- **Décor:** Lignes de grille subtiles, particules flottantes, gradients

## 3. Layout & Structure

### Architecture de la Page
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Logo + Navigation + Status + Profile             │
├─────────┬───────────────────────────────────────────────────┤
│         │  MAIN CONTENT AREA                               │
│  SIDE   │  ┌─────────────────────────────────────────────┐  │
│  NAV    │  │  Hero Stats (4 cards)                       │  │
│         │  ├─────────────────────────────────────────────┤  │
│  • Home │  │  Charts Section (2 colonnes)                 │  │
│  • Capteurs │  │  • Température & Humidité              │  │
│  • Irrigation │  │  • Humidité du Sol & Précipitations│  │
│  • Météo │  └─────────────────────────────────────────────┘  │
│  • Chat IA │  ├─────────────────────────────────────────────┤  │
│  • Paramètres │  │  Zone de contrôle irrigation + actions  │  │
│         │  └─────────────────────────────────────────────┘  │
└─────────┴───────────────────────────────────────────────────┘
```

### Responsive Strategy
- **Desktop (>1280px):** Layout complet avec sidebar
- **Tablet (768-1280px):** Sidebar collapsible, cards empilées
- **Mobile (<768px):** Navigation bottom, full-width cards, swipeable

## 4. Features & Interactions

### Dashboard Principal
- **Hero Stats Cards:** Température, Humidité Air, Humidité Sol, UV Index
  - Animation de valeur en temps réel
  - Indicateur de santé (vert/orange/rouge)
  - Click → drill-down vers détails

### Surveillance en Temps Réel
- **Graphiques interactifs:** Line charts avec tooltip au hover
- **Zones de seuils:** Highlight visuel quand valeurs critiques
- **Historique:** Sélecteur de période (24h, 7j, 30j)

### Contrôle Irrigation
- **Bouton ON/OFF avec animation**
- **Modes:** Manuel, Automatique, Programmé
- **Scheduler:** Sélection heure/durée
- **Feedback visuel:** Pompe active = animation pulse

### Intégration Météo
- **Widget météo actuel:** Icone dynamique, température, humidité
- **Prévisions 5 jours:** Cards scrollables
- **Alertes météo:** Notification si pluie prévue

### Chat IA Intelligent
- **Interface conversationnelle**
- **Suggestions rapides:** "État irrigation?", "Recommandation?", "Météo?"
- **Réponses contextuelles** basées sur données capteurs
- **Actions directes:** Boutons dans les réponses

### États et Feedback
- **Loading:** Skeleton cards avec shimmer
- **Empty:** Illustration + message encourageant
- **Error:** Toast notification + retry button
- **Success:** Confetti animation subtle

## 5. Component Inventory

### StatsCard
- **Default:** Valeur + label + icône + tendance
- **Hover:** Glow effect, scale 1.02
- **Critical:** Bordure rouge pulsante, icône alerte
- **Loading:** Skeleton avec shimmer

### ChartContainer
- **Default:** Graphique avec légende
- **Hover point:** Tooltip avec détails
- **Empty:** Message "Pas de données"
- **Loading:** Skeleton animé

### IrrigationControl
- **OFF:** Bouton gris, icône inactive
- **ON:** Bouton vert animé, pompe visible
- **Auto:** Badge "AUTO" + indicateur calendrier
- **Loading:** Spinner sur bouton

### WeatherWidget
- **Sunny:** Gradient orange, icône soleil animé
- **Rainy:** Gradient bleu, icône pluie
- **Cloudy:** Gradient gris, icône nuages
- **Loading:** Skeleton card

### ChatInterface
- **User message:** Aligné droite, background accent
- **Bot message:** Aligné gauche, background card
- **Typing:** Trois points animés
- **Action buttons:** Inline après messages bot

### Navigation
- **Item default:** Icône + label, opacity 0.7
- **Item hover:** Opacity 1, background highlight
- **Item active:** Background primary, texte blanc, indicateur

### Modal/Overlay
- **Backdrop:** Blur 8px, opacity 0.8
- **Container:** Slide up 300ms, scale 0.95→1
- **Close:** X button + click outside + Escape key

## 6. Technical Approach

### Stack
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Routing:** React Router v6
- **State:** React hooks + Context
- **HTTP:** Axios (simulé avec données mock)

### Data Flow
```
Mock API → Context (AppContext) → Components → UI
```

### Structure des Données
```typescript
interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
  timestamp: Date;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  forecast: ForecastDay[];
}

interface IrrigationState {
  status: 'on' | 'off' | 'auto';
  mode: 'manual' | 'automatic' | 'scheduled';
  lastActivation?: Date;
  nextScheduled?: Date;
}
```

### API Endpoints (Simulés)
- `GET /api/sensors` - Données capteurs
- `GET /api/weather` - Données météo
- `POST /api/irrigation` - Contrôle irrigation
- `GET /api/history` - Historique données
- `POST /api/chat` - Chat IA