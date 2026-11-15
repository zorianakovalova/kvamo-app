import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { OptionCard } from '@/components/OptionCard';
import { ProgressPill } from '@/components/ProgressPill';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TIME_OPTIONS } from '@/data/onboarding';
import { useProfile } from '@/store/profile';
import { colors, space } from '@/theme/tokens';

/** 09 Daily time. */
export default function TimeScreen() {
  const { minutes, update } = useProfile();
  return (
    <Screen
      nav={
        <>
          <GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />
          <ProgressPill total={4} done={2} />
        </>
      }
      bodyStyle={{ gap: space.xxl }}
      footer={
        <>
          <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            Змінити можна будь-коли в профілі
          </Text>
          <Button label="Далі" disabled={minutes == null} onPress={() => router.push('/onboarding/path')} />
        </>
      }
    >
      <ScreenHeader title="Скільки часу на день?" description="Один урок триває 3–5 хвилин" />
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {TIME_OPTIONS.map((o) => {
          const on = minutes === o.minutes;
          return (
            <OptionCard key={o.minutes} control="radio" selected={on} onPress={() => update({ minutes: o.minutes })}>
              <Text variant="title1" color={on ? colors.textInverse : colors.textPrimary}>
                {o.minutes} хв
              </Text>
              <Text variant="subheadline" color={on ? colors.textInverse : colors.textSecondary}>
                {o.note}
              </Text>
            </OptionCard>
          );
        })}
      </View>
    </Screen>
  );
}
