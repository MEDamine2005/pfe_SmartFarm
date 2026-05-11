import React from 'react';
import { Bell, LogOut, RefreshCw, User, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const Header = () => {
    const { alerts, refreshSensorData, isLoadingSensors, currentUser, logout } = useApp();
    const unreadCount = alerts.filter(a => !a.read).length;
    const [isOnline] = React.useState(true);
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-800/50 px-4 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-900/60 p-1 md:hidden">
                    <img src="/logo1.png" alt="Smart Farm" className="h-full w-full object-contain object-center" />
                </div>
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${isOnline
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'}`}>
                    {isOnline ? (
                        <>
                            <Wifi className="h-4 w-4" />
                            <span>Connecte</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="h-4 w-4" />
                            <span>Hors ligne</span>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <button onClick={refreshSensorData} disabled={isLoadingSensors} className="rounded-lg bg-slate-700/50 p-2 text-slate-400 transition-all hover:bg-slate-600/50 hover:text-white disabled:opacity-50" title="Actualiser les donnees">
                    <RefreshCw className={`h-5 w-5 ${isLoadingSensors ? 'animate-spin' : ''}`} />
                </button>
                <button className="relative rounded-lg bg-slate-700/50 p-2 text-slate-400 transition-all hover:bg-slate-600/50 hover:text-white" title="Alertes">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">{unreadCount}</span>}
                </button>
                <div className="hidden items-center gap-3 rounded-lg p-2 md:flex">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-300">{currentUser?.name || 'Utilisateur'}</div>
                        <div className="text-xs capitalize text-slate-500">{currentUser?.role || 'farmer'}</div>
                    </div>
                </div>
                <button onClick={logout} className="rounded-lg bg-slate-700/50 p-2 text-slate-400 transition-all hover:bg-red-500/20 hover:text-red-200" title="Deconnexion">
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};
export default Header;
