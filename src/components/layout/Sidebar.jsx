import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Activity, Droplets, Cloud, MessageSquare, Settings, ChevronLeft, ChevronRight, Tractor } from "lucide-react";
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const [logoFailed, setLogoFailed] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Tableau de bord" },
    { path: "/sensors", icon: Activity, label: "Capteurs" },
    { path: "/irrigation", icon: Droplets, label: "Irrigation" },
    { path: "/weather", icon: Cloud, label: "Météo" },
    { path: "/chat", icon: MessageSquare, label: "Chat IA" },
    { path: "/settings", icon: Settings, label: "Paramètres" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-40 flex flex-col ${sidebarCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
            {logoFailed ? (
              <Tractor className="w-5 h-5 text-white" />
            ) : (
              <img
                src="/logo.png"
                alt="Smart Farm Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Smart Farm</h1>
              <p className="text-xs text-slate-400">Agriculture Intelligente</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full" />}
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform"}`} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="p-4 border-t border-slate-700/50 text-slate-400 hover:text-white transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
};

export default Sidebar;
