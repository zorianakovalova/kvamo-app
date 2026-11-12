import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GradientBackground } from '@/components/GradientBackground';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { MODULES } from '@/data/modules';
import { useProgress } from '@/store/progress';
import { colors, space } from '@/theme/tokens';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { stars, streak, doneCount, resetProgress } = useProgress();
  const totalStars = Object.values(stars).reduce<number>((s, n) => s + n, 0);
  const lessonsDone = Object.keys(stars).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#eef8e3' }}>
      <GradientBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + space.md, paddingHorizontal: space.lg, paddingBottom: 140, gap: space.md }}>
        <View style={styles.titleRow}>
          <Text variant="screenTitle" accessibilityRole="header">
            Профіль
          </Text>
          <StreakPill days={streak} />
        </View>

        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Stat value={lessonsDone} label="занять пройдено" />
          <Stat value={totalStars} label="зірок зібрано" />
          <Stat value={streak} label="днів поспіль" />
        </View>

        {MODULES.map((m) => (
          <Card key={m.id} tone="soft" style={{ padding: space.lg }}>
            <Text variant="overline" color={colors.textSecondary}>
              МОДУЛЬ {m.number}
            </Text>
            <Text variant="moduleTitle" style={{ marginTop: 2 }}>
              {m.title}
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
              {doneCount(m)} з {m.lessons.length} · бейдж «{m.badge}»
            </Text>
          </Card>
        ))}

        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: space.md }}>
          Прогрес зберігається лише на цьому телефоні.
        </Text>
        <Button label="Почати спочатку" variant="secondary" onPress={resetProgress} />
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card style={{ flex: 1, padding: space.md }}>
      <Text variant="moduleTitle" style={{ fontSize: 22, lineHeight: 28 }}>
        {value}
      </Text>
      <Text variant="caption" color={colors.textSecondary}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: space.md },
});
