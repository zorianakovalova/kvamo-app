import { GLOSSARY } from './glossary';
import type { StickerName } from '@/components/library/stickers';
type ImageSourcePropType = number;

export type MaterialKind = 'sim' | 'story' | 'article' | 'quiz' | 'source' | 'lesson' | 'checklist';

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
  story: 'Історія',
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
  { id: 'story-student', kind: 'story', module: 1, title: 'Бюджет студентки на 12 000 грн', subtitle: 'Реальний розподіл за місяць', tile: require('../../assets/img/lib/art-payslip.png'), keywords: 'бюджет студентка' },
  { id: 'story-family', kind: 'story', module: 1, title: 'Сім\'я з двома дітьми', subtitle: 'Бюджет на чотирьох', tile: require('../../assets/img/lib/art-needs.png'), keywords: 'бюджет сім\'я' },
  { id: 'story-deposit', kind: 'story', module: 2, title: '10 000 грн на депозиті 3 роки', subtitle: 'Скільки реально виросте', tile: require('../../assets/img/lib/art-cushion.png'), keywords: 'депозит' },
  { id: 'story-inflation', kind: 'story', module: 2, title: 'Як інфляція з\'їла заначку', subtitle: 'Ціни 2021 і 2024', tile: require('../../assets/img/lib/art-cashback.png'), keywords: 'інфляція' },
  { id: 'story-portfolio', kind: 'story', module: 3, title: 'Портфель на 5 000 грн', subtitle: 'Реальний розподіл активів', tile: require('../../assets/img/lib/art-ovdp-simple.png'), keywords: 'інвестиції портфель' },
  { id: 'story-scam', kind: 'story', module: 3, title: 'Схема про гарантовані 30%', subtitle: 'Розбір реальної піраміди', tile: require('../../assets/img/lib/art-ovdp-buy.png'), keywords: 'шахраї піраміда' },
  { id: 'art-subs', kind: 'article', module: 1, title: 'Підписки, що тихо з\'їдають бюджет', subtitle: 'Як скасувати зайві', minutes: 3, tile: require('../../assets/img/lib/art-payslip.png') },
  { id: 'art-cashback', kind: 'article', module: 1, title: 'Кешбек: вигода чи пастка', subtitle: 'Коли змушує витрачати більше', minutes: 3, tile: require('../../assets/img/lib/art-cashback.png') },
  { id: 'sim-basket', kind: 'sim', module: 1, title: 'Розумний кошик', subtitle: 'Ціна за кілограм і пастки 1+1', minutes: 5, tile: tile.simWeek, keywords: 'продукти акція бюджет' },
  { id: 'sim-installment', kind: 'sim', module: 1, title: 'Розстрочка «0%»', subtitle: 'Знайди справжню ціну', minutes: 5, tile: tile.simWeek, keywords: 'кредит комісія телефон' },
  { id: 'sim-move', kind: 'sim', module: 1, title: 'Перший переїзд', subtitle: 'Бюджет власного житла', minutes: 5, tile: tile.simWeek, keywords: 'оренда житло договір' },
  { id: 'sim-trip', kind: 'sim', module: 1, title: 'Подорож з друзями', subtitle: 'Спільні витрати без сварок', minutes: 5, tile: tile.simWeek, keywords: 'борг друзі поїздка' },
  { id: 'quiz-rights', kind: 'quiz', module: 1, title: 'Права покупця', subtitle: '5 питань · 2 хв', tile: tile.quizBudget },
  { id: 'quiz-credit', kind: 'quiz', module: 1, title: 'Кредитна картка', subtitle: '5 питань · 2 хв', tile: tile.quizBudget },
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
  { id: 'sim-fx', kind: 'sim', module: 2, title: 'Обмін валюти', subtitle: 'Де курс вигідніший', minutes: 5, tile: tile.simWeek, keywords: 'євро долар курс обмінник' },
  { id: 'art-fgvfo', kind: 'article', module: 2, title: 'Скільки грошей захищає ФГВФО', subtitle: 'Гарантія вкладів у банках', minutes: 3, tile: require('../../assets/img/lib/art-cushion.png'), keywords: 'подушка депозит' },
  { id: 'quiz-insurance', kind: 'quiz', module: 2, title: 'Страхування', subtitle: '5 питань · 2 хв', tile: tile.quizBudget },
  { id: 'quiz-fees', kind: 'quiz', module: 2, title: 'Комісії банку', subtitle: '5 питань · 2 хв', tile: tile.quizBudget },
  { id: 'sim-cashback', kind: 'sim', module: 3, title: 'Кешбек і бонуси', subtitle: 'Скільки повертається насправді', minutes: 5, tile: tile.simWeek, keywords: 'кешбек бонуси картка' },
  { id: 'art-ovdp-buy', kind: 'article', module: 3, title: 'Як купити ОВДП у застосунку', subtitle: 'Покроково, з екранами', minutes: 4, tile: require('../../assets/img/lib/art-ovdp-buy.png'), keywords: 'ОВДП облігації' },
  { id: 'art-tax-invest', kind: 'article', module: 3, title: 'Податки з інвестицій', subtitle: 'Що і коли сплачувати', minutes: 3, tile: require('../../assets/img/lib/art-ovdp-simple.png') },
  { id: 'lesson-ovdp', kind: 'lesson', module: 3, title: 'ОВДП', tile: require('../../assets/img/lib/lesson-ovdp.png'), lessonId: 'm3l4', rank: 2 },
  { id: 'quiz-charity', kind: 'quiz', module: 3, title: 'Благодійні збори', subtitle: '5 питань · 2 хв', tile: tile.quizBudget },
  { id: 'quiz-card', kind: 'quiz', module: 3, title: 'Перша банківська картка', subtitle: '5 питань · 2 хв', tile: tile.quizBudget },
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
  { id: 'example', title: 'Приклади', kinds: ['story'], color: '#d88376', glass: '#dd796a', stickers: ['scales', 'broken-phone', 'red-flag'], forms: ['історія', 'історії', 'історій'] },
  { id: 'sim', title: 'Симуляції', kinds: ['sim'], color: '#7299d9', glass: '#6493de', stickers: ['calendar', 'wallet', 'sprout-coin'], forms: ['симуляція', 'симуляції', 'симуляцій'] },
  { id: 'quiz', title: 'Квізи', kinds: ['quiz'], color: '#a086e5', glass: '#9c7de8', stickers: ['question-card', 'savings-jar', 'volatility'], forms: ['квіз', 'квізи', 'квізів'] },
  { id: 'source', title: 'Джерела', kinds: ['source', 'checklist'], color: '#d39662', glass: '#d78f50', stickers: ['bank', 'government', 'checklist'], forms: ['джерело', 'джерела', 'джерел'] },
  { id: 'terms', title: 'Словник', kinds: [], color: '#67ada8', glass: '#58aca6', stickers: ['magnifier', 'coin', 'chart'], forms: ['термін', 'терміни', 'термінів'] },
];
export const folderItems = (f: Folder) => MATERIALS.filter((m) => f.kinds.includes(m.kind));

/** Stickers on each material tile inside a folder. */
export const MATERIAL_STICKERS: Record<string, StickerName[]> = {
  'story-student': ['wallet', 'coin'],
  'story-family': ['groceries', 'wallet'],
  'story-deposit': ['savings-jar', 'coin'],
  'story-inflation': ['volatility', 'coin'],
  'story-portfolio': ['chart', 'bond'],
  'story-scam': ['red-flag', 'broken-phone'],
  'art-subs': ['phone', 'calendar'],
  'art-cashback': ['bag', 'coin'],
  'art-fx': ['coin', 'wallet'],
  'art-fgvfo': ['bank'],
  'art-ovdp-buy': ['phone', 'bond'],
  'art-tax-invest': ['payslip', 'chart'],
  'sim-basket': ['checklist', 'groceries'],
  'sim-installment': ['calendar', 'phone'],
  'sim-move': ['wallet', 'house'],
  'sim-trip': ['wallet', 'bus'],
  'sim-fx': ['coin', 'bank'],
  'sim-cashback': ['coin', 'bag'],
  'quiz-rights': ['question-card', 'bag'],
  'quiz-credit': ['question-card', 'wallet'],
  'quiz-insurance': ['question-card', 'broken-phone'],
  'quiz-fees': ['question-card', 'coin'],
  'quiz-charity': ['question-card', 'red-flag'],
  'quiz-card': ['question-card', 'bank'],
  'src-nbu': ['bank'],
  'src-nkcpfr': ['government', 'magnifier'],
  'check-offer': ['checklist', 'red-flag'],
};

/** Rows shown in each module section on the Library home, in the Figma order. */
export const HOME_MODULE_ROWS: Record<1 | 2 | 3, string[]> = {
  1: ['sim-basket', 'art-cashback', 'quiz-rights', 'src-nbu'],
  2: ['sim-fx', 'art-fgvfo'],
  3: ['art-ovdp-buy', 'quiz-charity', 'src-nkcpfr'],
};

/** Library materials of a module (lessons live on the Path, not here). */
export function moduleMaterials(n: number) {
  return MATERIALS.filter((m) => m.module === n && m.kind !== 'lesson');
}

/** The article that prepares for the learner's next lesson. */
export const UP_NEXT_ID = 'art-subs';

/** "Для тебе" cards with their wide covers. */
export const FOR_YOU: { id: string; cover: ImageSourcePropType }[] = [
  { id: 'sim-cashback', cover: require('../../assets/img/lib/cover-first1000.png') },
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
  visuals: { inset?: number; src: ImageSourcePropType; ratio: number; alt: string }[];
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
      { src: require('../../assets/img/art/vis1a.png'), ratio: 1083 / 609, inset: 16, alt: 'Музика 99 грн на місяць, кіно 199, хмара 59. Разом за рік 4 284 грн.' },
      { src: require('../../assets/img/art/vis1b.png'), ratio: 1059 / 216, inset: 20, alt: 'Щомісяця по 357 грн, і так 12 разів: 4 284 грн за рік.' },
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


/** Kvamo stories: swipeable cards exported from the Figma "Історія Квамо" screens (the text is part of the image, so every card has a spoken label). */
export type Story = { cards: { img: ImageSourcePropType; alt: string }[] };
export const STORIES: Record<string, Story> = {
  'story-student': {
    cards: [
      { img: require('../../assets/img/story/s1-1.png'), alt: 'Квамо – студент. Квамо: Привіт! Я вчуся й підробляю. Щомісяця на картку приходить 12 000 грн. Покажу, як я їх ділю.' },
      { img: require('../../assets/img/story/s1-2.png'), alt: 'Спершу – обов’язкове. Кімната 4 000, їжа 3 500, проїзд 1 000. Квамо: Першим ділом плачу за те, без чого не прожити. Разом 8 500 з 12 000 грн.' },
      { img: require('../../assets/img/story/s1-3.png'), alt: 'Одразу – в банку. Квамо: Одразу відкладаю 10% – 1 200 грн, поки гроші не розійшлися на дрібниці. 9 700 з 12 000 грн.' },
      { img: require('../../assets/img/story/s1-4.png'), alt: 'Решта – на бажання. Квамо: Лишається 2 300 грн. Кава з друзями, кіно, дрібниці – але не більше цього ліміту.' },
      { img: require('../../assets/img/story/s1-5.png'), alt: 'Кінець місяця. Квамо: Боргів – 0. У банці +1 200 грн. Якщо так щомісяця, за рік збереться 14 400 грн!' },
    ],
  },
  'story-family': {
    cards: [
      { img: require('../../assets/img/story/s2-1.png'), alt: 'Родина Квамо. Бюджет родини. 45 000 грн. •• 4521. Нас четверо: двоє дорослих і двоє дітей. Разом заробляємо 45 000 грн на місяць.' },
      { img: require('../../assets/img/story/s2-2.png'), alt: 'Спершу – дім і їжа. Першим ділом – житло, їжа, транспорт і зв’язок. Разом 29 500 грн. 29 500 з 45 000 грн' },
      { img: require('../../assets/img/story/s2-3.png'), alt: 'Окремо – на дітей. Садок, гуртки й одяг для дітей – 7 000 грн. Плануємо це наперед, а не «як вийде». 36 500 з 45 000 грн' },
      { img: require('../../assets/img/story/s2-4.png'), alt: 'Одразу – в банку. У день зарплати відкладаємо 10% – 4 500 грн. Одразу, ще до всіх покупок. 41 000 з 45 000 грн. +4 500 грн' },
      { img: require('../../assets/img/story/s2-5.png'), alt: 'Кінець місяця. Решта 4 000 грн – на відпочинок. А за рік у банці збереться 54 000 грн!. Житло 12 000. Їжа 14 000. Транспорт 3 500. Діти 7 000. Банка 4 500. Дозвілля 4 000' },
    ],
  },
  'story-deposit': {
    cards: [
      { img: require('../../assets/img/story/s3-1.png'), alt: 'Депозит Квамо. Вклад. 10 000 грн. •• 4521. Кладу 10 000 грн на депозит під 14% річних. Відсотки щороку додаються до вкладу.' },
      { img: require('../../assets/img/story/s3-2.png'), alt: 'Мінус податки. З відсотків держава забирає 23% податків. Тож вклад реально росте на 10,78% на рік.' },
      { img: require('../../assets/img/story/s3-3.png'), alt: 'Рік за роком. Відсотки нараховуються й на минулі відсотки. За 3 роки 10 000 грн стають 13 595 грн.' },
      { img: require('../../assets/img/story/s3-4.png'), alt: 'А ціни ростуть. Якщо ціни ростуть на 10% щороку, 13 595 грн через 3 роки купують стільки ж, скільки ≈ 10 200 грн сьогодні.' },
      { img: require('../../assets/img/story/s3-5.png'), alt: 'Що в підсумку. Депозит зберіг гроші від інфляції, але не зробив багатшим. Це надійне місце для подушки.' },
    ],
  },
  'story-inflation': {
    cards: [
      { img: require('../../assets/img/story/s4-1.png'), alt: 'Заначка на чорний день. 2021 рік. Відкладаю 10 000 грн удома «на чорний день». Здається, тут вони в безпеці. 2021' },
      { img: require('../../assets/img/story/s4-2.png'), alt: '2024: ціни зросли. За ці роки ціни зросли ≈ на 64%. Те, що коштувало 100 грн, тепер коштує ≈ 164 грн.' },
      { img: require('../../assets/img/story/s4-3.png'), alt: 'Сума та сама. У мене ті самі 10 000 грн, але на них можна купити лише 61% того, що раніше.' },
      { img: require('../../assets/img/story/s4-4.png'), alt: 'Що з’їла інфляція. Заначка. 10 000 грн. ≈ 6 100 грн. купує зараз. ≈ 3 900. з’їла інфляція. Гроші просто лежали, а ≈ 3 900 грн їхньої вартості з’їла інфляція.' },
      { img: require('../../assets/img/story/s4-5.png'), alt: 'Як можна було. Наступного разу покладу заначку на депозит або в ОВДП. Відсотки частково або повністю перекриють зростання цін.' },
    ],
  },
  'story-portfolio': {
    cards: [
      { img: require('../../assets/img/story/s5-1.png'), alt: 'Портфель Квамо. Для інвестицій. 5 000 грн. •• 4521. Подушка в мене вже є. Тепер хочу вкласти 5 000 грн на рік і довше.' },
      { img: require('../../assets/img/story/s5-2.png'), alt: 'Надійна частина. 80% – у надійне: по 2 000 грн на депозит і в ОВДП. Дохід там передбачуваний. 4 000 з 5 000 грн' },
      { img: require('../../assets/img/story/s5-3.png'), alt: 'Трохи ризику. Фонд акцій. 1 000 грн. ▲ росте. ▼ падає. П’ята частина – 1 000 грн – у фонд акцій. Він може і вирости, і впасти. 5 000 з 5 000 грн' },
      { img: require('../../assets/img/story/s5-4.png'), alt: 'Мій портфель. Що довше гроші можуть полежати, то більшу частку можна вкладати в акції. Депозит 40%. ОВДП 40%. Фонд акцій 20%' },
    ],
  },
  'story-scam': {
    cards: [
      { img: require('../../assets/img/story/s6-1.png'), alt: 'Дивна реклама. +30%. щомісяця. Гарантовано!. Вклади 5 000. Бачу рекламу: «Вклади 5 000 грн – отримуй 30% щомісяця. Гарантовано!» Звідки такі гроші?' },
      { img: require('../../assets/img/story/s6-2.png'), alt: 'Звідки виплати. Перші учасники справді отримують виплати – але з грошей тих, хто прийшов пізніше. Справжнього прибутку немає.' },
      { img: require('../../assets/img/story/s6-3.png'), alt: 'Нові не приходять. Коли нові люди перестають приходити, грошей на виплати немає. Схема закривається, і більшість учасників втрачає гроші. виплат немає' },
      { img: require('../../assets/img/story/s6-4.png'), alt: 'Червоні прапорці. Бачиш хоч одне з цього – зупинись і перевір. Справжні вкладення не гарантують високий дохід.' },
      { img: require('../../assets/img/story/s6-5.png'), alt: 'Рішення Квамо. Мої гроші. 5 000 грн. •• 4521. Не вкладаю. Краще депозит чи ОВДП – дохід там менший, але реальний.' },
    ],
  },
};
