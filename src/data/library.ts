import { GLOSSARY } from './glossary';
import type { StickerName } from '@/components/library/stickers';
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
  /** Lesson and module where the term appears (Figma "Де зустрічається"). */
  where?: { lesson: string; module: string };
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
  { id: 'art-subs', kind: 'article', module: 1, title: 'Підписки, що тихо з\'їдають бюджет', subtitle: 'Як скасувати зайві', minutes: 3, tile: require('../../assets/img/lib/art-payslip.png') },
  { id: 'art-cashback', kind: 'article', module: 1, title: 'Кешбек: вигода чи пастка', subtitle: 'Коли змушує витрачати більше', minutes: 3, tile: require('../../assets/img/lib/art-cashback.png') },
  { id: 'sim-week', kind: 'sim', module: 1, title: 'Тиждень після зарплати', subtitle: '3–5 рішень, кожне змінює залишок', minutes: 5, tile: tile.simWeek },
  { id: 'quiz-budget', kind: 'quiz', module: 1, title: 'Бюджет: 10 питань', subtitle: 'Можна пройти будь-коли, без впливу на стрик', tile: tile.quizBudget },
  { id: 'art-fx', kind: 'article', module: 2, title: 'Гривня чи валюта для заощаджень', subtitle: 'Плюси й ризики кожної', minutes: 4, tile: require('../../assets/img/lib/art-needs.png') },
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
  { id: 'art-fgvfo', kind: 'article', module: 2, title: 'Скільки грошей захищає ФГВФО', subtitle: 'Гарантія вкладів у банках', minutes: 3, tile: require('../../assets/img/lib/art-cushion.png'), keywords: 'подушка депозит' },
  { id: 'quiz-cushion', kind: 'quiz', module: 2, title: 'Подушка безпеки: 8 питань', tile: require('../../assets/img/lib/quiz-cushion.png') },
  { id: 'sim-first1000', kind: 'sim', module: 3, title: 'Перші 1 000 грн інвестицій', minutes: 6, tile: require('../../assets/img/lib/sim-first1000.png'), keywords: 'ОВДП інвестиції' },
  { id: 'art-ovdp-buy', kind: 'article', module: 3, title: 'Як купити ОВДП у застосунку', subtitle: 'Покроково, з екранами', minutes: 4, tile: require('../../assets/img/lib/art-ovdp-buy.png'), keywords: 'ОВДП облігації' },
  { id: 'art-tax-invest', kind: 'article', module: 3, title: 'Податки з інвестицій', subtitle: 'Що і коли сплачувати', minutes: 3, tile: require('../../assets/img/lib/art-ovdp-simple.png') },
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

/** Library folders from Figma "01 Бібліотека / Головна · Папки": colours, preview stickers and what goes inside. */
export type FolderId = 'article' | 'example' | 'sim' | 'quiz' | 'source' | 'terms';
export type Folder = { id: FolderId; title: string; kinds: MaterialKind[]; color: string; glass: string; stickers: StickerName[]; forms: [string, string, string] };
export const FOLDERS: Folder[] = [
  { id: 'article', title: 'Статті', kinds: ['article'], color: '#6ca983', glass: '#5ca779', stickers: ['payslip', 'bond', 'bag'], forms: ['стаття', 'статті', 'статей'] },
  { id: 'example', title: 'Приклади', kinds: [], color: '#d88376', glass: '#dd796a', stickers: ['scales', 'broken-phone', 'red-flag'], forms: ['історія', 'історії', 'історій'] },
  { id: 'sim', title: 'Симуляції', kinds: ['sim'], color: '#7299d9', glass: '#6493de', stickers: ['calendar', 'wallet', 'sprout-coin'], forms: ['симуляція', 'симуляції', 'симуляцій'] },
  { id: 'quiz', title: 'Квізи', kinds: ['quiz'], color: '#a086e5', glass: '#9c7de8', stickers: ['question-card', 'savings-jar', 'volatility'], forms: ['квіз', 'квізи', 'квізів'] },
  { id: 'source', title: 'Джерела', kinds: ['source', 'checklist'], color: '#d39662', glass: '#d78f50', stickers: ['bank', 'government', 'checklist'], forms: ['джерело', 'джерела', 'джерел'] },
  { id: 'terms', title: 'Словник', kinds: [], color: '#67ada8', glass: '#58aca6', stickers: ['magnifier', 'coin', 'chart'], forms: ['термін', 'терміни', 'термінів'] },
];
export const folderItems = (f: Folder) => MATERIALS.filter((m) => f.kinds.includes(m.kind));

/** Stickers on each material tile inside a folder. */
export const MATERIAL_STICKERS: Record<string, StickerName[]> = {
  'art-subs': ['payslip', 'coin'],
  'art-cashback': ['bag', 'coin'],
  'art-fx': ['groceries', 'sneakers'],
  'art-fgvfo': ['cushion', 'savings-jar'],
  'art-ovdp-buy': ['phone', 'bond'],
  'art-tax-invest': ['bond', 'government'],
  'sim-week': ['calendar', 'wallet'],
  'sim-unexpected': ['broken-phone', 'wallet'],
  'sim-first1000': ['sprout-coin', 'chart'],
  'quiz-budget': ['question-card', 'wallet'],
  'quiz-cushion': ['question-card', 'savings-jar'],
  'quiz-risk': ['volatility', 'question-card'],
  'src-nbu': ['bank'],
  'src-nkcpfr': ['government', 'magnifier'],
  'check-offer': ['checklist', 'red-flag'],
};

/** Rows shown in each module section on the Library home, in the Figma order. */
export const HOME_MODULE_ROWS: Record<1 | 2 | 3, string[]> = {
  1: ['sim-week', 'art-cashback', 'quiz-budget', 'src-nbu'],
  2: ['sim-unexpected', 'art-fgvfo'],
  3: ['art-ovdp-buy', 'quiz-risk', 'src-nkcpfr'],
};

/** Library materials of a module (lessons live on the Path, not here). */
export function moduleMaterials(n: number) {
  return MATERIALS.filter((m) => m.module === n && m.kind !== 'lesson');
}

/** The article that prepares for the learner's next lesson. */
export const UP_NEXT_ID = 'art-subs';

/** "Для тебе" cards with their wide covers. */
export const FOR_YOU: { id: string; cover: ImageSourcePropType }[] = [
  { id: 'sim-first1000', cover: require('../../assets/img/lib/cover-first1000.png') },
  { id: 'art-tax-invest', cover: require('../../assets/img/lib/cover-ovdp-simple.png') },
];

/** Ids that other screens already link to. */
const LEGACY_ID: Record<string, string> = { Акція: 't-share', Бюджет: 't-budget', Відсоток: 't-interest', Депозит: 't-deposit', Диверсифікація: 't-diversification', Дивіденди: 't-dividends', ЄСВ: 't-esv', Інфляція: 't-inflation', Кешбек: 't-cashback', ОВДП: 't-ovdp', ПДФО: 't-pdfo', 'Грошова подушка': 't-cushion', 'Складний відсоток': 't-compound' };
const termId = (title: string, i: number) => LEGACY_ID[title] ?? `t-${i + 1}`;
const ID_BY_TITLE = Object.fromEntries(GLOSSARY.map((g, i) => [g[0], termId(g[0], i)]));

/** Glossary from the Figma "Словник" screens, sorted by the Ukrainian alphabet when shown. */
export const TERMS: Term[] = GLOSSARY.map(([title, short, definition, example, lesson, module, related], i) => ({
  id: termId(title, i),
  title,
  short,
  definition,
  example,
  where: { lesson, module },
  related: related.map((r) => ID_BY_TITLE[r]).filter(Boolean),
}));

/** Linked from articles but not listed in the glossary. */
const HIDDEN_TERMS: Term[] = [{ id: 't-military', title: 'Військовий збір', short: '5% із зарплати на оборону', definition: 'Податок 5% із зарплати на потреби оборони. Як і ПДФО, його утримує роботодавець, тож на картку приходить сума вже без нього.', related: ['t-pdfo', 't-esv'] }];

/** Chips in the Library home "Словник" section. */
export const HOME_TERMS = ['t-pdfo', 't-esv', 't-inflation', 't-ovdp', 't-deposit', 't-diversification', 't-cashback'];

export const POPULAR = ['кешбек', 'подушка', 'інфляція', 'депозит', 'шахраї'];

export const SOON = [
  { module: 4, title: 'Податки', about: 'ПДФО, податкова знижка і декларація.' },
  { module: 5, title: 'Кредити', about: 'Кредитки, розстрочка і реальна ціна позики.' },
  { module: 6, title: 'Захист від шахраїв', about: 'Фішинг, фейкові інвестиції і як захистити картку.' },
];

/** Article from the Figma "Стаття" screens: illustration, intro, heading, one or two visual blocks (exported from Figma) and the explanation. */
export type Article = {
  id: string;
  chapter: string;
  hero: ImageSourcePropType;
  intro: string;
  heading: string;
  visuals: { src: ImageSourcePropType; ratio: number; alt: string }[];
  /** Paragraphs separated by a blank line. A line break inside one makes its first line a bold lead-in. */
  text: string;
};

export const ARTICLES: Record<string, Article> = {
  'art-subs': {
    id: 'art-subs',
    chapter: '“Все про бюджет”',
    hero: require('../../assets/img/art/hero1.png'),
    intro: 'Музика, кіно, хмара для фото – кожна підписка здається дрібницею. Але гроші списуються щомісяця, навіть коли нею не користуються.',
    heading: 'Скільки це за рік',
    visuals: [
      { src: require('../../assets/img/art/vis1a.png'), ratio: 1179 / 609, alt: 'Музика 99 грн на місяць, кіно 199, хмара 59. Разом за рік 4 284 грн.' },
      { src: require('../../assets/img/art/vis1b.png'), ratio: 1179 / 558, alt: 'Щомісяця по 357 грн, і так 12 разів: 4 284 грн за рік.' },
    ],
    text: 'Як рахуємо: 99 + 199 + 59 = 357 грн на місяць. Помножимо на 12 – це 4 284 грн за рік.\n\nЯк скасувати зайві: відкрий виписку з банку й знайди всі регулярні списання. Залиш те, чим користуєшся щотижня.\n\nПідписки з App Store чи Google Play вимикають у налаштуваннях телефона. Безкоштовний пробний період краще вимкнути за день до кінця, щоб гроші не почали списуватися.',
  },
  'art-cashback': {
    id: 'art-cashback',
    chapter: '“Все про бюджет”',
    hero: require('../../assets/img/art/hero2.png'),
    intro: 'Кешбек – це частина грошей, яку банк повертає після покупки. Він вигідний, лише коли купуєш те, що й так планувалося.',
    heading: 'Коли кешбек – пастка',
    visuals: [{ src: require('../../assets/img/art/vis2.png'), ratio: 1179 / 768, alt: 'Планувалося 400 грн. Витрачено через акцію: 400 грн, які й так мали витратити, 550 грн зайвих покупок, 50 грн повернувся кешбек.' }],
    text: 'Як рахуємо: 5% від 1 000 грн – це 50 грн. Без акції витрати були б 400 грн. Різниця 600 грн мінус 50 грн кешбеку – це 550 грн зайвих витрат.\n\nПеред покупкою з кешбеком спитай себе: чи купувалося б це без бонусу? Якщо ні – краще не купувати. Кешбек часто має ліміт на місяць, а бали можна витратити лише в певних магазинах.',
  },
  'art-fx': {
    id: 'art-fx',
    chapter: '“Заощадження”',
    hero: require('../../assets/img/art/hero3.png'),
    intro: 'Заощадження можна тримати в гривні або в іноземній валюті. Гривня зазвичай дає вищий відсоток, а валюта захищає, коли гривня дешевшає.',
    heading: 'Плюси й ризики',
    visuals: [{ src: require('../../assets/img/art/vis3.png'), ratio: 1179 / 1068, alt: 'Відсоток чи захист: гривня дає вищий відсоток, валюта краще захищає від знецінення, а суміш гривні й валюти лежить між ними.' }],
    text: 'Чому так?\nБанки платять за гривневими вкладами більше, бо гривня з часом може дешевшати. Валюта цей ризик знижує, але відсоток на ній малий, а під час купівлі й продажу частина грошей іде на різницю курсів.\n\nЩо робити?\nНе обов’язково обирати одне. Частину подушки можна тримати в гривні для щоденних витрат, а частину – у валюті на довгий строк. Валюту варто купувати лише в банку чи офіційному обміннику.',
  },
  'art-fgvfo': {
    id: 'art-fgvfo',
    chapter: '“Заощадження”',
    hero: require('../../assets/img/art/hero4.png'),
    intro: 'Фонд гарантування вкладів фізичних осіб (ФГВФО) повертає гроші вкладникам, якщо банк закривається. Тому депозит у банку – одне з найнадійніших місць для подушки.',
    heading: 'Що захищає фонд',
    visuals: [{ src: require('../../assets/img/art/vis4.png'), ratio: 1179 / 1032, alt: 'Гарантія діє для кожного банку окремо: до 600 000 грн у кожному.' }],
    text: 'Як це працює?\nГарантія діє для кожного банку окремо. Якщо в одному банку лежить понад 600 000 грн, частину краще перенести в інший.\n\nВиплати починаються не пізніше ніж через 20 робочих днів після закриття банку.\n\nПеревір свій банк: на сайті fg.gov.ua є список банків – учасників фонду. Майже всі банки в Україні в ньому є.',
  },
  'art-ovdp-buy': {
    id: 'art-ovdp-buy',
    chapter: '“Основи інвестування”',
    hero: require('../../assets/img/art/hero5.png'),
    intro: 'ОВДП – це облігації внутрішньої державної позики. Купуючи їх, позичаєш гроші державі, а вона повертає їх із відсотками. Купити можна просто в застосунку банку.',
    heading: 'Покроково',
    visuals: [{ src: require('../../assets/img/art/vis5.png'), ratio: 1179 / 1368, alt: 'Кроки купівлі ОВДП у застосунку банку.' }],
    text: 'Що далі?\nОблігації з’являться в застосунку. Відсотки приходять за графіком або разом із сумою в кінці строку. Податку з доходу від ОВДП немає.\n\nВажливо: ОВДП не підпадають під гарантію ФГВФО, їх повертає держава. Продати раніше строку можна, але ціна може бути нижчою.',
  },
  'art-tax-invest': {
    id: 'art-tax-invest',
    chapter: '“Основи інвестування”',
    hero: require('../../assets/img/art/hero6.png'),
    intro: 'Акції купили дешевше, а продали дорожче. Різниця між цими сумами – це прибуток. З нього треба заплатити податки.',
    heading: 'Скільки податків з прибутку',
    visuals: [{ src: require('../../assets/img/art/vis6.png'), ratio: 1179 / 552, alt: 'З 10 000 грн прибутку: ПДФО 18% це 1 800 грн, військовий збір 5% це 500 грн, лишається 7 700 грн.' }],
    text: 'Як рахуємо:\n18% від 10 000 грн – це 1 800 грн\n5% – це 500 грн.\nРазом 2 300 грн податків.\n\nКоли податку немає: прибуток від ОВДП не оподатковується.\n\nХто платить: часто брокер сам забирає податок. Якщо ні – до 1 травня наступного року треба подати декларацію й сплатити податок.',
  },
};

export function findMaterial(id: string) {
  return MATERIALS.find((m) => m.id === id);
}

export function findTerm(id: string) {
  return TERMS.find((t) => t.id === id) ?? HIDDEN_TERMS.find((t) => t.id === id);
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
