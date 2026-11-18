import { MODULES, type Module } from './modules';

export type Badge = {
  id: string;
  title: string;
  /** Learning module the badge is earned for; undefined while the module is still being prepared. */
  module?: Module;
  /** Topic name used in the condition text for modules that are not out yet. */
  topic: string;
  art?: number;
  /** Grey "not earned yet" art from the Figma section "Бейджі · не отримані". */
  off: number;
};

/** Module badges from the Figma "Бейджі" page (category "Модулі"): one per module, 4–6 are still in preparation. */
export const BADGES: Badge[] = [
  { id: 'budget', title: 'Бюджет', module: MODULES[0], topic: MODULES[0].title, art: require('../../assets/img/badge/budget.png'), off: require('../../assets/img/badge/budget-off.png') },
  { id: 'savings', title: 'Заощадження', module: MODULES[1], topic: MODULES[1].title, art: require('../../assets/img/badge/savings.png'), off: require('../../assets/img/badge/savings-off.png') },
  { id: 'investor', title: 'Інвестор-початківець', module: MODULES[2], topic: MODULES[2].title, art: require('../../assets/img/badge/investor.png'), off: require('../../assets/img/badge/investor-off.png') },
  { id: 'taxes', title: 'Податки без страху', topic: 'Податки', off: require('../../assets/img/badge/taxes-off.png') },
  { id: 'credit', title: 'Кредит під контролем', topic: 'Кредити', off: require('../../assets/img/badge/credit-off.png') },
  { id: 'fraud', title: 'Шахраям — ні', topic: 'Захист від шахраїв', off: require('../../assets/img/badge/fraud-off.png') },
];
