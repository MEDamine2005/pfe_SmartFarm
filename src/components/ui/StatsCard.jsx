import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
const StatsCard = ({ title, value, unit, icon: Icon, trend, trendValue, status = 'normal', isLoading = false, }) => {
    const statusStyles = {
        normal: 'border-slate-700/50 hover:border-emerald-500/50',
        warning: 'border-amber-500/50 hover:border-amber-500',
        critical: 'border-red-500/50 hover:border-red-500 animate-pulse',
    };
    const statusGlow = {
        normal: '',
        warning: 'shadow-amber-500/20',
        critical: 'shadow-red-500/20',
    };
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';
    if (isLoading) {
        return (_jsx("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50", children: _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-4 bg-slate-700 rounded w-24" }), _jsx("div", { className: "h-10 bg-slate-700 rounded w-32" }), _jsx("div", { className: "h-4 bg-slate-700 rounded w-20" })] }) }));
    }
    return (_jsxs("div", { className: `bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${statusStyles[status]} ${statusGlow[status]} shadow-lg`, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-sm font-medium text-slate-400", children: title }), _jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${status === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : status === 'warning'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'}`, children: _jsx(Icon, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "text-4xl font-bold text-white tracking-tight", children: value }), _jsx("span", { className: "ml-2 text-lg text-slate-400", children: unit })] }), trend && trendValue && (_jsxs("div", { className: `flex items-center gap-1 text-sm ${trendColor}`, children: [_jsx(TrendIcon, { className: "w-4 h-4" }), _jsx("span", { children: trendValue })] }))] }));
};
export default StatsCard;
