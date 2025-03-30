# SalaryHero System

This is a balance calculation system built with Node.js, Prisma, PostgreSQL, and Temporal. It supports both daily and monthly employees and calculates salary balances accordingly.

## Features

- Supports **daily** and **monthly** salary types
- Calculates working days by excluding:
  - Company and employee weekly offs
  - Company holidays
  - Unpaid absences
- Batch and parallel processing for large employee datasets
- Saves calculated results per employee into a `Balance` table
- Uses Temporal to ensure scalability and fault tolerance

## Project Structure

```
src/
├── activities/            // Contains salary calculation logic
├── adapters/              // Temporal sendSignal
├── configs/               // Environment config and any config if needed
├── controllers/           // Express API controllers
├── errors/                // Handle error type which set 
├── middlewares/           // Express middlewares
├── models/                // Prisma client
├── routes/                // Routes of the system
├── services/              // Business logic
├── utils/                 // Utility functions, logging, etc.
├── workers/               // Temporal workers
├── workflows/             // Temporal workflows
```

---

## Configuration

Create an `.env` and `.env.worker` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://postgres:yourpass@localhost:5432/salary_hero?schema=public
TEMPORAL_ADDRESS=localhost:7233
SALARY_BATCH_SIZE=1
SALARY_PARALLEL=2
```
---

## Getting Started

### Prerequisites

- Node.js (v23.10.0)
- PostgreSQL (v17)
- Docker (for Temporal runtime)

### Install Dependencies

Run Temporal docker with this docker-compose.yml in another project
```bash
version: '3.8'

services:
  postgres:
    image: postgres:12
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: payroll_user
      POSTGRES_PASSWORD: payroll_pass
      POSTGRES_DB: temporal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U payroll_user"]
      interval: 5s
      timeout: 5s
      retries: 10

  temporal:
    image: temporalio/auto-setup:1.20.2
    ports:
      - "7233:7233"
      - "8088:8088"
    environment:
      DB: postgres12_pgx
      POSTGRES_USER: payroll_user
      POSTGRES_PASSWORD: payroll_pass
      POSTGRES_DB: temporal
      POSTGRES_SEEDS: postgres
      POSTGRES_PORT: 5432
      POSTGRES_SSL_MODE: disable
    depends_on:
      postgres:
        condition: service_healthy
```


Install dependencies

```bash
npm install
```

### 2. Set Up Database

Generate and apply Prisma migrations:

```bash
npx prisma migrate dev
npx prisma db seed
```


### 3. Start the App

Start the main API server (Express):

```bash
npm run start
```

Start Temporal Worker:

```bash
npm run start:worker
```

---

## Testing

This project uses **Jest** for unit testing.

### Run Tests:

```bash
npm run test
```

### Example Test Cases

Tests cover cases like:

- Employees working every day
- Employees who took unpaid leave
- Monthly employees with sick leave
- Borrowed amounts impacting balance calculations

Mocking Prisma is used to simulate database conditions based on seeded data.

---

## Not Ready Yet

These features are planned or in-progress:

- Result from workflow not handled yet in UI
- Caching layer (e.g., Redis) not implemented
- Worker logs not linked to correlation ID (but planned)
- Bulk upsert for better performance (currently upsert per employee)
