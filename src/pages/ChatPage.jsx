import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Bot, Sparkles, Lightbulb, Droplets, Cloud, Thermometer, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatInterface } from '../components/ui';
const suggestions = [
    {
        icon: Droplets,
        title: "État de l'irrigation",
        prompt: "Quel est l'état actuel de l'irrigation?",
        color: 'from-emerald-500 to-teal-600',
    },
    {
        icon: Cloud,
        title: 'Météo',
        prompt: "Quelles sont les prévisions météo pour aujourd'hui?",
        color: 'from-blue-500 to-indigo-600',
    },
    {
        icon: Thermometer,
        title: 'Humidité du sol',
        prompt: "Quelle est l'humidité actuelle du sol?",
        color: 'from-amber-500 to-orange-600',
    },
    {
        icon: BarChart3,
        title: 'Analyse',
        prompt: "Donne-moi une analyse des données de la semaine.",
        color: 'from-purple-500 to-pink-600',
    },
    {
        icon: Lightbulb,
        title: 'Recommandations',
        prompt: "Quelles recommandations as-tu pour moi?",
        color: 'from-yellow-500 to-amber-600',
    },
];
const ChatPage = () => {
    const { chatMessages, sendMessage, isTyping, sensorData } = useApp();
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Chat IA" }), _jsx("p", { className: "text-slate-400 mt-1", children: "Assistant intelligent pour votre exploitation" })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-2", children: [_jsx(Bot, { className: "w-4 h-4" }), _jsx("span", { children: "En ligne" })] }) })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: suggestions.map((item, index) => {
                    const Icon = item.icon;
                    return (_jsxs("button", { onClick: () => sendMessage(item.prompt), className: `bg-gradient-to-br ${item.color} p-4 rounded-2xl text-left group hover:scale-[1.02] transition-all shadow-lg`, children: [_jsx(Icon, { className: "w-6 h-6 text-white mb-3" }), _jsx("h4", { className: "text-white font-semibold mb-1", children: item.title }), _jsx("p", { className: "text-white/70 text-sm", children: item.prompt })] }, index));
                }) }), _jsx(ChatInterface, { messages: chatMessages, onSendMessage: sendMessage, isTyping: isTyping }), _jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Sparkles, { className: "w-5 h-5 text-emerald-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Capacit\u00E9s de l'assistant IA" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsx("div", { className: "w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3", children: _jsx(Droplets, { className: "w-5 h-5 text-emerald-400" }) }), _jsx("h4", { className: "text-white font-semibold mb-2", children: "Irrigation intelligente" }), _jsx("p", { className: "text-sm text-slate-400", children: "Analyse les donn\u00E9es des capteurs et recommande les moments optimaux pour l'irrigation." })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsx("div", { className: "w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3", children: _jsx(Cloud, { className: "w-5 h-5 text-blue-400" }) }), _jsx("h4", { className: "text-white font-semibold mb-2", children: "Analyse m\u00E9t\u00E9o" }), _jsx("p", { className: "text-sm text-slate-400", children: "Int\u00E8gre les pr\u00E9visions m\u00E9t\u00E9orologiques pour adapter les recommandations." })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsx("div", { className: "w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3", children: _jsx(BarChart3, { className: "w-5 h-5 text-amber-400" }) }), _jsx("h4", { className: "text-white font-semibold mb-2", children: "Rapports personnalis\u00E9s" }), _jsx("p", { className: "text-sm text-slate-400", children: "G\u00E9n\u00E8re des rapports sur l'\u00E9tat de votre ferme et suggestions d'am\u00E9lioration." })] })] })] }), sensorData && (_jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: [_jsx("h4", { className: "text-sm font-medium text-slate-400 mb-4", children: "Donn\u00E9es actuelles disponibles pour l'analyse" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-900/50 rounded-xl p-3 text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-white", children: [sensorData.temperature, "\u00B0C"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Temp\u00E9rature" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-3 text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-white", children: [sensorData.humidity, "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Humidit\u00E9 air" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-3 text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-white", children: [sensorData.soilMoisture, "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Humidit\u00E9 sol" })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-white", children: sensorData.lightLevel }), _jsx("div", { className: "text-xs text-slate-400", children: "Luminosit\u00E9 lux" })] })] })] }))] }));
};
export default ChatPage;
