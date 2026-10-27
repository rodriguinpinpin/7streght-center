import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Target,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { PersonalRecord } from '../../types/gym';

export const ClientProgress: React.FC = () => {
  const { personalRecords, savePersonalRecord, workoutLogs } = useGym();

  const [activeChartTab, setActiveChartTab] = useState<'volume' | 'strength'>('volume');
  const [showAddPRModal, setShowAddPRModal] = useState<boolean>(false);

  // New PR form states
  const [prExercise, setPrExercise] = useState<string>('Press de banca plano');
  const [prWeight, setPrWeight] = useState<number>(112.5);

  // Weekly volume data (Kg lifted across 4 weeks)
  const volumeData = [
    { week: 'Semana 1', kg: 14200, label: '14.2 t' },
    { week: 'Semana 2', kg: 16800, label: '16.8 t' },
    { week: 'Semana 3', kg: 18100, label: '18.1 t' },
    { week: 'Semana 4 (Actual)', kg: 21400, label: '21.4 t' },
  ];

  const maxVolume = 24000;

  // Strength evolution (Index out of 100)
  const strengthData = [
    { week: 'Semana 1', index: 78 },
    { week: 'Semana 2', index: 82 },
    { week: 'Semana 3', index: 86 },
    { week: 'Semana 4', index: 92 },
  ];

  const handleSavePR = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = personalRecords.find((r) => r.exerciseName === prExercise);
    savePersonalRecord({
      exerciseName: prExercise,
      oneRepMaxKg: Number(prWeight),
      previousRecordKg: existing ? existing.oneRepMaxKg : Number(prWeight) - 5,
      improvementKg: existing ? Number(prWeight) - existing.oneRepMaxKg : 5,
    });
    setShowAddPRModal(false);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas de Rendimiento Físico</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
            Mi Progreso & Evolución de Fuerza
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Registro biométrico de sobrecarga progresiva y volumen total levantado.
          </p>
        </div>

        <button
          onClick={() => setShowAddPRModal(true)}
          className="px-4 py-2 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#DC1F32]/25 transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Récord</span>
        </button>
      </div>

      {/* Top 3 Personal Records Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-heading font-bold text-neutral-900 uppercase tracking-wider">
            Récords Personales (1RM Estimado)
          </h2>
          <span className="text-xs text-neutral-500 font-mono">Sobrecarga Progresiva</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalRecords.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-[11px] font-mono uppercase text-neutral-500">
                    Marca Oficial
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-heading font-bold text-sm text-neutral-900 mb-2">
                  {record.exerciseName}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-neutral-900 tabular-nums">
                    {record.oneRepMaxKg}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">kg</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{record.improvementKg} kg
                </span>
                <span className="text-neutral-400 text-[11px] font-mono">
                  {record.dateAchieved}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-6">
          <div>
            <h2 className="text-base font-heading font-bold text-neutral-900">
              {activeChartTab === 'volume'
                ? 'Volumen Total Levantado por Semana'
                : 'Índice de Fuerza Relativa'}
            </h2>
            <p className="text-xs text-neutral-500">
              Datos acumulados de series de trabajo efectivas (kg × repeticiones)
            </p>
          </div>

          <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveChartTab('volume')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeChartTab === 'volume'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Volumen (Kg)
            </button>
            <button
              onClick={() => setActiveChartTab('strength')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeChartTab === 'strength'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Curva de Fuerza
            </button>
          </div>
        </div>

        {/* Chart View */}
        {activeChartTab === 'volume' ? (
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-4 sm:gap-8 pt-8 pb-4 px-2 sm:px-6">
              {volumeData.map((item, i) => {
                const heightPct = Math.round((item.kg / maxVolume) * 100);
                const isCurrent = i === volumeData.length - 1;

                return (
                  <div
                    key={item.week}
                    className="flex-1 flex flex-col items-center h-full justify-end group"
                  >
                    {/* Tooltip on bar */}
                    <div className="mb-2 text-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="font-heading font-bold text-xs sm:text-sm text-neutral-900 tabular-nums">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-neutral-400 block font-mono">
                        {item.kg.toLocaleString('es-PE')} kg
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[64px] bg-neutral-100 rounded-t-xl overflow-hidden h-full flex items-end">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                          isCurrent ? 'bg-[#DC1F32]' : 'bg-[#101014]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* X-axis label */}
                    <span className="text-[11px] font-medium text-neutral-600 mt-2 text-center truncate max-w-full">
                      {item.week}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100 font-mono">
              <span>Progresión semanal: +50.7% de volumen total acumulado</span>
              <span className="text-emerald-600 font-semibold">Tendencia en ascenso</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* SVG Line Chart for Strength */}
            <div className="h-64 relative flex items-center justify-center p-2">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="#f1f5f9" strokeWidth="1" />

                {/* Gradient area */}
                <defs>
                  <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC1F32" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#DC1F32" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 50 140 Q 200 110 350 70 T 550 30 L 550 180 L 50 180 Z"
                  fill="url(#strengthGradient)"
                />

                {/* Line */}
                <path
                  d="M 50 140 Q 200 110 350 70 T 550 30"
                  fill="none"
                  stroke="#DC1F32"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  { cx: 50, cy: 140, label: '78 pts' },
                  { cx: 216, cy: 110, label: '82 pts' },
                  { cx: 383, cy: 70, label: '86 pts' },
                  { cx: 550, cy: 30, label: '92 pts' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.cx} cy={pt.cy} r="6" fill="#DC1F32" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={pt.cx}
                      y={pt.cy - 12}
                      textAnchor="middle"
                      fill="#101014"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100 font-mono">
              <span>Semana 1 (78) · Semana 2 (82) · Semana 3 (86) · Semana 4 (92)</span>
              <span className="text-emerald-600 font-semibold">+14 pts de fuerza</span>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Goals Progress Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-700">Consistencia</span>
            <Target className="w-4 h-4 text-[#DC1F32]" />
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-heading font-bold text-xl text-neutral-900">14 / 20 días</span>
            <span className="text-xs font-mono text-neutral-500">70%</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#DC1F32] rounded-full" style={{ width: '70%' }} />
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">6 asistencias restantes para bono mensual.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-700">Tonelaje Mensual</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-heading font-bold text-xl text-neutral-900">70.5 / 80 t</span>
            <span className="text-xs font-mono text-neutral-500">88%</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }} />
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Cerca de batir el récord histórico del gimnasio.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-700">Récords Nuevos (PRs)</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-heading font-bold text-xl text-neutral-900">3 / 3 metas</span>
            <span className="text-xs font-mono text-emerald-600 font-bold">100%</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Press banca, sentadilla y militar superados.</p>
        </div>
      </div>

      {/* History of Completed Sessions */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
          <h2 className="text-base font-heading font-bold text-neutral-900">
            Historial de Sesiones Registradas
          </h2>
          <span className="text-xs text-neutral-400 font-mono">
            {workoutLogs.length} sesiones archivadas
          </span>
        </div>

        <div className="space-y-3">
          {workoutLogs.map((log) => {
            const FeelingIcon =
              log.feeling === 'Fácil'
                ? Smile
                : log.feeling === 'Normal'
                ? Meh
                : Frown;

            const feelingColor =
              log.feeling === 'Fácil'
                ? 'text-emerald-600 bg-emerald-50'
                : log.feeling === 'Normal'
                ? 'text-amber-600 bg-amber-50'
                : 'text-rose-600 bg-rose-50';

            return (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-sm text-neutral-900">
                      {log.dayName}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">· {log.date}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600">
                    <span>
                      Duración: <strong className="text-neutral-800">{log.durationMinutes} min</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Ejercicios: <strong className="text-neutral-800">{log.exercisesCompleted} / {log.totalExercises}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Volumen:{' '}
                      <strong className="text-neutral-800">
                        {log.totalWeightLiftedKg.toLocaleString('es-PE')} kg
                      </strong>
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-neutral-500 mt-2 italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${feelingColor}`}>
                    <FeelingIcon className="w-3.5 h-3.5" />
                    <span>Sensación: {log.feeling}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to Register New PR */}
      {showAddPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#141418] border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white">
            <h3 className="text-lg font-heading font-bold text-white mb-1">
              Registrar Nueva Marca Personal (PR)
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              Actualiza tu 1RM para recalcular los porcentajes de tu programa.
            </p>

            <form onSubmit={handleSavePR} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Ejercicio
                </label>
                <select
                  value={prExercise}
                  onChange={(e) => setPrExercise(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DC1F32]"
                >
                  <option value="Press de banca plano">Press de banca plano</option>
                  <option value="Sentadilla libre trasera">Sentadilla libre trasera</option>
                  <option value="Peso muerto convencional">Peso muerto convencional</option>
                  <option value="Press militar estricto">Press militar estricto</option>
                  <option value="Dominadas lastradas">Dominadas lastradas</option>
                  <option value="Hip Thrust con barra">Hip Thrust con barra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Peso Máximo Levantado (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="500"
                  required
                  value={prWeight}
                  onChange={(e) => setPrWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-[#DC1F32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPRModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-[#DC1F32] hover:bg-[#b81827] text-white rounded-xl shadow-md transition-all"
                >
                  Guardar Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
