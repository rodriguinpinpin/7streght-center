import { ClassSession, ExerciseItem, PaymentRecord, UserProfile } from '../types/gym';

/**
 * Calculates percentage of completed exercises in a session (0 - 100)
 */
export function calculateWorkoutProgress(exercises: ExerciseItem[]): number {
  if (!exercises || exercises.length === 0) return 0;
  
  let totalSets = 0;
  let completedSets = 0;

  for (const ex of exercises) {
    if (ex.sets && ex.sets.length > 0) {
      totalSets += ex.sets.length;
      completedSets += ex.sets.filter((s) => s.completed).length;
    } else {
      totalSets += 1;
      if (ex.completed) completedSets += 1;
    }
  }

  if (totalSets === 0) return 0;
  return Math.round((completedSets / totalSets) * 100);
}

/**
 * Validates if a user can book a class
 */
export function canBookClass(
  gymClass: ClassSession,
  userId: string
): { canBook: boolean; reason?: string } {
  if (!gymClass) return { canBook: false, reason: 'Clase no encontrada' };

  if (gymClass.registeredUserIds.includes(userId)) {
    return { canBook: false, reason: 'Ya tienes una reserva confirmada para esta clase' };
  }

  if (gymClass.registeredUserIds.length >= gymClass.maxCapacity) {
    return { canBook: false, reason: 'La clase ha alcanzado su capacidad máxima' };
  }

  return { canBook: true };
}

/**
 * Formats a number in Peruvian Soles (S/)
 */
export function formatSoles(amount: number): string {
  return `S/ ${amount.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculates aggregate financial statistics for payments
 */
export function calculateFinancialStats(payments: PaymentRecord[]): {
  totalApprovedSoles: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  pendingTotalSoles: number;
} {
  let totalApprovedSoles = 0;
  let pendingTotalSoles = 0;
  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;

  for (const p of payments) {
    if (p.status === 'Aprobado') {
      totalApprovedSoles += p.amountSoles;
      approvedCount += 1;
    } else if (p.status === 'Pendiente') {
      pendingTotalSoles += p.amountSoles;
      pendingCount += 1;
    } else if (p.status === 'Rechazado') {
      rejectedCount += 1;
    }
  }

  return {
    totalApprovedSoles,
    pendingTotalSoles,
    pendingCount,
    approvedCount,
    rejectedCount,
  };
}

/**
 * Calculates goal progress percentage clamped between 0 and 100
 */
export function calculateGoalProgress(completed: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = Math.round((completed / target) * 100);
  return Math.min(Math.max(percentage, 0), 100);
}

/**
 * Filters clients by name/email/phone query and membership status
 */
export function filterClients(
  clients: UserProfile[],
  query: string,
  statusFilter: string
): UserProfile[] {
  const cleanQuery = query.trim().toLowerCase();
  return clients.filter((client) => {
    const matchesQuery =
      cleanQuery === '' ||
      client.name.toLowerCase().includes(cleanQuery) ||
      client.email.toLowerCase().includes(cleanQuery) ||
      client.phone.includes(cleanQuery) ||
      (client.dni && client.dni.includes(cleanQuery));

    const matchesStatus =
      statusFilter === 'all' ||
      statusFilter === '' ||
      client.membershipStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });
}
