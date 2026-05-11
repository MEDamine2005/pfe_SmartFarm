import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Droplets, Sun, Radio, Battery, Clock, Database, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChartContainer } from '../components/ui';
import { generateChartData } from '../services/mockData';
const SensorCard = ({ name, value, unit, icon: Icon, status, lastUpdate, description }) => {
    const statusStyles = {
        normal: 'border-emerald-500/30 bg-emerald-500/5',
        warning: 'border-amber-500/30 bg-amber-500/5',
        critical: 'border-red-500/30 bg-red-500/5',
    };
    const statusIndicator = {
        normal: 'bg-emerald-500',
        warning: 'bg-amber-500',
        critical: 'bg-red-500 animate-pulse',
    };
    return (_jsxs("div", { className: `bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border ${statusStyles[status]} transition-all duration-300`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${status === 'critical' ? 'bg-red-500/20' : status === 'warning' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`, children: _jsx(Icon, { className: `w-6 h-6 ${status === 'critical' ? 'text-red-400' : status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}` }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-semibold", children: name }), _jsx("p", { className: "text-sm text-slate-400", children: description })] })] }), _jsx("div", { className: `w-3 h-3 rounded-full ${statusIndicator[status]}` })] }), _jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "text-4xl font-bold text-white", children: value }), _jsx("span", { className: "ml-2 text-lg text-slate-400", children: unit })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: ["Mis \u00E0 jour ", new Date(lastUpdate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] })] }));
};
const SensorsPage = () => {
    const { sensorData, isLoadingSensors, refreshSensorData } = useApp();
    const [timeRange, setTimeRange] = useState('24h');
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [soilData, setSoilData] = useState([]);
    useEffect(() => {
        setTemperatureData(generateChartData(28, 5, timeRange === '24h' ? 24 : 168));
        setHumidityData(generateChartData(65, 15, timeRange === '24h' ? 24 : 168));
        setSoilData(generateChartData(42, 20, timeRange === '24h' ? 24 : 168));
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
        if (type === 'light') {
            if (value < 100 || value > 1000)
                return 'critical';
            if (value < 200 || value > 800)
                return 'warning';
            return 'normal';
        }
        return 'normal';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Capteurs" }), _jsx("p", { className: "text-slate-400 mt-1", children: "Donn\u00E9es en temps r\u00E9el des capteurs IoT" })] }), _jsxs("button", { onClick: refreshSensorData, disabled: isLoadingSensors, className: "flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white transition-all disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${isLoadingSensors ? 'animate-spin' : ''}` }), "Actualiser"] })] }), _jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Radio, { className: "w-6 h-6 text-emerald-400" }), _jsx("h2", { className: "text-xl font-semibold text-white", children: "Architecture IoT" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm mb-2", children: [_jsx(Database, { className: "w-4 h-4" }), _jsx("span", { children: "Microcontr\u00F4leur" })] }), _jsx("div", { className: "text-white font-semibold", children: "Arduino Uno" }), _jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Collecte des donn\u00E9es capteurs" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm mb-2", children: [_jsx(Radio, { className: "w-4 h-4" }), _jsx("span", { children: "Module WiFi" })] }), _jsx("div", { className: "text-white font-semibold", children: "ESP8266" }), _jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Transmission sans fil" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm mb-2", children: [_jsx(Battery, { className: "w-4 h-4" }), _jsx("span", { children: "Alimentation" })] }), _jsx("div", { className: "text-white font-semibold", children: "Solaire + Batterie" }), _jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Autonome en \u00E9nergie" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm mb-2", children: [_jsx(Activity, { className: "w-4 h-4" }), _jsx("span", { children: "Intervalle" })] }), _jsx("div", { className: "text-white font-semibold", children: "30 secondes" }), _jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Fr\u00E9quence de mesure" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(SensorCard, { name: "Temp\u00E9rature", value: sensorData?.temperature ?? 0, unit: "\u00B0C", icon: Thermometer, status: sensorData ? getSensorStatus(sensorData.temperature, 'temperature') : 'normal', lastUpdate: sensorData?.timestamp ?? new Date(), description: "Capteur de temp\u00E9rature DHT22" }), _jsx(SensorCard, { name: "Humidit\u00E9 Air", value: sensorData?.humidity ?? 0, unit: "%", icon: Droplets, status: sensorData ? getSensorStatus(sensorData.humidity, 'humidity') : 'normal', lastUpdate: sensorData?.timestamp ?? new Date(), description: "Capteur d'humidit\u00E9 relative" }), _jsx(SensorCard, { name: "Humidit\u00E9 Sol", value: sensorData?.soilMoisture ?? 0, unit: "%", icon: Sun, status: sensorData ? getSensorStatus(sensorData.soilMoisture, 'soil') : 'normal', lastUpdate: sensorData?.timestamp ?? new Date(), description: "Capteur capacitive soil moisture" }), _jsx(SensorCard, { name: "Luminosit\u00E9", value: sensorData?.lightLevel ?? 0, unit: " lux", icon: Sun, status: sensorData ? getSensorStatus(sensorData.lightLevel, 'light') : 'normal', lastUpdate: sensorData?.timestamp ?? new Date(), description: "Capteur de lumi\u00E8re BH1750" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(ChartContainer, { title: "Historique Temp\u00E9rature", data: temperatureData, dataKey: "value", color: "#EF4444", unit: "\u00B0C", timeRange: timeRange, onTimeRangeChange: setTimeRange, fill: true }), _jsx(ChartContainer, { title: "Historique Humidit\u00E9 Air", data: humidityData, dataKey: "value", color: "#3B82F6", unit: "%", timeRange: timeRange, onTimeRangeChange: setTimeRange, fill: true })] }), _jsx(ChartContainer, { title: "Historique Humidit\u00E9 Sol", data: soilData, dataKey: "value", color: "#8B5CF6", unit: "%", timeRange: timeRange, onTimeRangeChange: setTimeRange, fill: true })] }));
};
export default SensorsPage;
