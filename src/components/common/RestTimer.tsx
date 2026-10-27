import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, X, Volume2 } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  onClose?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (newDuration?: number) => {
    const val = newDuration || initialSeconds;
    setSecondsLeft(val);
    setIsActive(true);
    setIsFinished(false);
  };

  const addSeconds = (secs: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + secs));
    setIsFinished(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isFinished
        ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-900/40 text-emerald-100'
        : 'bg-[#18181D] border-neutral-800 text-white'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${isFinished ? 'text-emerald-400 animate-bounce' : 'text-[#DC1F32]'}`} />
          <span className="font-heading font-semibold text-xs tracking-wide uppercase text-neutral-300">
            {isFinished ? '¡Tiempo de Descanso Completo!' : 'Temporizador de Descanso'}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Cerrar temporizador"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Large time display */}
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-3xl tabular-nums tracking-tight text-white">
            {formatTime(secondsLeft)}
          </span>
          {isFinished && (
            <span className="text-xs text-emerald-400 font-medium">¡Listo para la siguiente serie!</span>
          )}
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`p-2.5 rounded-lg font-medium text-xs transition-transform active:scale-95 flex items-center gap-1.5 ${
              isActive
                ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                : 'bg-[#DC1F32] hover:bg-[#b81827] text-white'
            }`}
            aria-label={isActive ? 'Pausar descanso' : 'Iniciar descanso'}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pausar' : 'Reanudar'}</span>
          </button>

          <button
            onClick={() => resetTimer(initialSeconds)}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors"
            title="Reiniciar"
            aria-label="Reiniciar temporizador"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => addSeconds(15)}
            className="px-2.5 py-2 bg-neutral-800/80 hover:bg-neutral-700 text-xs font-mono text-neutral-300 hover:text-white rounded-lg transition-colors"
            title="Añadir 15 segundos"
          >
            +15s
          </button>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-800/80">
        <span className="text-[11px] text-neutral-400 mr-1">Preajustes:</span>
        {[45, 60, 90, 120, 180].map((t) => (
          <button
            key={t}
            onClick={() => resetTimer(t)}
            className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
              secondsLeft === t && !isFinished
                ? 'bg-[#DC1F32] text-white font-semibold'
                : 'bg-neutral-800/70 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            {t}s
          </button>
        ))}
      </div>
    </div>
  );
};
