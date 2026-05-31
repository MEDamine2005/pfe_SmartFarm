import React, { useEffect, useState } from "react";
import { Activity, Droplets, Sun, Thermometer, TrendingUp, Wind } from "lucide-react";
import { AlertPanel, ChartContainer, IrrigationControl, StatsCard, WeatherWidget } from "../components/ui";
import { useApp } from "../context/AppContext";
import { fetchSensorHistory } from "../services/api";

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

const Dashboard = () => {
  const {
    sensorData,
    isLoadingSensors,
    weatherData,
    isLoadingWeather,
    irrigationState,
    alerts,
    markAlertRead,
    dismissAlert,
    timeRange,
    setTimeRange,
  } = useApp();
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
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="mt-1 text-slate-400">Surveillance en temps reel de votre exploitation</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>Donnees Laravel API</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Temperature" value={sensorData?.temperature ?? "--"} unit="°C" icon={Thermometer} status={sensorData ? getSensorStatus(sensorData.temperature, "temperature") : "normal"} isLoading={isLoadingSensors} />
        <StatsCard title="Humidite Air" value={sensorData?.humidity ?? "--"} unit="%" icon={Droplets} status={sensorData ? getSensorStatus(sensorData.humidity, "humidity") : "normal"} isLoading={isLoadingSensors} />
        <StatsCard title="Humidite Sol" value={sensorData?.soilMoisture ?? "--"} unit="%" icon={Sun} status={sensorData ? getSensorStatus(sensorData.soilMoisture, "soil") : "normal"} isLoading={isLoadingSensors} />
        <StatsCard title="Luminosite" value={sensorData?.lightLevel ?? "--"} unit="" icon={Wind} status="normal" isLoading={isLoadingSensors} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer title="Temperature" data={history.temperature} dataKey="value" color="#EF4444" unit="°C" timeRange={timeRange} onTimeRangeChange={setTimeRange} isLoading={isLoadingSensors} fill />
        <ChartContainer title="Humidite Air" data={history.humidity} dataKey="value" color="#3B82F6" unit="%" timeRange={timeRange} onTimeRangeChange={setTimeRange} isLoading={isLoadingSensors} fill />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartContainer title="Humidite du Sol" data={history.soil} dataKey="value" color="#8B5CF6" unit="%" timeRange={timeRange} onTimeRangeChange={setTimeRange} isLoading={isLoadingSensors} fill />
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
              <TrendingUp className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Irrigation</h3>
              <p className="text-sm text-slate-400">Etat backend</p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Pompe</span><span className="font-semibold text-white">{irrigationState?.status ?? "--"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Mode</span><span className="font-semibold text-white">{irrigationState?.mode ?? "--"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Seuil</span><span className="font-semibold text-white">{irrigationState?.threshold ?? "--"}%</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {weatherData && <WeatherWidget current={weatherData.current} forecast={weatherData.forecast} isLoading={isLoadingWeather} />}
        {irrigationState && <IrrigationControl state={irrigationState} />}
        <AlertPanel alerts={alerts} onMarkRead={markAlertRead} onDismiss={dismissAlert} />
      </div>
    </div>
  );
};

export default Dashboard;
