// Generate realistic sensor data with some variation
const generateSensorReading = (base, variance) => {
    return base + (Math.random() - 0.5) * variance * 2;
};
// Mock sensor data
export const mockSensorData = {
    temperature: Math.round(generateSensorReading(28, 5) * 10) / 10,
    humidity: Math.round(generateSensorReading(65, 15) * 10) / 10,
    soilMoisture: Math.round(generateSensorReading(42, 20) * 10) / 10,
    lightLevel: Math.round(generateSensorReading(650, 200)),
    uvIndex: Math.round(generateSensorReading(7, 3)),
    timestamp: new Date(),
};
// Mock weather data
export const mockWeatherData = {
    current: {
        temperature: Math.round(generateSensorReading(30, 8) * 10) / 10,
        humidity: Math.round(generateSensorReading(55, 20) * 10) / 10,
        condition: 'sunny',
        windSpeed: Math.round(generateSensorReading(12, 8)),
        uvIndex: Math.round(generateSensorReading(8, 3)),
        feelsLike: Math.round(generateSensorReading(32, 8) * 10) / 10,
        icon: 'sun',
    },
    forecast: [
        { date: new Date(), tempMax: 32, tempMin: 24, condition: 'Ensoleillé', precipChance: 5, icon: 'sun' },
        { date: new Date(Date.now() + 86400000), tempMax: 30, tempMin: 23, condition: 'Partiellement nuageux', precipChance: 15, icon: 'cloud-sun' },
        { date: new Date(Date.now() + 86400000 * 2), tempMax: 28, tempMin: 22, condition: 'Nuageux', precipChance: 35, icon: 'cloud' },
        { date: new Date(Date.now() + 86400000 * 3), tempMax: 26, tempMin: 21, condition: 'Pluie légère', precipChance: 65, icon: 'cloud-rain' },
        { date: new Date(Date.now() + 86400000 * 4), tempMax: 29, tempMin: 23, condition: 'Ensoleillé', precipChance: 10, icon: 'sun' },
    ],
};
// Mock irrigation state
export const mockIrrigationState = {
    status: 'off',
    mode: 'automatic',
    duration: 15,
    lastActivation: new Date(Date.now() - 3600000 * 6),
    nextScheduled: new Date(Date.now() + 3600000 * 4),
    waterSaved: 1240,
};
// Generate historical chart data
export const generateChartData = (baseValue, variance, points = 24) => {
    const data = [];
    const now = new Date();
    for (let i = points - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600000);
        const hour = time.getHours().toString().padStart(2, '0');
        data.push({
            time: `${hour}:00`,
            value: Math.round(generateSensorReading(baseValue, variance) * 10) / 10,
        });
    }
    return data;
};
// Mock history data
export const mockTemperatureHistory = generateChartData(28, 5, 24);
export const mockHumidityHistory = generateChartData(65, 15, 24);
export const mockSoilMoistureHistory = generateChartData(42, 20, 24);
export const mockLightHistory = generateChartData(650, 200, 24);
// AI Chat responses
export const aiResponses = [
    {
        trigger: ['état', 'status', 'irrigation'],
        response: "L'irrigation est actuellement en mode automatique. Le système surveille l'humidité du sol et active la pompe quand nécessaire. Dernière activation il y a 6 heures pendant 15 minutes.",
        actions: [
            { label: 'Activer irrigation', action: 'start_irrigation', icon: 'droplets' },
            { label: 'Modifier le mode', action: 'change_mode', icon: 'settings' },
        ],
    },
    {
        trigger: ['météo', 'temps', 'prévisions'],
        response: "Le temps est actuellement ensoleillé avec une température de 30°C. Les prévisions pour les 5 prochains jours montrent un temps variable. Une pluie légère est attendue dans 3 jours, ce qui pourrait affecter le calendrier d'irrigation.",
        actions: [
            { label: 'Voir détails météo', action: 'view_weather', icon: 'cloud' },
            { label: 'Ajuster irrigation', action: 'adjust_irrigation', icon: 'calendar' },
        ],
    },
    {
        trigger: ['sol', 'humidité', 'capteurs'],
        response: "L'humidité du sol est actuellement à 42%, ce qui est dans la zone acceptable. Le système recommande de surveiller les prochaines 48 heures. Si l'humidité descend sous 30%, une irrigation sera automatiquement déclenchée.",
        actions: [
            { label: 'Voir historique sol', action: 'view_soil_history', icon: 'chart-line' },
            { label: 'Modifier seuil', action: 'change_threshold', icon: 'sliders' },
        ],
    },
    {
        trigger: ['recommande', 'conseil', 'suggestion'],
        response: "Basé sur les données actuelles, je recommande d'activer l'irrigation demain matin entre 6h et 8h pour optimiser l'absorption d'eau. La température prévue sera élevée (32°C) et l'humidité du sol risque de chuter.",
        actions: [
            { label: "Programmer l'irrigation", action: 'schedule_irrigation', icon: 'calendar-plus' },
            { label: 'Ignorer', action: 'dismiss', icon: 'x' },
        ],
    },
    {
        trigger: ['eau', 'consommation', 'économie'],
        response: "Excellent travail! Le système a permis d'économiser 1240 litres d'eau ce mois-ci par rapport à un calendrier fixe. L'irrigation intelligente a réduit la consommation de 23%. Vos cultures sont en bonne santé!",
        actions: [
            { label: 'Voir statistiques', action: 'view_stats', icon: 'bar-chart' },
            { label: 'Rapport mensuel', action: 'monthly_report', icon: 'file-text' },
        ],
    },
];
// Get AI response based on user message
export const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    for (const rule of aiResponses) {
        if (rule.trigger.some(keyword => lowerMessage.includes(keyword))) {
            return { response: rule.response, actions: rule.actions };
        }
    }
    return {
        response: "Je suis là pour vous aider avec votre ferme intelligente. Vous pouvez me demander l'état de l'irrigation, les prévisions météo, l'humidité du sol, ou des recommandations. Par exemple: 'Quel est l'état de l'irrigation?' ou 'Quelles sont les prévisions météo?'",
        actions: [
            { label: "État irrigation", action: 'irrigation_status', icon: 'droplets' },
            { label: 'Météo', action: 'weather', icon: 'cloud' },
            { label: 'Sol', action: 'soil_status', icon: 'thermometer' },
        ],
    };
};
// API simulation functions
export const fetchSensorData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        ...mockSensorData,
        temperature: Math.round(generateSensorReading(28, 5) * 10) / 10,
        humidity: Math.round(generateSensorReading(65, 15) * 10) / 10,
        soilMoisture: Math.round(generateSensorReading(42, 20) * 10) / 10,
        lightLevel: Math.round(generateSensorReading(650, 200)),
        timestamp: new Date(),
    };
};
export const fetchWeatherData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockWeatherData;
};
export const fetchIrrigationState = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockIrrigationState;
};
export const controlIrrigation = async (action) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (action === 'start') {
        return { ...mockIrrigationState, status: 'on' };
    }
    else if (action === 'stop') {
        return { ...mockIrrigationState, status: 'off', lastActivation: new Date() };
    }
    else {
        return { ...mockIrrigationState, status: 'auto', mode: 'automatic' };
    }
};
export const fetchChartData = async (type, range) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const points = range === '24h' ? 24 : range === '7d' ? 7 * 24 : 30 * 24;
    const baseValue = type === 'temperature' ? 28 : type === 'humidity' ? 65 : type === 'soil' ? 42 : 650;
    const variance = type === 'temperature' ? 5 : type === 'humidity' ? 15 : type === 'soil' ? 20 : 200;
    return generateChartData(baseValue, variance, points);
};
