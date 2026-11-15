import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GlassCard } from '@/components/GlassCard';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { plural } from '@/data/modules';
import { useProfile } from '@/store/profile';
import { useProgress } from '@/store/progress';
import { colors, radius, space } from '@/theme/tokens';

const flame = require('../../../assets/img/flame.png');
const frog = require('../../../assets/img/streak-frog.png');
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

/** 11 Streak after a lesson: flame with the day count and this week. */
export default function Streak() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { streak } = useProgress();
  const { account, update } = useProfile();
  const today = (new Date().getDay() + 6) % 7;
  const count = Math.max(streak, 1);
  const first = count === 1;

  const next = () => {
    if (account) return router.replace('/');
    update({ accountOffered: true });
    router.replace('/account/save');
  };

  return (
    <Screen
      background="gradient"
      bodyStyle={{ paddingHorizontal: space.lg, paddingTop: 114, gap: space.lg, alignItems: 'center' }}
      behind={<Image source={frog} contentFit="contain" style={{ position: 'absolute', left: width - 174, top: insets.top + 146, width: 174, height: 345 }} />}
      footer={<Button label="Зберегти стрик" onPress={next} />}
    >
      <View style={styles.flame} accessibilityLabel={`Стрик ${count} ${plural(count, 'день', 'дні', 'днів')}`}>
        <Image source={flame} style={StyleSheet.absoluteFill} contentFit="contain" />
        <Text variant="displayLarge" color={colors.textInverse} style={styles.count}>
          {count}
        </Text>
      </View>

      <ScreenHeader
        align="center"
        title={first ? 'Перший день стрику!' : `${count} ${plural(count, 'день', 'дні', 'днів')} поспіль!`}
        description="Повертайся завтра, щоб продовжити серію."
      />

      <View style={styles.week}>
        {DAYS.map((d, i) => {
          const done = i <= today && i > today - count;
          return (
            <View key={d} style={styles.day} accessibilityLabel={`${d}: ${done ? 'є урок' : 'немає уроку'}`}>
              <View style={[styles.dot, done && styles.dotDone]}>{done && <Image source={flame} style={{ width: 22, height: 30 }} contentFit="contain" />}</View>
              <Text variant={i === today ? 'captionStrong' : 'caption'} color={i === today ? colors.textPrimary : colors.textSecondary}>
                {d}
              </Text>
            </View>
          );
        })}
      </View>

      <GlassCard style={{ padding: space.lg, alignSelf: 'stretch' }}>
        <Text variant="subheadline" color={colors.textSecondary}>
          Якщо пропустите день, стрик заморозиться — наступного дня продовжите без втрати вогника.
        </Text>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flame: { width: 115, height: 162, alignItems: 'center' },
  count: { position: 'absolute', top: 103 - 3 },
  week: {
    width: 336,
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  day: { width: 40, alignItems: 'center', gap: 4 },
  dot: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dotDone: { borderWidth: 0, backgroundColor: 'transparent' },
});
