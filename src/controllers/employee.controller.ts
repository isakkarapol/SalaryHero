// src/controllers/employee.controller.ts

import { Request, Response, NextFunction } from 'express';
import { getEmployees } from '../services/employee.service';
import { startBalanceCalculation } from '../services/balance.service';
import { withLogFn } from '../utils/with-log';
import { ValidationException } from '../errors/validation.error';

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await getEmployees();
      res.json({ data: employees });
    } catch (err) {
      next(err);
    }
  };

  export const calculateBalances = withLogFn(
    'calculateBalances',
    async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
      const { date } = req.body;
  
      if (!date || isNaN(Date.parse(date))) {
        const exampleDate = new Date().toISOString().split('T')[0];
        throw new ValidationException(`Please provide a valid date (e.g. ${exampleDate})`);
      }
  
      const result = await startBalanceCalculation(date);
  
      return res.status(200).json({
        message: 'Salary calculation for all employees started',
        result,
      });
    }
  );
