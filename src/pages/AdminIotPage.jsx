import React, { useEffect, useState } from "react";
import { Activity, Cpu, RefreshCw, Server, Wifi } from "lucide-react";
import { fetchAdminDevices, fetchSensorData } from "../services/api";

const HARDWARE_MODULES = [
  { name: "DHT22", role: "Temperature / humidite", signal: "D4" },
  { name: "Soil Moisture", role: "Humidite sol", signal: "A0" },
  { name: "LDR", role: "Luminosite", signal: "D1" },
  { name: "Water Level", role: "Niveau eau", signal: "D2" },
  { name: "Relais pompe", role: "Commande irrigation", signal: "D5" },
];

const AdminIotPage = () => {
  const [devices, setDevices] = useState([]);
  const [sensorSnapshot, setSensorSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    Promise.all([fetchAdminDevices(), fetchSensorData().catch(() => null)])
      .then(([deviceList, sensors]) => {
        setDevices(deviceList);
        setSensorSnapshot(sensors);
      })
      .catch(() => setDevices([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Systeme IoT</h1>
          <p className="mt-1 text-slate-400">Appareils et dernieres lectures API</p>
        </div>
        <button type="button" onClick={load} className="flex w-fit items-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-white hover:bg-slate-600">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_390px]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Cpu className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-semibold text-white">Appareils enregistres</h2>
          </div>
          {devices.length === 0 ? (
            <p className="text-slate-500">{isLoading ? "Chargement..." : "Aucun appareil — envoyez des lectures depuis l'ESP8266"}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {devices.map((device) => (
                <div key={device.id} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                  <div className="mb-2 font-semibold text-white">{device.device_id}</div>
                  <div className="text-sm text-slate-500">{device.module}</div>
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      device.etat === "online" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {device.etat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Server className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold text-white">Derniere lecture</h2>
          </div>
          {sensorSnapshot ? (
            <div className="space-y-2 text-sm text-slate-300">
              <p>Temp: {sensorSnapshot.temperature} °C</p>
              <p>Humidite air: {sensorSnapshot.humidity} %</p>
              <p>Humidite sol: {sensorSnapshot.soilMoisture} %</p>
              <p>Luminosite: {sensorSnapshot.lightLevel} %</p>
              <p>Niveau eau: {sensorSnapshot.waterLevel} %</p>
            </div>
          ) : (
            <p className="text-slate-500">Pas de donnees capteur</p>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <Activity className="h-5 w-5 text-amber-300" />
          <h2 className="text-xl font-semibold text-white">Modules materiel</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {HARDWARE_MODULES.map((module) => (
            <div key={module.name} className="rounded-xl bg-slate-900/50 p-4">
              <div className="font-medium text-white">{module.name}</div>
              <div className="text-sm text-slate-500">{module.role}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <Wifi className="h-3 w-3" />
                Pin {module.signal}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminIotPage;
