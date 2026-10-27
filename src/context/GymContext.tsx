import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ClassSession,
  CompletedWorkoutLog,
  NotificationItem,
  PaymentRecord,
  PersonalRecord,
  UserProfile,
  UserRole,
  WorkoutRoutine,
} from '../types/gym';
import {
  INITIAL_ADMIN,
  INITIAL_CLASSES,
  INITIAL_CLIENT,
  INITIAL_CLIENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENTS,
  INITIAL_PRS,
  INITIAL_ROUTINE,
  INITIAL_WORKOUT_LOGS,
} from '../data/mockData';
import { canBookClass } from '../utils/gymLogic';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface GymContextType {
  // Auth & Roles
  currentUser: UserProfile;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  loginAs: (user: UserProfile) => void;
  logout: () => void;
  isLoggedIn: boolean;

  // Clients
  clients: UserProfile[];
  registerClient: (client: Omit<UserProfile, 'id' | 'joinedAt'>) => void;
  updateClient: (client: UserProfile) => void;
  toggleClientStatus: (clientId: string) => void;

  // Routines & Workout
  routine: WorkoutRoutine;
  currentDayIndex: number;
  setCurrentDayIndex: (index: number) => void;
  toggleSetCompleted: (dayIndex: number, exerciseId: string, setNumber: number) => void;
  toggleExerciseCompleted: (dayIndex: number, exerciseId: string) => void;
  finishWorkout: (
    dayIndex: number,
    feeling: 'Fácil' | 'Normal' | 'Muy difícil',
    notes?: string
  ) => void;
  workoutLogs: CompletedWorkoutLog[];

  // PRs
  personalRecords: PersonalRecord[];
  savePersonalRecord: (pr: Omit<PersonalRecord, 'id' | 'dateAchieved'>) => void;

  // Classes
  classes: ClassSession[];
  bookClass: (classId: string) => { success: boolean; message: string };
  cancelBooking: (classId: string) => { success: boolean; message: string };
  addClass: (newClass: Omit<ClassSession, 'id' | 'registeredUserIds' | 'attendedUserIds'>) => void;
  toggleAttendanceCheckIn: (classId: string, userId: string) => void;
  cancelClassSession: (classId: string) => void;

  // Payments
  payments: PaymentRecord[];
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string) => void;
  registerPayment: (payment: Omit<PaymentRecord, 'id' | 'status' | 'date'>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Toasts
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('client');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CLIENT);
  const [clients, setClients] = useState<UserProfile[]>(INITIAL_CLIENTS);
  const [routine, setRoutine] = useState<WorkoutRoutine>(INITIAL_ROUTINE);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [workoutLogs, setWorkoutLogs] = useState<CompletedWorkoutLog[]>(INITIAL_WORKOUT_LOGS);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(INITIAL_PRS);
  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'admin') {
      setCurrentUser(INITIAL_ADMIN);
      setActiveTab('dashboard');
      showToast('Cambiado a modo Administrador', 'info');
    } else {
      setCurrentUser(INITIAL_CLIENT);
      setActiveTab('dashboard');
      showToast('Cambiado a modo Cliente', 'info');
    }
  };

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    showToast(`Bienvenido a 7 Strength Center, ${user.name.split(' ')[0]}`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Sesión cerrada correctamente', 'info');
  };

  // Routine toggles
  const toggleSetCompleted = (dayIndex: number, exerciseId: string, setNumber: number) => {
    setRoutine((prev) => {
      const newDays = [...prev.days];
      const targetDay = newDays[dayIndex];
      if (!targetDay) return prev;

      const newExercises = targetDay.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newSets = ex.sets.map((s) => {
          if (s.setNumber !== setNumber) return s;
          return { ...s, completed: !s.completed };
        });
        const allCompleted = newSets.every((s) => s.completed);
        return { ...ex, sets: newSets, completed: allCompleted };
      });

      newDays[dayIndex] = { ...targetDay, exercises: newExercises };
      return { ...prev, days: newDays };
    });
  };

  const toggleExerciseCompleted = (dayIndex: number, exerciseId: string) => {
    setRoutine((prev) => {
      const newDays = [...prev.days];
      const targetDay = newDays[dayIndex];
      if (!targetDay) return prev;

      const newExercises = targetDay.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const nextState = !ex.completed;
        const updatedSets = ex.sets.map((s) => ({ ...s, completed: nextState }));
        return { ...ex, completed: nextState, sets: updatedSets };
      });

      newDays[dayIndex] = { ...targetDay, exercises: newExercises };
      return { ...prev, days: newDays };
    });
  };

  const finishWorkout = (
    dayIndex: number,
    feeling: 'Fácil' | 'Normal' | 'Muy difícil',
    notes?: string
  ) => {
    const currentDay = routine.days[dayIndex];
    if (!currentDay) return;

    let totalWeight = 0;
    let completedExCount = 0;

    currentDay.exercises.forEach((ex) => {
      if (ex.completed) completedExCount++;
      ex.sets.forEach((s) => {
        if (s.completed) {
          totalWeight += s.weightKg * s.reps;
        }
      });
    });

    const newLog: CompletedWorkoutLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      routineTitle: routine.title,
      dayName: `${currentDay.dayName} - ${currentDay.focus}`,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: 55,
      exercisesCompleted: completedExCount || currentDay.exercises.length,
      totalExercises: currentDay.exercises.length,
      totalWeightLiftedKg: totalWeight > 0 ? totalWeight : 3250,
      feeling,
      notes,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);
    showToast('¡Entrenamiento registrado con éxito! Gran esfuerzo.', 'success');
  };

  // Personal Records
  const savePersonalRecord = (pr: Omit<PersonalRecord, 'id' | 'dateAchieved'>) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = personalRecords.find((r) => r.exerciseName === pr.exerciseName);

    if (existing) {
      const updated: PersonalRecord = {
        ...existing,
        previousRecordKg: existing.oneRepMaxKg,
        oneRepMaxKg: pr.oneRepMaxKg,
        dateAchieved: today,
        improvementKg: pr.oneRepMaxKg - existing.oneRepMaxKg,
      };
      setPersonalRecords((prev) => prev.map((r) => (r.id === existing.id ? updated : r)));
    } else {
      const newPR: PersonalRecord = {
        id: `pr-${Date.now()}`,
        exerciseName: pr.exerciseName,
        oneRepMaxKg: pr.oneRepMaxKg,
        previousRecordKg: pr.previousRecordKg || pr.oneRepMaxKg,
        dateAchieved: today,
        improvementKg: pr.oneRepMaxKg - (pr.previousRecordKg || pr.oneRepMaxKg),
      };
      setPersonalRecords((prev) => [...prev, newPR]);
    }
    showToast(`Récord guardado: ${pr.exerciseName} - ${pr.oneRepMaxKg} kg`, 'success');
  };

  // Class booking
  const bookClass = (classId: string) => {
    const target = classes.find((c) => c.id === classId);
    if (!target) return { success: false, message: 'Clase no encontrada' };

    const validation = canBookClass(target, currentUser.id);
    if (!validation.canBook) {
      showToast(validation.reason || 'No se puede reservar la clase', 'error');
      return { success: false, message: validation.reason || 'Error' };
    }

    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          registeredUserIds: [...c.registeredUserIds, currentUser.id],
        };
      })
    );

    showToast(`¡Reserva confirmada para ${target.title}!`, 'success');
    return { success: true, message: 'Reserva confirmada con éxito' };
  };

  const cancelBooking = (classId: string) => {
    const target = classes.find((c) => c.id === classId);
    if (!target) return { success: false, message: 'Clase no encontrada' };

    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          registeredUserIds: c.registeredUserIds.filter((uid) => uid !== currentUser.id),
        };
      })
    );

    showToast(`Reserva cancelada para ${target.title}. Cupo liberado.`, 'info');
    return { success: true, message: 'Reserva cancelada' };
  };

  const addClass = (
    newClass: Omit<ClassSession, 'id' | 'registeredUserIds' | 'attendedUserIds'>
  ) => {
    const item: ClassSession = {
      ...newClass,
      id: `class-${Date.now()}`,
      registeredUserIds: [],
      attendedUserIds: [],
    };
    setClasses((prev) => [item, ...prev]);
    showToast('Nueva clase programada exitosamente', 'success');
  };

  const toggleAttendanceCheckIn = (classId: string, userId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        const isAttended = c.attendedUserIds.includes(userId);
        const updated = isAttended
          ? c.attendedUserIds.filter((uid) => uid !== userId)
          : [...c.attendedUserIds, userId];
        return { ...c, attendedUserIds: updated };
      })
    );
    showToast('Asistencia actualizada', 'info');
  };

  const cancelClassSession = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    showToast('Clase cancelada y retirada de la programación', 'info');
  };

  // Payments
  const approvePayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== paymentId) return p;
        return {
          ...p,
          status: 'Aprobado',
          reviewedAt: new Date().toLocaleString('es-PE'),
          reviewedBy: currentUser.name,
        };
      })
    );

    // Also activate client membership if matching
    const p = payments.find((x) => x.id === paymentId);
    if (p) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id !== p.userId && c.email !== p.userEmail) return c;
          return { ...c, membershipStatus: 'Activo' };
        })
      );
    }

    showToast('Pago validado y aprobado exitosamente', 'success');
  };

  const rejectPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== paymentId) return p;
        return {
          ...p,
          status: 'Rechazado',
          reviewedAt: new Date().toLocaleString('es-PE'),
          reviewedBy: currentUser.name,
        };
      })
    );
    showToast('Pago marcado como rechazado', 'info');
  };

  const registerPayment = (paymentData: Omit<PaymentRecord, 'id' | 'status' | 'date'>) => {
    const newRecord: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      status: 'Aprobado',
      date: new Date().toISOString().split('T')[0],
      reviewedAt: new Date().toLocaleString('es-PE'),
      reviewedBy: currentUser.name,
    };
    setPayments((prev) => [newRecord, ...prev]);
    showToast(`Pago de ${paymentData.userName} registrado por S/ ${paymentData.amountSoles}`, 'success');
  };

  // Clients
  const registerClient = (clientData: Omit<UserProfile, 'id' | 'joinedAt'>) => {
    const newClient: UserProfile = {
      ...clientData,
      id: `user-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Cliente ${clientData.name} registrado con éxito`, 'success');
  };

  const updateClient = (client: UserProfile) => {
    setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
    if (client.id === currentUser.id) {
      setCurrentUser(client);
    }
    showToast('Datos del cliente actualizados', 'success');
  };

  const toggleClientStatus = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const nextStatus = c.membershipStatus === 'Activo' ? 'Inactivo' : 'Activo';
        return { ...c, membershipStatus: nextStatus };
      })
    );
    showToast('Estado de membresía actualizado', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <GymContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        loginAs,
        logout,
        isLoggedIn,
        clients,
        registerClient,
        updateClient,
        toggleClientStatus,
        routine,
        currentDayIndex,
        setCurrentDayIndex,
        toggleSetCompleted,
        toggleExerciseCompleted,
        finishWorkout,
        workoutLogs,
        personalRecords,
        savePersonalRecord,
        classes,
        bookClass,
        cancelBooking,
        addClass,
        toggleAttendanceCheckIn,
        cancelClassSession,
        payments,
        approvePayment,
        rejectPayment,
        registerPayment,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
