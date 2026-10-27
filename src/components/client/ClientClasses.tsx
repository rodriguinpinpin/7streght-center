import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Users,
  CheckCircle2,
  XCircle,
  MapPin,
  AlertCircle,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { ClassSession } from '../../types/gym';

export const ClientClasses: React.FC = () => {
  const { currentUser, classes, bookClass, cancelBooking } = useGym();

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-27');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Available days for tabs
  const days = [
    { label: 'Hoy (Lun 27)', value: '2026-10-27' },
    { label: 'Mar 28', value: '2026-10-28' },
    { label: 'Mié 29', value: '2026-10-29' },
    { label: 'Jue 30', value: '2026-10-30' },
    { label: 'Vie 31', value: '2026-10-31' },
  ];

  // Filter classes by day and category
  const filteredClasses = classes.filter((c) => {
    const matchesDate = c.date === selectedDate;
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesDate && matchesCat;
  });

  // User's active bookings
  const myBookings = classes.filter((c) => c.registeredUserIds.includes(currentUser.id));

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#DC1F32] uppercase tracking-wider mb-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Programación & Reservas de Clases</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
              Entrenamientos Grupales & Talleres
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              Cupos limitados por sesión para garantizar coaching personalizado.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-xl self-start sm:self-center">
            <span>Tus reservas activas:</span>
            <strong className="text-neutral-900 font-bold">{myBookings.length}</strong>
          </div>
        </div>

        {/* Date Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-5 border-t border-neutral-100 no-scrollbar">
          {days.map((day) => {
            const isSelected = selectedDate === day.value;
            return (
              <button
                key={day.value}
                onClick={() => setSelectedDate(day.value)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#101014] text-white shadow-sm'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mis Clases Reservadas (Active Bookings Section) */}
      {myBookings.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#101014] text-white border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#DC1F32]" />
              <h2 className="text-sm font-heading font-bold uppercase tracking-wider">
                Mis Clases Reservadas ({myBookings.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Cupo confirmado</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {myBookings.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="text-[#DC1F32] font-semibold">{c.category}</span>
                    <span className="font-mono">{c.date}</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-white">{c.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{c.time}</span>
                    <span>·</span>
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{c.instructorName}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Asistencia reservada
                  </span>
                  <button
                    onClick={() => cancelBooking(c.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Classes Grid for Selected Date */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-heading font-bold text-neutral-900 uppercase tracking-wider">
            Clases Disponibles para esta Fecha
          </h2>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'Fuerza básica', 'Entrenamiento funcional', 'Spinning', 'Movilidad & Core', 'Powerlifting'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
            <CalendarIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <h3 className="text-sm font-heading font-bold text-neutral-800">
              No hay clases programadas con este filtro
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Prueba seleccionando otro día o categoría en la barra superior.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((item) => {
              const isRegistered = item.registeredUserIds.includes(currentUser.id);
              const spotsLeft = item.maxCapacity - item.registeredUserIds.length;
              const isFull = spotsLeft <= 0;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  {/* Class Header with Photo/Illustration if present */}
                  {item.imageUrl ? (
                    <div className="relative h-36 w-full overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-mono text-[#DC1F32] uppercase tracking-wider font-bold">
                          {item.category}
                        </span>
                        <h3 className="font-heading font-bold text-sm text-white line-clamp-1">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 pb-0">
                      <span className="text-[11px] font-mono text-[#DC1F32] uppercase tracking-wider font-bold block mb-1">
                        {item.category}
                      </span>
                      <h3 className="font-heading font-bold text-base text-neutral-900 line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="space-y-1.5 text-xs text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-semibold text-neutral-800">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Instructor: <strong className="text-neutral-800">{item.instructorName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{item.room}</span>
                      </div>
                    </div>

                    {/* Spot Availability Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-neutral-500 font-medium">Cupos disponibles:</span>
                        <span className={`font-mono font-bold ${
                          isFull
                            ? 'text-rose-600'
                            : spotsLeft <= 3
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}>
                          {isFull ? 'Completa' : `${spotsLeft} de ${item.maxCapacity}`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull
                              ? 'bg-rose-500'
                              : spotsLeft <= 3
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.round(
                              (item.registeredUserIds.length / item.maxCapacity) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isRegistered ? (
                        <div className="flex items-center gap-2">
                          <button
                            disabled
                            className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lugar Reservado</span>
                          </button>
                          <button
                            onClick={() => cancelBooking(item.id)}
                            className="py-2 px-3 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : isFull ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-3 bg-neutral-100 text-neutral-400 text-xs font-semibold rounded-xl cursor-not-allowed"
                        >
                          Clase Completa (Sin cupos)
                        </button>
                      ) : (
                        <button
                          onClick={() => bookClass(item.id)}
                          className="w-full py-2.5 px-3 bg-[#DC1F32] hover:bg-[#b81827] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#DC1F32]/20 transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reservar Mi Cupo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Attendance History Log */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm">
        <h3 className="text-base font-heading font-bold text-neutral-900 mb-3">
          Historial de Asistencias Presenciales
        </h3>
        <div className="divide-y divide-neutral-100">
          {[
            { date: '2026-10-24', type: 'Entrenamiento Libre', time: '18:15', status: 'Registrado' },
            { date: '2026-10-22', type: 'Clase: Fuerza Básica', time: '07:02', status: 'Registrado' },
            { date: '2026-10-20', type: 'Clase: HIIT Funcional', time: '18:05', status: 'Registrado' },
            { date: '2026-10-17', type: 'Entrenamiento Libre', time: '17:30', status: 'Registrado' },
          ].map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <span className="font-semibold text-neutral-900">{item.type}</span>
                  <span className="text-neutral-400 font-mono ml-2">({item.time})</span>
                </div>
              </div>
              <span className="font-mono text-neutral-500">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
