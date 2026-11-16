/**
 * Numbers the learner worked out in earlier practices, reused by later ones in the same session
 * ("Суми підставлено з минулих уроків"). Defaults are the Figma examples.
 */
export const memo = {
  /** Monthly amount found in "Знайди свої 5%". */
  saving: 1150,
  /** Mandatory monthly spending from "Твоя подушка". */
  monthly: 8200,
  /** Cushion size from "Твоя подушка". */
  cushion: 24600,
  /** Risk profile from "Який ризик підходить тобі?": 0 cautious, 1 moderate, 2 bold. */
  profile: 0,
  /** Basket from "Розподіли 10 000 грн": deposit, OVDP, stock fund, one company. */
  basket: [4000, 3000, 2000, 1000],
};

export const PROFILES = ['обережний', 'помірний', 'сміливий'];

export const round = (n: number, step = 100) => Math.round(n / step) * step;
