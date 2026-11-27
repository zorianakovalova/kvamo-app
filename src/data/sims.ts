/** Library simulations from the Figma frames 29–34: a scene picture per step, two tiles, two options and an optional risk sheet. */
type Img = number;

export type SimOpt = {
  label: string;
  /** Right-hand value of the option row. */
  value: string;
  d1?: number;
  d2?: number;
  /** Money lost compared with the better option (shown in the result). */
  over?: number;
  debt?: number;
  /** Simulation specific counter (late payments, fees, bonuses…). */
  x?: number;
  /** Absolute value for the second tile. */
  set2?: number;
  risk?: { title: string; text: string };
};

export type SimStep = { scene: Img; height: number; title: string | ((s: SimState) => string); opts: [SimOpt, SimOpt] };

export type SimState = { v1: number; v2: number; over: number; debt: number; x: number; n: number };

type Icon = 'wallet' | 'list' | 'phone' | 'jar';

export type SimDef = {
  id: string;
  title: string;
  chapter: string;
  intro: string;
  /** "5 полиць – 5 рішень". */
  stepsLabel: string;
  cta: string;
  start: { v1: number; v2: number };
  /** Two tiles on the intro, the steps and the result. */
  icons: [Icon, Icon];
  introTiles: [[string, string], [string, string]];
  tile1: (s: SimState, done: boolean) => [string, string];
  tile2: (s: SimState, done: boolean) => [string, string];
  chips: (s: SimState) => [[string, string], [string, string]];
  /** One line for the sheet that opens an already passed simulation. */
  replay: (s: SimState) => string;
  /** A shortage on the first tile is taken from the second one (the cushion). */
  overflow?: boolean;
  steps: SimStep[];
};

const sp = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const uah = (n: number) => `${n < 0 ? '−' : ''}${sp(Math.abs(n))} грн`;
const eur = (n: number) => `${sp(n)} €`;

export function initialSimState(def: SimDef): SimState {
  return { v1: def.start.v1, v2: def.start.v2, over: 0, debt: 0, x: 0, n: 0 };
}

export function applyOpt(def: SimDef, s: SimState, o: SimOpt): SimState {
  let v1 = s.v1 + (o.d1 ?? 0);
  let v2 = o.set2 ?? s.v2 + (o.d2 ?? 0);
  if (def.overflow && v1 < 0) {
    v2 += v1;
    v1 = 0;
  }
  return { v1, v2: Math.max(v2, 0), over: s.over + (o.over ?? 0), debt: s.debt + (o.debt ?? 0), x: s.x + (o.x ?? 0), n: s.n + 1 };
}

export type SimResult = { icons: [Icon, Icon]; t1: [string, string]; t2: [string, string]; chips: [[string, string], [string, string]]; replay: string };

export function simResult(def: SimDef, s: SimState): SimResult {
  return { icons: def.icons, t1: def.tile1(s, true), t2: def.tile2(s, true), chips: def.chips(s), replay: def.replay(s) };
}

const overText = (over: number) => (over ? `з переплатою ${uah(over)}` : 'без переплат');

const img = (n: number, k: number): Img =>
  ({
    1: [require('../../assets/img/sim/c1-1.png'), require('../../assets/img/sim/c1-2.png'), require('../../assets/img/sim/c1-3.png'), require('../../assets/img/sim/c1-4.png'), require('../../assets/img/sim/c1-5.png')],
    2: [require('../../assets/img/sim/c2-1.png'), require('../../assets/img/sim/c2-2.png'), require('../../assets/img/sim/c2-3.png'), require('../../assets/img/sim/c2-4.png'), require('../../assets/img/sim/c2-5.png')],
    3: [require('../../assets/img/sim/c3-1.png'), require('../../assets/img/sim/c3-2.png'), require('../../assets/img/sim/c3-3.png'), require('../../assets/img/sim/c3-4.png'), require('../../assets/img/sim/c3-5.png')],
    4: [require('../../assets/img/sim/c4-1.png'), require('../../assets/img/sim/c4-2.png'), require('../../assets/img/sim/c4-3.png'), require('../../assets/img/sim/c4-4.png'), require('../../assets/img/sim/c4-5.png')],
    5: [require('../../assets/img/sim/c5-1.png'), require('../../assets/img/sim/c5-2.png'), require('../../assets/img/sim/c5-3.png'), require('../../assets/img/sim/c5-4.png'), require('../../assets/img/sim/c5-5.png')],
    6: [require('../../assets/img/sim/c6-1.png'), require('../../assets/img/sim/c6-2.png'), require('../../assets/img/sim/c6-3.png'), require('../../assets/img/sim/c6-4.png'), require('../../assets/img/sim/c6-5.png')],
  })[n as 1][k];

export const SIM_ORDER = ['sim-basket', 'sim-installment', 'sim-move', 'sim-trip', 'sim-fx', 'sim-cashback'] as const;

export const SIMS: Record<string, SimDef> = {
  'sim-basket': {
    id: 'sim-basket',
    title: 'Розумний кошик',
    chapter: 'Ціна за кілограм і пастки 1+1',
    intro: 'П’ять полиць – п’ять рішень. Збери продукти зі списку й не вийди за бюджет.',
    stepsLabel: '5 полиць – 5 рішень',
    cta: 'Почати покупки',
    start: { v1: 300, v2: 0 },
    icons: ['wallet', 'list'],
    introTiles: [['Бюджет', '300 грн'], ['Список', '5 продуктів']],
    tile1: (s, done) => [uah(s.v1), done ? 'лишилося з 300' : 'з 300'],
    tile2: (s) => [`${s.n} з 5`, 'у кошику'],
    chips: (s) => [[uah(s.over), 'переплат'], [uah(s.v1), 'лишилось']],
    replay: (s) => `Симуляцію вже пройдено: усі 5 продуктів у кошику ${overText(s.over)}, лишилось ${uah(s.v1)}.`,
    steps: [
      {
        scene: img(1, 0),
        height: 274,
        title: 'Гречка: велика пачка чи мала?',
        opts: [
          { label: 'Пачка 1 кг', value: '−62 грн', d1: -62 },
          { label: 'Пачка 400 г', value: '−32 грн', d1: -32 },
        ],
      },
      {
        scene: img(1, 1),
        height: 246,
        title: 'Молоко 1+1, але воно зіпсується до завтра.',
        opts: [
          { label: 'Один пакет', value: '−38 грн', d1: -38 },
          {
            label: 'Два за акцією',
            value: '−58 грн',
            d1: -58,
            over: 20,
            risk: { title: 'Переплата\n20 грн', text: 'Другий пакет зіпсується раніше, ніж його вип’єш. Акція 1+1 вигідна, лише коли береш те, що й так використаєш.' },
          },
        ],
      },
      {
        scene: img(1, 2),
        height: 218,
        title: 'Макарони: на рівні очей за 54 грн, на нижній полиці за 29 грн. Склад однаковий.',
        opts: [
          { label: 'З нижньої полиці', value: '−29 грн', d1: -29 },
          { label: 'З рівня очей', value: '−54 грн', d1: -54, over: 25 },
        ],
      },
      {
        scene: img(1, 3),
        height: 246,
        title: 'Біля каси шоколадка за 45 грн. Її не було в списку.',
        opts: [
          { label: 'Не брати', value: '0 грн' },
          { label: 'Взяти', value: '−45 грн', d1: -45, over: 45 },
        ],
      },
      {
        scene: img(1, 4),
        height: 246,
        title: 'Каса: «Купи ще на 100 грн – отримаєш 30 бонусів».',
        opts: [
          { label: 'Оплатити як є', value: '0 грн' },
          { label: 'Докупити на 100 грн', value: '−100 грн', d1: -100, over: 100 },
        ],
      },
    ],
  },

  'sim-installment': {
    id: 'sim-installment',
    title: 'Розстрочка «0%»',
    chapter: 'Знайди справжню ціну',
    intro: 'П’ять пропозицій – п’ять рішень. Купи телефон за 12 000 грн і не переплати.',
    stepsLabel: '5 пропозицій – 5 рішень',
    cta: 'Почати',
    start: { v1: 12000, v2: 5000 },
    icons: ['phone', 'jar'],
    introTiles: [['Ціна телефону', '12 000 грн'], ['Подушка', '5 000 грн']],
    tile1: (s) => [uah(s.v1), 'вартість телефону'],
    tile2: (s) => [uah(s.v2), 'подушка'],
    chips: (s) => [[uah(s.over), 'переплат'], [`${6 - s.x} з 6`, 'платежів вчасно']],
    replay: (s) => `Симуляцію вже пройдено: телефон куплено ${overText(s.over)}, ${6 - s.x} з 6 платежів вчасно.`,
    steps: [
      {
        scene: img(2, 0),
        height: 216,
        title: 'Телефон за 12 000 грн у «розстрочку 0%». Дрібним шрифтом: комісія 1,5% щомісяця.',
        opts: [
          { label: 'Пошукати інші умови', value: '0 грн' },
          {
            label: 'Оформити в магазині',
            value: '+1 800 грн',
            over: 1800,
            risk: { title: 'Переплата\n1 800 грн', text: '«0%» – лише про відсотки. Комісія 1,5% щомісяця за 10 місяців – це ще 1 800 грн. Питай загальну суму всіх платежів.' },
          },
        ],
      },
      {
        scene: img(2, 1),
        height: 216,
        title: 'Банк пропонує два способи купити той самий телефон за 12 000 грн.',
        opts: [
          { label: 'Оплата частинами', value: '0 грн' },
          { label: 'Кредит на рік', value: '+1 680 грн', over: 1680 },
        ],
      },
      {
        scene: img(2, 2),
        height: 244,
        title: 'У договорі вже стоїть галочка: страхування телефону за 900 грн.',
        opts: [
          { label: 'Зняти галочку', value: '0 грн' },
          { label: 'Залишити', value: '+900 грн', over: 900 },
        ],
      },
      {
        scene: img(2, 3),
        height: 244,
        title: 'Завтра платіж 2 000 грн, а зарплату затримали на тиждень.',
        opts: [
          { label: 'Заплатити з подушки', value: 'з подушки', d2: -2000 },
          { label: 'Пропустити платіж', value: '+300 штраф', over: 300, x: 1 },
        ],
      },
      {
        scene: img(2, 4),
        height: 244,
        title: 'Банк збільшив ліміт і пропонує ще й ноутбук частинами.',
        opts: [
          { label: 'Відмовитись', value: '0 грн' },
          { label: 'Оформити ноутбук', value: '+8 000 боргу', over: 8000, debt: 8000 },
        ],
      },
    ],
  },

  'sim-move': {
    id: 'sim-move',
    title: 'Перший переїзд',
    chapter: 'Бюджет власного житла',
    intro: 'П’ять рішень про перше власне житло. Влаштуйся і не вийди за бюджет.',
    stepsLabel: '5 кроків – 5 рішень',
    cta: 'Почати',
    start: { v1: 15000, v2: 6000 },
    icons: ['wallet', 'jar'],
    introTiles: [['Бюджет на місяць', '15 000 грн'], ['Подушка', '6 000 грн']],
    tile1: (s, done) => [uah(s.v1), done ? 'лишилось' : 'на місяць'],
    tile2: (s) => [uah(s.v2), 'подушка'],
    chips: (s) => [[uah(s.over), 'переплат'], [uah(s.debt), 'нових боргів']],
    replay: (s) => `Симуляцію вже пройдено: перший переїзд ${overText(s.over)}, у бюджеті лишилось ${uah(s.v1)}.`,
    overflow: true,
    steps: [
      {
        scene: img(3, 0),
        height: 216,
        title: 'Перша оренда: квартира в центрі за 9 000 грн чи кімната за 5 500 грн, 20 хвилин до роботи?',
        opts: [
          { label: 'Кімната', value: '−5 500 грн', d1: -5500 },
          { label: 'Квартира в центрі', value: '−9 000 грн', d1: -9000 },
        ],
      },
      {
        scene: img(3, 1),
        height: 216,
        title: 'Власник просить 11 000 грн за 2 місяці наперед, а договір – «потім».',
        opts: [
          { label: 'Спершу договір', value: '0 грн' },
          {
            label: 'Переказати одразу',
            value: '−11 000 грн',
            d1: -11000,
            over: 11000,
            risk: { title: 'Ризик втратити\n11 000 грн', text: 'Без договору гроші нічим не захищені: господар може зникнути або підняти ціну. Спершу договір, потім оплата.' },
          },
        ],
      },
      {
        scene: img(3, 2),
        height: 216,
        title: 'Прийшли перші рахунки: світло й інтернет – 1 200 грн. Сплатити до 10 числа.',
        opts: [
          { label: 'Сплатити вчасно', value: '−1 200 грн', d1: -1200 },
          { label: 'Відкласти на потім', value: '+200 пені', d1: -1400, over: 200 },
        ],
      },
      {
        scene: img(3, 3),
        height: 216,
        title: 'Потрібен диван: новий у розстрочку 12 × 900 грн або вживаний за 2 000 грн.',
        opts: [
          { label: 'Вживаний', value: '−2 000 грн', d1: -2000 },
          { label: 'Новий у розстрочку', value: '−10 800 грн', d1: -10800, over: 8800, debt: 10800 },
        ],
      },
      {
        scene: img(3, 4),
        height: 244,
        title: 'Новосілля! Друзі пропонують замовити піцу на всіх за 1 500 грн.',
        opts: [
          { label: 'Приготувати разом', value: '−500 грн', d1: -500 },
          { label: 'Замовити доставку', value: '−1 500 грн', d1: -1500, over: 1000 },
        ],
      },
    ],
  },

  'sim-trip': {
    id: 'sim-trip',
    title: 'Подорож з друзями',
    chapter: 'Спільні витрати без сварок',
    intro: 'Вихідні у Львові з друзями: п’ять рішень у дорозі. Повернись без боргів і з цілою подушкою.',
    stepsLabel: '5 кроків – 5 рішень',
    cta: 'Почати',
    start: { v1: 4000, v2: 6000 },
    icons: ['wallet', 'jar'],
    introTiles: [['Бюджет на поїздку', '4 000 грн'], ['Подушка', '6 000 грн']],
    tile1: (s, done) => [uah(s.v1), done ? 'лишилось' : 'на поїздку'],
    tile2: (s) => [uah(s.v2), 'подушка'],
    chips: (s) => [[uah(s.over), 'переплат'], [uah(s.debt), 'боргів друзям']],
    replay: (s) => `Симуляцію вже пройдено: поїздка ${overText(s.over)}, у бюджеті лишилось ${uah(s.v1)}.`,
    overflow: true,
    steps: [
      {
        scene: img(4, 0),
        height: 216,
        title: 'Квитки на поїзд до Львова: зараз по 450 грн чи в день поїздки по 900 грн?',
        opts: [
          { label: 'Купити зараз', value: '−450 грн', d1: -450 },
          { label: 'Купити пізніше', value: '−900 грн', d1: -900, over: 450 },
        ],
      },
      {
        scene: img(4, 1),
        height: 216,
        title: 'Житло на 2 ночі: квартира на чотирьох за 3 200 грн чи окремий номер за 2 000 грн?',
        opts: [
          { label: 'Квартира на чотирьох', value: '−800 грн', d1: -800 },
          { label: 'Окремий номер', value: '−2 000 грн', d1: -2000 },
        ],
      },
      {
        scene: img(4, 2),
        height: 216,
        title: 'Друг заплатив за вечерю на всіх 2 400 грн і каже: «Розберемось потім».',
        opts: [
          { label: 'Скинути свою частку', value: '−600 грн', d1: -600 },
          {
            label: 'Розібратись потім',
            value: 'борг 600 грн',
            debt: 600,
            risk: { title: 'Борг\n600 грн', text: '«Потім» легко забувається, а борги між друзями псують настрій. Скинь свою частку одразу або запиши в спільний список витрат.' },
          },
        ],
      },
      {
        scene: img(4, 3),
        height: 216,
        title: 'Перекуси в дорогу назад: взяти з квартири за 80 грн чи купити на вокзалі за 300 грн?',
        opts: [
          { label: 'Взяти з собою', value: '−80 грн', d1: -80 },
          { label: 'Купити на вокзалі', value: '−300 грн', d1: -300, over: 220 },
        ],
      },
      {
        scene: img(4, 4),
        height: 244,
        title: 'Друзі хочуть лишитись у Львові ще на ніч: по 800 грн з кожного.',
        opts: [
          { label: 'Їхати за планом', value: '0 грн' },
          { label: 'Лишитись', value: '−800 з подушки', d2: -800 },
        ],
      },
    ],
  },

  'sim-fx': {
    id: 'sim-fx',
    title: 'Обмін валюти',
    chapter: 'Де курс вигідніший',
    intro: 'Поїздка за кордон: п’ять рішень про курс, комісії та обмінники. Не віддай зайвого.',
    stepsLabel: '5 кроків – 5 рішень',
    cta: 'Почати',
    start: { v1: 16000, v2: 0 },
    icons: ['wallet', 'jar'],
    introTiles: [['Гривні на обмін', '16 000 грн'], ['Потрібно', '300 €']],
    tile1: (s) => [uah(s.v1), 'гривні'],
    tile2: (s, done) => [eur(s.v2), done ? 'збережено' : 'в євро'],
    chips: (s) => [[uah(s.over), 'переплат'], [eur(s.x), 'комісії']],
    replay: (s) => `Симуляцію вже пройдено: обмін ${overText(s.over)}, збережено ${eur(s.v2)}.`,
    steps: [
      {
        scene: img(5, 0),
        height: 216,
        title: 'На поїздку потрібно 300 €. Де міняти: в аеропорту чи в банку в місті?',
        opts: [
          { label: 'Банк у місті', value: '−13 650 грн', d1: -13650, d2: 300 },
          { label: 'Аеропорт', value: '−14 700 грн', d1: -14700, d2: 300, over: 1050 },
        ],
      },
      {
        scene: img(5, 1),
        height: 216,
        title: 'Незнайомець у чаті пропонує 50 € за 2 000 грн: переказ на картку зараз, валюта при зустрічі.',
        opts: [
          { label: 'Відмовитись', value: '0 грн' },
          {
            label: 'Переказати',
            value: '−2 000 грн',
            d1: -2000,
            over: 2000,
            risk: { title: 'Ризик втратити\n2 000 грн', text: 'Надто вигідний курс від незнайомця – типова схема шахраїв. Міняй гроші тільки в банку чи офіційному обміннику.' },
          },
        ],
      },
      {
        scene: img(5, 2),
        height: 244,
        title: 'У кафе за кордоном термінал питає: сплатити 20 € чи 980 грн?',
        opts: [
          { label: 'У євро', value: '−20 €', d2: -20 },
          { label: 'У гривнях', value: '−980 грн', d1: -980, over: 70 },
        ],
      },
      {
        scene: img(5, 3),
        height: 244,
        title: 'Банкомат бере 5 € за кожне зняття готівки. Як зняти 100 €?',
        opts: [
          { label: 'Один раз 100 €', value: '−5 €', set2: 40, x: 5 },
          { label: 'Щодня по 20 €', value: '−25 €', set2: 20, x: 25 },
        ],
      },
      {
        scene: img(5, 4),
        height: 216,
        title: (s) => `Поїздка закінчилась, лишилось ${eur(s.v2)}. Обміняти в аеропорту по 41 грн за € чи зберегти?`,
        opts: [
          { label: 'Зберегти євро', value: '0 грн' },
          { label: 'Обміняти назад', value: '−320 грн', over: 320, set2: 0 },
        ],
      },
    ],
  },

  'sim-cashback': {
    id: 'sim-cashback',
    title: 'Кешбек і бонуси',
    chapter: 'Скільки повертається насправді',
    intro: 'Місяць покупок карткою: п’ять рішень про кешбек, акції та бонуси. Отримай вигоду, а не зайві витрати.',
    stepsLabel: '5 кроків – 5 рішень',
    cta: 'Почати',
    start: { v1: 6000, v2: 0 },
    icons: ['wallet', 'jar'],
    introTiles: [['Витрати на місяць', '6 000 грн'], ['Кешбек', '0 грн']],
    tile1: (s, done) => [uah(s.v1), done ? 'лишилось' : 'на місяць'],
    tile2: (s) => [uah(s.v2), 'кешбек'],
    chips: (s) => [[uah(s.over), 'переплат'], [sp(s.x), 'бонусів']],
    replay: (s) => `Симуляцію вже пройдено: кешбек ${uah(s.v2)}, ${overText(s.over)}, лишилось ${uah(s.v1)}.`,
    steps: [
      {
        scene: img(6, 0),
        height: 244,
        title: 'Банк дає 5% кешбеку на одну категорію. Яку обрати?',
        opts: [
          { label: 'Продукти', value: '+125 грн', d2: 125 },
          { label: 'Кафе', value: '+10 грн', d2: 10, over: 115 },
        ],
      },
      {
        scene: img(6, 1),
        height: 216,
        title: 'Акція: навушники за 1 000 грн і 100 грн кешбеку. У твоєму списку їх немає.',
        opts: [
          { label: 'Не купувати', value: '0 грн' },
          { label: 'Купити', value: '−900 грн', d1: -900, over: 900 },
        ],
      },
      {
        scene: img(6, 2),
        height: 216,
        title: 'Прийшло SMS: «Ваш кешбек згорить сьогодні! Підтвердіть картку за посиланням».',
        opts: [
          { label: 'Перевірити в застосунку', value: '0 грн' },
          {
            label: 'Перейти за посиланням',
            value: 'ризик',
            d1: -6000,
            d2: -125,
            over: 6000,
            risk: { title: 'Ризик втратити\n6 000 грн', text: 'Банк не просить підтверджувати картку за посиланням. Це фішинг: так крадуть дані картки. Перевіряй кешбек лише в застосунку банку.' },
          },
        ],
      },
      {
        scene: img(6, 3),
        height: 216,
        title: 'Нова картка: кешбек 2% замість 1%, але обслуговування 150 грн на місяць.',
        opts: [
          { label: 'Лишити стару', value: '0 грн' },
          { label: 'Оформити нову', value: '−90 грн/міс', d1: -90, over: 90 },
        ],
      },
      {
        scene: img(6, 4),
        height: 216,
        title: 'У магазині 300 бонусів, які згорять за тиждень. Продукти в кошику – на 400 грн.',
        opts: [
          { label: 'Оплатити бонусами', value: '−100 грн', d1: -100, x: 300 },
          { label: 'Зберегти бонуси', value: '−400 грн', d1: -400, over: 300 },
        ],
      },
    ],
  },
};

export const SIM_ICONS = {
  wallet: require('../../assets/img/sim/i-wallet.png'),
  list: require('../../assets/img/sim/i-list.png'),
  phone: require('../../assets/img/sim/i-phone.png'),
  jar: require('../../assets/img/sim/i-jar.png'),
} satisfies Record<Icon, Img>;
