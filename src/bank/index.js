import { taskT1 } from './tasks/t1.js';
import { taskT2 } from './tasks/t2.js';
import { taskT3 } from './tasks/t3.js';
import { taskT4 } from './tasks/t4.js';
import { taskT5 } from './tasks/t5.js';
import { taskT6 } from './tasks/t6.js';
import { taskT7 } from './tasks/t7.js';
import { taskT8 } from './tasks/t8.js';
import { taskT9 } from './tasks/t9.js';
import { taskT10 } from './tasks/t10.js';
import { taskT11 } from './tasks/t11.js';
import { taskT12 } from './tasks/t12.js';
import { taskT13 } from './tasks/t13.js';
import { taskT14 } from './tasks/t14.js';
import { validateTasksSchema } from './validate.js';

export const TASKS = {
  t1: taskT1,
  t2: taskT2,
  t3: taskT3,
  t4: taskT4,
  t5: taskT5,
  t6: taskT6,
  t7: taskT7,
  t8: taskT8,
  t9: taskT9,
  t10: taskT10,
  t11: taskT11,
  t12: taskT12,
  t13: taskT13,
  t14: taskT14
};

export const BANK = {
  t1: taskT1.items,
  t2: taskT2.items,
  t3: taskT3.items,
  t4: taskT4.items,
  t5: taskT5.items,
  t6: taskT6.items,
  t7: taskT7.items,
  t8: taskT8.items,
  t9: taskT9.items,
  t10Pairs: taskT10.pairs,
  t11: taskT11.items,
  t12: taskT12.items,
  t13: taskT13.items,
  t14: taskT14.items
};

export const RULES = {
  t1: taskT1.meta.constraints,
  t2: taskT2.meta.constraints,
  t3: taskT3.meta.constraints,
  t4: taskT4.meta.constraints,
  t5: taskT5.meta.constraints,
  t6: taskT6.meta.constraints,
  t7: taskT7.meta.constraints,
  t8: taskT8.meta.constraints,
  t9: taskT9.meta.constraints,
  t10: taskT10.meta.constraints,
  t14: taskT14.meta.constraints,
  historySize: 20
};

export const BANK_SCHEMA_VALIDATION = validateTasksSchema(TASKS);
