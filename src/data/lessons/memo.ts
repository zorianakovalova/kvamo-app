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
};

export const round = (n: number, step = 100) => Math.round(n / step) * step;
