import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Dumbbell,
  Calendar,
  CreditCard,
  Edit,
  UserCheck,
  UserX,
  X,
  ChevronRight,
  Phone,
  Mail,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { UserProfile } from '../../types/gym';
import { filterClients } from '../../utils/gymLogic';

export const AdminClients: React.FC = () => {
  const { clients, registerClient, updateClient, toggleClientStatus, routine, showToast } =
    useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New Client Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+51 ');
  const [newDni, setNewDni] = useState('');
  const [newPlan, setNewPlan] = useState<'Mensual' | 'Trimestral' | 'Semestral' | 'Anual'>('Mensual');

  const filtered = filterClients(clients, searchQuery, statusFilter);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Por favor completa el nombre y correo del cliente', 'error');
      return;
    }

    const expires = new Date();
    expires.setMonth(expires.getMonth() + (newPlan === 'Anual' ? 12 : newPlan === 'Trimestral' ? 3 : 1));

    registerClient({
      name: newName,
      email: newEmail,
      phone: newPhone,
      dni: newDni || `${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      membershipPlan: newPlan,
      membershipStatus: 'Activo',
      membershipExpiresAt: expires.toISOString().split('T')[0],
      assignedRoutineId: 'routine-fuerza-1',
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('+51 ');
    setNewDni('');
    setShowRegisterModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Base de Datos de Atletas & Clientes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
            Gestión Integral de Clientes
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Control de membresías, rutinas asignadas y perfiles de entrenamiento.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-4 py-2.5 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o DNI..."
            className="w-full pl-9 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC1F32]"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'activo', label: 'Activos' },
            { id: 'por vencer', label: 'Por vencer' },
            { id: 'inactivo', label: 'Inactivos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Plan & Vencimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {filtered.map((client) => {
                const isActivo = client.membershipStatus === 'Activo';
                const isExpiring = client.membershipStatus === 'Por vencer';

                return (
                  <tr
                    key={client.id}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-200"
                        />
                        <div>
                          <p className="font-semibold text-neutral-900">{client.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">DNI: {client.dni}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      <p>{client.email}</p>
                      <p className="text-[11px] text-neutral-400">{client.phone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-neutral-800">{client.membershipPlan}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Vence: {client.membershipExpiresAt}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isActivo
                            ? 'bg-emerald-50 text-emerald-700'
                            : isExpiring
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isActivo && <CheckCircle2 className="w-3 h-3" />}
                        {isExpiring && <AlertCircle className="w-3 h-3" />}
                        {!isActivo && !isExpiring && <XCircle className="w-3 h-3" />}
                        {client.membershipStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                        }}
                        className="px-3 py-1.5 bg-neutral-100 group-hover:bg-[#DC1F32] group-hover:text-white text-neutral-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-neutral-100">
          {filtered.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="p-4 flex items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={client.avatar}
                  alt={client.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200"
                />
                <div>
                  <h3 className="font-heading font-bold text-xs text-neutral-900">{client.name}</h3>
                  <p className="text-[11px] text-neutral-500 font-mono">{client.membershipPlan}</p>
                  <span
                    className={`inline-block text-[10px] font-semibold mt-0.5 ${
                      client.membershipStatus === 'Activo'
                        ? 'text-emerald-600'
                        : client.membershipStatus === 'Por vencer'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    ● {client.membershipStatus}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Client Detail Drawer / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl text-neutral-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors"
              aria-label="Cerrar ficha"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
              <img
                src={selectedClient.avatar}
                alt={selectedClient.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#DC1F32]"
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#DC1F32] font-bold">
                  Ficha Oficial del Atleta
                </span>
                <h2 className="text-lg font-heading font-black text-neutral-900">
                  {selectedClient.name}
                </h2>
                <p className="text-xs text-neutral-500 font-mono">DNI: {selectedClient.dni}</p>
              </div>
            </div>

            {/* Client Details Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-b border-neutral-100 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50">
                <span className="text-neutral-400 font-medium block">Correo</span>
                <span className="font-semibold text-neutral-900 break-all">{selectedClient.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50">
                <span className="text-neutral-400 font-medium block">Teléfono</span>
                <span className="font-semibold text-neutral-900">{selectedClient.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50">
                <span className="text-neutral-400 font-medium block">Membresía</span>
                <span className="font-semibold text-neutral-900">{selectedClient.membershipPlan}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50">
                <span className="text-neutral-400 font-medium block">Vencimiento</span>
                <span className="font-semibold text-neutral-900">{selectedClient.membershipExpiresAt}</span>
              </div>
            </div>

            {/* Routine Assignment */}
            <div className="py-4 border-b border-neutral-100">
              <h3 className="text-xs font-heading font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Rutina Asignada Actualmente
              </h3>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{routine.title}</p>
                  <p className="text-[11px] text-neutral-500">{routine.days.length} días de entrenamiento</p>
                </div>
                <button
                  onClick={() => showToast(`Rutina confirmada para ${selectedClient.name}`, 'success')}
                  className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Reasignar
                </button>
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleClientStatus(selectedClient.id);
                  setSelectedClient({
                    ...selectedClient,
                    membershipStatus:
                      selectedClient.membershipStatus === 'Activo' ? 'Inactivo' : 'Activo',
                  });
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                  selectedClient.membershipStatus === 'Activo'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {selectedClient.membershipStatus === 'Activo' ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Suspender Cuenta</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Activar Cuenta</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Client Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl text-neutral-900">
            <h2 className="text-lg font-heading font-black text-neutral-900 mb-1">
              Inscripción de Nuevo Atleta
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              Crea el perfil del cliente para habilitar su acceso a rutinas y clases.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sebastián Vargas"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="sebastian@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+51 987 111 222"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    DNI / Documento
                  </label>
                  <input
                    type="text"
                    placeholder="75892014"
                    value={newDni}
                    onChange={(e) => setNewDni(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Plan de Membresía
                </label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                >
                  <option value="Mensual">Mensual (S/ 220)</option>
                  <option value="Trimestral">Trimestral (S/ 550)</option>
                  <option value="Semestral">Semestral (S/ 980)</option>
                  <option value="Anual">Anual VIP (S/ 1,800)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                >
                  Registrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
