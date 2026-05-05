import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, Thermometer } from 'lucide-react';
const WeatherWidget = ({ current, forecast, isLoading }) => {
    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'sunny':
            case 'sun':
                return Sun;
            case 'cloudy':
            case 'cloud':
                return Cloud;
            case 'rainy':
            case 'cloud-rain':
                return CloudRain;
            case 'stormy':
            case 'cloud-lightning':
                return CloudLightning;
            default:
                return Sun;
        }
    };
    const getWeatherGradient = (condition) => {
        switch (condition) {
            case 'sunny':
            case 'sun':
                return 'from-amber-500 to-orange-600';
            case 'cloudy':
            case 'cloud':
            case 'cloud-sun':
                return 'from-slate-500 to-slate-600';
            case 'rainy':
            case 'cloud-rain':
                return 'from-blue-500 to-slate-600';
            case 'stormy':
            case 'cloud-lightning':
                return 'from-purple-600 to-slate-800';
            default:
                return 'from-amber-500 to-orange-600';
        }
    };
    const WeatherIcon = getWeatherIcon(current.condition);
    const gradient = getWeatherGradient(current.condition);
    if (isLoading) {
        return (_jsx("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-6 bg-slate-700 rounded w-32" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-20 w-20 bg-slate-700 rounded-full" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-8 bg-slate-700 rounded w-24" }), _jsx("div", { className: "h-4 bg-slate-700 rounded w-32" })] })] })] }) }));
    }
    return (_jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300", children: [_jsx("div", { className: `bg-gradient-to-br ${gradient} p-6`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center", children: _jsx(WeatherIcon, { className: "w-10 h-10 text-white" }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-5xl font-bold text-white", children: [current.temperature, "\u00B0"] }), _jsx("div", { className: "text-white/80 capitalize", children: current.condition === 'sunny' ? 'Ensoleillé' : current.condition === 'cloudy' ? 'Partiellement nuageux' : current.condition === 'rainy' ? 'Pluie' : current.condition === 'stormy' ? 'Orage' : current.condition })] })] }), _jsxs("div", { className: "flex flex-col gap-2 text-right", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/90 text-sm", children: [_jsx(Thermometer, { className: "w-4 h-4" }), _jsxs("span", { children: ["Ressenti ", current.feelsLike, "\u00B0"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-white/90 text-sm", children: [_jsx(Droplets, { className: "w-4 h-4" }), _jsxs("span", { children: ["Humidit\u00E9 ", current.humidity, "%"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-white/90 text-sm", children: [_jsx(Wind, { className: "w-4 h-4" }), _jsxs("span", { children: ["Vent ", current.windSpeed, " km/h"] })] })] })] }) }), _jsxs("div", { className: "p-4", children: [_jsx("h4", { className: "text-sm font-medium text-slate-400 mb-3", children: "Pr\u00E9visions 5 jours" }), _jsx("div", { className: "grid grid-cols-5 gap-2", children: forecast.map((day, index) => {
                            const DayIcon = getWeatherIcon(day.icon);
                            return (_jsxs("div", { className: "bg-slate-900/50 rounded-xl p-3 text-center hover:bg-slate-700/50 transition-colors", children: [_jsx("div", { className: "text-xs text-slate-400 mb-2", children: index === 0 ? "Aujourd'hui" : new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }) }), _jsx("div", { className: "w-8 h-8 mx-auto mb-2 bg-slate-700/50 rounded-full flex items-center justify-center", children: _jsx(DayIcon, { className: "w-5 h-5 text-slate-300" }) }), _jsxs("div", { className: "text-sm font-medium text-white", children: [day.tempMax, "\u00B0"] }), _jsxs("div", { className: "text-xs text-slate-500", children: [day.tempMin, "\u00B0"] }), day.precipChance > 20 && (_jsxs("div", { className: "text-xs text-blue-400 mt-1", children: [day.precipChance, "%"] }))] }, index));
                        }) })] })] }));
};
export default WeatherWidget;
