// configs/index.ts

import { ITemporal } from './type';

const temporalConfig: ITemporal = {
    address: process.env.TEMPORAL_ADDRESS || 'http://localhost:7233',
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    batchSize: process.env.CAL_BATCH_SIZE || '1',
    palallelSize: process.env.CAL_PARALLEL || '2',
};

export const config = {
    temporal: temporalConfig
};