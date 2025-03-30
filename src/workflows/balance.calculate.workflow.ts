// src/workflows/balance.calculate.workflow.ts

import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/balance.activity';

const {
  calculateBalanceByParallelBatches,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '60 minutes',
});

interface CalculateBalanceData {
  date: string;
  batchSize: number;
  parallel: number;
}

export async function calculateBalanceWorkflow(data: CalculateBalanceData) {
  const { date, batchSize, parallel } = data;
  const result = await calculateBalanceByParallelBatches(date, batchSize, parallel);
  return result;
}