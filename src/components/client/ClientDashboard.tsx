import React from 'react';
import {
  Dumbbell,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { calculateGoalProgress } from '../../utils/gymLogic';

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    classes,
    personalRecords,
    workoutLogs,
    cancelBooking,
  } = useGym();

  // Find next booked class for this user
  const bookedClasses = classes.filter((c) => c.registeredUserIds.includes(currentUser.id));
  const nextClass = bookedClasses[0];

  // Best PR (highest weight or latest)
  const topPR = personalRecords[0] || {
    exerciseName: 'Press de banca plano',
    oneRepMaxKg: 110,
    improvementKg: 5,
  };

  // Monthly goal
  const completedSessionsThisMonth = 14;
  const targetSessionsMonth = 20;
  const goalProgress = calculateGoalProgress(completedSessionsThisMonth, targetSessionsMonth);

  // Weekly workouts completed: 4 out of 5
  const weeklyWorkouts = 4;
  const weeklyTarget = 5;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#101014] text-white p-6 sm:p-8">
        {/* Background Image with Scrim Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_strength_center_1793067565342.jpg"
            alt="7 Strength Center Training Floor"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101014] via-[#101014]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] mb-2 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Centro de Alto Rendimiento · Sesión Activa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white mb-2">
            ¡Hola, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light mb-6">
            "La fuerza no es casualidad; es la suma de cada repetición ejecutada con disciplina y propósito."
          </p>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('routine')}
              className="px-4 py-2.5 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#DC1F32]/25 transition-all flex items-center gap-2 group"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Continuar Rutina de Hoy</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700/80 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-neutral-300" />
              <span>Reservar Nueva Clase</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Monthly Attendance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Asistencias Mes</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tabular-nums">
                {completedSessionsThisMonth}
              </span>
              <span className="text-xs font-medium text-neutral-400">/ {targetSessionsMonth} días</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Ritmo constante (+2 vs mes pasado)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Weekly Routines */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Rutinas Semana</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#DC1F32]">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tabular-nums">
                {weeklyWorkouts}
              </span>
              <span className="text-xs font-medium text-neutral-400">/ {weeklyTarget} sesiones</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-neutral-600">
              <span>Falta 1 sesión para meta semanal</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Personal Record Highlight */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Récord Destacado</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tabular-nums">
                {topPR.oneRepMaxKg}
              </span>
              <span className="text-xs font-medium text-neutral-400">kg (1RM)</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-medium">
              <span>+{topPR.improvementKg} kg en {topPR.exerciseName.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Monthly Goal Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Objetivo Mensual</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#DC1F32]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tabular-nums">
                {goalProgress}%
              </span>
              <span className="text-xs text-neutral-500 font-medium">Completado</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#DC1F32] rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Next Class Spotlight & Weekly Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Next Class Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-heading font-bold text-neutral-900">
                Tu Próxima Clase Reservada
              </h2>
              <p className="text-xs text-neutral-500">
                Confirmación de cupo y horario en plataforma
              </p>
            </div>
            <button
              onClick={() => setActiveTab('classes')}
              className="text-xs font-semibold text-[#DC1F32] hover:text-[#b81827] flex items-center gap-1 transition-colors"
            >
              Ver todas
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextClass ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#101014] text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Hoy</span>
                  <span className="text-sm font-bold text-[#DC1F32]">
                    {nextClass.time.split(' - ')[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-neutral-900">
                    {nextClass.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-600">
                    <span>Instructor: <strong className="text-neutral-800">{nextClass.instructorName}</strong></span>
                    <span>·</span>
                    <span>{nextClass.room}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => cancelBooking(nextClass.id)}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Cancelar Reserva
                </button>
                <button
                  onClick={() => setActiveTab('classes')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#101014] hover:bg-neutral-800 text-white rounded-lg transition-colors"
                >
                  Detalles
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-neutral-50 border border-dashed border-neutral-200">
              <Calendar className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-700">
                No tienes clases programadas para hoy
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Revisa los cupos de Fuerza Básica, HIIT Funcional o Spinning y reserva tu lugar.
              </p>
              <button
                onClick={() => setActiveTab('classes')}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-[#DC1F32] text-white rounded-xl shadow-sm hover:bg-[#b81827] transition-colors"
              >
                Explorar Horarios Disponibles
              </button>
            </div>
          )}

          {/* Weekly Attendance Heatmap / Visual Days */}
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <h4 className="text-xs font-heading font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Asistencia Semanal Registrada
            </h4>
            <div className="grid grid-cols-7 gap-2 text-center">
              {[
                { day: 'Lun', num: '20', attended: true },
                { day: 'Mar', num: '21', attended: false },
                { day: 'Mié', num: '22', attended: true },
                { day: 'Jue', num: '23', attended: false },
                { day: 'Vie', num: '24', attended: true },
                { day: 'Sáb', num: '25', attended: true },
                { day: 'Dom', num: '26', attended: false },
              ].map((d, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    d.attended
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                      : 'bg-neutral-50 border-neutral-200/70 text-neutral-400'
                  }`}
                >
                  <span className="text-[11px] font-medium">{d.day}</span>
                  <span className="text-xs font-bold tabular-nums">{d.num}</span>
                  {d.attended ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Routine & Recent Log Preview */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-heading font-bold text-neutral-900">
                Último Registro
              </h3>
              <span className="text-xs text-neutral-400 font-mono">Historial</span>
            </div>

            {workoutLogs.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-800 mb-1">
                    <span className="font-semibold text-neutral-900">
                      {workoutLogs[0].dayName.split(' - ')[0]}
                    </span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {workoutLogs[0].date}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    {workoutLogs[0].dayName.split(' - ')[1] || 'Entrenamiento general'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-500">
                    <span>Duración: <strong className="text-neutral-700">{workoutLogs[0].durationMinutes} min</strong></span>
                    <span>·</span>
                    <span>Sensación: <strong className="text-[#DC1F32]">{workoutLogs[0].feeling}</strong></span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/60 text-xs text-neutral-600">
                  <p className="font-medium text-neutral-800 mb-0.5">Membresía Activa</p>
                  <p className="text-[11px] text-neutral-500">
                    Plan Trimestral vigente hasta el 15/12/2026.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className="w-full mt-5 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ver Gráficos y Evolución</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
