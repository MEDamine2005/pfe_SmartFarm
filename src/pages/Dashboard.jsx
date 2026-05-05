import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, Wind, Activity, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatsCard, ChartContainer, WeatherWidget, IrrigationControl, AlertPanel } from '../components/ui';
import { generateChartData } from '../services/mockData';
const Dashboard = () => {
    const { sensorData, isLoadingSensors, weatherData, isLoadingWeather, irrigationState, alerts, markAlertRead, dismissAlert, timeRange, setTimeRange, } = useApp();
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [soilData, setSoilData] = useState([]);
    useEffect(() => {
        setTemperatureData(generateChartData(28, 5, timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720));
        setHumidityData(generateChartData(65, 15, timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720));
        setSoilData(generateChartData(42, 20, timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720));
    }, [timeRange]);
    const getSensorStatus = (value, type) => {
        if (type === 'temperature') {
            if (value > 35 || value < 15)
                return 'critical';
            if (value > 32 || value < 18)
                return 'warning';
            return 'normal';
        }
        if (type === 'humidity') {
            if (value > 90 || value < 20)
                return 'critical';
            if (value > 80 || value < 30)
                return 'warning';
            return 'normal';
        }
        if (type === 'soil') {
            if (value < 20)
                return 'critical';
            if (value < 30)
                return 'warning';
            return 'normal';
        }
        return 'normal';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Tableau de bord" }), _jsx("p", { className: "text-slate-400 mt-1", children: "Surveillance en temps r\u00E9el de votre exploitation" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-400", children: [_jsx(Activity, { className: "w-4 h-4 text-emerald-400 animate-pulse" }), _jsx("span", { children: "Mise \u00E0 jour automatique" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatsCard, { title: "Temp\u00E9rature", value: sensorData?.temperature ?? '--', unit: "\u00B0C", icon: Thermometer, status: sensorData ? getSensorStatus(sensorData.temperature, 'temperature') : 'normal', trend: "up", trendValue: "+2\u00B0C", isLoading: isLoadingSensors }), _jsx(StatsCard, { title: "Humidit\u00E9 Air", value: sensorData?.humidity ?? '--', unit: "%", icon: Droplets, status: sensorData ? getSensorStatus(sensorData.humidity, 'humidity') : 'normal', trend: "down", trendValue: "-5%", isLoading: isLoadingSensors }), _jsx(StatsCard, { title: "Humidit\u00E9 Sol", value: sensorData?.soilMoisture ?? '--', unit: "%", icon: Sun, status: sensorData ? getSensorStatus(sensorData.soilMoisture, 'soil') : 'normal', trend: "neutral", trendValue: "Stable", isLoading: isLoadingSensors }), _jsx(StatsCard, { title: "Indice UV", value: sensorData?.uvIndex ?? '--', unit: "", icon: Wind, status: sensorData && sensorData.uvIndex > 8 ? 'warning' : 'normal', trend: "up", trendValue: "\u00C9lev\u00E9", isLoading: isLoadingSensors })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(ChartContainer, { title: "Temp\u00E9rature", data: temperatureData, dataKey: "value", color: "#EF4444", unit: "\u00B0C", timeRange: timeRange, onTimeRangeChange: setTimeRange, isLoading: isLoadingSensors, fill: true }), _jsx(ChartContainer, { title: "Humidit\u00E9", data: humidityData, dataKey: "value", color: "#3B82F6", unit: "%", timeRange: timeRange, onTimeRangeChange: setTimeRange, isLoading: isLoadingSensors, fill: true })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(ChartContainer, { title: "Humidit\u00E9 du Sol", data: soilData, dataKey: "value", color: "#8B5CF6", unit: "%", timeRange: timeRange, onTimeRangeChange: setTimeRange, isLoading: isLoadingSensors, fill: true }) }), _jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20", children: _jsx(TrendingUp, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "\u00C9conomie d'eau" }), _jsx("p", { className: "text-sm text-slate-400", children: "Ce mois-ci" })] })] }), _jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "text-5xl font-bold text-white mb-2", children: irrigationState?.waterSaved ?? 0 }), _jsx("div", { className: "text-lg text-slate-400", children: "Litres \u00E9conomis\u00E9s" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-slate-400", children: "R\u00E9duction vs planning fixe" }), _jsx("span", { className: "text-emerald-400 font-semibold", children: "23%" })] }), _jsx("div", { className: "mt-2 h-2 bg-slate-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full", style: { width: '77%' } }) })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [weatherData && (_jsx(WeatherWidget, { current: weatherData.current, forecast: weatherData.forecast, isLoading: isLoadingWeather })), irrigationState && _jsx(IrrigationControl, { state: irrigationState }), _jsx(AlertPanel, { alerts: alerts, onMarkRead: markAlertRead, onDismiss: dismissAlert })] })] }));
};
export default Dashboard;
