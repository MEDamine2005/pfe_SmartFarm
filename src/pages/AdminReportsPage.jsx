import React from "react";
import { Activity, BarChart3, Download, Droplets, FileText, TrendingUp, Users, Wifi } from "lucide-react";

const cards = [
  { label: "Utilisateurs actifs", value: "18", detail: "+3 ce mois", icon: Users, tone: "emerald" },
  { label: "Donnees capteurs", value: "42.8k", detail: "30 sec intervalle", icon: Activity, tone: "cyan" },
  { label: "Eau economisee", value: "1,240 L", detail: "23% vs planning fixe", icon: Droplets, tone: "blue" },
  { label: "Disponibilite IoT", value: "99.9%", detail: "ESP8266 en ligne", icon: Wifi, tone: "amber" },
];

const reports = [
  { name: "Rapport irrigation mensuel", type: "PDF", status: "Pret", date: "Mai 2026" },
  { name: "Historique capteurs", type: "CSV", status: "Pret", date: "30 derniers jours" },
  { name: "Performance systeme IoT", type: "PDF", status: "En revision", date: "Semaine courante" },
  { name: "Consommation eau", type: "XLSX", status: "Pret", date: "Trimestre" },
];

const toneClasses = {
  emerald: "bg-emerald-500/15 text-emerald-300",
  cyan: "bg-cyan-500/15 text-cyan-300",
  blue: "bg-blue-500/15 text-blue-300",
  amber: "bg-amber-500/15 text-amber-300",
};

const AdminReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Administration</h1>
          <p className="mt-1 text-slate-400">Rapports, supervision globale et indicateurs systeme</p>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500">
          <Download className="h-4 w-4" />
          Exporter
        </button>
      </div>

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
              { label: "Stabilite capteurs", value: 92, color: "bg-emerald-500" },
              { label: "Optimisation irrigation", value: 77, color: "bg-cyan-500" },
              { label: "Alertes traitees", value: 84, color: "bg-amber-500" },
              { label: "Sante systeme", value: 96, color: "bg-blue-500" },
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
            {reports.map((report) => (
              <div key={report.name} className="rounded-xl bg-slate-900/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{report.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{report.date}</div>
                  </div>
                  <span className="rounded-lg bg-slate-700/70 px-2.5 py-1 text-xs font-semibold text-slate-200">{report.type}</span>
                </div>
                <div className="mt-3 text-sm text-emerald-300">{report.status}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminReportsPage;
