import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/tokens';

/** Glass progress pill in the onboarding nav bar: segments, ink = done. */
export function ProgressPill({ total, done }: { total: number; done: number }) {
  return (
    <View style={styles.pill} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: done }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.seg, { backgroundColor: i < done ? colors.ink : colors.progressTodo }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  seg: { flex: 1, height: 6, borderRadius: 8 },
});
