// src/activities/balance.activity.ts

import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../models/prisma';
import { Employee } from '@prisma/client';
import dayjs from 'dayjs';

export async function calculateDailySalary(employee: Employee, date: string): Promise<Decimal> {
  const targetDate = dayjs(date).startOf('day');

  const paySchedule = await prisma.paySchedule.findFirst({
    where: { company_id: employee.company_id },
  });
  if (!paySchedule) throw new Error('Pay schedule not found');

  const payDay = paySchedule.pay_day;
  let startDate = targetDate.date() >= payDay
    ? targetDate.date(payDay)
    : targetDate.subtract(1, 'month').date(payDay);

  if (!startDate.isValid()) {
    startDate = startDate.endOf('month');
  }

  const [holidays, companyWeeklyOffs, employeeWeeklyOffs, absences] = await Promise.all([
    prisma.holiday.findMany({
      where: {
        company_id: employee.company_id,
        holiday_date: {
          gte: startDate.toDate(),
          lte: targetDate.toDate(),
        },
      },
    }),
    prisma.companyWeeklyOff.findMany({
      where: { company_id: employee.company_id },
    }),
    prisma.employeeWeeklyOff.findMany({
      where: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
      },
    }),
    prisma.absence.findMany({
      where: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
        absent_date: {
          gte: startDate.toDate(),
          lte: targetDate.toDate(),
        },
      },
    }),
  ]);

  const holidayDates = new Set(holidays.map(h => dayjs(h.holiday_date).format('YYYY-MM-DD')));
  const companyDayOffs = new Set(companyWeeklyOffs.map(w => w.day_of_week));
  const employeeDayOffs = new Set(employeeWeeklyOffs.map(w => w.day_of_week));
  const unpaidAbsenceDates = new Set(absences.filter(a => !a.is_paid).map(a => dayjs(a.absent_date).format('YYYY-MM-DD')));

  let amount = new Decimal(0);

  for (let d = startDate.clone(); d.isBefore(targetDate.add(1, 'day')); d = d.add(1, 'day')) {
    const dayStr = d.format('YYYY-MM-DD');
    const dayOfWeek = d.day();

    const isHoliday = holidayDates.has(dayStr);
    const isCompanyOff = companyDayOffs.has(dayOfWeek);
    const isEmployeeOff = employeeDayOffs.has(dayOfWeek);
    const isAbsent = unpaidAbsenceDates.has(dayStr);

    const isWorking = !isHoliday && !isCompanyOff && !isEmployeeOff && !isAbsent;

    if (isWorking) {
      amount = amount.plus(employee.salary_amount);
    }
  }

  const existingBalance = await prisma.balance.findUnique({
    where: {
      company_id_employee_code: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
      },
    },
  });

  const borrowed = existingBalance?.borrowed ?? new Decimal(0);
  const balance = amount.minus(borrowed);

  await prisma.balance.upsert({
    where: {
      company_id_employee_code: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
      },
    },
    update: {
      amount: amount,
      borrowed,
      balance,
    },
    create: {
      employee_id: employee.id,
      company_id: employee.company_id,
      employee_code: employee.employee_code,
      date: targetDate.toDate(),
      amount: amount,
      borrowed,
      balance,
    },
  });

  return amount;
}

export async function calculateMonthlySalary(employee: Employee, date: string): Promise<Decimal> {
  const targetDate = dayjs(date).startOf('day');

  const paySchedule = await prisma.paySchedule.findFirst({
    where: { company_id: employee.company_id },
  });

  if (!paySchedule) throw new Error('Pay schedule not found');

  const payDay = paySchedule.pay_day;

  let startDate = targetDate.date() >= payDay
    ? targetDate.date(payDay)
    : targetDate.subtract(1, 'month').date(payDay);

  if (!startDate.isValid()) {
    startDate = startDate.endOf('month');
  }

  const [holidays, companyWeeklyOffs, employeeWeeklyOffs, absences] = await Promise.all([
    prisma.holiday.findMany({
      where: {
        company_id: employee.company_id,
        holiday_date: {
          gte: startDate.toDate(),
          lte: targetDate.toDate(),
        },
      },
    }),
    prisma.companyWeeklyOff.findMany({
      where: {
        company_id: employee.company_id,
      },
    }),
    prisma.employeeWeeklyOff.findMany({
      where: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
      },
    }),
    prisma.absence.findMany({
      where: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
        absent_date: {
          gte: startDate.toDate(),
          lte: targetDate.toDate(),
        },
      },
    }),
  ]);

  const holidayDates = new Set(holidays.map(h => dayjs(h.holiday_date).format('YYYY-MM-DD')));
  const companyDayOffs = new Set(companyWeeklyOffs.map(w => w.day_of_week));
  const employeeDayOffs = new Set(employeeWeeklyOffs.map(w => w.day_of_week));
  const unpaidAbsenceDates = new Set(absences.filter(a => !a.is_paid).map(a => dayjs(a.absent_date).format('YYYY-MM-DD')));

  let workingDays = 0;
  let totalDays = 0;

  for (let d = startDate.clone(); d.isBefore(targetDate.add(1, 'day')); d = d.add(1, 'day')) {
    const dayStr = d.format('YYYY-MM-DD');
    const dayOfWeek = d.day();

    const isHoliday = holidayDates.has(dayStr);
    const isCompanyOff = companyDayOffs.has(dayOfWeek);
    const isEmployeeOff = employeeDayOffs.has(dayOfWeek);
    const isAbsent = unpaidAbsenceDates.has(dayStr);

    const isWorking = !isHoliday && !isCompanyOff && !isEmployeeOff && !isAbsent;

    if (isWorking) workingDays++;
    totalDays++;
  }

  const dailyRate = employee.salary_amount.div(totalDays);
  const amount = dailyRate.mul(workingDays);

  const existingBalance = await prisma.balance.findUnique({
    where: {
      company_id_employee_code: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
      },
    },
  });

  const borrowed = existingBalance?.borrowed ?? new Decimal(0);
  const balance = amount.minus(borrowed);

  await prisma.balance.upsert({
    where: {
      company_id_employee_code: {
        company_id: employee.company_id,
        employee_code: employee.employee_code,
      },
    },
    update: {
      amount,
      borrowed,
      balance,
    },
    create: {
      employee_id: employee.id,
      company_id: employee.company_id,
      employee_code: employee.employee_code,
      date: targetDate.toDate(),
      amount,
      borrowed,
      balance,
    },
  });

  return amount;
}

export async function calculateBalanceByParallelBatches(
  date: string,
  batchSize = 1000,
  parallel = 5
): Promise<number> {
  let lastId = 0;
  let hasMore = true;
  let totalSalary = 0;

  while (hasMore) {
    const batchPromises = Array.from({ length: parallel }).map(async (_, i) => {
      const offset = i * batchSize;
      const employees = await prisma.employee.findMany({
        where: {
          id: { gt: lastId },
        },
        orderBy: { id: 'asc' },
        take: batchSize,
        skip: offset,
      });

      if (employees.length === 0) return 0;

      const batchTotal = await employees.reduce(async (accPromise, emp) => {
        const acc = await accPromise;
        const salary =
          emp.salary_type === 'daily'
            ? await calculateDailySalary(emp, date)
            : await calculateMonthlySalary(emp, date);
        return acc + salary.toNumber();
      }, Promise.resolve(0));

      return batchTotal;
    });

    const results = await Promise.all(batchPromises);
    const sum = results.reduce((acc, val) => acc + val, 0);
    totalSalary += sum;

    const lastBatch = await prisma.employee.findFirst({
      where: { id: { gt: lastId } },
      orderBy: { id: 'asc' },
      skip: batchSize * parallel - 1,
    });

    if (!lastBatch) {
      hasMore = false;
    } else {
      lastId = lastBatch.id;
    }
  }

  return totalSalary;
}