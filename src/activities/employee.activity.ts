// src/activities/employee.activity.ts

import { prisma } from '../models/prisma';

export async function fetchAllEmployees() {
  return await prisma.employee.findMany();
}

export async function fetchEmployeeById(id: number) {
  return await prisma.employee.findUnique({
    where: { id },
  });
}
