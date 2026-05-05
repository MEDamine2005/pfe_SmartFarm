import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchSensorData,
  fetchWeatherData,
  fetchIrrigationState,
  controlIrrigation,
} from "../services/mockData";
import { generateFarmResponse } from "../services/gemini";

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState(null);
  const [isLoadingSensors, setIsLoadingSensors] = useState(true);

  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  const [irrigationState, setIrrigationState] = useState(null);
  const [isIrrigating, setIsIrrigating] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      role: "bot",
      content:
        "Bonjour! Je suis votre assistant Smart Farm. Je réponds uniquement aux sujets agricoles (irrigation, météo, sol, cultures). Posez votre question.",
      timestamp: new Date(),
      actions: [
        { label: "État irrigation", action: "irrigation_status", icon: "droplets" },
        { label: "Météo", action: "weather", icon: "cloud" },
        { label: "Sol", action: "soil_status", icon: "thermometer" },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: "1",
      type: "warning",
      title: "Humidité du sol basse",
      message: "L'humidité du sol est descendue à 35%. Une irrigation pourrait être nécessaire.",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Prévisions météo",
      message: "Une pluie légère est prévue dans 3 jours. Envisagez de reporter l irrigation.",
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
  ]);

  const [timeRange, setTimeRange] = useState("24h");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshSensorData = async () => {
    setIsLoadingSensors(true);
    try {
      const data = await fetchSensorData();
      setSensorData(data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    } finally {
      setIsLoadingSensors(false);
    }
  };

  const refreshWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchWeatherData();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const toggleIrrigation = async () => {
    const action = isIrrigating ? "stop" : "start";
    setIsIrrigating(!isIrrigating);

    try {
      const newState = await controlIrrigation(action);
      setIrrigationState(newState);
    } catch (error) {
      console.error("Error controlling irrigation:", error);
      setIsIrrigating(!isIrrigating);
    }
  };

  const setIrrigationMode = async (mode) => {
    try {
      const action = mode === "automatic" ? "auto" : "stop";
      const newState = await controlIrrigation(action);
      setIrrigationState({ ...newState, mode });
    } catch (error) {
      console.error("Error setting irrigation mode:", error);
    }
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

    try {
      const content = await generateFarmResponse(message, {
        sensorData,
        weatherData,
        irrigationState,
        alerts,
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      const botErrorMessage = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content:
          `Impossible de contacter Gemini. Détail: ${reason}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botErrorMessage]);
      console.error("Error while generating Gemini response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const markAlertRead = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)));
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    refreshSensorData();
    refreshWeatherData();
    fetchIrrigationState().then(setIrrigationState);

    const interval = setInterval(refreshSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
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
    toggleSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
