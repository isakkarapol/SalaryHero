// src/routes/employees.ts

import { Router } from 'express';
import { getAllEmployees } from '../controllers/employee.controller';

const router = Router();

router.get('/', getAllEmployees);

export default router;