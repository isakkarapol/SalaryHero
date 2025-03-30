//src/schedulers/balance.scheduler.ts

import { schedule } from 'node-cron';
import axios from 'axios';
import dayjs from 'dayjs';

schedule('* 1 * * *', async () => {
  const today = dayjs().format('YYYY-MM-DD');

  try {
    const response = await axios.post('http://localhost:3000/employees/calculate-balance', {
      date: today,
    });

    console.log(`[SCHEDULE] Success:`, response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('[SCHEDULE] Failed to calculate balance:', error.message);
    } else {
      console.error('[SCHEDULE] Failed to calculate balance:', error);
    }
  }
});