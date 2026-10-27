import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Timer,
  Play,
  Flame,
  Award,
  ChevronDown,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { calculateWorkoutProgress } from '../../utils/gymLogic';
import { RestTimer } from '../common/RestTimer';
import { WorkoutCompletionModal } from '../common/WorkoutCompletionModal';

export const ClientRoutine: React.FC = () => {
  const {
    routine,
    currentDayIndex,
    setCurrentDayIndex,
    toggleSetCompleted,
    toggleExerciseCompleted,
    finishWorkout,
    showToast,
  } = useGym();

  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  const activeDay = routine.days[currentDayIndex] || routine.days[0];
  const progressPct = calculateWorkoutProgress(activeDay.exercises);

  const handleFinishClick = () => {
    setShowCompletionModal(true);
  };

  const handleConfirmFinish = (
    feeling: 'Fácil' | 'Normal' | 'Muy difícil',
    notes: string
  ) => {
    finishWorkout(currentDayIndex, feeling, notes);
    setShowCompletionModal(false);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Banner / Assigned Program Info */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Programa Oficial Asignado</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
              {routine.title}
            </h1>
            <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
              {routine.description} · Asignado por{' '}
              <strong className="text-neutral-900">{routine.coachName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTimerSeconds(activeTimerSeconds ? null : 90)}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Timer className="w-4 h-4 text-[#DC1F32]" />
              <span>{activeTimerSeconds ? 'Ocultar Timer' : 'Abrir Timer de Descanso'}</span>
            </button>
            <button
              onClick={handleFinishClick}
              className="px-4 py-2 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#DC1F32]/25 transition-all flex items-center gap-1.5 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalizar Sesión</span>
            </button>
          </div>
        </div>

        {/* Floating / Embedded Rest Timer */}
        {activeTimerSeconds !== null && (
          <div className="mt-5 pt-5 border-t border-neutral-100">
            <RestTimer
              initialSeconds={activeTimerSeconds}
              onClose={() => setActiveTimerSeconds(null)}
            />
          </div>
        )}

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-5 border-t border-neutral-100 no-scrollbar">
          {routine.days.map((d, idx) => {
            const isSelected = currentDayIndex === idx;
            const dayProgress = calculateWorkoutProgress(d.exercises);

            return (
              <button
                key={d.dayIndex}
                onClick={() => setCurrentDayIndex(idx)}
                className={`px-4 py-2.5 rounded-xl border text-left transition-all shrink-0 flex flex-col gap-0.5 ${
                  isSelected
                    ? 'bg-[#101014] border-[#101014] text-white shadow-md'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/80 text-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-xs">{d.dayName}</span>
                  {dayProgress === 100 && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  )}
                </div>
                <span
                  className={`text-[10px] truncate max-w-[130px] ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {d.focus.split('(')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Progress Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-heading font-bold text-neutral-900">
              {activeDay.dayName}: {activeDay.focus}
            </h2>
            <p className="text-xs text-neutral-500">
              {activeDay.exercises.length} ejercicios planificados para hoy
            </p>
          </div>
          <div className="text-right">
            <span className="font-heading font-bold text-lg text-neutral-900 tabular-nums">
              {progressPct}%
            </span>
            <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
              Completado
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#DC1F32] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {activeDay.exercises.map((exercise, exIndex) => {
          const isDone = exercise.completed;

          return (
            <div
              key={exercise.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/20 border-emerald-300/60 shadow-sm'
                  : 'bg-white border-neutral-200/90 shadow-sm hover:border-neutral-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {exIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-heading font-bold text-neutral-900">
                        {exercise.name}
                      </h3>
                      {isDone && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Listo
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500 mt-0.5">
                      <span className="font-medium text-neutral-700">{exercise.muscleGroup}</span>
                      <span>·</span>
                      <span>Objetivo: {exercise.targetSets} series × {exercise.targetReps} reps</span>
                      <span>·</span>
                      <span>Descanso: {exercise.restSeconds}s</span>
                    </div>
                  </div>
                </div>

                {/* Exercise Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setActiveTimerSeconds(exercise.restSeconds)}
                    className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                    title={`Descansar ${exercise.restSeconds} segundos`}
                  >
                    <Timer className="w-3.5 h-3.5 text-[#DC1F32]" />
                    <span>Timer {exercise.restSeconds}s</span>
                  </button>
                  <button
                    onClick={() => toggleExerciseCompleted(currentDayIndex, exercise.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isDone ? 'Desmarcar Ejercicio' : 'Completar Todo'}
                  </button>
                </div>
              </div>

              {/* Coach notes if any */}
              {exercise.notes && (
                <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 text-[11px] text-neutral-600 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span><strong className="text-neutral-800">Técnica:</strong> {exercise.notes}</span>
                </div>
              )}

              {/* Set Checkboxes Grid */}
              <div className="mt-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Registro de Series
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {exercise.sets.map((set) => {
                    const setDone = set.completed;
                    return (
                      <button
                        key={set.setNumber}
                        type="button"
                        onClick={() =>
                          toggleSetCompleted(currentDayIndex, exercise.id, set.setNumber)
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          setDone
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/90 text-neutral-700'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] text-neutral-500 font-mono block">
                            Serie {set.setNumber}
                          </span>
                          <span className="text-xs font-bold tabular-nums">
                            {set.weightKg} kg × {set.reps}
                          </span>
                        </div>
                        {setDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to Finish */}
      <div className="p-6 rounded-2xl bg-[#101014] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-heading font-bold">
            ¿Terminaste tu rutina de {activeDay.dayName}?
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Guarda tus sensaciones para que el sistema actualice tus estadísticas y el historial de volumen.
          </p>
        </div>
        <button
          onClick={handleFinishClick}
          className="w-full sm:w-auto px-6 py-3 bg-[#DC1F32] hover:bg-[#b81827] text-white font-semibold text-xs rounded-xl shadow-lg shadow-[#DC1F32]/30 transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>Finalizar Entrenamiento de Hoy</span>
        </button>
      </div>

      {/* Completion Modal */}
      <WorkoutCompletionModal
        routineName={routine.title}
        dayFocus={`${activeDay.dayName} - ${activeDay.focus}`}
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={handleConfirmFinish}
      />
    </div>
  );
};
