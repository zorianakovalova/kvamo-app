type ImageSourcePropType = number;

export type MaterialKind = 'sim' | 'article' | 'quiz' | 'source' | 'lesson' | 'checklist';

export type Material = {
  id: string;
  kind: MaterialKind;
  module: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  minutes?: number;
  tile: ImageSourcePropType;
  /** Shown in the module section on the Library home. */
  home?: boolean;
  /** Extra words the search should match. */
  keywords?: string;
  /** External source: site address shown in the sheet and opened in the browser. */
  site?: { name: string; host: string; url: string };
  /** Lower comes first in search results. */
  rank?: number;
};

export type Term = { id: string; title: string; definition: string };

export const KIND_LABEL: Record<MaterialKind, string> = {
  sim: 'Симуляція',
  article: 'Стаття',
  quiz: 'Квіз',
  source: 'Джерело',
  lesson: 'Заняття',
  checklist: 'Чекліст',
};

export const MATERIALS: Material[] = [
  { id: 'sim-week', kind: 'sim', module: 1, title: 'Тиждень після зарплати', subtitle: '3–5 рішень, кожне змінює залишок', minutes: 5, tile: require('../../assets/img/lib/sim-week.png'), home: true },
  { id: 'art-payslip', kind: 'article', module: 1, title: 'Як читати розрахунковий лист', subtitle: 'Що таке ПДФО, ЄСВ і військовий збір', minutes: 3, tile: require('../../assets/img/lib/art-payslip.png') },
  { id: 'art-cashback', kind: 'article', module: 1, title: 'Як насправді працює кешбек', subtitle: 'Коли він вигідний, а коли змушує витрачати більше', minutes: 4, tile: require('../../assets/img/lib/art-cashback.png'), home: true },
  { id: 'quiz-budget', kind: 'quiz', module: 1, title: 'Бюджет: 10 питань', subtitle: 'Можна пройти будь-коли, без впливу на стрик', tile: require('../../assets/img/lib/quiz-budget.png'), home: true },
  {
    id: 'src-nbu',
    kind: 'source',
    module: 1,
    title: 'НБУ: фінансова грамотність',
    subtitle: 'Зовнішній сайт',
    tile: require('../../assets/img/lib/src-nbu.png'),
    home: true,
    site: { name: 'НБУ', host: 'bank.gov.ua', url: 'https://bank.gov.ua' },
  },
  { id: 'sim-unexpected', kind: 'sim', module: 2, title: 'Непередбачені витрати', subtitle: 'Зламався телефон: звідки взяти гроші', minutes: 5, tile: require('../../assets/img/lib/sim-unexpected.png'), home: true },
  { id: 'art-cushion', kind: 'article', module: 2, title: 'Де тримати подушку безпеки', subtitle: 'Картка, депозит чи ОВДП', minutes: 4, tile: require('../../assets/img/lib/art-cushion.png'), home: true, keywords: 'подушка', rank: 3 },
  { id: 'quiz-cushion', kind: 'quiz', module: 2, title: 'Подушка безпеки: 8 питань', tile: require('../../assets/img/lib/quiz-cushion.png') },
  { id: 'sim-first1000', kind: 'sim', module: 3, title: 'Перші 1 000 грн інвестицій', minutes: 6, tile: require('../../assets/img/lib/sim-first1000.png'), keywords: 'ОВДП інвестиції' },
  { id: 'art-ovdp-buy', kind: 'article', module: 3, title: 'Як купити ОВДП у банківському застосунку', subtitle: 'Покроково, з прикладами екранів', minutes: 5, tile: require('../../assets/img/lib/art-ovdp-buy.png'), home: true, rank: 1 },
  { id: 'art-ovdp-simple', kind: 'article', module: 3, title: 'Що таке ОВДП простими словами', minutes: 5, tile: require('../../assets/img/lib/art-ovdp-simple.png') },
  { id: 'lesson-ovdp', kind: 'lesson', module: 3, title: 'ОВДП', tile: require('../../assets/img/lib/lesson-ovdp.png'), rank: 2 },
  { id: 'quiz-risk', kind: 'quiz', module: 3, title: 'Ризик чи ні: 8 ситуацій', subtitle: 'Перевір, чи розпізнаєш ризик', tile: require('../../assets/img/lib/quiz-risk.png'), home: true },
  { id: 'check-offer', kind: 'checklist', module: 3, title: 'Перевір пропозицію: 5 червоних прапорців', subtitle: 'Як розпізнати шахрайську пропозицію', tile: require('../../assets/img/lib/check-offer.png'), keywords: 'шахраї' },
  {
    id: 'src-nkcpfr',
    kind: 'source',
    module: 3,
    title: 'НКЦПФР: як перевірити компанію',
    subtitle: 'Зовнішній сайт',
    tile: require('../../assets/img/lib/src-nkcpfr.png'),
    home: true,
    site: { name: 'НКЦПФР', host: 'nssmc.gov.ua', url: 'https://www.nssmc.gov.ua' },
  },
];

/** The article that prepares for the learner's next lesson. */
export const UP_NEXT_ID = 'art-payslip';

/** "Для тебе" cards with their wide covers. */
export const FOR_YOU: { id: string; cover: ImageSourcePropType }[] = [
  { id: 'sim-first1000', cover: require('../../assets/img/lib/cover-first1000.png') },
  { id: 'art-ovdp-simple', cover: require('../../assets/img/lib/cover-ovdp-simple.png') },
];

export const TERMS: Term[] = [
  { id: 't-pdfo', title: 'ПДФО', definition: 'Податок на доходи фізичних осіб: 18 % із зарплати, його сплачує роботодавець за тебе.' },
  { id: 't-esv', title: 'ЄСВ', definition: 'Єдиний соціальний внесок: гроші на твою майбутню пенсію та соціальні виплати.' },
  { id: 't-inflation', title: 'Інфляція', definition: 'Зростання цін: з часом на ту саму суму можна купити менше.' },
  { id: 't-ovdp', title: 'ОВДП', definition: 'Облігації внутрішньої державної позики: ти позичаєш гроші державі під відсоток.' },
  { id: 't-deposit', title: 'Депозит', definition: 'Гроші, які ти кладеш у банк на певний строк під відсоток.' },
  { id: 't-diversification', title: 'Диверсифікація', definition: 'Розподіл грошей між різними активами, щоб зменшити ризик.' },
  { id: 't-cashback', title: 'Кешбек', definition: 'Частина витраченої суми, яку банк або магазин повертає тобі.' },
];

export const POPULAR = ['кешбек', 'подушка', 'інфляція', 'депозит', 'шахраї'];

export const SOON = [
  { module: 4, title: 'Податки' },
  { module: 5, title: 'Кредити' },
  { module: 6, title: 'Захист від шахраїв' },
];

export function findMaterial(id: string) {
  return MATERIALS.find((m) => m.id === id);
}

export function plural(n: number, one: string, few: string, many: string) {
  const d = n % 10;
  const h = n % 100;
  if (d === 1 && h !== 11) return one;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
}

const norm = (s: string) => s.toLocaleLowerCase('uk').replace(/[’'ʼ]/g, '').trim();

export function search(query: string) {
  const q = norm(query);
  if (!q) return { terms: [] as Term[], materials: [] as Material[] };
  return {
    terms: TERMS.filter((t) => norm(t.title).includes(q)),
    materials: MATERIALS.filter((m) => norm(`${m.title} ${m.subtitle ?? ''} ${m.keywords ?? ''}`).includes(q))
      .sort((a, b) => (a.rank ?? 10) - (b.rank ?? 10)),
  };
}

/** Queries about topics the app does not cover yet (shown with an info note). */
export function isCryptoQuery(query: string) {
  return /крипт|біткоїн|біткоін|біткойн|bitcoin|btc|crypto|ethereum|ефір/i.test(query);
}
