import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Calendar, CreditCard, Save, CheckCircle2 } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const ClientProfile: React.FC = () => {
  const { currentUser, updateClient, showToast } = useGym();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [emergencyContact, setEmergencyContact] = useState(
    currentUser.emergencyContact || 'María Mendoza (+51 912 345 678)'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient({
      ...currentUser,
      name,
      email,
      phone,
      emergencyContact,
    });
    showToast('Perfil actualizado correctamente', 'success');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101014] text-white border border-neutral-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-2xl object-cover ring-2 ring-[#DC1F32]"
          />
          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#DC1F32]/20 text-[#DC1F32] font-mono text-xs font-semibold uppercase tracking-wider">
              Miembro Oficial · {currentUser.membershipPlan}
            </div>
            <h1 className="text-2xl font-heading font-black">{currentUser.name}</h1>
            <p className="text-xs text-neutral-400 font-mono">DNI: {currentUser.dni || '74829104'}</p>
          </div>
        </div>
      </div>

      {/* Membership Info Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Plan Activo</span>
          <p className="font-heading font-bold text-lg text-neutral-900 mt-1">
            {currentUser.membershipPlan}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Estado: {currentUser.membershipStatus}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Vencimiento</span>
          <p className="font-heading font-bold text-lg text-neutral-900 mt-1">
            {currentUser.membershipExpiresAt}
          </p>
          <span className="text-xs text-neutral-500 mt-2 block">
            Renovación automática habilitada
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Miembro Desde</span>
          <p className="font-heading font-bold text-lg text-neutral-900 mt-1">
            {currentUser.joinedAt}
          </p>
          <span className="text-xs text-neutral-500 mt-2 block font-mono">
            Sede: Javier Prado / Lima
          </span>
        </div>
      </div>

      {/* Editable Contact Info Form */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <h2 className="text-base font-heading font-bold text-neutral-900 mb-1">
          Información Personal y de Contacto
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Actualiza tus datos para emergencias y notificaciones de reservas.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Teléfono Móvil
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Contacto de Emergencia
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
