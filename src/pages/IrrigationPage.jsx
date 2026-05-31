import React, { useEffect, useState } from "react";
import { Droplets, History, TrendingUp, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";
import { IrrigationControl } from "../components/ui";
import { fetchIrrigationReports, fetchSensorHistory } from "../services/api";

const IrrigationPage = () => {
  const { irrigationState, isIrrigating } = useApp();
  const [timeRange, setTimeRange] = useState("7d");
  const [soilHistory, setSoilHistory] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchSensorHistory(timeRange), fetchIrrigationReports()])
      .then(([history, irrigationReports]) => {
        setSoilHistory(history.soil || []);
        setReports(irrigationReports);
      })
      .catch(() => {
        setSoilHistory([]);
        setReports([]);
      })
      .finally(() => setIsLoading(false));
  }, [timeRange]);

  const formatReportTime = (report) => {
    const date = report.date_debut || report.date_fin;
    if (!date) return "—";
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Irrigation</h1>
          <p className="mt-1 text-slate-400">Donnees Laravel API — capteurs et pompe</p>
        </div>
        {isIrrigating && (
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-400">
            <div className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            <span>Irrigation active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IrrigationControl state={irrigationState} />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Reglage actuel</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Seuil humidite sol</span>
                <span className="font-semibold text-white">{irrigationState?.threshold ?? "—"}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duree session</span>
                <span className="font-semibold text-white">{irrigationState?.duration ?? "—"} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Debit pompe</span>
                <span className="font-semibold text-white">{irrigationState?.flowRate ?? 0} L/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mode</span>
                <span className="font-semibold capitalize text-emerald-300">{irrigationState?.mode ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <History className="h-5 w-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Historique irrigation (API)</h3>
          </div>
          {reports.length === 0 ? (
            <p className="text-sm text-slate-500">{isLoading ? "Chargement..." : "Aucun rapport enregistre"}</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4">
                  <div>
                    <div className="font-medium capitalize text-white">{report.type || "irrigation"}</div>
                    <div className="text-sm text-slate-400">{formatReportTime(report)}</div>
                  </div>
                  <Droplets className="h-5 w-5 text-emerald-400" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Humidite sol (capteurs)</h3>
            </div>
            <div className="flex rounded-lg bg-slate-900/50 p-1">
              {["24h", "7d", "30d"].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                    timeRange === range ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          {soilHistory.length === 0 ? (
            <p className="text-sm text-slate-500">{isLoading ? "Chargement..." : "Pas encore de lectures IoT"}</p>
          ) : (
            <div className="flex h-56 items-end gap-1">
              {soilHistory.slice(-20).map((point, index) => (
                <div key={`${point.time}-${index}`} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-cyan-400"
                    style={{ height: `${Math.max(8, point.value)}%` }}
                    title={`${point.value}%`}
                  />
                  <span className="truncate text-[10px] text-slate-500">{point.time}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IrrigationPage;
