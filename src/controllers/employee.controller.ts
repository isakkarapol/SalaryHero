// src/controllers/employee.controller.ts

import { Request, Response, NextFunction } from 'express';
import { getEmployees } from '../services/employee.service';

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await getEmployees();
    res.json({ data: employees });
  } catch (err) {
    next(err);
  }
};
