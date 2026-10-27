export type UserRole = 'client' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  dni?: string;
  membershipPlan: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
  membershipStatus: 'Activo' | 'Por vencer' | 'Inactivo';
  membershipExpiresAt: string; // YYYY-MM-DD
  joinedAt: string;
  assignedRoutineId: string;
  emergencyContact?: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  muscleGroup: 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core' | 'Full Body';
  sets: ExerciseSet[];
  targetSets: number;
  targetReps: string; // e.g., "8 - 10"
  recommendedWeightKg: number;
  restSeconds: number;
  notes?: string;
  completed: boolean;
}

export interface DayRoutine {
  dayIndex: number; // 0 = Lunes, 1 = Martes, etc.
  dayName: string;
  focus: string; // e.g. "Push - Pecho y Tríceps"
  exercises: ExerciseItem[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  coachName: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  days: DayRoutine[];
}

export interface CompletedWorkoutLog {
  id: string;
  userId: string;
  routineTitle: string;
  dayName: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  exercisesCompleted: number;
  totalExercises: number;
  totalWeightLiftedKg: number;
  feeling: 'Fácil' | 'Normal' | 'Muy difícil';
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  oneRepMaxKg: number;
  previousRecordKg: number;
  dateAchieved: string;
  improvementKg: number;
}

export interface ClassSession {
  id: string;
  title: string;
  category: 'Fuerza básica' | 'Entrenamiento funcional' | 'Spinning' | 'Movilidad & Core' | 'Powerlifting';
  instructorName: string;
  instructorAvatar?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "07:00 - 08:00"
  room: string;
  maxCapacity: number;
  registeredUserIds: string[];
  attendedUserIds: string[];
  imageUrl?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: 'Membresía Mensual' | 'Plan Trimestral' | 'Plan Anual VIP' | 'Pase Diario';
  amountSoles: number;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Yape' | 'Plin' | 'Transferencia BCP' | 'Tarjeta de Crédito' | 'Efectivo';
  voucherCode: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'Clase grupal' | 'Sala de musculación';
  detail: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}
