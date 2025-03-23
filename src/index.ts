// src/index.ts

import express from 'express';
import employeeRoutes from './routes/employees';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.use('/employees', employeeRoutes);