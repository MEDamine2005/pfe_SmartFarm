import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  apiLogin,
  apiLogout,
  controlIrrigation,
  deleteAlert,
  fetchAlerts,
  fetchChatMessages,
  fetchIrrigationState,
  fetchSensorData,
  fetchWeatherData,
  hasApiToken,
  markAlertRead as apiMarkAlertRead,
  sendChatMessage,
} from "../services/api";
import { areNotificationsEnabled, notify, showAlertToast } from "../utils/toast";

const AppContext = createContext(undefined);

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
    return saved && hasApiToken() ? JSON.parse(saved) : null;
  });
  const [sensorData, setSensorData] = useState(null);
  const [isLoadingSensors, setIsLoadingSensors] = useState(Boolean(currentUser));
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(Boolean(currentUser));
  const [irrigationState, setIrrigationState] = useState(null);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeRange, setTimeRange] = useState("24h");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const knownAlertIdsRef = useRef(new Set());
  const alertsBootstrappedRef = useRef(false);

  const login = async ({ email, password }) => {
    try {
      const user = await apiLogin({ email, password });
      setCurrentUser(user);
      window.localStorage.setItem("smartFarmUser", JSON.stringify(user));
      notify.success(`Bienvenue, ${user.name}`);
      return user;
    } catch (error) {
      notify.error(error.message || "Connexion impossible");
      throw error;
    }
  };

  const logout = async () => {
    await apiLogout().catch(() => undefined);
    setCurrentUser(null);
    setSensorData(null);
    setWeatherData(null);
    setIrrigationState(null);
    setAlerts([]);
    setChatMessages([]);
    knownAlertIdsRef.current = new Set();
    alertsBootstrappedRef.current = false;
    window.localStorage.removeItem("smartFarmUser");
    notify.info("Deconnexion reussie");
  };

  const refreshSensorData = async ({ silent = false } = {}) => {
    setIsLoadingSensors(true);
    try {
      setSensorData(await fetchSensorData());
      if (!silent) {
        notify.success("Donnees capteurs actualisees");
      }
    } catch (error) {
      setSensorData(null);
      if (!silent) {
        notify.error("Impossible de charger les capteurs");
      }
    } finally {
      setIsLoadingSensors(false);
    }
  };

  const refreshWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      setWeatherData(await fetchWeatherData());
    } catch (error) {
      setWeatherData(null);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const syncAlerts = useCallback(async (isInitial = false) => {
    try {
      const nextAlerts = await fetchAlerts();
      const knownIds = knownAlertIdsRef.current;
      const newAlerts = nextAlerts.filter((alert) => !knownIds.has(alert.id));

      knownAlertIdsRef.current = new Set(nextAlerts.map((alert) => alert.id));
      setAlerts(nextAlerts);

      if (!areNotificationsEnabled()) {
        return;
      }

      const toastHandlers = {
        onMarkRead: (id) => {
          apiMarkAlertRead(id).catch(() => undefined);
          setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)));
          notify.dismiss(`alert-${id}`);
        },
        onDismiss: (id) => {
          deleteAlert(id).catch(() => undefined);
          setAlerts((prev) => prev.filter((alert) => alert.id !== id));
          notify.dismiss(`alert-${id}`);
        },
      };

      if (isInitial && !alertsBootstrappedRef.current) {
        alertsBootstrappedRef.current = true;
        const unreadCount = nextAlerts.filter((alert) => !alert.read).length;
        if (unreadCount > 0) {
          notify.info(
            unreadCount === 1
              ? "1 alerte en attente sur le tableau de bord"
              : `${unreadCount} alertes en attente sur le tableau de bord`,
            { toastId: "alerts-summary" },
          );
        }
        return;
      }

      newAlerts
        .filter((alert) => !alert.read)
        .forEach((alert) => showAlertToast(alert, toastHandlers));
    } catch (error) {
      if (isInitial) {
        setAlerts([]);
      }
    }
  }, []);

  const toggleIrrigation = async () => {
    const nextIsIrrigating = !isIrrigating;
    setIsIrrigating(nextIsIrrigating);
    try {
      const nextState = await controlIrrigation(nextIsIrrigating ? "start" : "stop");
      setIrrigationState(nextState);
      notify.success(nextIsIrrigating ? "Irrigation demarree" : "Irrigation arretee");
    } catch (error) {
      setIsIrrigating(!nextIsIrrigating);
      notify.error("Commande irrigation echouee");
      throw error;
    }
  };

  const setIrrigationMode = async (mode) => {
    try {
      const nextState = await controlIrrigation(mode === "automatic" ? "auto" : "stop");
      setIrrigationState({ ...nextState, mode });
      setIsIrrigating(nextState.status === "on");
      notify.success(mode === "automatic" ? "Mode automatique active" : "Mode manuel active");
    } catch (error) {
      notify.error("Impossible de changer le mode irrigation");
      throw error;
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
      const answer = await sendChatMessage(message);
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
    } catch (error) {
      notify.warning("Assistant IA indisponible");
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "Connexion au backend impossible.",
          actions: [],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const markAlertRead = (id) => {
    apiMarkAlertRead(id).catch(() => undefined);
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)));
    notify.dismiss(`alert-${id}`);
  };

  const dismissAlert = (id) => {
    deleteAlert(id).catch(() => undefined);
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    notify.dismiss(`alert-${id}`);
    notify.info("Alerte ignoree");
  };

  useEffect(() => {
    if (!currentUser) {
      setIsLoadingSensors(false);
      setIsLoadingWeather(false);
      return undefined;
    }

    refreshSensorData({ silent: true });
    refreshWeatherData();
    fetchIrrigationState().then(setIrrigationState).catch(() => setIrrigationState(null));
    syncAlerts(true);
    fetchChatMessages().then(setChatMessages).catch(() => setChatMessages([]));

    const sensorInterval = setInterval(() => refreshSensorData({ silent: true }), 30000);
    const alertInterval = setInterval(() => syncAlerts(false), 45000);

    return () => {
      clearInterval(sensorInterval);
      clearInterval(alertInterval);
    };
  }, [currentUser?.id, syncAlerts]);

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
    refreshAlerts: syncAlerts,
    timeRange,
    setTimeRange,
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed((value) => !value),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
