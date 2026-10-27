import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  UserCheck,
  ChevronRight,
  Shield,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const AdminSidebar: React.FC = () => {
  const { activeTab, setActiveTab, payments, switchRole, currentUser } = useGym();

  const pendingPaymentsCount = payments.filter((p) => p.status === 'Pendiente').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'clients',
      label: 'Gestión de Clientes',
      icon: Users,
      badge: null,
    },
    {
      id: 'classes',
      label: 'Clases & Asistencia',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'payments',
      label: 'Control de Pagos (S/)',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} pend.` : null,
      badgeColor: 'bg-[#DC1F32] text-white',
    },
  ];

  return (
    <aside className="w-64 bg-[#101014] text-white border-r border-neutral-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div>
        {/* Admin Navigation Menu */}
        <div className="p-4 space-y-1">
          <div className="text-[11px] font-mono text-neutral-400 px-3 py-2 uppercase tracking-wider">
            Gestión Gimnasio
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#DC1F32] text-white shadow-md font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                      isActive ? 'bg-white text-[#DC1F32]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Bottom Switcher & Profile Card */}
      <div className="p-4 border-t border-neutral-800/80 space-y-3">
        <button
          onClick={() => switchRole('client')}
          className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-neutral-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Modo Cliente</span>
        </button>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-neutral-400 truncate">Director & Head Coach</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
