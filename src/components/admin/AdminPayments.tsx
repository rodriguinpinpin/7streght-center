import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  DollarSign,
  FileText,
  Calendar,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { calculateFinancialStats, formatSoles } from '../../utils/gymLogic';
import { PaymentRecord } from '../../types/gym';

export const AdminPayments: React.FC = () => {
  const { payments, approvePayment, rejectPayment, registerPayment, clients, showToast } =
    useGym();

  const [statusTab, setStatusTab] = useState<'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado'>('Pendiente');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterPaymentModal, setShowRegisterPaymentModal] = useState(false);

  // Manual payment state
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [manualPlan, setManualPlan] = useState<'Membresía Mensual' | 'Plan Trimestral' | 'Plan Anual VIP' | 'Pase Diario'>('Membresía Mensual');
  const [manualAmount, setManualAmount] = useState(220);
  const [manualMethod, setManualMethod] = useState<'Yape' | 'Plin' | 'Transferencia BCP' | 'Tarjeta de Crédito' | 'Efectivo'>('Yape');
  const [manualVoucher, setManualVoucher] = useState('REC-00192');

  const financialStats = calculateFinancialStats(payments);

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusTab === 'Todos' || p.status === statusTab;
    const matchesQuery =
      searchQuery === '' ||
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleRegisterManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];

    registerPayment({
      userId: client.id,
      userName: client.name,
      userEmail: client.email,
      planName: manualPlan,
      amountSoles: Number(manualAmount),
      paymentMethod: manualMethod,
      voucherCode: manualVoucher || `REC-${Math.floor(10000 + Math.random() * 90000)}`,
    });

    setShowRegisterPaymentModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Caja & Facturación en Soles Peruanos (S/)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
            Gestión y Validación de Pagos
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Revisa comprobantes transferidos vía Yape, Plin y BCP, o registra pagos directos en recepción.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterPaymentModal(true)}
          className="px-4 py-2.5 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Pago en Recepción</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Approved total */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Ingresos Aprobados (Mes)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              {formatSoles(financialStats.totalApprovedSoles + 32500)}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            {financialStats.approvedCount + 142} transacciones validadas
          </span>
        </div>

        {/* Pending total */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Pendientes de Validación
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-heading font-black text-2xl sm:text-3xl text-amber-600 tabular-nums">
              {formatSoles(financialStats.pendingTotalSoles)}
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium block mt-1">
            {financialStats.pendingCount} comprobantes esperan tu revisión
          </span>
        </div>

        {/* Total Payments in system */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Historial de Operaciones
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tabular-nums">
              {payments.length}
            </span>
            <span className="text-xs text-neutral-500 font-mono">registros</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono block mt-1">
            {financialStats.rejectedCount} rechazados por error de voucher
          </span>
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['Pendiente', 'Aprobado', 'Rechazado', 'Todos'] as const).map((tab) => {
            const count =
              tab === 'Pendiente'
                ? financialStats.pendingCount
                : tab === 'Aprobado'
                ? financialStats.approvedCount
                : tab === 'Rechazado'
                ? financialStats.rejectedCount
                : payments.length;

            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  statusTab === tab
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    tab === 'Pendiente' && count > 0
                      ? 'bg-[#DC1F32] text-white'
                      : 'bg-neutral-300/60 text-neutral-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, voucher o método..."
            className="w-full pl-9 pr-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC1F32]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No se encontraron transacciones en esta vista.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Plan / Concepto</th>
                  <th className="py-3 px-4">Monto (S/)</th>
                  <th className="py-3 px-4">Método & Comprobante</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {filteredPayments.map((payment) => {
                  const isPendiente = payment.status === 'Pendiente';
                  const isAprobado = payment.status === 'Aprobado';
                  const isRechazado = payment.status === 'Rechazado';

                  return (
                    <tr key={payment.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-neutral-900">{payment.userName}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">{payment.userEmail}</p>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-neutral-800">
                        {payment.planName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-heading font-black text-sm text-neutral-900 tabular-nums">
                          {formatSoles(payment.amountSoles)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-800 text-[11px]">
                            {payment.paymentMethod}
                          </span>
                          <span className="font-mono text-neutral-500 text-[11px]">
                            {payment.voucherCode}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">
                        {payment.date}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isAprobado
                              ? 'bg-emerald-50 text-emerald-700'
                              : isPendiente
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isAprobado && <CheckCircle2 className="w-3 h-3" />}
                          {isPendiente && <Clock className="w-3 h-3" />}
                          {isRechazado && <XCircle className="w-3 h-3" />}
                          {payment.status}
                        </span>
                        {payment.reviewedAt && (
                          <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
                            {payment.reviewedAt}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPendiente ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approvePayment(payment.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              title="Aprobar pago y activar membresía"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Aprobar</span>
                            </button>
                            <button
                              onClick={() => rejectPayment(payment.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition-colors border border-rose-200"
                              title="Rechazar comprobante"
                            >
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-neutral-400">
                            Procesado por {payment.reviewedBy || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Payment Registration Modal */}
      {showRegisterPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl text-neutral-900">
            <h2 className="text-lg font-heading font-black text-neutral-900 mb-1">
              Registro de Pago en Recepción
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              Ingresa los detalles para registrar y validar el pago de un cliente en Soles (S/).
            </p>

            <form onSubmit={handleRegisterManualPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Seleccionar Cliente
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Plan / Concepto
                  </label>
                  <select
                    value={manualPlan}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setManualPlan(val);
                      if (val === 'Membresía Mensual') setManualAmount(220);
                      else if (val === 'Plan Trimestral') setManualAmount(550);
                      else if (val === 'Plan Anual VIP') setManualAmount(1800);
                      else setManualAmount(35);
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  >
                    <option value="Membresía Mensual">Membresía Mensual</option>
                    <option value="Plan Trimestral">Plan Trimestral</option>
                    <option value="Plan Anual VIP">Plan Anual VIP</option>
                    <option value="Pase Diario">Pase Diario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Monto en Soles (S/)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  >
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                    <option value="Transferencia BCP">Transferencia BCP</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito / POS</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    N° Comprobante / Voucher
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="BCP-19284"
                    value={manualVoucher}
                    onChange={(e) => setManualVoucher(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-mono focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterPaymentModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                >
                  Guardar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
