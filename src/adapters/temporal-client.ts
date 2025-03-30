// adapters/temporal-client.ts

import { Connection, Client } from '@temporalio/client';
import * as wf from '@temporalio/workflow';
import { config } from '../configs';

export class temporal {
    public async sendSignal(taskQueue: string, workflowId: string, signal: wf.SignalDefinition<[Object], any>, data: Object):Promise<any> {
        try {
            const address = config.temporal.address;
            const namespace = config.temporal.namespace;

            const connection = await Connection.connect({ address });
            const client = new Client({ connection, namespace });

            const batchSize = parseInt(config.temporal.batchSize) || 1;
            const parallel = parseInt(config.temporal.palallelSize) || 2;

            const enrichedData = {
              ...data,
              batchSize,
              parallel
            };

            const result = await client.workflow.start('calculateBalanceWorkflow', {
              taskQueue: taskQueue,
              workflowId: workflowId,
              args: [enrichedData],
            });
            return result.workflowId;
          } catch (error) {
          }
    }
}

export const temporalClient = new temporal();