import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, Flame } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { INITIAL_ADMIN, INITIAL_CLIENT } from '../../data/mockData';

export const LoginScreen: React.FC = () => {
  const { loginAs, showToast } = useGym();

  const [roleTab, setRoleTab] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('rodrigo.mendoza@email.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleTabChange = (role: 'client' | 'admin') => {
    setRoleTab(role);
    setErrorMsg('');
    if (role === 'admin') {
      setEmail('carlos.director@7strengthcenter.pe');
      setPassword('admin2026');
    } else {
      setEmail('rodrigo.mendoza@email.com');
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }

    if (roleTab === 'admin') {
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('carlos')) {
        loginAs(INITIAL_ADMIN);
      } else {
        loginAs({
          ...INITIAL_ADMIN,
          name: 'Administrador 7 Strength',
          email,
        });
      }
    } else {
      if (email.toLowerCase().includes('rodrigo')) {
        loginAs(INITIAL_CLIENT);
      } else {
        loginAs({
          ...INITIAL_CLIENT,
          name: email.split('@')[0],
          email,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#DC1F32]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#DC1F32]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DC1F32] font-heading font-black text-white text-2xl shadow-xl shadow-[#DC1F32]/25 mb-4">
            7
          </div>
          <h1 className="text-2xl font-heading font-black tracking-tight text-white">
            7 STRENGTH <span className="text-[#DC1F32]">CENTER</span>
          </h1>
          <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase mt-1">
            High Performance Training Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141418] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Role Tabs */}
          <div className="flex rounded-xl bg-neutral-900 p-1 mb-6 border border-neutral-800">
            <button
              type="button"
              onClick={() => handleRoleTabChange('client')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                roleTab === 'client'
                  ? 'bg-[#DC1F32] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Acceso Cliente
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                roleTab === 'admin'
                  ? 'bg-[#DC1F32] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acceso Administrador</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC1F32] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-300">Contraseña</label>
                <span className="text-[11px] text-[#DC1F32] hover:underline cursor-pointer">
                  ¿Olvidaste tu clave?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC1F32] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-[#DC1F32] hover:bg-[#b81827] text-white font-semibold text-xs rounded-xl shadow-lg shadow-[#DC1F32]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{roleTab === 'admin' ? 'Ingresar como Administrador' : 'Ingresar a Mi Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block text-center mb-3">
              Acceso Rápido Demostrativo
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAs(INITIAL_CLIENT)}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
              >
                <span className="text-[10px] text-[#DC1F32] font-mono block">Cliente Demo</span>
                <span className="text-xs font-bold text-white block">Rodrigo Mendoza</span>
              </button>
              <button
                type="button"
                onClick={() => loginAs(INITIAL_ADMIN)}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
              >
                <span className="text-[10px] text-neutral-400 font-mono block">Admin Demo</span>
                <span className="text-xs font-bold text-white block">Carlos Guerrero</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
