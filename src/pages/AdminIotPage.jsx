import React, { useState } from "react";
import { Activity, Cpu, Database, RefreshCw, Save, Server, Shield, Wifi } from "lucide-react";

const modules = [
  { name: "Arduino Uno", role: "Microcontroleur", status: "Online", signal: "USB/Serial" },
  { name: "ESP8266", role: "Module WiFi", status: "Online", signal: "-61 dBm" },
  { name: "DHT22", role: "Temperature / humidite", status: "Online", signal: "GPIO 2" },
  { name: "Soil Moisture", role: "Humidite sol", status: "Online", signal: "A0" },
  { name: "BH1750", role: "Luminosite", status: "Online", signal: "I2C" },
];

const AdminIotPage = () => {
  const [config, setConfig] = useState({
    interval: 30,
    endpoint: "https://api.smartfarm.local/iot/readings",
    apiKey: "SF-DEV-2026",
    weatherSync: true,
    alerts: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Systeme IoT</h1>
          <p className="mt-1 text-slate-400">Configuration Arduino Uno, ESP8266, capteurs et transmission</p>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500">
          <Save className="h-4 w-4" />
          Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_390px]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Cpu className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-semibold text-white">Modules connectes</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <div key={module.name} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-white">{module.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{module.role}</div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">{module.status}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2 text-sm">
                  <span className="text-slate-500">Signal</span>
                  <span className="font-medium text-slate-200">{module.signal}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Server className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold text-white">Transmission</h2>
          </div>
          <label className="mb-2 block text-sm text-slate-300">Intervalle lecture (sec)</label>
          <input
            type="number"
            min="5"
            max="300"
            value={config.interval}
            onChange={(event) => setConfig({ ...config, interval: Number(event.target.value) })}
            className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <label className="mb-2 block text-sm text-slate-300">Endpoint API</label>
          <input
            value={config.endpoint}
            onChange={(event) => setConfig({ ...config, endpoint: event.target.value })}
            className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <label className="mb-2 block text-sm text-slate-300">Cle API device</label>
          <input
            value={config.apiKey}
            onChange={(event) => setConfig({ ...config, apiKey: event.target.value })}
            className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          {[
            ["Synchronisation meteo", "weatherSync", Wifi],
            ["Alertes automatiques", "alerts", Shield],
          ].map(([label, key, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setConfig({ ...config, [key]: !config[key] })}
              className="mb-3 flex w-full items-center justify-between rounded-xl bg-slate-900/50 p-4 text-left"
            >
              <span className="flex items-center gap-3 text-white">
                <Icon className="h-4 w-4 text-slate-400" />
                {label}
              </span>
              <span className={`h-6 w-11 rounded-full p-0.5 transition ${config[key] ? "bg-emerald-600" : "bg-slate-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${config[key] ? "translate-x-5" : ""}`} />
              </span>
            </button>
          ))}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-amber-300" />
            <h2 className="text-xl font-semibold text-white">Sante systeme</h2>
          </div>
          <RefreshCw className="h-5 w-5 text-slate-500" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ["Backend Laravel", "Connecte"],
            ["Base MySQL", "Operationnel"],
            ["Queue alerts", "Actif"],
            ["WeatherAPI", "Synchronise"],
          ].map(([label, status]) => (
            <div key={label} className="rounded-xl bg-slate-900/50 p-4">
              <div className="mb-3 h-2 w-2 rounded-full bg-emerald-400" />
              <div className="font-medium text-white">{label}</div>
              <div className="mt-1 text-sm text-emerald-300">{status}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminIotPage;
