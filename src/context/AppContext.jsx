import React, { createContext, useContext, useEffect, useState } from "react";
import {
  controlIrrigation,
  fetchIrrigationState,
  fetchSensorData,
  fetchWeatherData,
  getAIResponse,
} from "../services/mockData";

const AppContext = createContext(undefined);

const demoUsers = [
  { id: "farmer-1", name: "Fermier", email: "farmer@smartfarm.local", role: "farmer" },
  { id: "admin-1", name: "Admin", email: "admin@smartfarm.local", role: "admin" },
];

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = window.localStorage.getItem("smartFarmUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [sensorData, setSensorData] = useState(null);
  const [isLoadingSensors, setIsLoadingSensors] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [irrigationState, setIrrigationState] = useState(null);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeRange, setTimeRange] = useState("24h");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      role: "bot",
      content:
        "Bonjour! Je suis votre assistant Smart Farm. Je peux vous aider avec les capteurs, l'irrigation, la météo et les recommandations.",
      timestamp: new Date(),
      actions: [
        { label: "Etat irrigation", action: "irrigation_status", icon: "droplets" },
        { label: "Meteo", action: "weather", icon: "cloud" },
        { label: "Sol", action: "soil_status", icon: "thermometer" },
      ],
    },
  ]);
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      type: "warning",
      title: "Humidite du sol basse",
      message: "L'humidite du sol est descendue a 35%. Une irrigation pourrait etre necessaire.",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Previsions meteo",
      message: "Une pluie legere est prevue dans 3 jours. Envisagez de reporter l'irrigation.",
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
  ]);

  const login = async ({ email, password, role }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const user =
      demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase()) ||
      demoUsers.find((item) => item.role === role) ||
      demoUsers[0];

    if (!password || password.length < 4) {
      throw new Error("Mot de passe invalide");
    }

    setCurrentUser(user);
    window.localStorage.setItem("smartFarmUser", JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem("smartFarmUser");
  };

  const refreshSensorData = async () => {
    setIsLoadingSensors(true);
    try {
      setSensorData(await fetchSensorData());
    } finally {
      setIsLoadingSensors(false);
    }
  };

  const refreshWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      setWeatherData(await fetchWeatherData());
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const toggleIrrigation = async () => {
    const nextIsIrrigating = !isIrrigating;
    setIsIrrigating(nextIsIrrigating);
    try {
      setIrrigationState(await controlIrrigation(nextIsIrrigating ? "start" : "stop"));
    } catch (error) {
      setIsIrrigating(!nextIsIrrigating);
      throw error;
    }
  };

  const setIrrigationMode = async (mode) => {
    const nextState = await controlIrrigation(mode === "automatic" ? "auto" : "stop");
    setIrrigationState({ ...nextState, mode });
    setIsIrrigating(nextState.status === "on");
  };

  const sendMessage = async (message) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    const answer = getAIResponse(message);
    setChatMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: answer.response,
        actions: answer.actions,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  const markAlertRead = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)));
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    refreshSensorData();
    refreshWeatherData();
    fetchIrrigationState().then(setIrrigationState);
    const interval = setInterval(refreshSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    sensorData,
    isLoadingSensors,
    refreshSensorData,
    weatherData,
    isLoadingWeather,
    refreshWeatherData,
    irrigationState,
    isIrrigating,
    toggleIrrigation,
    setIrrigationMode,
    chatMessages,
    sendMessage,
    isTyping,
    alerts,
    markAlertRead,
    dismissAlert,
    timeRange,
    setTimeRange,
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed((value) => !value),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
