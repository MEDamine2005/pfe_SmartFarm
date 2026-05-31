import React, { useEffect, useState } from "react";
import { Droplets, Save, SlidersHorizontal } from "lucide-react";
import { controlIrrigation, fetchIrrigationState, fetchSensorData } from "../services/api";
import { notify } from "../utils/toast";

const AdminIrrigationPage = () => {
  const [settings, setSettings] = useState({
    soilThreshold: 40,
    maxDuration: 15,
    active: false,
  });
  const [soilMoisture, setSoilMoisture] = useState(null);
  const [pumpOn, setPumpOn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const [irrigation, sensors] = await Promise.all([fetchIrrigationState(), fetchSensorData()]);
      setSettings({
        soilThreshold: irrigation.threshold ?? 40,
        maxDuration: irrigation.duration ?? 15,
        active: irrigation.mode === "automatic",
      });
      setPumpOn(irrigation.status === "on");
      setSoilMoisture(sensors.soilMoisture);
    } catch {
      notify.error("Chargement irrigation echoue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    try {
      await controlIrrigation(settings.active ? "auto" : "stop");
      notify.success("Regles irrigation enregistrees");
      load();
    } catch (error) {
      notify.error(error.message || "Sauvegarde echouee");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Irrigation auto</h1>
          <p className="mt-1 text-slate-400">Regles et etat pompe depuis l&apos;API</p>
        </div>
        <button type="button" onClick={handleSave} className="flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-500">
          <Save className="h-4 w-4" />
          Sauvegarder
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[390px_1fr]">
          <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-emerald-300" />
              <h2 className="text-xl font-semibold text-white">Regles automatiques</h2>
            </div>
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm">
                <label className="text-slate-300">Seuil humidite sol (%)</label>
                <span className="font-semibold text-white">{settings.soilThreshold}</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={settings.soilThreshold}
                onChange={(event) => setSettings({ ...settings, soilThreshold: Number(event.target.value) })}
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm">
                <label className="text-slate-300">Duree max (min)</label>
                <span className="font-semibold text-white">{settings.maxDuration}</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={settings.maxDuration}
                onChange={(event) => setSettings({ ...settings, maxDuration: Number(event.target.value) })}
                className="w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, active: !settings.active })}
              className={`flex w-full items-center justify-between rounded-xl p-4 ${settings.active ? "bg-emerald-500/10" : "bg-slate-900/50"}`}
            >
              <span className="text-white">Mode automatique</span>
              <span className={`h-6 w-11 rounded-full p-0.5 ${settings.active ? "bg-emerald-600" : "bg-slate-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${settings.active ? "translate-x-5" : ""}`} />
              </span>
            </button>
          </section>

          <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <Droplets className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Etat zone principale</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-900/50 p-4">
                <div className="text-sm text-slate-400">Humidite sol actuelle</div>
                <div className="mt-2 text-3xl font-bold text-white">{soilMoisture ?? "—"}%</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 p-4">
                <div className="text-sm text-slate-400">Pompe</div>
                <div className={`mt-2 text-xl font-bold ${pumpOn ? "text-emerald-400" : "text-slate-300"}`}>{pumpOn ? "Actif" : "Arrete"}</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 p-4">
                <div className="text-sm text-slate-400">Seuil configure</div>
                <div className="mt-2 text-3xl font-bold text-white">{settings.soilThreshold}%</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminIrrigationPage;
