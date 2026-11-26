import { router } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { OptionCard } from '@/components/OptionCard';
import { FlowNav, Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { GOALS } from '@/data/onboarding';
import { useProfile, type Goal } from '@/store/profile';
import { colors, radius, space, type } from '@/theme/tokens';

/** 08 Goals: one or several; they set the order of topics. */
export default function GoalScreen() {
  const { goals, otherGoal, update } = useProfile();
  const toggle = (id: Goal) => update({ goals: goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id] });
  const none = goals.length === 0;

  return (
    <Screen
      nav={<FlowNav total={4} done={1} />}
      bodyStyle={{ gap: space.xxl }}
      footer={
        <>
          {none && (
            <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              Можна нічого не обирати. Ми складемо рекомендований порядок тем для старту.
            </Text>
          )}
          <Button label={none ? 'Скласти порядок за мене' : 'Далі'} onPress={() => router.push('/onboarding/time')} />
        </>
      }
    >
      <ScreenHeader title="Чого хочеш досягти?" description="Обери одну чи кілька цілей. Під них підлаштуємо порядок тем." />
      <View style={{ gap: space.sm }}>
        {GOALS.map((g) => (
          <OptionCard key={g.id} label={g.label} control="checkbox" selected={goals.includes(g.id)} onPress={() => toggle(g.id)} />
        ))}
        {goals.includes('other') && (
          <View style={{ gap: space.sm, marginTop: space.sm }}>
            <Text variant="subheadlineStrong" style={{ paddingHorizontal: space.sm }}>
              Твоя мета (необовʼязково)
            </Text>
            <TextInput
              value={otherGoal}
              onChangeText={(t) => update({ otherGoal: t })}
              placeholder="Наприклад, накопичити на ноутбук"
              placeholderTextColor={colors.textTertiary}
              style={styles.input}
              accessibilityLabel="Твоя мета"
            />
          </View>
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
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
});
