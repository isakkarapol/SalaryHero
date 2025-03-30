// src/workers/balance.worker.ts

import { Worker } from '@temporalio/worker';
import * as balanceActivities from '../activities/balance.activity';

async function run() {
  const worker = await Worker.create({
    taskQueue: 'balance-calculation-queue',
    workflowsPath: require.resolve('../workflows/balance.calculate.workflow'),
    activities: {
      ...balanceActivities,
    },
  });

  await worker.run();
}

run().catch((err) => {
  console.error('Worker failed:', err);
});