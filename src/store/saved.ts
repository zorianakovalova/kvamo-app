import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'kvamo.saved.v1';
const STATE_KEY = 'kvamo.library.v1';

type LibraryState = {
  /** Materials the learner opened or finished. */
  viewed: string[];
  /** Upcoming modules the learner asked to be told about. */
  notify: number[];
  /** Quiz results: last and best score per quiz. */
  quiz: Record<string, { last: number; best: number }>;
};

/** Items saved before the learner touched any bookmark (as in the Figma "Збережене" screen). */
const DEFAULT_SAVED = ['art-ovdp-buy', 't-ovdp', 'check-offer', 'art-cashback'];

let saved: string[] = DEFAULT_SAVED;
let state: LibraryState = { viewed: [], notify: [], quiz: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

AsyncStorage.multiGet([STORAGE_KEY, STATE_KEY])
  .then(([[, rawSaved], [, rawState]]) => {
    if (rawSaved) saved = JSON.parse(rawSaved);
    if (rawState) state = { ...state, ...JSON.parse(rawState) };
    emit();
  })
  .catch(() => {});

export function toggleSaved(id: string) {
  saved = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  emit();
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved)).catch(() => {});
}

function setState(next: LibraryState) {
  state = next;
  emit();
  AsyncStorage.setItem(STATE_KEY, JSON.stringify(next)).catch(() => {});
}

export function markViewed(id: string) {
  if (!state.viewed.includes(id)) setState({ ...state, viewed: [...state.viewed, id] });
}

export function setNotify(module: number) {
  if (!state.notify.includes(module)) setState({ ...state, notify: [...state.notify, module] });
}

export function saveQuizScore(id: string, score: number) {
  const prev = state.quiz[id];
  setState({ ...state, viewed: state.viewed.includes(id) ? state.viewed : [...state.viewed, id], quiz: { ...state.quiz, [id]: { last: score, best: Math.max(score, prev?.best ?? 0) } } });
}

/** Saved material and term ids, in the order they were saved. */
export function useSaved() {
  return useSyncExternalStore(subscribe, () => saved);
}

export function useLibraryState() {
  return useSyncExternalStore(subscribe, () => state);
}
