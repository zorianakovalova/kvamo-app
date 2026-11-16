import { M1, M1_SIM, M1_TEST } from './m1';
import { M2, M2_SIM, M2_TEST } from './m2';
import type { Art, LessonContent, MonthSim, Simulation, Test } from './types';

export * from './types';

const LESSONS: Record<string, LessonContent> = { ...M1, ...M2 };
const SIMS: Record<string, Simulation> = { m1l7: M1_SIM };
const TESTS: Record<string, Test> = { m1t: M1_TEST, m2t: M2_TEST };
const MONTH_SIMS: Record<string, { sim: MonthSim; art: Art }> = { m2l7: { sim: M2_SIM, art: 'sim2-intro' } };

export const lessonContent = (id: string): LessonContent | undefined => LESSONS[id];
export const simulation = (id: string): Simulation | undefined => SIMS[id];
export const testContent = (id: string): Test | undefined => TESTS[id];
export const monthSim = (id: string) => MONTH_SIMS[id];

/** Illustrations exported from Figma at 3x; ratio is width / height. */
export const ART: Record<Art, { src: number; ratio: number }> = {
  'story-m1': { src: require('../../../assets/img/lesson/story-m1.png'), ratio: 361 / 164 },
  'hero-payslip': { src: require('../../../assets/img/lesson/hero-payslip.png'), ratio: 361 / 150 },
  'needs-wants': { src: require('../../../assets/img/lesson/needs-wants.png'), ratio: 361 / 150 },
  cashback: { src: require('../../../assets/img/lesson/cashback.png'), ratio: 361 / 120 },
  'sit-m1-l1': { src: require('../../../assets/img/lesson/sit-m1-l1.png'), ratio: 361 / 96 },
  'sit-m1-l2': { src: require('../../../assets/img/lesson/sit-m1-l2.png'), ratio: 361 / 96 },
  'sit-m1-l3': { src: require('../../../assets/img/lesson/sit-m1-l3.png'), ratio: 361 / 96 },
  'sit-m1-l4': { src: require('../../../assets/img/lesson/sit-m1-l4.png'), ratio: 361 / 96 },
  'sit-m1-l5': { src: require('../../../assets/img/lesson/sit-m1-l5.png'), ratio: 361 / 96 },
  'sit-m1-l6': { src: require('../../../assets/img/lesson/sit-m1-l6.png'), ratio: 361 / 96 },
  'sim1-intro': { src: require('../../../assets/img/lesson/sim1-intro.png'), ratio: 361 / 180 },
  'test1-intro': { src: require('../../../assets/img/lesson/test1-intro.png'), ratio: 361 / 180 },
  'story-m2': { src: require('../../../assets/img/lesson/story-m2.png'), ratio: 361 / 164 },
  'cushion': { src: require('../../../assets/img/lesson/cushion.png'), ratio: 361 / 150 },
  'sit-m2-l1': { src: require('../../../assets/img/lesson/sit-m2-l1.png'), ratio: 361 / 96 },
  'sit-m2-l2': { src: require('../../../assets/img/lesson/sit-m2-l2.png'), ratio: 361 / 96 },
  'sit-m2-l3': { src: require('../../../assets/img/lesson/sit-m2-l3.png'), ratio: 361 / 96 },
  'sit-m2-l4': { src: require('../../../assets/img/lesson/sit-m2-l4.png'), ratio: 361 / 96 },
  'sit-m2-l5': { src: require('../../../assets/img/lesson/sit-m2-l5.png'), ratio: 361 / 96 },
  'sit-m2-l6': { src: require('../../../assets/img/lesson/sit-m2-l6.png'), ratio: 361 / 96 },
  'sim2-intro': { src: require('../../../assets/img/lesson/sim2-intro.png'), ratio: 361 / 140 },
  'test2-intro': { src: require('../../../assets/img/lesson/test2-intro.png'), ratio: 361 / 160 },
};
