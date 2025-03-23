// src/services/employee.service.ts

import { prisma } from '../models/prisma';

export const getEmployees = async () => {
  return prisma.employee.findMany({
    include: {
      company: true,
      weekly_offs: true,
      absences: true,
    },
  });
};
