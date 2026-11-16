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

/** Simulation intros: the simulation itself is the practice lesson on the Path. */
export type Simulation = { id: string; chapter: string; hero: ImageSourcePropType; tile: ImageSourcePropType; description: string; decisions: string; minutes: number; lessonId: string };

export const SIMULATIONS: Record<string, Simulation> = {
  'sim-week': {
    id: 'sim-week',
    chapter: '“Все про бюджет”',
    hero: require('../../assets/img/lib/hero-sim-week.png'),
    tile: require('../../assets/img/lib/tile-sim-week.png'),
    description: 'На картку прийшло 15 400 грн. Ухвали кілька рішень за тиждень і подивись, скільки лишиться до наступної зарплати.',
    decisions: '3–5',
    minutes: 5,
    lessonId: 'm1l7',
  },
  'sim-unexpected': {
    id: 'sim-unexpected',
    chapter: '“Заощадження і подушка”',
    hero: require('../../assets/img/lib/hero-sim-unexpected.png'),
    tile: require('../../assets/img/lib/tile-sim-unexpected.png'),
    description: 'Зламався телефон, а до зарплати ще два тижні. Обери, звідки взяти гроші, і подивись, що буде з подушкою.',
    decisions: '3–4',
    minutes: 5,
    lessonId: 'm2l7',
  },
  'sim-first1000': {
    id: 'sim-first1000',
    chapter: '“Основи інвестування”',
    hero: require('../../assets/img/lib/hero-sim-first1000.png'),
    tile: require('../../assets/img/lib/tile-sim-first1000.png'),
    description: 'У тебе є 1 000 грн, які не знадобляться найближчий рік. Обери, куди їх вкласти, і подивись на результат через рік.',
    decisions: '3–5',
    minutes: 6,
    lessonId: 'm3l7',
  },
};

/** Quizzes: can be taken any time, no effect on streak, points or badges. */
export type QuizQuestion = { q: string; options: string[]; correct: number; explain: string; topic: string; lessonId: string };
export type Quiz = { id: string; chapter: string; minutes: number; questions: QuizQuestion[] };

export const QUIZZES: Record<string, Quiz> = {
  'quiz-budget': {
    id: 'quiz-budget',
    chapter: '“Все про бюджет”',
    minutes: 4,
    questions: [
      { q: 'У договорі 20 000 грн. Скільки приблизно прийде на картку?', options: ['20 000 грн', '15 400 грн', '18 000 грн'], correct: 1, explain: 'Із суми в договорі утримують ПДФО 18% і військовий збір 5%.', topic: 'Дохід', lessonId: 'm1l2' },
      { q: 'Від якої суми краще планувати бюджет?', options: ['Від суми в договорі', 'Від суми на руки', 'Від суми з премією'], correct: 1, explain: 'Витрачати можна лише те, що реально прийшло на картку.', topic: 'Дохід', lessonId: 'm1l2' },
      { q: 'Зарплата 20 000 грн. Скільки за правилом 50/30/20 іде на заощадження?', options: ['2 000 грн', '4 000 грн', '6 000 грн'], correct: 1, explain: '20% від 20 000 грн – це 4 000 грн.', topic: 'Правило 50/30/20', lessonId: 'm1l4' },
      { q: 'Що з цього – потреба, а не бажання?', options: ['Нові навушники', 'Оплата комуналки', 'Доставка кави'], correct: 1, explain: 'Комуналка – обовʼязкова витрата, без неї не обійтися.', topic: 'Потреби і бажання', lessonId: 'm1l3' },
      { q: 'За правилом 50/30/20 яка частка йде на бажання?', options: ['50%', '30%', '20%'], correct: 1, explain: '50% – потреби, 30% – бажання, 20% – заощадження.', topic: 'Правило 50/30/20', lessonId: 'm1l4' },
      { q: 'Кешбек 5% на покупку, яку ти не планував. Це вигідно?', options: ['Так, бо повертають гроші', 'Ні, бо 95% суми ти все одно витратив', 'Залежить від магазину'], correct: 1, explain: 'Кешбек вигідний лише на те, що ти й так збирався купити.', topic: 'Пастки витрат', lessonId: 'm1l6' },
      { q: 'Підписка за 99 грн на місяць коштує на рік приблизно:', options: ['99 грн', '600 грн', '1 200 грн'], correct: 2, explain: '99 грн × 12 місяців ≈ 1 200 грн.', topic: 'Пастки витрат', lessonId: 'm1l6' },
      { q: 'Навіщо записувати витрати?', options: ['Щоб бачити, куди йдуть гроші', 'Щоб платити менше податків', 'Щоб отримати кешбек'], correct: 0, explain: 'Облік показує, на що реально йдуть гроші і де можна заощадити.', topic: 'Облік витрат', lessonId: 'm1l5' },
      { q: 'Яку витрату найпростіше скоротити?', options: ['Оренду житла', 'Імпульсні покупки', 'Проїзд на роботу'], correct: 1, explain: 'Імпульсні покупки – бажання, від них можна відмовитися без шкоди.', topic: 'Потреби і бажання', lessonId: 'm1l3' },
      { q: 'Хто сплачує ЄСВ із твоєї зарплати?', options: ['Ти сам із суми на руки', 'Роботодавець зверху', 'Банк'], correct: 1, explain: 'ЄСВ роботодавець платить зверху, з твоєї суми його не віднімають.', topic: 'Дохід', lessonId: 'm1l2' },
    ],
  },
  'quiz-cushion': {
    id: 'quiz-cushion',
    chapter: '“Заощадження і подушка”',
    minutes: 3,
    questions: [
      { q: 'Для чого потрібна подушка безпеки?', options: ['Для відпустки', 'На непередбачені ситуації', 'Для інвестицій'], correct: 1, explain: 'Подушка – запас на втрату роботи, хворобу чи поломку.', topic: 'Фінансова подушка', lessonId: 'm2l3' },
      { q: 'Скільки зазвичай радять мати в подушці?', options: ['1 тиждень витрат', '3–6 місяців витрат', '5 років витрат'], correct: 1, explain: 'Цього вистачить, щоб спокійно пережити складний період.', topic: 'Фінансова подушка', lessonId: 'm2l3' },
      { q: 'Коли краще відкладати гроші?', options: ['У кінці місяця, що лишиться', 'У день зарплати', 'Раз на рік'], correct: 1, explain: 'Принцип «спочатку заплати собі»: відклади одразу, поки гроші не розійшлися.', topic: 'Спочатку заплати собі', lessonId: 'm2l2' },
      { q: 'Де не варто тримати подушку?', options: ['На окремій картці', 'На депозиті з можливістю зняти', 'В акціях однієї компанії'], correct: 2, explain: 'Подушка має бути доступною і не падати в ціні.', topic: 'Фінансова подушка', lessonId: 'm2l3' },
      { q: 'Інфляція 10% на рік. Що буде з 10 000 грн під матрацом?', options: ['Купиш на них більше', 'Купиш на них менше', 'Нічого не зміниться'], correct: 1, explain: 'Ціни зростуть, тож на ту саму суму можна буде купити менше.', topic: 'Інфляція', lessonId: 'm2l4' },
      { q: 'Що таке складний відсоток?', options: ['Відсоток, який важко порахувати', 'Відсотки, які нараховуються на відсотки', 'Штраф банку'], correct: 1, explain: 'Відсотки додаються до суми і далі ростуть уже на більшу суму.', topic: 'Депозит і складний відсоток', lessonId: 'm2l5' },
      { q: 'Вклади в банку до якої суми гарантує держава?', options: ['До 100 000 грн', 'До 600 000 грн', 'Без обмежень'], correct: 1, explain: 'Фонд гарантування вкладів повертає до 600 000 грн на одного вкладника в банку.', topic: 'Депозит і складний відсоток', lessonId: 'm2l5' },
      { q: 'Як перетворити мрію на ціль накопичення?', options: ['Назвати суму і строк', 'Просто відкладати, скільки вийде', 'Чекати премію'], correct: 0, explain: 'Сума і строк показують, скільки відкладати щомісяця.', topic: 'Ціль накопичення', lessonId: 'm2l6' },
    ],
  },
  'quiz-risk': {
    id: 'quiz-risk',
    chapter: '“Основи інвестування”',
    minutes: 3,
    questions: [
      { q: 'Тобі обіцяють 10% на місяць «без ризику». Що це?', options: ['Вигідна пропозиція', 'Ознака шахрайства', 'Звичайний депозит'], correct: 1, explain: 'Висока дохідність без ризику не буває. Це червоний прапорець.', topic: 'Інвестиційні шахраї', lessonId: 'm3l6' },
      { q: 'ОВДП – це позика кому?', options: ['Банку', 'Державі', 'Друзям'], correct: 1, explain: 'Купуючи ОВДП, ти позичаєш гроші державі під відсоток.', topic: 'ОВДП', lessonId: 'm3l4' },
      { q: 'Чим вища можлива дохідність, тим…', options: ['нижчий ризик', 'вищий ризик', 'ризик не змінюється'], correct: 1, explain: 'Висока дохідність завжди має ціну – більший ризик втрат.', topic: 'Ризик і дохідність', lessonId: 'm3l2' },
      { q: 'Ти вклав усі гроші в акції однієї компанії. Це…', options: ['Диверсифікація', 'Високий ризик', 'Гарантований дохід'], correct: 1, explain: 'Якщо з компанією щось станеться, втратиш усе. Краще розподіляти.', topic: 'Диверсифікація', lessonId: 'm3l3' },
      { q: 'Друг кличе в «проєкт» і просить привести ще двох людей. Це…', options: ['Стартап', 'Ймовірна фінансова піраміда', 'Депозит'], correct: 1, explain: 'Дохід за залучення нових людей – типова ознака піраміди.', topic: 'Інвестиційні шахраї', lessonId: 'm3l6' },
      { q: 'Що робити з грошима, які знадобляться за місяць?', options: ['Інвестувати в акції', 'Тримати доступними', 'Купити криптовалюту'], correct: 1, explain: 'Інвестувати варто лише гроші, які не знадобляться найближчим часом.', topic: 'Інвестування чи заощадження', lessonId: 'm3l1' },
      { q: 'Де перевірити, чи має компанія ліцензію на інвестиції?', options: ['У соцмережах компанії', 'На сайті НКЦПФР', 'У відгуках друзів'], correct: 1, explain: 'НКЦПФР веде реєстр учасників ринку цінних паперів.', topic: 'Інвестиційні шахраї', lessonId: 'm3l6' },
      { q: 'Що отримує власник акції, коли компанія ділиться прибутком?', options: ['Купон', 'Дивіденди', 'Кешбек'], correct: 1, explain: 'Частку прибутку для власників акцій називають дивідендами.', topic: 'Акції та фонди', lessonId: 'm3l5' },
    ],
  },
};
