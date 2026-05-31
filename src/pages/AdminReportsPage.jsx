import React, { useEffect, useState } from "react";
import { Activity, BarChart3, Download, Droplets, FileText, TrendingUp, Users, Wifi } from "lucide-react";
import { fetchAdminReports } from "../services/api";

const toneClasses = {
  emerald: "bg-emerald-500/15 text-emerald-300",
  cyan: "bg-cyan-500/15 text-cyan-300",
  blue: "bg-blue-500/15 text-blue-300",
  amber: "bg-amber-500/15 text-amber-300",
};

const AdminReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminReports()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setIsLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Utilisateurs", value: String(stats.users ?? 0), detail: `${stats.agriculteurs ?? 0} agriculteurs`, icon: Users, tone: "emerald" },
        { label: "Lectures capteurs", value: String(stats.capteurs ?? 0), detail: "Total en base", icon: Activity, tone: "cyan" },
        { label: "Pompes actives", value: String(stats.pompes_actives ?? 0), detail: "Etat temps reel", icon: Droplets, tone: "blue" },
        { label: "Alertes non lues", value: String(stats.alertes_non_lues ?? 0), detail: "A traiter", icon: Wifi, tone: "amber" },
      ]
    : [];

  const reports = stats?.repports
    ? [{ name: "Rapports irrigation", type: "DB", status: "Disponible", date: `${stats.repports} enregistrement(s)` }]
    : [];

  const healthPercent = stats
    ? Math.min(100, Math.round(((stats.capteurs || 0) > 0 ? 40 : 0) + ((stats.pompes_actives || 0) >= 0 ? 30 : 0) + ((stats.alertes_non_lues || 0) < 5 ? 30 : 10)))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Administration</h1>
          <p className="mt-1 text-slate-400">Rapports et indicateurs depuis l&apos;API Laravel</p>
        </div>
        <button type="button" className="flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500">
          <Download className="h-4 w-4" />
          Exporter
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Chargement des rapports...</p>
      ) : !stats ? (
        <p className="text-red-300">Impossible de charger les donnees admin.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 backdrop-blur-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[card.tone]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">{card.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{card.label}</div>
                  <div className="mt-3 text-xs text-slate-500">{card.detail}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-semibold text-white">Synthese operationnelle</h2>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Activite capteurs", value: stats.capteurs > 0 ? 92 : 0, color: "bg-emerald-500" },
                  { label: "Irrigation (pompes)", value: stats.pompes_actives > 0 ? 77 : 40, color: "bg-cyan-500" },
                  { label: "Alertes traitees", value: Math.max(0, 100 - (stats.alertes_non_lues || 0) * 10), color: "bg-amber-500" },
                  { label: "Sante systeme", value: healthPercent, color: "bg-blue-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-semibold text-white">{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-900/70">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Rapports</h2>
              </div>
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun rapport en base</p>
                ) : (
                  reports.map((report) => (
                    <div key={report.name} className="rounded-xl bg-slate-900/50 p-4">
                      <div className="font-medium text-white">{report.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{report.date}</div>
                      <div className="mt-3 text-sm text-emerald-300">{report.status}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReportsPage;
