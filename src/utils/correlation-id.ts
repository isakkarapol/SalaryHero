// src/utils/correlation-id.ts

import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export function setCorrelationId(correlationId: string, fn: () => void) {
  const store = new Map<string, string>();
  store.set('cid', correlationId);
  asyncLocalStorage.run(store, fn);
}

export function getCorrelationId(): string {
  const store = asyncLocalStorage.getStore();
  return store?.get('cid') ?? 'unknown';
}