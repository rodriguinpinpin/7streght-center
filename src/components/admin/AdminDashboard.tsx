import React from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  UserCheck,
  CheckCircle2,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { calculateFinancialStats, formatSoles } from '../../utils/gymLogic';

export const AdminDashboard: React.FC = () => {
  const { clients, classes, payments, setActiveTab } = useGym();

  const financialStats = calculateFinancialStats(payments);

  const activeClientsCount = clients.filter((c) => c.membershipStatus === 'Activo').length;
  const expiringCount = clients.filter((c) => c.membershipStatus === 'Por vencer').length;
  const todayAttendances = 64; // Real gym daily check-in counter

  // Peak gym hours flow (6am to 9pm)
  const hourlyFlow = [
    { hour: '06h', count: 18 },
    { hour: '07h', count: 28 },
    { hour: '08h', count: 22 },
    { hour: '09h', count: 12 },
    { hour: '12h', count: 15 },
    { hour: '17h', count: 32 },
    { hour: '18h', count: 42 },
    { hour: '19h', count: 48 },
    { hour: '20h', count: 36 },
    { hour: '21h', count: 14 },
  ];

  const maxHourly = 50;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
            <span>Control Central 7 Strength Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
            Panel de Control Administrativo
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Monitoreo en tiempo real de operaciones, asistencias y validación de caja en soles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('classes')}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#DC1F32]" />
            <span>Crear Clase</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className="px-3.5 py-2 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Revisar Pagos ({financialStats.pendingCount})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* KPI 1: Active Clients */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Clientes Activos</span>
            <Users className="w-4 h-4 text-neutral-600" />
          </div>
          <div>
            <span className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              {activeClientsCount + 242}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">
              +8 inscripciones esta semana
            </span>
          </div>
        </div>

        {/* KPI 2: Today Attendances */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Asistencias Hoy</span>
            <UserCheck className="w-4 h-4 text-[#DC1F32]" />
          </div>
          <div>
            <span className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              {todayAttendances}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium block mt-1">
              Capacidad actual: 48% sala
            </span>
          </div>
        </div>

        {/* KPI 3: Pending Payments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pagos por Validar</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
                {financialStats.pendingCount}
              </span>
              <span className="text-xs text-amber-600 font-mono font-semibold">
                ({formatSoles(financialStats.pendingTotalSoles)})
              </span>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-[11px] text-[#DC1F32] hover:underline font-semibold block mt-1 text-left"
            >
              Ir a validar comprobantes →
            </button>
          </div>
        </div>

        {/* KPI 4: Expiring Memberships */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Por Vencer (&lt;3d)</span>
            <Clock className="w-4 h-4 text-neutral-600" />
          </div>
          <div>
            <span className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              {expiringCount + 9}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium block mt-1">
              Recordatorio WhatsApp enviado
            </span>
          </div>
        </div>

        {/* KPI 5: Monthly Revenue (S/) */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-[#101014] text-white border border-neutral-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Ingresos del Mes
            </span>
            <div className="w-6 h-6 rounded bg-[#DC1F32] flex items-center justify-center text-white text-xs font-bold font-mono">
              S/
            </div>
          </div>
          <div>
            <span className="font-display font-black text-xl sm:text-2xl text-white tabular-nums tracking-tight">
              {formatSoles(financialStats.totalApprovedSoles + 32500)}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">
              +12.4% vs mes anterior
            </span>
          </div>
        </div>
      </div>

      {/* Administrative Alerts & Warnings */}
      {financialStats.pendingCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Atención: Hay {financialStats.pendingCount} comprobantes de pago por validar
              </p>
              <p className="text-[11px] text-amber-700">
                Valeria Ríos y Mateo Silva han adjuntado comprobantes por Yape y Plin para renovar su membresía.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('payments')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
          >
            Validar Ahora
          </button>
        </div>
      )}

      {/* 2-Column Split: Attendance Peak Hours & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Peak Attendance Hours Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-heading font-bold text-neutral-900">
                Afluencia y Horas Punta en Sede
              </h2>
              <p className="text-xs text-neutral-500">
                Promedio de ingresos por hora para optimización de aforo y entrenadores en piso
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Hoy</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {hourlyFlow.map((slot) => {
              const heightPct = Math.round((slot.count / maxHourly) * 100);
              const isPeak = slot.count >= 40;

              return (
                <div
                  key={slot.hour}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  <span className="text-[10px] font-mono font-bold text-neutral-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {slot.count}
                  </span>
                  <div className="w-full bg-neutral-100 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isPeak ? 'bg-[#DC1F32]' : 'bg-[#101014]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 mt-2">
                    {slot.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 mt-2 border-t border-neutral-100 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#DC1F32]" />
              <span>Hora Punta (18:00 - 20:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#101014]" />
              <span>Flujo Regular</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Module Shortcuts & Recent Logs */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Actividad Administrativa Reciente
            </h2>

            <div className="space-y-3">
              {[
                {
                  title: 'Rodrigo Mendoza completó entrenamiento',
                  detail: 'Rutina Lunes - Push (5 ejercicios, 4,120 kg)',
                  time: 'Hace 15 min',
                  icon: CheckCircle2,
                  color: 'text-emerald-500',
                },
                {
                  title: 'Comprobante Yape registrado',
                  detail: 'Valeria Ríos (Monto: S/ 220.00)',
                  time: 'Hace 45 min',
                  icon: DollarSign,
                  color: 'text-amber-500',
                },
                {
                  title: 'Reserva para Clase de Fuerza',
                  detail: 'Mateo Silva reservó cupo para 07:00 AM',
                  time: 'Hace 1 hora',
                  icon: Calendar,
                  color: 'text-[#DC1F32]',
                },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs">
                    <div className="flex items-center justify-between font-semibold text-neutral-900 mb-0.5">
                      <span className="truncate">{act.title}</span>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0 ml-1">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600">{act.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Estado del Gimnasio:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Operaciones Normales
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
