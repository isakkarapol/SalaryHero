// configs/type.ts

export interface ITemporal {
    address: string;
    namespace: string;
    batchSize: string;
    palallelSize: string;
}

export interface IEmployee {
    id: number;
    name: string;
    salary_type: 'daily' | 'monthly';
    dailyRate?: number;
    monthlyRate?: number;
  }