import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { OptionCard } from '@/components/OptionCard';
import { Screen, ScreenHeader } from '@/components/Screen';
import { GOALS } from '@/data/onboarding';
import { useProfile, type Goal } from '@/store/profile';
import { colors, radius, space, type } from '@/theme/tokens';

/** 08 Edit goal. */
export default function EditGoal() {
  const profile = useProfile();
  const [goals, setGoals] = useState<Goal[]>(profile.goals);
  const [other, setOther] = useState(profile.otherGoal);
  const toggle = (id: Goal) => setGoals(goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id]);

  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: space.lg, gap: space.xxl }}
      footer={
        <Button
          label="Зберегти"
          onPress={() => {
            profile.update({ goals, otherGoal: other });
            router.back();
          }}
        />
      }
    >
      <View style={{ paddingHorizontal: 4 }}>
        <ScreenHeader title="Твоя мета" description="Можна змінити будь-коли. Під мету підлаштуємо порядок тем." />
      </View>
      <View style={{ gap: space.sm }}>
        {GOALS.map((g) => (
          <OptionCard key={g.id} label={g.label} control="checkbox" selected={goals.includes(g.id)} onPress={() => toggle(g.id)} />
        ))}
        {goals.includes('other') && (
          <TextInput
            value={other}
            onChangeText={setOther}
            placeholder="Наприклад, накопичити на ноутбук"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            accessibilityLabel="Твоя мета"
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    ...type.body,
    color: colors.textPrimary,
    height: 56,
    marginTop: space.sm,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
