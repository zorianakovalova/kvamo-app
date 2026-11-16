/** Lesson content model: each lesson is a list of screens (steps) taken from the Figma "Модуль N · Заняття" pages. */

export type Feedback = { title: string; text: string };

export type Block =
  | { t: 'text'; text: string }
  /** Heading placed between blocks (when cards come before the title). */
  | { t: 'title'; text: string }
  | { t: 'note'; text: string }
  | { t: 'helper'; text: string }
  | { t: 'table'; title?: string; rows: [string, string][]; total?: boolean }
  | { t: 'stats'; items: [string, string][]; /** Indexes of grey (secondary) numbers. */ dim?: number[] }
  | { t: 'callout'; text: string; tone?: 'key' | 'example' }
  | { t: 'message'; text: string }
  | { t: 'list'; items: [string, string][] }
  | { t: 'steps'; title?: string; items: [string, string][] }
  | { t: 'split'; items: { label: string; value: string; share: number }[] }
  /** Check-marked list without numbers. */
  | { t: 'checks'; items: string[] }
  /** Selectable options with a second line (result of a practice). */
  | { t: 'choose'; items: [string, string][] }
  /** Two-column comparison: column titles, then rows of label and two values. */
  | { t: 'compare'; cols: [string, string]; rows: [string, string, string][] }
  /** Read-only chip row with one chip highlighted. */
  | { t: 'chips'; items: string[]; value: number };

/** Illustration key from assets/img/lesson. */
export type Art =
  | 'story-m1'
  | 'hero-payslip'
  | 'needs-wants'
  | 'cashback'
  | 'sit-m1-l1'
  | 'sit-m1-l2'
  | 'sit-m1-l3'
  | 'sit-m1-l4'
  | 'sit-m1-l5'
  | 'sit-m1-l6'
  | 'sim1-intro'
  | 'test1-intro'
  | 'story-m2'
  | 'cushion'
  | 'sit-m2-l1'
  | 'sit-m2-l2'
  | 'sit-m2-l3'
  | 'sit-m2-l4'
  | 'sit-m2-l5'
  | 'sit-m2-l6'
  | 'sim2-intro'
  | 'test2-intro'
  | 'story-m3'
  | 'sit-m3-l1'
  | 'sit-m3-l2'
  | 'sit-m3-l3'
  | 'ovdp-simple'
  | 'sit-m3-l4'
  | 'sit-m3-l5'
  | 'sit-m3-l6'
  | 'sim3-intro'
  | 'test3-intro'
  | 'stocks';

type Base = {
  /** Chips above the title, left aligned. */
  chips?: string[];
  /** Counter chip on the right ("1 з 2"). */
  count?: string;
  art?: Art;
};

export type ContentStep = Base & {
  kind: 'content';
  title?: string;
  /** Unbounded title instead of SF Bold. */
  display?: boolean;
  blocks: Block[];
  cta?: string;
  /** Second footer action (link). Both actions go to the next screen. */
  link?: string;
};

export type QuestionStep = Base & {
  kind: 'question';
  q: string;
  sub?: string;
  options: string[];
  correct: number;
  /** Shown under the options before the check. */
  note?: string;
  right: Feedback;
  /** Wrong-answer feedback with "Спробувати ще раз / Показати відповідь". Without it a wrong answer just shows the explanation. */
  wrong?: Feedback;
  /** Mistakes lower the lesson stars. */
  graded?: boolean;
  /** Entry check of the intro lesson: counted for the short-mode offer. */
  pretest?: boolean;
};

export type SituationStep = Base & {
  kind: 'situation';
  q: string;
  options: { label: string; good: boolean; fb: Feedback }[];
  /** Risk feedback with two buttons in a row (Lesson 1), otherwise a link below. */
  row?: boolean;
};

export type SortStep = Base & {
  kind: 'sort';
  title: string;
  text: string;
  needs: [string, number][];
  wants: [string, number][];
  queue: { label: string; amount: number; need: boolean }[];
  right: Feedback;
  wrong: Feedback;
};

export type PlanStep = Base & { kind: 'plan'; title: string; income: number; presets: [number, number, number][]; note: string; cta: string };

export type RecordStep = Base & {
  kind: 'record';
  title: string;
  amount: string;
  caption: string;
  categories: string[];
  cta: string;
};

export type CheckListStep = Base & { kind: 'checklist'; title: string; items: [string, number][]; checked: number[]; caption: string };

/** Values the learner entered in a calculator practice. */
export type CalcState = { values: number[]; to: number[]; text: string; on: boolean[]; choice: number; flag: boolean; picks: number[] };

/** Practice with editable numbers and a computed result screen (Modules 2 and 3). */
export type CalcStep = Base & {
  kind: 'calc';
  title: string;
  text?: string;
  /** Caption inside the fields card. */
  fieldsTitle?: string;
  /** Editable amounts; `to` makes a "before → now" pair. */
  fields?: { label: string; value: number; to?: number; unit?: string }[];
  textField?: { label: string; value: string };
  toggles?: { label: string; sub: string; amount: number; on: boolean }[];
  totalLabel?: string;
  choice?: { label: string; items: string[]; value: number };
  /** Several chip questions; `inline` puts each as a row with small chips inside one card. */
  choices?: { label: string; items: string[]; value: number }[];
  inline?: boolean;
  flag?: { label: string; value: boolean };
  /** Live stat under the fields. */
  live?: (s: CalcState) => [string, string];
  note?: string;
  cta: string;
  /** `save` adds a Library material to the saved list ("Зберегти чекліст"). */
  result: (s: CalcState) => { title?: string; text?: string; blocks: Block[]; cta?: string; save?: { label: string; id: string } };
};

export type Step = ContentStep | QuestionStep | SituationStep | SortStep | PlanStep | RecordStep | CheckListStep | CalcStep;

export type Done = {
  title?: string;
  key: string;
  task?: string;
  /** Up-next card overrides (Figma texts differ slightly from the Path titles). */
  nextChip?: string;
  nextTitle?: string;
  nextCta?: string;
  /** Lesson 1 offers the short mode for the rest of the module. */
  short?: boolean;
  /** Text above the entry-check score (Modules 2 and 3). */
  pretest?: string;
  /** Outline "Детальніше в Бібліотеці". */
  library?: boolean;
  /** Small grey line under the callouts. */
  note?: string;
};

export type LessonContent = { steps: Step[]; done: Done };

export type SimDay = {
  day: string;
  text: string;
  options: { label: string; cost?: number; from?: 'wants' | 'bank'; risk?: Feedback; amount?: string }[];
};

export type Simulation = {
  title: string;
  text: string;
  wants: number;
  bank: number;
  days: SimDay[];
};

export type TestQuestion = {
  q: string;
  options: string[];
  /** One index, or several for "Обери всі". */
  correct: number[];
  explain: string;
  wrongExplain?: string;
  lesson: string;
  topic: string;
  short: string;
};

/** Numbers a month simulation keeps between steps. */
export type SimState = Record<string, number>;

/** Text that may depend on the simulation state. */
export type SimText = string | ((s: SimState) => string);

export type MonthOption = {
  label: SimText;
  amount: SimText;
  good: boolean;
  fb: Feedback;
  /** Module 2: change of the cushion and debts. */
  cushion?: number;
  debt?: number;
  covered?: boolean;
  drain?: boolean;
  habit?: boolean;
  /** Module 3: id of the decision, read by the simulation's apply(). */
  act?: string;
  /** Risky option that has to be changed: no "Залишити так". */
  retry?: boolean;
};

/** Month-by-month practice (Module 2 "Непередбачені витрати", Module 3 "Перші 1 000 грн"). */
export type MonthSim = {
  title: string;
  /** Chips above the intro title. */
  chips?: string[];
  text: string;
  intro: [string, string][];
  note: string;
  /** Message bubble on the intro (Module 2) or a plain note (Module 3). */
  noteStyle?: 'message' | 'note';
  /** Caption under the intro title (Module 3). */
  sub?: string;
  next: string;
  resultCta: string;
  init: SimState;
  steps: { label: string; text: SimText; options: MonthOption[] }[];
  /** New state after a decision on step `i`. */
  apply: (s: SimState, o: MonthOption, i: number) => SimState;
  /** Summary card above the question. */
  card: (s: SimState) => { label: string; value: string; aside?: string; progress?: number; foot: [string, string] | string };
  result: (s: SimState) => { title: string; stats: [string, string][]; rows: [string, string][]; callout: string };
};

/** Copy of the Module 2–3 test screens (they differ from Module 1). */
export type TestCopy = {
  introChips: string[];
  introTitle: string;
  introText: string;
  introNote?: string;
  failCallout: string;
  failNote: string;
  moduleTitle: string;
  nextCta: string;
  /** Badge screen extras (Module 3): link under the main button, example callout and a grey note. */
  badgeLink?: { label: string; href: '/profile/badges' };
  badgeCallout?: string;
  badgeNote?: string;
};

export type Test = { pass: number; minutes: number; attempts: TestQuestion[][]; nextModule?: string; copy?: TestCopy; art?: Art };
