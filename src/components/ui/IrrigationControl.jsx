import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Power, Clock, Droplets, Zap, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const IrrigationControl = ({ state }) => {
    const { toggleIrrigation, isIrrigating, setIrrigationMode } = useApp();
    const [isAnimating, setIsAnimating] = useState(false);
    const handleToggle = () => {
        setIsAnimating(true);
        toggleIrrigation();
        setTimeout(() => setIsAnimating(false), 500);
    };
    const modes = [
        { id: 'manual', label: 'Manuel', icon: Power },
        { id: 'automatic', label: 'Automatique', icon: Zap },
        { id: 'scheduled', label: 'Programmé', icon: Clock },
    ];
    return (_jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Contr\u00F4le Irrigation" }), _jsx("p", { className: "text-sm text-slate-400", children: "Syst\u00E8me d'arrosage intelligent" })] }), _jsxs("div", { className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isIrrigating
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : state.status === 'auto'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-700/50 text-slate-400'}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full ${isIrrigating ? 'bg-emerald-400 animate-pulse' : state.status === 'auto' ? 'bg-amber-400' : 'bg-slate-500'}` }), _jsx("span", { children: isIrrigating ? 'Actif' : state.status === 'auto' ? 'Auto' : 'Inactif' })] })] }), _jsx("div", { className: "flex items-center justify-center mb-8", children: _jsxs("button", { onClick: handleToggle, disabled: state.mode === 'automatic' && isIrrigating, className: `relative w-32 h-32 rounded-full transition-all duration-300 ${isIrrigating
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/40'
                        : 'bg-slate-700 hover:bg-slate-600'} ${isAnimating ? 'scale-110' : ''} ${state.mode === 'automatic' && !isIrrigating ? 'opacity-70' : ''}`, children: [isIrrigating && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" }), _jsx("div", { className: "absolute inset-0 rounded-full bg-emerald-400/20 animate-ping", style: { animationDelay: '0.5s' } })] })), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx(Droplets, { className: `w-12 h-12 text-white ${isIrrigating ? 'animate-bounce' : ''}` }) }), _jsx("div", { className: `absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center ${isIrrigating ? 'bg-emerald-400' : 'bg-slate-600'}`, children: _jsx(Power, { className: "w-4 h-4 text-white" }) })] }) }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "text-sm font-medium text-slate-400 mb-3 block", children: "Mode de fonctionnement" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: modes.map((mode) => {
                            const Icon = mode.icon;
                            const isActive = state.mode === mode.id;
                            return (_jsxs("button", { onClick: () => setIrrigationMode(mode.id), className: `flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${isActive
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm font-medium", children: mode.label })] }, mode.id));
                        }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm mb-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: "Derni\u00E8re activation" })] }), _jsx("div", { className: "text-white font-semibold", children: state.lastActivation
                                    ? new Date(state.lastActivation).toLocaleString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : 'Aucune' })] }), _jsxs("div", { className: "bg-slate-900/50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm mb-1", children: [_jsx(Droplets, { className: "w-4 h-4" }), _jsx("span", { children: "Eau \u00E9conomis\u00E9e" })] }), _jsxs("div", { className: "text-white font-semibold", children: [state.waterSaved, " L"] })] })] }), state.mode === 'scheduled' && state.nextScheduled && (_jsxs("div", { className: "mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-amber-400 flex-shrink-0" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-amber-400", children: "Prochaine irrigation" }), _jsx("div", { className: "text-white", children: new Date(state.nextScheduled).toLocaleString('fr-FR', {
                                    weekday: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }) })] })] }))] }));
};
export default IrrigationControl;
