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
  /** Extra words the search should match. */
  keywords?: string;
  /** External source: site address shown in the sheet and opened in the browser. */
  site?: { name: string; host: string; url: string };
  /** Lesson on the Path that this row opens. */
  lessonId?: string;
  /** Lower comes first in search results. */
  rank?: number;
};

export type Term = {
  id: string;
  title: string;
  /** Short line in the glossary list. */
  short: string;
  definition: string;
  example?: string;
  /** Materials where the term is used. */
  usedIn?: string[];
  related?: string[];
};

export const KIND_LABEL: Record<MaterialKind, string> = {
  sim: 'Симуляція',
  article: 'Стаття',
  quiz: 'Квіз',
  source: 'Джерело',
  lesson: 'Заняття',
  checklist: 'Чекліст',
};

const tile = {
  simWeek: require('../../assets/img/lib/sim-week.png'),
  quizBudget: require('../../assets/img/lib/quiz-budget.png'),
};

export const MATERIALS: Material[] = [
  { id: 'art-payslip', kind: 'article', module: 1, title: 'Як читати розрахунковий лист', subtitle: 'Що таке ПДФО, ЄСВ і військовий збір', minutes: 3, tile: require('../../assets/img/lib/art-payslip.png') },
  { id: 'art-cashback', kind: 'article', module: 1, title: 'Як насправді працює кешбек', subtitle: 'Коли він вигідний, а коли змушує витрачати більше', minutes: 4, tile: require('../../assets/img/lib/art-cashback.png') },
  { id: 'sim-week', kind: 'sim', module: 1, title: 'Тиждень після зарплати', subtitle: '3–5 рішень, кожне змінює залишок', minutes: 5, tile: tile.simWeek },
  { id: 'quiz-budget', kind: 'quiz', module: 1, title: 'Бюджет: 10 питань', subtitle: 'Можна пройти будь-коли, без впливу на стрик', tile: tile.quizBudget },
  { id: 'art-needs', kind: 'article', module: 1, title: 'Потреби чи бажання: 5 прикладів', subtitle: 'Як відрізнити необхідне від імпульсу', minutes: 4, tile: require('../../assets/img/lib/art-needs.png') },
  {
    id: 'src-nbu',
    kind: 'source',
    module: 1,
    title: 'НБУ: фінансова грамотність',
    subtitle: 'Зовнішній сайт',
    tile: require('../../assets/img/lib/src-nbu.png'),
    site: { name: 'НБУ', host: 'bank.gov.ua', url: 'https://bank.gov.ua' },
  },
  { id: 'lesson-income', kind: 'lesson', module: 1, title: 'Дохід', tile: tile.quizBudget, lessonId: 'm1l2', keywords: 'зарплата' },
  { id: 'sim-unexpected', kind: 'sim', module: 2, title: 'Непередбачені витрати', subtitle: 'Зламався телефон: звідки взяти гроші', minutes: 5, tile: require('../../assets/img/lib/sim-unexpected.png') },
  { id: 'art-cushion', kind: 'article', module: 2, title: 'Де тримати подушку безпеки', subtitle: 'Картка, депозит чи ОВДП', minutes: 4, tile: require('../../assets/img/lib/art-cushion.png'), keywords: 'подушка', rank: 3 },
  { id: 'quiz-cushion', kind: 'quiz', module: 2, title: 'Подушка безпеки: 8 питань', tile: require('../../assets/img/lib/quiz-cushion.png') },
  { id: 'sim-first1000', kind: 'sim', module: 3, title: 'Перші 1 000 грн інвестицій', minutes: 6, tile: require('../../assets/img/lib/sim-first1000.png'), keywords: 'ОВДП інвестиції' },
  { id: 'art-ovdp-buy', kind: 'article', module: 3, title: 'Як купити ОВДП у банківському застосунку', subtitle: 'Покроково, з прикладами екранів', minutes: 5, tile: require('../../assets/img/lib/art-ovdp-buy.png'), rank: 1 },
  { id: 'art-ovdp-simple', kind: 'article', module: 3, title: 'Що таке ОВДП простими словами', minutes: 5, tile: require('../../assets/img/lib/art-ovdp-simple.png') },
  { id: 'lesson-ovdp', kind: 'lesson', module: 3, title: 'ОВДП', tile: require('../../assets/img/lib/lesson-ovdp.png'), lessonId: 'm3l4', rank: 2 },
  { id: 'quiz-risk', kind: 'quiz', module: 3, title: 'Ризик чи ні: 8 ситуацій', subtitle: 'Перевір, чи розпізнаєш ризик', tile: require('../../assets/img/lib/quiz-risk.png') },
  { id: 'check-offer', kind: 'checklist', module: 3, title: 'Перевір пропозицію: 5 червоних прапорців', subtitle: 'Як розпізнати шахрайську пропозицію', tile: require('../../assets/img/lib/check-offer.png'), keywords: 'шахраї' },
  {
    id: 'src-nkcpfr',
    kind: 'source',
    module: 3,
    title: 'НКЦПФР: як перевірити компанію',
    subtitle: 'Зовнішній сайт',
    tile: require('../../assets/img/lib/src-nkcpfr.png'),
    site: { name: 'НКЦПФР', host: 'nssmc.gov.ua', url: 'https://www.nssmc.gov.ua' },
  },
];

/** Rows shown in each module section on the Library home, in the Figma order. */
export const HOME_MODULE_ROWS: Record<1 | 2 | 3, string[]> = {
  1: ['sim-week', 'art-cashback', 'quiz-budget', 'src-nbu'],
  2: ['sim-unexpected', 'art-cushion'],
  3: ['art-ovdp-buy', 'quiz-risk', 'src-nkcpfr'],
};

/** Library materials of a module (lessons live on the Path, not here). */
export function moduleMaterials(n: number) {
  return MATERIALS.filter((m) => m.module === n && m.kind !== 'lesson');
}

/** The article that prepares for the learner's next lesson. */
export const UP_NEXT_ID = 'art-payslip';

/** "Для тебе" cards with their wide covers. */
export const FOR_YOU: { id: string; cover: ImageSourcePropType }[] = [
  { id: 'sim-first1000', cover: require('../../assets/img/lib/cover-first1000.png') },
  { id: 'art-ovdp-simple', cover: require('../../assets/img/lib/cover-ovdp-simple.png') },
];

/** Glossary, sorted by the Ukrainian alphabet when shown. */
export const TERMS: Term[] = [
  { id: 't-share', title: 'Акція', short: 'Частка у власності компанії', definition: 'Цінний папір, який робить тебе співвласником компанії. Ціна акції може як зрости, так і впасти.', related: ['t-dividends', 't-diversification'] },
  { id: 't-budget', title: 'Бюджет', short: 'План доходів і витрат', definition: 'План, скільки грошей ти отримуєш і на що їх витрачаєш за місяць. Допомагає бачити, куди йдуть гроші.', usedIn: ['quiz-budget', 'sim-week'], related: ['t-cushion'] },
  { id: 't-interest', title: 'Відсоток', short: 'Плата за користування грошима', definition: 'Плата, яку банк чи держава дає тобі за те, що користуються твоїми грошима. Або яку ти платиш, коли позичаєш сам.', related: ['t-deposit', 't-compound'] },
  { id: 't-military', title: 'Військовий збір', short: '5% із зарплати на оборону', definition: 'Податок 5% із зарплати на потреби оборони. Як і ПДФО, його утримує роботодавець, тож на картку приходить сума вже без нього.', usedIn: ['art-payslip'], related: ['t-pdfo', 't-esv'] },
  { id: 't-deposit', title: 'Депозит', short: 'Гроші в банку під відсоток на строк', definition: 'Гроші, які ти кладеш у банк на певний строк. За це банк платить відсоток. Вклади до 600 000 грн гарантує держава.', usedIn: ['art-cushion'], related: ['t-interest', 't-ovdp', 't-compound'] },
  { id: 't-diversification', title: 'Диверсифікація', short: 'Розподіл грошей між вкладеннями', definition: 'Розподіл грошей між різними вкладеннями, щоб невдача одного не забрала все. Не всі яйця в один кошик.', usedIn: ['sim-first1000'], related: ['t-share', 't-ovdp'] },
  { id: 't-dividends', title: 'Дивіденди', short: 'Частка прибутку для власників акцій', definition: 'Частина прибутку компанії, яку вона виплачує власникам акцій. Не всі компанії платять дивіденди.', related: ['t-share'] },
  { id: 't-esv', title: 'ЄСВ', short: 'Внесок, який сплачує роботодавець', definition: 'Єдиний соціальний внесок: 22% від зарплати на пенсію і соціальні виплати. Роботодавець платить його зверху, з твоєї суми його не віднімають.', usedIn: ['art-payslip'], related: ['t-pdfo', 't-military'] },
  { id: 't-inflation', title: 'Інфляція', short: 'Зростання цін з часом', definition: 'Зростання цін з часом. Через інфляцію на ту саму суму через рік можна купити менше.', related: ['t-deposit', 't-ovdp'] },
  { id: 't-cashback', title: 'Кешбек', short: 'Повернення частини витрат', definition: 'Частина витраченої суми, яку банк або магазин повертає тобі. Вигідний, лише коли ти й так планував цю покупку.', usedIn: ['art-cashback'], related: ['t-budget'] },
  { id: 't-coupon', title: 'Купон', short: 'Відсоток, який платять за облігацією', definition: 'Регулярна виплата відсотків власнику облігації. Для ОВДП купон зазвичай платять двічі на рік.', related: ['t-ovdp', 't-nominal'] },
  { id: 't-nominal', title: 'Номінал', short: 'Сума, яку повернуть у кінці строку', definition: 'Ціна облігації, яку тобі повернуть у кінці строку. Для ОВДП номінал зазвичай 1 000 грн.', related: ['t-ovdp', 't-coupon'] },
  {
    id: 't-ovdp',
    title: 'ОВДП',
    short: 'Облігації держави під відсоток',
    definition: 'Облігації внутрішньої державної позики. Ти позичаєш гроші державі, а вона платить відсоток і в кінці строку повертає суму. Дохід за ОВДП не оподатковується.',
    example: '3 ОВДП по 1 000 грн під 15% на рік – це 450 грн відсотків за рік і 3 000 грн назад у кінці строку.',
    usedIn: ['lesson-ovdp'],
    related: ['t-deposit', 't-nominal', 't-coupon'],
  },
  { id: 't-pdfo', title: 'ПДФО', short: 'Податок 18% із доходу', definition: 'Податок на доходи фізичних осіб.\nІз зарплати утримують 18%, і роботодавець сам сплачує його до бюджету.\nНа картку приходить сума вже без нього.', usedIn: ['art-payslip'], related: ['t-military', 't-esv'] },
  { id: 't-cushion', title: 'Подушка безпеки', short: 'Запас на 3–6 місяців витрат', definition: 'Гроші, відкладені на непередбачені ситуації: втрату роботи, хворобу, поломку. Зазвичай це 3–6 місячних витрат.', usedIn: ['art-cushion', 'sim-unexpected'], related: ['t-deposit', 't-budget'] },
  { id: 't-compound', title: 'Складний відсоток', short: 'Відсотки, які нараховуються на відсотки', definition: 'Коли відсотки додаються до суми і наступного разу нараховуються вже на більшу суму. Чим довше строк, тим помітніший ефект.', related: ['t-interest', 't-deposit'] },
];

/** Chips in the Library home "Словник" section. */
export const HOME_TERMS = ['t-pdfo', 't-esv', 't-inflation', 't-ovdp', 't-deposit', 't-diversification', 't-cashback'];

export const POPULAR = ['кешбек', 'подушка', 'інфляція', 'депозит', 'шахраї'];

export const SOON = [
  { module: 4, title: 'Податки', about: 'ПДФО, податкова знижка і декларація.' },
  { module: 5, title: 'Кредити', about: 'Кредитки, розстрочка і реальна ціна позики.' },
  { module: 6, title: 'Захист від шахраїв', about: 'Фішинг, фейкові інвестиції і як захистити картку.' },
];

/** Article body: paragraphs (with glossary links), headings, a table, a callout and a self-check. */
export type Inline = string | { term: string; text: string };
export type Block =
  | { type: 'p'; parts: Inline[] }
  | { type: 'h'; text: string }
  | { type: 'table'; rows: { label: string; value: string; kind?: 'deduction' | 'total' }[] }
  | { type: 'callout'; text: string };
export type Article = {
  id: string;
  chapter: string;
  hero: ImageSourcePropType;
  blocks: Block[];
  check: { question: string; options: string[]; correct: number };
  readAlso: string[];
};

export const ARTICLES: Record<string, Article> = {
  'art-payslip': {
    id: 'art-payslip',
    chapter: '“Все про бюджет”',
    hero: require('../../assets/img/lib/hero-payslip.png'),
    blocks: [
      {
        type: 'p',
        parts: ['Розрахунковий лист показує, скільки тобі нарахували і скільки ти отримуєш на руки. Різниця – це податки: ', { term: 't-pdfo', text: 'ПДФО' }, ' і ', { term: 't-military', text: 'військовий збір' }, '.'],
      },
      { type: 'h', text: 'Що утримують із зарплати' },
      {
        type: 'table',
        rows: [
          { label: 'Нараховано', value: '20 000 грн' },
          { label: 'ПДФО 18%', value: '−3 600 грн', kind: 'deduction' },
          { label: 'Військовий збір 5%', value: '−1 000 грн', kind: 'deduction' },
          { label: 'На руки', value: '15 400 грн', kind: 'total' },
        ],
      },
      { type: 'p', parts: ['Нараховано – уся сума за місяць: оклад, премії, доплати.'] },
      { type: 'p', parts: ['Утримано – податки, які роботодавець сплатив за тебе.'] },
      { type: 'p', parts: ['До виплати – те, що прийде на картку.'] },
      { type: 'p', parts: ['ЄСВ (22%) роботодавець платить зверху, з твоєї суми його не віднімають.'] },
      { type: 'callout', text: 'Сума в договорі – це «брудна» зарплата. Плануй бюджет від суми на руки.' },
    ],
    check: { question: 'Що з цього утримують із зарплати?', options: ['ПДФО і військовий збір', 'Кешбек'], correct: 0 },
    readAlso: ['art-cashback', 'lesson-income'],
  },
};

export function findMaterial(id: string) {
  return MATERIALS.find((m) => m.id === id);
}

export function findTerm(id: string) {
  return TERMS.find((t) => t.id === id);
}

export function plural(n: number, one: string, few: string, many: string) {
  const d = n % 10;
  const h = n % 100;
  if (d === 1 && h !== 11) return one;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
}

export const termsLabel = (n: number) => `${n} ${plural(n, 'термін', 'терміни', 'термінів')}`;

const norm = (s: string) => s.toLocaleLowerCase('uk').replace(/[’'ʼ]/g, '').trim();

export function search(query: string) {
  const q = norm(query);
  if (!q) return { terms: [] as Term[], materials: [] as Material[] };
  return {
    terms: TERMS.filter((t) => norm(t.title).includes(q)),
    materials: MATERIALS.filter((m) => norm(`${m.title} ${m.subtitle ?? ''} ${m.keywords ?? ''}`).includes(q)).sort((a, b) => (a.rank ?? 10) - (b.rank ?? 10)),
  };
}

export function searchTerms(query: string) {
  const q = norm(query);
  return q ? TERMS.filter((t) => norm(`${t.title} ${t.short}`).includes(q)) : TERMS;
}

/** Queries about topics the app does not cover yet (shown with an info note). */
export function isCryptoQuery(query: string) {
  return /крипт|біткоїн|біткоін|біткойн|bitcoin|btc|crypto|ethereum|ефір/i.test(query);
}
