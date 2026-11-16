import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { OptionCard } from '@/components/OptionCard';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TIME_OPTIONS } from '@/data/onboarding';
import { useProfile } from '@/store/profile';
import { colors, space } from '@/theme/tokens';

/** 09 Edit daily time. */
export default function EditTime() {
  const profile = useProfile();
  const [minutes, setMinutes] = useState(profile.minutes);
  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: space.lg, gap: space.xxl }}
      footer={
        <Button
          label="Зберегти"
          disabled={minutes == null}
          onPress={() => {
            profile.update({ minutes });
            router.back();
          }}
        />
      }
    >
      <View style={{ paddingHorizontal: 4 }}>
        <ScreenHeader title="Час на день" description="Один урок триває 3–5 хвилин" />
      </View>
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {TIME_OPTIONS.map((o) => {
          const on = minutes === o.minutes;
          return (
            <OptionCard key={o.minutes} control="radio" selected={on} onPress={() => setMinutes(o.minutes)}>
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
