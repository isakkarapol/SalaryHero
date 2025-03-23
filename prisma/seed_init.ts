import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Companies
  const companyAA = await prisma.company.create({
    data: { name: 'Company AA', weekly_off_type: 'company' },
  })
  const companyBB = await prisma.company.create({
    data: { name: 'Factory BB', weekly_off_type: 'employee' },
  })

  // Employees
  const employees = await prisma.employee.createMany({
    data: [
      {
        company_id: companyAA.id,
        employee_code: 'A001',
        name: 'Mr A',
        salary_type: 'monthly',
        salary_amount: 30000,
        start_date: new Date('2024-03-10'),
        email: 'a@example.com',
      },
      {
        company_id: companyAA.id,
        employee_code: 'B001',
        name: 'Mr B',
        salary_type: 'monthly',
        salary_amount: 32000,
        start_date: new Date('2024-03-01'),
      },
      {
        company_id: companyAA.id,
        employee_code: 'C001',
        name: 'Mr C',
        salary_type: 'daily',
        salary_amount: 500,
        start_date: new Date('2024-03-07'),
      },
      {
        company_id: companyAA.id,
        employee_code: 'D001',
        name: 'Mr D',
        salary_type: 'daily',
        salary_amount: 600,
        start_date: new Date('2024-03-05'),
      },
    ],
  })

  // Pay Schedules
  await prisma.paySchedule.createMany({
    data: [
      { company_id: companyAA.id, pay_day: 15, check_holiday: true, pay_name: 'Mid of Month' },
      { company_id: companyAA.id, pay_day: 31, check_holiday: true, pay_name: 'End of Month' },
    ],
  })

  // Company Weekly Offs
  await prisma.companyWeeklyOff.createMany({
    data: [
      { company_id: companyAA.id, day_of_week: 0 },
      { company_id: companyAA.id, day_of_week: 6 },
    ],
  })

  // Employee Weekly Offs
  const weeklyOffs = [
    { employee_code: 'A001', day: 4 },
    { employee_code: 'B001', day: 6 },
    { employee_code: 'B001', day: 0 },
    { employee_code: 'C001', day: 2 },
    { employee_code: 'D001', day: 3 },
  ]
  for (const off of weeklyOffs) {
    await prisma.employeeWeeklyOff.create({
      data: {
        company: { connect: { id: companyAA.id } },
        employee: {
          connect: {
            company_id_employee_code: {
              company_id: companyAA.id,
              employee_code: off.employee_code,
            },
          },
        },
        employee_code: off.employee_code,
        day_of_week: off.day,
      },
    })
  }

  // Holidays
  await prisma.holiday.createMany({
    data: [
      { company_id: companyAA.id, holiday_date: new Date('2024-03-06'), name: 'Makha Bucha Day' },
      { company_id: companyAA.id, holiday_date: new Date('2024-04-06'), name: 'Chakri Memorial Day' },
    ],
  })

  // Absences
  const absences = ['2024-03-09', '2024-03-10']
  for (const date of absences) {
    await prisma.absence.create({
      data: {
        company: { connect: { id: companyAA.id } },
        employee: {
          connect: {
            company_id_employee_code: {
              company_id: companyAA.id,
              employee_code: 'D001',
            },
          },
        },
        employee_code: 'D001',
        absent_date: new Date(date),
        absence_type: 'personal',
      },
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
