import React, { useState } from 'react';
import { Award, CheckCircle2, Flame, Smile, Meh, Frown, Sparkles, X } from 'lucide-react';

interface WorkoutCompletionModalProps {
  routineName: string;
  dayFocus: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feeling: 'Fácil' | 'Normal' | 'Muy difícil', notes: string) => void;
}

export const WorkoutCompletionModal: React.FC<WorkoutCompletionModalProps> = ({
  routineName,
  dayFocus,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<'Fácil' | 'Normal' | 'Muy difícil'>('Normal');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedFeeling, notes);
  };

  const feelings = [
    {
      value: 'Fácil' as const,
      label: 'Fácil',
      desc: 'Energía de sobra, pesos ligeros',
      icon: Smile,
      color: 'hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-400',
      activeColor: 'border-emerald-500 bg-emerald-950/30 text-emerald-300 ring-2 ring-emerald-500/50',
    },
    {
      value: 'Normal' as const,
      label: 'Normal',
      desc: 'Buen estímulo, fatiga adecuada',
      icon: Meh,
      color: 'hover:border-amber-500 hover:bg-amber-950/20 text-amber-400',
      activeColor: 'border-amber-500 bg-amber-950/30 text-amber-300 ring-2 ring-amber-500/50',
    },
    {
      value: 'Muy difícil' as const,
      label: 'Muy difícil',
      desc: 'Exigencia máxima, RPE 9-10',
      icon: Frown,
      color: 'hover:border-rose-500 hover:bg-rose-950/20 text-rose-400',
      activeColor: 'border-rose-500 bg-rose-950/30 text-rose-300 ring-2 ring-rose-500/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#141418] border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with athletic badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DC1F32]/10 border border-[#DC1F32]/30 text-[#DC1F32] mb-3">
            <Flame className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white">
            ¡Sesión Completada con Éxito!
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {dayFocus} · 7 Strength Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Question */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              ¿Cómo te sentiste hoy?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {feelings.map((f) => {
                const Icon = f.icon;
                const isSelected = selectedFeeling === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setSelectedFeeling(f.value)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-start gap-1.5 ${
                      isSelected
                        ? f.activeColor
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 ' + f.color
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <span className="font-heading font-semibold text-xs block text-white">
                        {f.label}
                      </span>
                      <span className="text-[10px] text-neutral-400 leading-tight block mt-0.5">
                        {f.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Notas o sensaciones del entrenamiento (opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Buena congestión en pecho, subí 2.5 kg en la última serie..."
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC1F32] transition-colors resize-none"
            />
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#DC1F32] hover:bg-[#b81827] text-white rounded-xl shadow-lg shadow-[#DC1F32]/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Guardar y Finalizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
