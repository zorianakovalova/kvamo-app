import type { Profile, Reminders } from '@/store/profile';
import { plural } from './modules';
import { GOALS } from './onboarding';

const SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export function goalLabel(p: Pick<Profile, 'goals' | 'otherGoal'>) {
  if (!p.goals.length) return 'Не обрано';
  if (p.goals.length > 1) return `${p.goals.length} ${plural(p.goals.length, 'ціль', 'цілі', 'цілей')}`;
  const g = p.goals[0];
  return g === 'other' ? p.otherGoal.trim() || 'Інше' : GOALS.find((x) => x.id === g)!.label;
}

export function daysLabel(days: boolean[]) {
  if (days.every(Boolean)) return 'щодня';
  if (days.slice(0, 5).every(Boolean) && !days[5] && !days[6]) return 'у будні';
  return SHORT.filter((_, i) => days[i]).join(', ');
}

export function remindersLabel(r: Reminders | null) {
  if (!r || !r.enabled || r.frequency === 'off') return 'Вимкнено';
  return `${r.time}, ${daysLabel(r.days)}`;
}

export function displayName(p: Pick<Profile, 'name' | 'account'>) {
  return p.name.trim() || 'Мій акаунт';
}

export function initial(p: Pick<Profile, 'name' | 'account'>) {
  const src = p.name.trim() || p.account?.contact?.replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, '') || 'К';
  return src[0].toUpperCase();
}
