import type { ModuleTheme } from '@/theme/tokens';

export type LessonKind = 'lesson' | 'practice' | 'simulation' | 'test';

export type Lesson = {
  id: string;
  title: string;
  /** One-line promise shown on the "Зараз" card. */
  summary: string;
  minutes: number;
  kind: LessonKind;
};

export type Module = {
  id: string;
  number: number;
  title: string;
  theme: ModuleTheme;
  icon: 'wallet' | 'coins' | 'trend';
  badge: string;
  lessons: Lesson[];
};

const l = (id: string, title: string, summary: string, minutes: number, kind: LessonKind = 'lesson'): Lesson => ({
  id,
  title,
  summary,
  minutes,
  kind,
});

export const MODULES: Module[] = [
  {
    id: 'm1',
    number: 1,
    title: 'Бюджет',
    theme: 'budget',
    icon: 'wallet',
    badge: 'Бюджет',
    lessons: [
      l('m1l1', 'Вступ: куди зникла зарплата', 'Звідки береться відчуття, що гроші тануть', 4),
      l('m1l2', 'Дохід: брудна і чиста зарплата', 'Чому на картку приходить менше, ніж у договорі', 4),
      l('m1l3', 'Потреби і бажання', 'Як відрізнити необхідне від імпульсу', 4),
      l('m1l4', 'Правило 50/30/20', 'Простий спосіб розділити зарплату', 5),
      l('m1l5', 'Облік витрат за хвилину', 'Як бачити, куди йдуть гроші, без таблиць', 4),
      l('m1l6', 'Пастки витрат', 'Кешбек, підписки і «лише 99 грн»', 4),
      l('m1l7', 'Практика: тиждень після зарплати', 'Проживи тиждень і розподіли бюджет', 6, 'practice'),
      l('m1t', 'Підсумковий тест', '10 питань · бейдж «Бюджет»', 8, 'test'),
    ],
  },
  {
    id: 'm2',
    number: 2,
    title: 'Заощадження і подушка',
    theme: 'savings',
    icon: 'coins',
    badge: 'Заощадження',
    lessons: [
      l('m2l1', 'Навіщо відкладати', 'Що дає запас і чому з нього починають', 4),
      l('m2l2', 'Спочатку заплати собі', 'Відкладай у день зарплати, а не в кінці місяця', 4),
      l('m2l3', 'Фінансова подушка', 'Скільки потрібно і де її тримати', 5),
      l('m2l4', 'Інфляція', 'Чому гроші під матрацом дешевшають', 4),
      l('m2l5', 'Депозит і складний відсоток', 'Як відсотки нараховуються на відсотки', 5),
      l('m2l6', 'Ціль накопичення', 'Як перетворити мрію на план', 4),
      l('m2l7', 'Практика: непередбачені витрати', 'Справся з несподіваними витратами', 5, 'simulation'),
      l('m2t', 'Підсумковий тест', '10 питань · бейдж «Заощадження»', 8, 'test'),
    ],
  },
  {
    id: 'm3',
    number: 3,
    title: 'Основи інвестування',
    theme: 'investing',
    icon: 'trend',
    badge: 'Інвестор-початківець',
    lessons: [
      l('m3l1', 'Чим інвестування відрізняється від заощадження', 'Коли гроші мають працювати', 4),
      l('m3l2', 'Ризик і дохідність', 'Чому висока дохідність завжди має ціну', 5),
      l('m3l3', 'Диверсифікація', 'Не всі яйця в один кошик', 4),
      l('m3l4', 'ОВДП', 'Облігації держави простими словами', 5),
      l('m3l5', 'Акції та фонди простими словами', 'Що купуєш, коли купуєш акцію', 5),
      l('m3l6', 'Інвестиційні шахраї', 'Як розпізнати «гарантований дохід»', 4),
      l('m3l7', 'Практика: перші 1 000 грн', 'Обери, куди вкласти перші гроші', 6, 'simulation'),
      l('m3t', 'Підсумковий тест', '10 питань · бейдж «Інвестор-початківець»', 8, 'test'),
    ],
  },
];

export const COMING_SOON = ['Податки', 'Кредити', 'Захист від шахраїв'] as const;

export const ALL_LESSONS = MODULES.flatMap((m) => m.lessons.map((lesson) => ({ ...lesson, module: m })));

export function findLesson(id: string) {
  return ALL_LESSONS.find((x) => x.id === id);
}

export function moduleMinutes(m: Module) {
  return m.lessons.reduce((sum, x) => sum + x.minutes, 0);
}

export function lessonMeta(lesson: Lesson) {
  if (lesson.kind === 'test') return lesson.summary;
  if (lesson.kind === 'practice') return `Практика · ${lesson.minutes} хв`;
  if (lesson.kind === 'simulation') return `Симуляція · ${lesson.minutes} хв`;
  return `${lesson.minutes} хв`;
}

/** Ukrainian plural: 1 заняття, 2 заняття, 5 занять. */
export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
