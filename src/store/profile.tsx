import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'kvamo.profile.v1';

export type Goal = 'paycheck' | 'cushion' | 'invest' | 'basics' | 'other';
export type AccountMethod = 'google' | 'apple' | 'phone' | 'email';

export type Reminders = {
  enabled: boolean;
  frequency: 'daily' | 'off';
  /** Mon..Sun */
  days: boolean[];
  time: string;
};

export type Profile = {
  onboarded: boolean;
  /** Index of the chosen option per question; null = skipped test. */
  quiz: number[] | null;
  goals: Goal[];
  otherGoal: string;
  minutes: 3 | 5 | 10 | null;
  /** Account is simulated: there is no server yet, everything stays on the phone. */
  account: { method: AccountMethod; contact?: string } | null;
  /** The "save progress" flow after the first lesson was shown once. */
  accountOffered: boolean;
  reminders: Reminders | null;
};

const EMPTY: Profile = {
  onboarded: false,
  quiz: null,
  goals: [],
  otherGoal: '',
  minutes: null,
  account: null,
  accountOffered: false,
  reminders: null,
};

type ProfileValue = Profile & {
  ready: boolean;
  update: (patch: Partial<Profile>) => void;
  resetProfile: () => void;
};

const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Profile>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setData(EMPTY);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(EMPTY)).catch(() => {});
  }, []);

  const value = useMemo(() => ({ ...data, ready, update, resetProfile }), [data, ready, update, resetProfile]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
