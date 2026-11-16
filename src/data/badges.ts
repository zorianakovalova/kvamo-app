import { MODULES, type Module } from './modules';

export type Badge = {
  id: string;
  title: string;
  /** Learning module the badge is earned for; undefined while the module is still being prepared. */
  module?: Module;
  /** Topic name used in the condition text for modules that are not out yet. */
  topic: string;
  art?: number;
};

/** Module badges from the Figma "Бейджі" page (category "Модулі"): one per module, 4–6 are still in preparation. */
export const BADGES: Badge[] = [
  { id: 'budget', title: 'Бюджет', module: MODULES[0], topic: MODULES[0].title, art: require('../../assets/img/badge-budget.png') },
  { id: 'savings', title: 'Заощадження', module: MODULES[1], topic: MODULES[1].title, art: require('../../assets/img/badge-savings.png') },
  { id: 'investor', title: 'Інвестор-початківець', module: MODULES[2], topic: MODULES[2].title, art: require('../../assets/img/badge-investor.png') },
  { id: 'taxes', title: 'Податки без страху', topic: 'Податки' },
  { id: 'credit', title: 'Кредит під контролем', topic: 'Кредити' },
  { id: 'fraud', title: 'Шахраям — ні', topic: 'Захист від шахраїв' },
];
