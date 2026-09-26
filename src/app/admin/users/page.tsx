'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth, User, UserRole, UserStatus } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const { allUsers, updateUserRole, toggleUserStatus, deleteUser, addUser, updateUser, user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    status: 'active' as UserStatus,
    avatar: '🍁',
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      avatar: '🍁',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      avatar: u.avatar || '🍁',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar,
      });
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar,
      });
    }

    setIsModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const filtered = allUsers.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {savedNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-2xl shadow-emerald-500/30 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Personnel registry updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Personnel & Access Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authenticated accounts, administrative privileges, and security clearance statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 w-56"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enlist Personnel</span>
          </button>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'admin', 'editor', 'user'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              roleFilter === r
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {r === 'ALL' ? 'All Roles' : `${r}s`}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Personnel</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Clearance</th>
                <th className="p-4">Status</th>
                <th className="p-4">Monitored Cities</th>
                <th className="p-4">Enlisted</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((u) => {
                const isSelf = Boolean(currentUser && currentUser.id === u.id);
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-base">
                          {u.avatar || '🍁'}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-400">{u.email}</td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/15 text-white font-bold text-xs focus:outline-none focus:border-purple-400 cursor-pointer disabled:opacity-60"
                      >
                        <option value="user" className="bg-slate-900 text-white">Member (User)</option>
                        <option value="editor" className="bg-slate-900 text-white">Climate Editor</option>
                        <option value="admin" className="bg-slate-900 text-white">Super Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 font-medium text-slate-400">
                      {u.favorites.length} stations
                    </td>

                    <td className="p-4 text-slate-400 font-mono text-[11px]">{u.createdAt}</td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit User Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        disabled={isSelf}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                        title={u.status === 'active' ? 'Suspend User' : 'Reactivate User'}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${u.name}?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        disabled={isSelf}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors disabled:opacity-40 cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">
                    {editingUser ? 'Edit Personnel Clearance' : 'Enlist New Personnel'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {editingUser ? editingUser.id : 'NEW REGISTRATION'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Bouchard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@weatherca.net"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Clearance Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold focus:outline-none focus:border-purple-400"
                  >
                    <option value="user">Member (User)</option>
                    <option value="editor">Climate Editor</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold focus:outline-none focus:border-purple-400"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Tactical Avatar Emoji</label>
                <div className="flex items-center gap-2">
                  {['🍁', '🔬', '⚡', '🛰️', '🧭', '🛡️', '❄️'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setFormData({ ...formData, avatar: emoji })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                        formData.avatar === emoji
                          ? 'bg-purple-600/30 border-purple-500 scale-110'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  {editingUser ? 'Save Clearance' : 'Enlist Personnel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
