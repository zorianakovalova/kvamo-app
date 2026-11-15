import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
              {done ? (
                <View style={styles.dotBox}>
                  <Svg width={36} height={51} viewBox="0 0 36 51" style={styles.dayFlame}>
                    <Path
                      d="M19.89 0C24.63 9.71 36 15.38 36 29.95C36 42.1 27.47 51 18 51C8.53 51 0 42.9 0 30.76C0 22.67 5.68 17 9.47 11.33C11.37 17 14.21 19.43 17.05 20.24C16.11 12.95 16.11 6.48 19.89 0Z"
                      fill={colors.streakIcon}
                    />
                    <Path d="M23.33 29L16 36.33L12.67 33" stroke="#F7F9F7" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </Svg>
                </View>
              ) : (
                <View style={styles.dot} />
              )}
              <Text variant={done ? 'captionStrong' : 'caption'}>
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  day: { width: 40, alignItems: 'center', gap: 4 },
  dot: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dotBox: { width: 36, height: 36 },
  dayFlame: { position: 'absolute', left: 0, bottom: 0 },
});
