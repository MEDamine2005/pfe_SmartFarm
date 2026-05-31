import React, { useEffect, useState } from "react";
import { Activity, Battery, Clock, Database, Droplets, Radio, RefreshCw, Sun, Thermometer } from "lucide-react";
import { ChartContainer } from "../components/ui";
import { useApp } from "../context/AppContext";
import { fetchSensorHistory } from "../services/api";

const SensorCard = ({ name, value, unit, icon: Icon, status, lastUpdate, description }) => {
  const statusStyles = {
    normal: "border-emerald-500/30 bg-emerald-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    critical: "border-red-500/30 bg-red-500/5",
  };
  const statusIndicator = {
    normal: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500 animate-pulse",
  };

  return (
    <div className={`rounded-2xl border bg-slate-800/50 p-6 backdrop-blur-xl ${statusStyles[status]}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
            <Icon className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
        <div className={`h-3 w-3 rounded-full ${statusIndicator[status]}`} />
      </div>
      <div className="mb-4">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="ml-2 text-lg text-slate-400">{unit}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Clock className="h-4 w-4" />
        <span>Mis a jour {lastUpdate ? new Date(lastUpdate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--"}</span>
      </div>
    </div>
  );
};

const getSensorStatus = (value, type) => {
  if (type === "temperature") {
    if (value > 35 || value < 15) return "critical";
    if (value > 32 || value < 18) return "warning";
    return "normal";
  }
  if (type === "humidity") {
    if (value > 90 || value < 20) return "critical";
    if (value > 80 || value < 30) return "warning";
    return "normal";
  }
  if (type === "soil") {
    if (value < 20) return "critical";
    if (value < 30) return "warning";
  }
  return "normal";
};

const SensorsPage = () => {
  const { sensorData, isLoadingSensors, refreshSensorData } = useApp();
  const [timeRange, setTimeRange] = useState("24h");
  const [history, setHistory] = useState({ temperature: [], humidity: [], soil: [] });

  useEffect(() => {
    fetchSensorHistory(timeRange)
      .then(setHistory)
      .catch(() => setHistory({ temperature: [], humidity: [], soil: [] }));
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Capteurs</h1>
          <p className="mt-1 text-slate-400">Donnees Laravel des capteurs ESP-12E</p>
        </div>
        <button onClick={refreshSensorData} disabled={isLoadingSensors} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-500 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${isLoadingSensors ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <Radio className="h-6 w-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Architecture IoT</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400"><Database className="h-4 w-4" />Microcontroleur</div>
            <div className="font-semibold text-white">ESP-12E 8266</div>
            <div className="mt-1 text-xs text-slate-500">Collecte et transmission</div>
          </div>
          <div className="rounded-xl bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400"><Radio className="h-4 w-4" />WiFi</div>
            <div className="font-semibold text-white">HTTP vers Laravel</div>
            <div className="mt-1 text-xs text-slate-500">POST /api/iot/readings</div>
          </div>
          <div className="rounded-xl bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400"><Battery className="h-4 w-4" />Alimentation</div>
            <div className="font-semibold text-white">Board ESP</div>
            <div className="mt-1 text-xs text-slate-500">Selon ton module</div>
          </div>
          <div className="rounded-xl bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400"><Activity className="h-4 w-4" />Intervalle</div>
            <div className="font-semibold text-white">15 secondes</div>
            <div className="mt-1 text-xs text-slate-500">Frequence ESP</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SensorCard name="Temperature" value={sensorData?.temperature ?? "--"} unit="°C" icon={Thermometer} status={sensorData ? getSensorStatus(sensorData.temperature, "temperature") : "normal"} lastUpdate={sensorData?.timestamp} description="DHT22 sur D4" />
        <SensorCard name="Humidite Air" value={sensorData?.humidity ?? "--"} unit="%" icon={Droplets} status={sensorData ? getSensorStatus(sensorData.humidity, "humidity") : "normal"} lastUpdate={sensorData?.timestamp} description="DHT22 humidite" />
        <SensorCard name="Humidite Sol" value={sensorData?.soilMoisture ?? "--"} unit="%" icon={Sun} status={sensorData ? getSensorStatus(sensorData.soilMoisture, "soil") : "normal"} lastUpdate={sensorData?.timestamp} description="Soil moisture sur A0" />
        <SensorCard name="Luminosite" value={sensorData?.lightLevel ?? "--"} unit="" icon={Sun} status="normal" lastUpdate={sensorData?.timestamp} description="LDR digital sur D1" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer title="Historique Temperature" data={history.temperature} dataKey="value" color="#EF4444" unit="°C" timeRange={timeRange} onTimeRangeChange={setTimeRange} fill />
        <ChartContainer title="Historique Humidite Air" data={history.humidity} dataKey="value" color="#3B82F6" unit="%" timeRange={timeRange} onTimeRangeChange={setTimeRange} fill />
      </div>
      <ChartContainer title="Historique Humidite Sol" data={history.soil} dataKey="value" color="#8B5CF6" unit="%" timeRange={timeRange} onTimeRangeChange={setTimeRange} fill />
    </div>
  );
};

export default SensorsPage;
