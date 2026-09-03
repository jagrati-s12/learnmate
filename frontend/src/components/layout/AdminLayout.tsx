import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* We can use a custom admin topbar or reuse the existing one with passed props if it supports it, but reusing it works for now or simplified inline: */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">Admin Control Center</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">{user?.email} (Admin)</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
