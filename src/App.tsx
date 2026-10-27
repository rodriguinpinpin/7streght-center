/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginScreen } from './components/auth/LoginScreen';

// Client Views
import { ClientDashboard } from './components/client/ClientDashboard';
import { ClientRoutine } from './components/client/ClientRoutine';
import { ClientProgress } from './components/client/ClientProgress';
import { ClientClasses } from './components/client/ClientClasses';
import { ClientProfile } from './components/client/ClientProfile';
import { ClientBottomNav } from './components/client/ClientBottomNav';

// Admin Views
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminClients } from './components/admin/AdminClients';
import { AdminClasses } from './components/admin/AdminClasses';
import { AdminPayments } from './components/admin/AdminPayments';

const MainLayout: React.FC = () => {
  const { isLoggedIn, activeRole, activeTab, setActiveTab } = useGym();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#101014] flex flex-col antialiased">
      <Header />

      {activeRole === 'client' ? (
        /* Client Interface */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && <ClientDashboard />}
          {activeTab === 'routine' && <ClientRoutine />}
          {activeTab === 'progress' && <ClientProgress />}
          {activeTab === 'classes' && <ClientClasses />}
          {activeTab === 'profile' && <ClientProfile />}

          <ClientBottomNav />
        </main>
      ) : (
        /* Admin Interface */
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          {/* Admin Mobile Navigation Sub-bar */}
          <div className="md:hidden bg-[#101014] border-b border-neutral-800 p-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {[
              { id: 'dashboard', label: 'Panel' },
              { id: 'clients', label: 'Clientes' },
              { id: 'classes', label: 'Clases' },
              { id: 'payments', label: 'Pagos (S/)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#DC1F32] text-white'
                    : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Admin Main Viewport */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'clients' && <AdminClients />}
            {activeTab === 'classes' && <AdminClasses />}
            {activeTab === 'payments' && <AdminPayments />}
          </main>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <GymProvider>
      <MainLayout />
    </GymProvider>
  );
}
