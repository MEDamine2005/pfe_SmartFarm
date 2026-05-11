import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Sprout } from "lucide-react";
import { useApp } from "../context/AppContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useApp();
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("farmer@smartfarm.local");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleCopy = useMemo(
    () =>
      role === "admin"
        ? { title: "Espace Admin", subtitle: "Gestion utilisateurs, rapports et configuration IoT" }
        : { title: "Espace Fermier", subtitle: "Surveillance, alertes, irrigation et assistant IA" },
    [role],
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setEmail(nextRole === "admin" ? "admin@smartfarm.local" : "farmer@smartfarm.local");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login({ email, password, role });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Connexion impossible");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_32%),linear-gradient(135deg,#0f172a,#10251f_50%,#111827)] p-8 lg:p-12">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-900/60 p-1.5 shadow-xl shadow-emerald-500/20 ring-1 ring-white/10">
              <img src="/logo1.png" alt="Smart Farm" className="h-full w-full object-contain object-center" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Smart Farm</h1>
              <p className="text-sm text-emerald-100/70">Plateforme agricole intelligente</p>
            </div>
          </div>

          <div className="max-w-2xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
              <Sprout className="h-4 w-4" />
              Authentification requise
            </div>
            <h2 className="text-4xl font-bold leading-tight lg:text-6xl">Controlez votre ferme depuis un seul tableau de bord.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Connectez-vous pour acceder aux capteurs, decisions d'irrigation, alertes, previsions meteo et fonctions admin prevues dans le use case.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">Capteurs temps reel</div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">Irrigation intelligente</div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">Roles farmer/admin</div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 lg:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">{roleCopy.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{roleCopy.subtitle}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-950/70 p-1">
              {["farmer", "admin"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleRoleChange(item)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    role === item ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item === "farmer" ? "Farmer" : "Admin"}
                </button>
              ))}
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 focus-within:border-emerald-500">
              <Mail className="h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                placeholder="email@smartfarm.local"
                required
              />
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300">Mot de passe</label>
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 focus-within:border-emerald-500">
              <Lock className="h-5 w-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                placeholder="Mot de passe"
                required
              />
            </div>

            {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 font-semibold text-white transition hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-60"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
