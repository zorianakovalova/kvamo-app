import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'kvamo.saved.v1';

/** Items saved before the learner touched any bookmark (as in the Figma "Збережене" screen). */
const DEFAULT_SAVED = ['art-ovdp-buy', 't-ovdp', 'check-offer', 'art-cashback'];

let saved: string[] = DEFAULT_SAVED;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (raw) {
      saved = JSON.parse(raw);
      emit();
    }
  })
  .catch(() => {});

function set(next: string[]) {
  saved = next;
  emit();
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
}

export function toggleSaved(id: string) {
  set(saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id]);
}

/** Saved material and term ids, in the order they were saved. */
export function useSaved() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => saved,
  );
}
