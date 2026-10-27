import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWorkoutProgress,
  canBookClass,
  formatSoles,
  calculateFinancialStats,
  calculateGoalProgress,
  filterClients,
} from './gymLogic';
import { ClassSession, ExerciseItem, PaymentRecord, UserProfile } from '../types/gym';

test('calculateWorkoutProgress handles empty and completed sets', () => {
  assert.equal(calculateWorkoutProgress([]), 0);

  const exercises: ExerciseItem[] = [
    {
      id: 'ex-1',
      name: 'Press de banca',
      muscleGroup: 'Pecho',
      sets: [
        { setNumber: 1, reps: 10, weightKg: 80, completed: true },
        { setNumber: 2, reps: 8, weightKg: 85, completed: true },
      ],
      targetSets: 2,
      targetReps: '8-10',
      recommendedWeightKg: 80,
      restSeconds: 90,
      completed: true,
    },
    {
      id: 'ex-2',
      name: 'Remo con barra',
      muscleGroup: 'Espalda',
      sets: [
        { setNumber: 1, reps: 10, weightKg: 70, completed: false },
        { setNumber: 2, reps: 10, weightKg: 70, completed: false },
      ],
      targetSets: 2,
      targetReps: '10',
      recommendedWeightKg: 70,
      restSeconds: 90,
      completed: false,
    },
  ];

  // 2 out of 4 sets completed = 50%
  assert.equal(calculateWorkoutProgress(exercises), 50);
});

test('canBookClass prevents overbooking and duplicate reservations', () => {
  const dummyClass: ClassSession = {
    id: 'class-1',
    title: 'Fuerza básica',
    category: 'Fuerza básica',
    instructorName: 'Marcos',
    date: '2026-10-27',
    time: '07:00 - 08:00',
    room: 'Sala A',
    maxCapacity: 2,
    registeredUserIds: ['user-1'],
    attendedUserIds: [],
  };

  // User 2 can book
  const res1 = canBookClass(dummyClass, 'user-2');
  assert.equal(res1.canBook, true);

  // User 1 already registered
  const res2 = canBookClass(dummyClass, 'user-1');
  assert.equal(res2.canBook, false);
  assert.match(res2.reason || '', /ya tienes una reserva/i);

  // When class reaches capacity
  dummyClass.registeredUserIds.push('user-2');
  const res3 = canBookClass(dummyClass, 'user-3');
  assert.equal(res3.canBook, false);
  assert.match(res3.reason || '', /capacidad máxima/i);
});

test('formatSoles renders formatted currency', () => {
  const formatted = formatSoles(250);
  assert.match(formatted, /S\/ 250/);
});

test('calculateFinancialStats sums approved and pending totals correctly', () => {
  const payments: PaymentRecord[] = [
    {
      id: 'p-1',
      userId: 'u-1',
      userName: 'Rodrigo',
      userEmail: 'rodrigo@gym.pe',
      planName: 'Membresía Mensual',
      amountSoles: 200,
      date: '2026-10-20',
      paymentMethod: 'Yape',
      voucherCode: 'YAP-9812',
      status: 'Aprobado',
    },
    {
      id: 'p-2',
      userId: 'u-2',
      userName: 'Camila',
      userEmail: 'camila@gym.pe',
      planName: 'Plan Trimestral',
      amountSoles: 550,
      date: '2026-10-22',
      paymentMethod: 'Transferencia BCP',
      voucherCode: 'BCP-7721',
      status: 'Aprobado',
    },
    {
      id: 'p-3',
      userId: 'u-3',
      userName: 'Mateo',
      userEmail: 'mateo@gym.pe',
      planName: 'Membresía Mensual',
      amountSoles: 200,
      date: '2026-10-26',
      paymentMethod: 'Plin',
      voucherCode: 'PLI-3301',
      status: 'Pendiente',
    },
  ];

  const stats = calculateFinancialStats(payments);
  assert.equal(stats.totalApprovedSoles, 750);
  assert.equal(stats.pendingTotalSoles, 200);
  assert.equal(stats.approvedCount, 2);
  assert.equal(stats.pendingCount, 1);
});

test('calculateGoalProgress clamps progress between 0 and 100', () => {
  assert.equal(calculateGoalProgress(14, 20), 70);
  assert.equal(calculateGoalProgress(25, 20), 100);
  assert.equal(calculateGoalProgress(0, 20), 0);
});

test('filterClients filters by text query and membership status', () => {
  const clients: UserProfile[] = [
    {
      id: 'u-1',
      name: 'Rodrigo Mendoza',
      email: 'rodrigo@gym.pe',
      role: 'client',
      avatar: '',
      phone: '987654321',
      membershipPlan: 'Mensual',
      membershipStatus: 'Activo',
      membershipExpiresAt: '2026-11-20',
      joinedAt: '2026-01-15',
      assignedRoutineId: 'r-1',
    },
    {
      id: 'u-2',
      name: 'Valeria Rios',
      email: 'valeria@gmail.com',
      role: 'client',
      avatar: '',
      phone: '912345678',
      membershipPlan: 'Trimestral',
      membershipStatus: 'Por vencer',
      membershipExpiresAt: '2026-10-28',
      joinedAt: '2026-04-10',
      assignedRoutineId: 'r-2',
    },
  ];

  const filtered = filterClients(clients, 'valeria', 'all');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].name, 'Valeria Rios');

  const activeOnly = filterClients(clients, '', 'activo');
  assert.equal(activeOnly.length, 1);
  assert.equal(activeOnly[0].name, 'Rodrigo Mendoza');
});
