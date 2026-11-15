import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { GlassButton } from '@/components/GlassButton';
import { Icon } from '@/components/Icon';
import { ProgressPill } from '@/components/ProgressPill';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { MODULES, plural, type Module } from '@/data/modules';
import { GOALS, MODULE_GOALS } from '@/data/onboarding';
import { useProfile } from '@/store/profile';
import { palette, radius, space } from '@/theme/tokens';

const walkingFrog = require('../../../assets/img/walk-frog.png');

const CARD_COLORS: Record<string, string> = { m1: palette.lime, m2: palette.blue, m3: palette.sun };

/** 10 Your path: modules ordered by the chosen goals. */
export default function YourPath() {
  const { goals, otherGoal, onboarded, update } = useProfile();
  const [start, setStart] = useState<string | null>(null);

  const isGoal = (m: Module) => MODULE_GOALS[m.id].some((g) => goals.includes(g));
  const ordered = [...MODULES.filter(isGoal), ...MODULES.filter((m) => !isGoal(m))];
  const first = ordered[0];

  const phrases = GOALS.filter((g) => goals.includes(g.id) && g.phrase).map((g) => g.phrase);
  if (goals.includes('other') && otherGoal.trim()) phrases.push(otherGoal.trim().replace(/[.!]+$/, ''));
  const recommended = phrases.length === 0;
  const description = recommended
    ? 'Почнемо з бюджету: це основа для всього іншого. Почати можна з будь-якого модуля.'
    : `Твої цілі: ${phrases.join(', ')}. Почати можна з будь-якого модуля.`;

  // Navigate only after "onboarded" is saved, otherwise the tabs would send us back here.
  useEffect(() => {
    if (onboarded && start) {
      router.replace('/');
      router.push({ pathname: '/lesson/[id]', params: { id: start } });
    }
  }, [onboarded, start]);

  const begin = (m: Module) => {
    setStart(m.lessons[0].id);
    update({ onboarded: true });
  };

  return (
    <Screen
      nav={
        <>
          <GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />
          <ProgressPill total={4} done={3} />
        </>
      }
      bodyStyle={{ gap: space.xxl }}
      footer={<Button label={`Почати з «${first.title}»`} icon="play" onPress={() => begin(first)} />}
    >
      <ScreenHeader title={recommended ? 'Рекомендований шлях' : 'Твій шлях готовий'} description={description} />
      <View style={{ gap: space.md }}>
        {ordered.map((m, i) => (
          <Pressable
            key={m.id}
            onPress={() => begin(m)}
            accessibilityRole="button"
            accessibilityLabel={`Почати модуль ${m.number}: ${m.title}`}
            style={({ pressed }) => [styles.card, { backgroundColor: CARD_COLORS[m.id] }, pressed && { opacity: 0.9 }]}
          >
            {i === 0 && <Image source={walkingFrog} style={styles.frog} contentFit="contain" />}
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.chips}>
                {isGoal(m) && <Chip label="Твоя мета" tone="glassLight" />}
                <Chip label={`Модуль №${m.number}`} tone="glassLight" />
                <Chip label={`${m.lessons.length} ${plural(m.lessons.length, 'заняття', 'заняття', 'занять')}`} tone="glassLight" />
              </View>
              <Text variant="title1" style={{ paddingRight: i === 0 ? 64 : 0 }}>
                {m.title}
              </Text>
            </View>
            <Icon name="chevronRight" size={24} />
          </Pressable>
        ))}
        <View style={[styles.card, { backgroundColor: palette.peach }]}>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.chips}>
              <Chip label="Скоро" tone="glassLight" />
            </View>
            <Text variant="title1">Кредити і борги</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 117,
    borderRadius: radius.lg,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    overflow: 'hidden',
  },
  chips: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  frog: { position: 'absolute', right: 0, bottom: 0, width: 179, height: 92 },
});
