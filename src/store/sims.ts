import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import type { SimResult } from '@/data/sims';

const KEY = 'kvamo.sims.v1';

let results: Record<string, SimResult> = {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

AsyncStorage.getItem(KEY)
  .then((raw) => {
    if (raw) results = { ...JSON.parse(raw), ...results };
    emit();
  })
  .catch(() => {});

/** Remembers the last finished run of a library simulation. */
export function saveSimResult(id: string, result: SimResult) {
  results = { ...results, [id]: result };
  emit();
  AsyncStorage.setItem(KEY, JSON.stringify(results)).catch(() => {});
}

export function useSimResults() {
  return useSyncExternalStore(subscribe, () => results);
}
