import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertTriangle, AlertCircle, Info, X, Check } from 'lucide-react';
const AlertPanel = ({ alerts, onMarkRead, onDismiss }) => {
    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical':
                return AlertTriangle;
            case 'warning':
                return AlertCircle;
            default:
                return Info;
        }
    };
    const getAlertStyles = (type) => {
        switch (type) {
            case 'critical':
                return 'bg-red-500/10 border-red-500/30 text-red-400';
            case 'warning':
                return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
            default:
                return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
        }
    };
    if (alerts.length === 0) {
        return (_jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Alertes" }), _jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4", children: _jsx(Check, { className: "w-8 h-8 text-emerald-400" }) }), _jsx("p", { className: "text-slate-400", children: "Aucune alerte active" })] })] }));
    }
    return (_jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-slate-700/50 flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Alertes" }), _jsx("span", { className: "px-2 py-1 bg-slate-700/50 rounded-full text-sm text-slate-400", children: alerts.length })] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    const styles = getAlertStyles(alert.type);
                    return (_jsx("div", { className: `p-4 border-b border-slate-700/30 ${styles} ${!alert.read ? 'bg-slate-800/30' : ''}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Icon, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("h4", { className: "font-semibold text-white", children: alert.title }), _jsx("span", { className: "text-xs text-slate-500 whitespace-nowrap", children: new Date(alert.timestamp).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }) })] }), _jsx("p", { className: "text-sm text-slate-300 mt-1", children: alert.message }), _jsxs("div", { className: "flex items-center gap-2 mt-3", children: [!alert.read && (_jsx("button", { onClick: () => onMarkRead(alert.id), className: "text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors", children: "Marquer lu" })), _jsxs("button", { onClick: () => onDismiss(alert.id), className: "text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1", children: [_jsx(X, { className: "w-3 h-3" }), "Ignorer"] })] })] })] }) }, alert.id));
                }) })] }));
};
export default AlertPanel;
