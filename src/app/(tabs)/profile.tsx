import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GlassCard } from '@/components/GlassCard';
import { GradientBackground } from '@/components/GradientBackground';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { MODULES } from '@/data/modules';
import { useProfile } from '@/store/profile';
import { useProgress } from '@/store/progress';
import { colors, space } from '@/theme/tokens';

const METHOD: Record<string, string> = { google: 'Google', apple: 'Apple', phone: 'телефон', email: 'email' };

/** Placeholder until the Profile screen is built from Figma. Has a reset to replay onboarding. */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { stars, streak, doneCount, resetProgress } = useProgress();
  const { account, reminders, resetProfile } = useProfile();
  const lessonsDone = Object.keys(stars).length;

  const resetAll = () => {
    resetProgress();
    resetProfile();
    router.replace('/onboarding');
  };

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: space.lg, paddingBottom: 140, gap: space.md }}>
        <View style={styles.titleRow}>
          <Text variant="largeTitle" accessibilityRole="header">
            Профіль
          </Text>
          <StreakPill days={streak} />
        </View>

        <GlassCard style={{ padding: space.lg, gap: 4 }}>
          <Text variant="headline">{account ? `Акаунт: ${METHOD[account.method]}` : 'Без акаунта'}</Text>
          <Text variant="subheadline" color={colors.textSecondary}>
            {account?.contact ? `${account.contact}. ` : ''}
            Вхід поки демонстраційний: прогрес зберігається лише на цьому телефоні.
          </Text>
          <Text variant="subheadline" color={colors.textSecondary}>
            Нагадування: {reminders?.enabled ? `щодня о ${reminders.time}` : 'вимкнені'}
          </Text>
        </GlassCard>

        <GlassCard style={{ padding: space.lg, gap: 4 }}>
          <Text variant="headline">Пройдено занять: {lessonsDone}</Text>
          {MODULES.map((m) => (
            <Text key={m.id} variant="subheadline" color={colors.textSecondary}>
              {m.title}: {doneCount(m)} з {m.lessons.length}
            </Text>
          ))}
        </GlassCard>

        <Button label="Почати спочатку з онбордингу" variant="secondary" onPress={resetAll} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4, paddingVertical: space.md },
});
