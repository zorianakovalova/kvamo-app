import type { Goal } from '@/store/profile';

export type QuizQuestion = { topic: string; question: string; options: string[]; correct: number };

export const QUIZ: QuizQuestion[] = [
  {
    topic: 'Складний відсоток',
    question: 'На рахунку 1 000 грн під 10% річних. Скільки там буде через 5 років, якщо нічого не знімати?',
    options: ['Більше 1 500 грн', 'Рівно 1 500 грн', 'Менше 1 500 грн', 'Не знаю'],
    correct: 0,
  },
  {
    topic: 'Інфляція',
    question: 'Ціни за рік зросли на 12%, а депозит приніс 8%. Що можна купити на ці гроші через рік?',
    options: ['Більше, ніж зараз', 'Стільки ж, як зараз', 'Менше, ніж зараз', 'Не знаю'],
    correct: 2,
  },
  {
    topic: 'Диверсифікація',
    question: 'Що зазвичай менш ризиковано для твоїх заощаджень?',
    options: ['Вкласти все в акції однієї компанії', 'Розподілити гроші між різними активами', 'Ризик однаковий', 'Не знаю'],
    correct: 1,
  },
];

export const GOALS: { id: Goal; label: string; phrase: string }[] = [
  { id: 'paycheck', label: 'Не жити від зарплати до зарплати', phrase: 'вийти з циклу «від зарплати до зарплати»' },
  { id: 'cushion', label: 'Створити подушку безпеки', phrase: 'створити подушку безпеки' },
  { id: 'invest', label: 'Почати інвестувати', phrase: 'почати інвестувати' },
  { id: 'basics', label: 'Просто розібратися з фінансами', phrase: 'розібратися з фінансами' },
  { id: 'other', label: 'Інше', phrase: '' },
];

export const TIME_OPTIONS = [
  { minutes: 3 as const, note: '1 урок' },
  { minutes: 5 as const, note: '1 урок і повторення' },
  { minutes: 10 as const, note: '2 уроки' },
];

/** Which onboarding goal each module answers. */
export const MODULE_GOALS: Record<string, Goal[]> = {
  m1: ['paycheck', 'basics'],
  m2: ['cushion'],
  m3: ['invest'],
};
