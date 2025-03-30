// src/services/balance.service.ts

import { WorkflowClient, Connection } from '@temporalio/client';
import { defineSignal } from '@temporalio/workflow';
import { temporalClient } from '../adapters/temporal-client';
import { withLogFn } from '../utils/with-log';


export const startBalanceCalculation = withLogFn(
  'startBalanceCalculation',
  async (date: string) => {
    const client = new WorkflowClient();
    const timestamp = new Date().toISOString();
    const workflowId = `calculate-balance-${date}-${timestamp}`;
    const signalToProceed = defineSignal<[Object], any>('signalToProceed');

    const workflow = await temporalClient.sendSignal('balance-calculation-queue', workflowId, signalToProceed, { date });
    return { "workflowId": workflow };
  }
);