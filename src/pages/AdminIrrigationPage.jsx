import React, { useState } from "react";
import { Calendar, Droplets, Save, SlidersHorizontal, Zap } from "lucide-react";

const zones = [
  { name: "Zone A - Serre", moisture: 42, mode: "Auto", pump: "Standby" },
  { name: "Zone B - Plein champ", moisture: 31, mode: "Auto", pump: "Actif" },
  { name: "Zone C - Pepiniere", moisture: 55, mode: "Manuel", pump: "Off" },
];

const AdminIrrigationPage = () => {
  const [settings, setSettings] = useState({
    soilThreshold: 30,
    maxDuration: 25,
    rainDelay: 12,
    safetyLock: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Irrigation auto</h1>
          <p className="mt-1 text-slate-400">Regles globales, zones et securite pompe</p>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500">
          <Save className="h-4 w-4" />
          Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[390px_1fr]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-semibold text-white">Regles automatiques</h2>
          </div>
          {[
            ["Seuil humidite sol (%)", "soilThreshold", 10, 60],
            ["Duree max irrigation (min)", "maxDuration", 5, 60],
            ["Delai apres pluie (h)", "rainDelay", 1, 48],
          ].map(([label, key, min, max]) => (
            <div key={key} className="mb-6">
              <div className="mb-2 flex justify-between text-sm">
                <label className="text-slate-300">{label}</label>
                <span className="font-semibold text-white">{settings[key]}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={settings[key]}
                onChange={(event) => setSettings({ ...settings, [key]: Number(event.target.value) })}
                className="w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSettings({ ...settings, safetyLock: !settings.safetyLock })}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900/50 p-4"
          >
            <span className="flex items-center gap-3 text-white">
              <Zap className="h-4 w-4 text-amber-300" />
              Verrouillage securite pompe
            </span>
            <span className={`h-6 w-11 rounded-full p-0.5 transition ${settings.safetyLock ? "bg-emerald-600" : "bg-slate-700"}`}>
              <span className={`block h-5 w-5 rounded-full bg-white transition ${settings.safetyLock ? "translate-x-5" : ""}`} />
            </span>
          </button>
        </section>

        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold text-white">Zones irrigation</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {zones.map((zone) => (
              <div key={zone.name} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-white">{zone.name}</div>
                    <div className="mt-1 text-sm text-slate-500">Mode {zone.mode}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${zone.pump === "Actif" ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700/70 text-slate-300"}`}>
                    {zone.pump}
                  </span>
                </div>
                <div className="text-4xl font-bold text-white">{zone.moisture}%</div>
                <div className="mt-1 text-sm text-slate-500">Humidite sol</div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${zone.moisture}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-amber-300" />
          <h2 className="text-xl font-semibold text-white">Planning automatique</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {["06:00 - Controle sol", "06:15 - Zone B active", "12:00 - Pause chaleur", "18:00 - Re-evaluation"].map((item) => (
            <div key={item} className="rounded-xl bg-slate-900/50 p-4 text-sm font-medium text-slate-200">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminIrrigationPage;
