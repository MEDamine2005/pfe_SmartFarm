import React, { useEffect, useMemo, useState } from "react";
import { Mail, Plus, Search, Shield, Trash2, UserCheck, Users } from "lucide-react";
import { createAdminUser, fetchAdminUsers, updateAdminUser } from "../services/api";
import { notify } from "../utils/toast";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "1234", role: "farmer", phone: "0600000000" });

  const loadUsers = () => {
    setIsLoading(true);
    fetchAdminUsers()
      .then(setUsers)
      .catch(() => {
        setUsers([]);
        notify.error("Impossible de charger les utilisateurs");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = query.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value));
  }, [query, users]);

  const addUser = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;

    try {
      await createAdminUser(form);
      notify.success("Utilisateur cree");
      setForm({ email: "", password: "1234", role: "farmer", phone: "0600000000" });
      loadUsers();
    } catch (error) {
      notify.error(error.message || "Creation echouee");
    }
  };

  const toggleRole = async (user) => {
    const nextRole = user.role === "admin" ? "farmer" : "admin";
    try {
      await updateAdminUser(user.id, { role: nextRole });
      loadUsers();
      notify.success("Role mis a jour");
    } catch (error) {
      notify.error(error.message || "Mise a jour echouee");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestion utilisateurs</h1>
        <p className="mt-1 text-slate-400">Comptes depuis l&apos;API /admin/users</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-300" />
              <h2 className="text-xl font-semibold text-white">Utilisateurs</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Rechercher"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-slate-400">Chargement...</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-700/50">
              <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_90px] bg-slate-900/80 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                <span>Utilisateur</span>
                <span>Role</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-[1.2fr_0.8fr_0.6fr_90px] items-center border-t border-slate-700/50 px-4 py-4">
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRole(user)}
                    className={`w-fit rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${
                      user.role === "admin" ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {user.role}
                  </button>
                  <span className="text-sm text-slate-300">{user.status}</span>
                  <button
                    type="button"
                    disabled
                    title="Suppression non exposee par l'API"
                    className="ml-auto cursor-not-allowed rounded-lg p-2 text-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={addUser} className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Ajouter utilisateur</h2>
              <p className="text-sm text-slate-500">POST /admin/users</p>
            </div>
          </div>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <label className="mb-2 block text-sm text-slate-300">Mot de passe</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <label className="mb-2 block text-sm text-slate-300">Role</label>
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-500"
          >
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
          <div className="mt-5 rounded-xl bg-slate-900/50 p-4 text-sm text-slate-400">
            <Shield className="mb-2 h-4 w-4 text-amber-300" />
            Donnees synchronisees avec MySQL via Laravel.
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersPage;
