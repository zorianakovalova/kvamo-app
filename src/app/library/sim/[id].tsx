import { useLocalSearchParams } from 'expo-router';

import { SimPlay } from '@/components/lesson/SimPlay';
import { SIMS } from '@/data/sims';
import { useSimResults } from '@/store/sims';

/** Library simulation: intro, decisions and result (`view=result` opens the saved result). */
export default function SimulationScreen() {
  const { id, view } = useLocalSearchParams<{ id: string; view?: string }>();
  const results = useSimResults();
  const def = SIMS[id];
  if (!def) return null;
  return <SimPlay key={`${id}-${view ?? 'play'}`} def={def} show={view === 'result' ? results[id] : undefined} />;
}
