import React, { useState } from 'react';
import {
  Dumbbell,
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  LogOut,
  Shield,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeRole,
    switchRole,
    logout,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    activeTab,
    setActiveTab,
  } = useGym();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const clientNavLinks = [
    { id: 'dashboard', label: 'Inicio' },
    { id: 'routine', label: 'Mi rutina' },
    { id: 'progress', label: 'Mi progreso' },
    { id: 'classes', label: 'Reservar clase' },
    { id: 'profile', label: 'Mi perfil' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#101014] text-white border-b border-neutral-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#DC1F32] flex items-center justify-center font-heading font-black text-white text-lg tracking-wider shadow-md group-hover:scale-105 transition-transform">
                7
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base tracking-tight text-white leading-none">
                  STRENGTH <span className="text-[#DC1F32]">CENTER</span>
                </span>
                <span className="text-[10px] text-neutral-400 tracking-widest font-mono uppercase mt-0.5">
                  High Performance
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Client Mode on Desktop) */}
          {activeRole === 'client' ? (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {clientNavLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-white bg-neutral-800/90 font-semibold'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-white font-medium">Panel Administrativo</span>
              <span>/</span>
              <span className="capitalize text-[#DC1F32]">
                {activeTab === 'dashboard'
                  ? 'Visión General'
                  : activeTab === 'clients'
                  ? 'Gestión de Clientes'
                  : activeTab === 'classes'
                  ? 'Programación de Clases'
                  : 'Control de Pagos'}
              </span>
            </div>
          )}

          {/* Zone 3: Quick Role Switcher, Notifications, and Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Role Switcher Button */}
            <div className="flex items-center bg-neutral-900 border border-neutral-700/80 rounded-lg p-0.5">
              <button
                onClick={() => switchRole('client')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeRole === 'client'
                    ? 'bg-[#DC1F32] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Cambiar a vista de Cliente"
              >
                Cliente
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeRole === 'admin'
                    ? 'bg-[#DC1F32] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Cambiar a vista de Administrador"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC1F32] rounded-full ring-2 ring-[#101014]" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#18181D] border border-neutral-800 rounded-xl shadow-2xl p-4 z-50 text-neutral-100">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                    <span className="font-heading font-semibold text-sm">Notificaciones</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-neutral-400 hover:text-neutral-200"
                      >
                        Limpiar todas
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-neutral-400">
                        No tienes notificaciones pendientes
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-neutral-900/60 opacity-70' : 'bg-neutral-800/80 border-l-2 border-[#DC1F32]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium text-white mb-1">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-neutral-400">{n.timestamp}</span>
                          </div>
                          <p className="text-neutral-300 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-800 transition-colors focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700"
                />
                <span className="hidden sm:inline-block text-xs font-medium text-neutral-200 max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#18181D] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 text-neutral-200 text-xs">
                  <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                    <p className="font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-[#DC1F32] font-mono mt-0.5 uppercase tracking-wide">
                      Rol: {currentUser.role === 'admin' ? 'Administrador' : 'Cliente Oficial'}
                    </p>
                  </div>

                  {activeRole === 'client' && (
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      Mi Perfil & Membresía
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle (Client mode) */}
            {activeRole === 'client' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg focus:outline-none"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu for Client Links */}
        {mobileMenuOpen && activeRole === 'client' && (
          <div className="md:hidden py-3 border-t border-neutral-800 space-y-1">
            {clientNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === link.id
                    ? 'text-white bg-[#DC1F32] font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
