import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Bell, RefreshCw, User, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const Header = () => {
    const { alerts, refreshSensorData, isLoadingSensors } = useApp();
    const unreadCount = alerts.filter(a => !a.read).length;
    const [isOnline] = React.useState(true);
    return (_jsxs("header", { className: "h-16 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isOnline
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'}`, children: isOnline ? (_jsxs(_Fragment, { children: [_jsx(Wifi, { className: "w-4 h-4" }), _jsx("span", { children: "Connect\u00E9" })] })) : (_jsxs(_Fragment, { children: [_jsx(WifiOff, { className: "w-4 h-4" }), _jsx("span", { children: "Hors ligne" })] })) }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: refreshSensorData, disabled: isLoadingSensors, className: "p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all disabled:opacity-50", title: "Actualiser les donn\u00E9es", children: _jsx(RefreshCw, { className: `w-5 h-5 ${isLoadingSensors ? 'animate-spin' : ''}` }) }), _jsxs("button", { className: "relative p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all", children: [_jsx(Bell, { className: "w-5 h-5" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center", children: unreadCount }))] }), _jsxs("button", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-all", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-4 h-4 text-white" }) }), _jsx("span", { className: "text-sm font-medium text-slate-300 hidden md:block", children: "Fermier" })] })] })] }));
};
export default Header;
