import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ALL_LESSONS, MODULES, type Module } from '@/data/modules';

const STORAGE_KEY = 'kvamo.progress.v1';

export type Stars = 1 | 2 | 3;

type Persisted = {
  /** Best star result per completed lesson id. */
  stars: Record<string, Stars>;
  streak: { count: number; lastDay: string | null };
  /** Every day (YYYY-MM-DD) with at least one finished lesson, for the streak calendar. */
  days: string[];
};

const EMPTY: Persisted = { stars: {}, streak: { count: 0, lastDay: null }, days: [] };

export function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetween(a: string, b: string) {
  const [ya, ma, da] = a.split('-').map(Number);
  const [yb, mb, db] = b.split('-').map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86_400_000);
}

function streakDays(lastDay: string, count: number) {
  const [y, m, d] = lastDay.split('-').map(Number);
  return Array.from({ length: count }, (_, i) => dayKey(new Date(y, m - 1, d - i)));
}

type ProgressValue = {
  ready: boolean;
  stars: Record<string, Stars>;
  /** Streak that is still alive today (0 if a day was missed). */
  streak: number;
  /** Days with lessons (YYYY-MM-DD). */
  days: string[];
  /** The lesson the learner should do next, across all modules. */
  currentLessonId: string | null;
  completeLesson: (lessonId: string, stars: Stars) => void;
  resetProgress: () => void;
  doneCount: (m: Module) => number;
};

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: Persisted) => {
    setData(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, result: Stars) => {
      const today = dayKey(new Date());
      const { lastDay, count } = data.streak;
      let nextCount = 1;
      if (lastDay === today) nextCount = Math.max(count, 1);
      else if (lastDay && daysBetween(lastDay, today) === 1) nextCount = count + 1;

      const best = Math.max(data.stars[lessonId] ?? 0, result) as Stars;
      const days = data.days.includes(today) ? data.days : [...data.days, today];
      persist({ stars: { ...data.stars, [lessonId]: best }, streak: { count: nextCount, lastDay: today }, days });
    },
    [data, persist],
  );

  const resetProgress = useCallback(() => persist(EMPTY), [persist]);

  const value = useMemo<ProgressValue>(() => {
    const today = dayKey(new Date());
    const { lastDay, count } = data.streak;
    const alive = lastDay !== null && daysBetween(lastDay, today) <= 1;
    const current = ALL_LESSONS.find((x) => !data.stars[x.id]);
    return {
      ready,
      stars: data.stars,
      streak: alive ? count : 0,
      // Older saves have no day list: rebuild it from the streak so the calendar is not empty.
      days: data.days.length || !lastDay ? data.days : streakDays(lastDay, count),
      currentLessonId: current?.id ?? null,
      completeLesson,
      resetProgress,
      doneCount: (m) => m.lessons.filter((x) => data.stars[x.id]).length,
    };
  }, [data, ready, completeLesson, resetProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}

export { MODULES };
