'use client';

import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'editor' | 'user';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  favorites: string[];
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface BroadcastAlert {
  message: string;
  severity: 'warning' | 'watch' | 'advisory';
  active: boolean;
  issuedAt: string;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  broadcastAlert: BroadcastAlert | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleFavorite: (citySlug: string) => void;
  isFavorite: (citySlug: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  // Admin Methods
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  addUser: (userData: { name: string; email: string; role: UserRole; status?: UserStatus; avatar?: string }) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  setBroadcastAlert: (alert: BroadcastAlert | null) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Chief Meteorological Officer',
    email: 'admin@weatherca.net',
    role: 'admin',
    status: 'active',
    avatar: '🇨🇦',
    favorites: ['toronto', 'vancouver', 'montreal'],
    notificationsEnabled: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'usr_editor_01',
    name: 'Sarah Jenkins (Atmospheric Editor)',
    email: 'editor@weatherca.net',
    role: 'editor',
    status: 'active',
    avatar: '🌤️',
    favorites: ['calgary', 'ottawa'],
    notificationsEnabled: true,
    createdAt: '2025-02-14',
  },
  {
    id: 'usr_user_01',
    name: 'Alexandre Tremblay',
    email: 'alex.tremblay@weatherca.net',
    role: 'user',
    status: 'active',
    avatar: '🍁',
    favorites: ['quebec-city', 'halifax'],
    notificationsEnabled: false,
    createdAt: '2025-03-01',
  },
];

const DEFAULT_BROADCAST: BroadcastAlert = {
  message: 'ENVIRONMENT CANADA: Flash Freeze & Winter Storm Warning active for High-Speed Corridors across Southern Ontario and Quebec.',
  severity: 'warning',
  active: true,
  issuedAt: '14:30 EST',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_current_user');
        if (saved) return JSON.parse(saved);
        localStorage.setItem('weatherca_current_user', JSON.stringify(DEFAULT_USERS[0]));
      } catch {
        // ignore
      }
    }
    return DEFAULT_USERS[0];
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_users');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_USERS;
  });

  const [broadcastAlert, setBroadcastAlertState] = useState<BroadcastAlert | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_broadcast_alert');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_BROADCAST;
  });

  const saveUsers = (users: User[]) => {
    setAllUsers(users);
    localStorage.setItem('weatherca_users', JSON.stringify(users));
  };

  const login = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'User not found. Check credentials or register a new account.' };
    }
    if (found.status === 'suspended') {
      return { success: false, error: 'This account has been suspended by an administrator.' };
    }

    setUser(found);
    localStorage.setItem('weatherca_current_user', JSON.stringify(found));
    return { success: true };
  };

  const register = async (name: string, email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    const exists = allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'user',
      status: 'active',
      avatar: '🍁',
      favorites: ['toronto', 'vancouver'],
      notificationsEnabled: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...allUsers, newUser];
    saveUsers(updated);
    setUser(newUser);
    localStorage.setItem('weatherca_current_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('weatherca_current_user');
  };

  const toggleFavorite = (citySlug: string) => {
    if (!user) return;
    const isFav = user.favorites.includes(citySlug);
    const newFavs = isFav
      ? user.favorites.filter((f) => f !== citySlug)
      : [...user.favorites, citySlug];

    const updatedUser = { ...user, favorites: newFavs };
    setUser(updatedUser);
    localStorage.setItem('weatherca_current_user', JSON.stringify(updatedUser));

    const updatedAll = allUsers.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedAll);
  };

  const isFavorite = (citySlug: string): boolean => {
    return user ? user.favorites.includes(citySlug) : false;
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    const updated = allUsers.map((u) => (u.id === userId ? { ...u, role } : u));
    saveUsers(updated);
    if (user && user.id === userId) {
      const selfUpdated = { ...user, role };
      setUser(selfUpdated);
      localStorage.setItem('weatherca_current_user', JSON.stringify(selfUpdated));
    }
  };

  const toggleUserStatus = (userId: string) => {
    const updated = allUsers.map((u) =>
      u.id === userId ? { ...u, status: (u.status === 'active' ? 'suspended' : 'active') as UserStatus } : u
    );
    saveUsers(updated);
  };

  const deleteUser = (userId: string) => {
    const updated = allUsers.filter((u) => u.id !== userId);
    saveUsers(updated);
    if (user && user.id === userId) {
      logout();
    }
  };

  const addUser = (userData: { name: string; email: string; role: UserRole; status?: UserStatus; avatar?: string }) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status || 'active',
      avatar: userData.avatar || '🍁',
      favorites: ['toronto', 'montreal'],
      notificationsEnabled: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newUser, ...allUsers];
    saveUsers(updated);
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    const updated = allUsers.map((u) => (u.id === userId ? { ...u, ...data } : u));
    saveUsers(updated);
    if (user && user.id === userId) {
      const selfUpdated = { ...user, ...data };
      setUser(selfUpdated);
      localStorage.setItem('weatherca_current_user', JSON.stringify(selfUpdated));
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const selfUpdated = { ...user, ...data };
    setUser(selfUpdated);
    localStorage.setItem('weatherca_current_user', JSON.stringify(selfUpdated));
    const updated = allUsers.map((u) => (u.id === user.id ? selfUpdated : u));
    saveUsers(updated);
  };

  const setBroadcastAlert = (alert: BroadcastAlert | null) => {
    setBroadcastAlertState(alert);
    if (alert) {
      localStorage.setItem('weatherca_broadcast_alert', JSON.stringify(alert));
    } else {
      localStorage.removeItem('weatherca_broadcast_alert');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        broadcastAlert,
        login,
        register,
        logout,
        toggleFavorite,
        isFavorite,
        updateProfile,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        addUser,
        updateUser,
        setBroadcastAlert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
