const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "smartFarmApiToken";

const normalizeRole = (role) => {
  if (role === "administrateur") return "admin";
  if (role === "agriculteur") return "farmer";
  return role;
};

const normalizeUser = (user) => ({
  ...user,
  role: normalizeRole(user?.role),
  rawRole: user?.role,
  name: user?.name || (normalizeRole(user?.role) === "admin" ? "Admin" : "Fermier"),
});

const getToken = () => window.localStorage.getItem(TOKEN_KEY);

export const hasApiToken = () => Boolean(getToken());

const setToken = (token) => {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};

const request = async (path, options = {}) => {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const token = getToken();
  if (token && options.auth !== false) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    error.isNetworkError = true;
    throw error;
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || "Erreur API");
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const apiLogin = async ({ email, password }) => {
  const payload = await request("/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password, device_name: "web" },
  });

  setToken(payload.token);
  return normalizeUser(payload.user);
};

export const apiLogout = async () => {
  try {
    await request("/auth/logout", { method: "POST" });
  } finally {
    setToken(null);
  }
};

const formatPointTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fetchSensorData = async () => {
  const payload = await request("/sensors");
  const data = payload.data || {};

  return {
    temperature: data.temperature ?? 0,
    humidity: data.humidite_air ?? 0,
    soilMoisture: data.humidite_sol ?? 0,
    lightLevel: data.luminosite ?? 0,
    waterLevel: data.niveau_eau ?? 0,
    uvIndex: Math.round((data.luminosite ?? 0) / 12),
    timestamp: data.capteurs?.[0]?.timestamp || new Date(),
  };
};

export const fetchSensorHistory = async (range = "24h") => {
  const payload = await request(`/sensors/history?range=${encodeURIComponent(range)}`);
  const history = payload.data || [];

  const byType = {
    temperature: [],
    humidite_air: [],
    humidite_sol: [],
    luminosite: [],
    niveau_eau: [],
  };

  history.forEach((reading) => {
    if (!byType[reading.type]) return;

    byType[reading.type].push({
      time: formatPointTime(reading.timestamp),
      value: Number(reading.valeur),
    });
  });

  return {
    temperature: byType.temperature,
    humidity: byType.humidite_air,
    soil: byType.humidite_sol,
    light: byType.luminosite,
    water: byType.niveau_eau,
  };
};

export const fetchWeatherData = async () => {
  const payload = await request("/weather");
  const data = payload.data || {};

  return {
    current: {
      temperature: data.temperature ?? 0,
      humidity: data.himidite ?? 0,
      condition: (data.precipitation ?? 0) > 40 ? "rainy" : "sunny",
      windSpeed: 0,
      uvIndex: 0,
      feelsLike: data.temperature ?? 0,
      icon: (data.precipitation ?? 0) > 40 ? "cloud-rain" : "sun",
    },
    forecast: [
      {
        date: new Date(data.timestamp || Date.now()),
        tempMax: data.temperature ?? 0,
        tempMin: data.temperature ?? 0,
        condition: (data.precipitation ?? 0) > 40 ? "Pluie" : "Ensoleille",
        precipChance: data.precipitation ?? 0,
        icon: (data.precipitation ?? 0) > 40 ? "cloud-rain" : "sun",
      },
    ],
  };
};

export const fetchWeatherHistory = async (range = "24h") => {
  const payload = await request(`/weather/history?range=${encodeURIComponent(range)}`);
  const history = payload.data || [];

  return {
    temperature: history.map((reading) => ({
      time: formatPointTime(reading.timestamp),
      value: Number(reading.temperature),
    })),
    precipitation: history.map((reading) => ({
      time: formatPointTime(reading.timestamp),
      value: Number(reading.precipitation),
    })),
    humidity: history.map((reading) => ({
      time: formatPointTime(reading.timestamp),
      value: Number(reading.himidite),
    })),
  };
};

export const fetchIrrigationState = async () => {
  const payload = await request("/irrigation");
  return normalizeIrrigation(payload.data);
};

export const controlIrrigation = async (action) => {
  const apiAction = action === "start" ? "executer" : action === "auto" ? "activer" : "dasactiver";
  const payload = await request("/irrigation", {
    method: "POST",
    body: { action: apiAction },
  });
  return normalizeIrrigation(payload.data);
};

const normalizeAlertType = (type) => {
  if (type === "danger") return "critical";
  if (type === "warning") return "warning";
  return "info";
};

const alertTitleForType = (type) => {
  if (type === "danger" || type === "critical") return "Alerte critique";
  if (type === "warning") return "Alerte irrigation";
  return "Information";
};

export const fetchAlerts = async () => {
  const payload = await request("/alerts");
  return (payload.data || []).map((alert) => {
    const type = normalizeAlertType(alert.type);
    return {
      id: String(alert.id),
      type,
      title: alertTitleForType(type),
      message: alert.message,
      timestamp: alert.timestamp,
      read: Boolean(alert.lue),
    };
  });
};

export const fetchChatMessages = async () => {
  const payload = await request("/chat");
  return (payload.data || []).flatMap((message) => [
    {
      id: `${message.id}-question`,
      role: "user",
      content: message.question,
      timestamp: message.timestamp,
    },
    {
      id: `${message.id}-response`,
      role: "bot",
      content: message.reponse,
      actions: [],
      timestamp: message.timestamp,
    },
  ]);
};

export const markAlertRead = (id) => request(`/alerts/${id}/read`, { method: "PATCH" });

export const deleteAlert = (id) => request(`/alerts/${id}`, { method: "DELETE" });

export const sendChatMessage = async (message) => {
  const payload = await request("/chat", {
    method: "POST",
    body: { message },
  });

  return {
    response: payload.data?.reponse || "Message envoye.",
    actions: [],
  };
};

const normalizeIrrigation = (data = {}) => {
  const regle = data.reglerIrrigation || {};
  const pompe = data.pompe || {};
  const isOn = Boolean(pompe.etat);

  return {
    status: isOn ? "on" : regle.active ? "auto" : "off",
    mode: regle.active ? "automatic" : "manual",
    duration: regle.dueree ?? 15,
    lastActivation: isOn ? new Date() : null,
    nextScheduled: null,
    waterSaved: 0,
    threshold: regle.seuil_humidite ?? 40,
    flowRate: pompe.dabit ?? 0,
  };
};
