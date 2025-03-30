// src/index.ts

import express from 'express';
import { requestLogger } from './middlewares/logger.middleware';
import employeeRoutes from './routes/employees.route';
import { correlationMiddleware } from './middlewares/correlation.middleware';
import { errorHandler } from './middlewares/error.middleware';
import './schedulers/balance.scheduler';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(correlationMiddleware);
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/employees', employeeRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});