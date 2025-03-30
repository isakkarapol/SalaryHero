// src/activities/balance.activity.test.ts

import { Decimal } from '@prisma/client/runtime/library';
import {
  calculateDailySalary,
  calculateMonthlySalary,
} from './balance.activity';
import { prisma } from '../models/prisma';

jest.mock('../models/prisma', () => ({
  prisma: {
    paySchedule: { findFirst: jest.fn() },
    holiday: { findMany: jest.fn() },
    companyWeeklyOff: { findMany: jest.fn() },
    employeeWeeklyOff: { findMany: jest.fn() },
    absence: { findMany: jest.fn() },
    balance: { findUnique: jest.fn(), upsert: jest.fn() },
  },
}));

describe('Salary Calculation Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  const date = '2025-03-30';

  it('1. Daily employee working every day', async () => {
    const employee = {
      id: 1,
      company_id: 1,
      employee_code: 'C001',
      salary_type: 'daily',
      salary_amount: new Decimal(500),
    };

    (prisma.paySchedule.findFirst as jest.Mock).mockResolvedValue({ pay_day: 1 });
    (prisma.holiday.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.companyWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.employeeWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.absence.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.balance.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.balance.upsert as jest.Mock).mockResolvedValue({});

    const amount = await calculateDailySalary(employee as any, date);
    expect(amount.toNumber()).toBeGreaterThan(0);
  });

  it('2. Daily employee with unpaid leave', async () => {
    const employee = {
      id: 4,
      company_id: 1,
      employee_code: 'D001',
      salary_type: 'daily',
      salary_amount: new Decimal(600),
    };

    (prisma.paySchedule.findFirst as jest.Mock).mockResolvedValue({ pay_day: 1 });
    (prisma.holiday.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.companyWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.employeeWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.absence.findMany as jest.Mock).mockResolvedValue([
      { absent_date: new Date('2025-03-28'), is_paid: false },
    ]);
    (prisma.balance.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.balance.upsert as jest.Mock).mockResolvedValue({});

    const amount = await calculateDailySalary(employee as any, date);
    expect(amount.toNumber()).toBeGreaterThan(0);
  });

  it('3. Monthly employee with sick leave (paid)', async () => {
    const employee = {
      id: 2,
      company_id: 1,
      employee_code: 'A001',
      salary_type: 'monthly',
      salary_amount: new Decimal(30000),
    };

    (prisma.paySchedule.findFirst as jest.Mock).mockResolvedValue({ pay_day: 1 });
    (prisma.holiday.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.companyWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.employeeWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.absence.findMany as jest.Mock).mockResolvedValue([
      { absent_date: new Date('2025-03-29'), is_paid: true },
    ]);
    (prisma.balance.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.balance.upsert as jest.Mock).mockResolvedValue({});

    const amount = await calculateMonthlySalary(employee as any, date);
    expect(amount.toNumber()).toBeGreaterThan(0);
  });

  it('4. Borrowed amounts affect balance correctly', async () => {
    const employee = {
      id: 3,
      company_id: 1,
      employee_code: 'B001',
      salary_type: 'monthly',
      salary_amount: new Decimal(32000),
    };

    (prisma.paySchedule.findFirst as jest.Mock).mockResolvedValue({ pay_day: 1 });
    (prisma.holiday.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.companyWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.employeeWeeklyOff.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.absence.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.balance.findUnique as jest.Mock).mockResolvedValue({ borrowed: new Decimal(3500) });
    const upsertMock = prisma.balance.upsert as jest.Mock;
    upsertMock.mockResolvedValue({});

    const amount = await calculateMonthlySalary(employee as any, date);
    const upsertArgs = upsertMock.mock.calls[0][0];

    expect(amount.toNumber()).toBeGreaterThan(0);
    expect(upsertArgs.update.borrowed.toNumber()).toBe(3500);
    expect(upsertArgs.update.balance.toNumber()).toBeCloseTo(amount.toNumber() - 3500);
  });
});