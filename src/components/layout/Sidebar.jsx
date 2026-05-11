import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Droplets,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Tractor,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const farmerItems = [
  { path: "/", icon: Home, label: "Tableau de bord" },
  { path: "/sensors", icon: Activity, label: "Capteurs" },
  { path: "/irrigation", icon: Droplets, label: "Irrigation" },
  { path: "/weather", icon: Cloud, label: "Meteo" },
  { path: "/chat", icon: MessageSquare, label: "Chat IA" },
  { path: "/settings", icon: Settings, label: "Parametres" },
];

const adminItems = [
  { path: "/admin", icon: BarChart3, label: "Rapports" },
  { path: "/admin/users", icon: Users, label: "Utilisateurs" },
  { path: "/admin/iot", icon: Shield, label: "Systeme IoT" },
  { path: "/admin/irrigation", icon: Droplets, label: "Irrigation auto" },
  { path: "/sensors", icon: Activity, label: "Donnees IoT" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar, currentUser } = useApp();
  const [logoFailed, setLogoFailed] = useState(false);
  const navItems = currentUser?.role === "admin" ? adminItems : farmerItems;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-slate-700/50 bg-slate-800/70 backdrop-blur-xl transition-all duration-300 md:flex ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="border-b border-slate-700/50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-900/60 p-1 shadow-lg shadow-emerald-500/20">
            {logoFailed ? (
              <Tractor className="h-6 w-6 text-emerald-700" />
            ) : (
              <img
                src="/logo1.png"
                alt="Smart Farm"
                className="h-full w-full object-contain object-center"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Smart Farm</h1>
              <p className="text-xs text-slate-400">
                {currentUser?.role === "admin" ? "Administration" : "Agriculture intelligente"}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <button
              key={`${item.path}-${item.label}`}
              onClick={() => navigate(item.path)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {active && <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-emerald-300" />}
              <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "" : "transition-transform group-hover:scale-110"}`} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="border-t border-slate-700/50 p-4 text-slate-400 transition-colors hover:text-white"
        title={sidebarCollapsed ? "Ouvrir le menu" : "Reduire le menu"}
      >
        {sidebarCollapsed ? <ChevronRight className="mx-auto h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
};

export default Sidebar;
