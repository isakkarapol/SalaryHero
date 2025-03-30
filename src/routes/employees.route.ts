// src/routes/employees.ts

import { Router } from 'express';
import { getAllEmployees, calculateBalances } from '../controllers/employee.controller';

const router = Router();

// GET /employees -- to test DB connection
router.get('/', getAllEmployees);

// POST /employees/calculate-balance -- to test temporal connection
router.post('/calculate-balance', calculateBalances);

export default router;