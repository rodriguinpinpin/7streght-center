import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Users,
  Clock,
  UserCheck,
  CheckCircle2,
  Trash2,
  X,
  AlertCircle,
  MapPin,
  Flame,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { ClassSession } from '../../types/gym';

export const AdminClasses: React.FC = () => {
  const {
    classes,
    addClass,
    cancelClassSession,
    toggleAttendanceCheckIn,
    clients,
    showToast,
  } = useGym();

  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Class Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<
    'Fuerza básica' | 'Entrenamiento funcional' | 'Spinning' | 'Movilidad & Core' | 'Powerlifting'
  >('Fuerza básica');
  const [instructorName, setInstructorName] = useState('Marcos Torres');
  const [date, setDate] = useState('2026-10-27');
  const [time, setTime] = useState('07:00 - 08:00');
  const [room, setRoom] = useState('Plataforma Principal A');
  const [maxCapacity, setMaxCapacity] = useState(12);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Por favor ingresa un título para la clase', 'error');
      return;
    }

    addClass({
      title,
      category,
      instructorName,
      date,
      time,
      room,
      maxCapacity: Number(maxCapacity),
      imageUrl: '/src/assets/images/class_strength_training_1793067567032.jpg',
    });

    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Programación & Aforos de Sala</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
            Gestión de Clases & Control de Asistencia
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Coordina instructores, capacidades de plataforma y marca asistencias de clientes en vivo.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Nueva Clase</span>
        </button>
      </div>

      {/* Class Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const registeredCount = cls.registeredUserIds.length;
          const attendedCount = cls.attendedUserIds.length;
          const pct = Math.round((registeredCount / cls.maxCapacity) * 100);

          return (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span className="font-mono text-[#DC1F32] font-semibold uppercase">
                    {cls.category}
                  </span>
                  <span className="font-mono">{cls.date}</span>
                </div>

                <h3 className="font-heading font-bold text-base text-neutral-900 mb-2">
                  {cls.title}
                </h3>

                <div className="space-y-1 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-800">{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Coach: <strong className="text-neutral-800">{cls.instructorName}</strong></span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-500">Inscritos:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {registeredCount} / {cls.maxCapacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-[#DC1F32]'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1 font-mono">
                    <span>{cls.maxCapacity - registeredCount} cupos libres</span>
                    <span className="text-emerald-600 font-semibold">{attendedCount} asistencias marcadas</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedClass(cls)}
                  className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#DC1F32]" />
                  <span>Tomar Asistencia ({registeredCount})</span>
                </button>

                <button
                  onClick={() => cancelClassSession(cls.id)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Cancelar clase"
                  aria-label="Cancelar clase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendees & Check-in Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl text-neutral-900">
            <button
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors"
              aria-label="Cerrar asistencia"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-neutral-100">
              <span className="text-[10px] font-mono text-[#DC1F32] uppercase tracking-wider font-bold">
                Lista de Asistencia Oficial
              </span>
              <h2 className="text-lg font-heading font-black text-neutral-900">
                {selectedClass.title}
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                {selectedClass.date} · {selectedClass.time} · {selectedClass.room}
              </p>
            </div>

            {/* List of enrolled members */}
            <div className="py-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {selectedClass.registeredUserIds.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Aún no hay clientes inscritos en esta sesión.
                </div>
              ) : (
                selectedClass.registeredUserIds.map((uid) => {
                  const clientObj = clients.find((c) => c.id === uid) || {
                    id: uid,
                    name: 'Cliente Registrado',
                    email: 'cliente@gym.pe',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                  };
                  const isPresent = selectedClass.attendedUserIds.includes(uid);

                  return (
                    <div
                      key={uid}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={clientObj.avatar}
                          alt={clientObj.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-xs text-neutral-900">{clientObj.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">{clientObj.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAttendanceCheckIn(selectedClass.id, uid)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                          isPresent
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                        }`}
                      >
                        {isPresent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Presente</span>
                          </>
                        ) : (
                          <span>Marcar Check-in</span>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-mono">
                {selectedClass.attendedUserIds.length} de {selectedClass.registeredUserIds.length} presentes
              </span>
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Cerrar Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program New Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl text-neutral-900">
            <h2 className="text-lg font-heading font-black text-neutral-900 mb-1">
              Programar Nueva Clase Grupal
            </h2>
            <p className="text-xs text-neutral-500 mb-5">
              Habilita un nuevo cupo en el calendario para los atletas.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nombre de la Clase
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Powerlifting: Sentadilla Profunda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  >
                    <option value="Fuerza básica">Fuerza básica</option>
                    <option value="Entrenamiento funcional">Entrenamiento funcional</option>
                    <option value="Spinning">Spinning</option>
                    <option value="Movilidad & Core">Movilidad & Core</option>
                    <option value="Powerlifting">Powerlifting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    required
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Horario
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 - 08:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Sala / Área
                  </label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Capacidad Máxima (Aforo)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-mono focus:outline-none focus:border-[#DC1F32]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                >
                  Guardar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
