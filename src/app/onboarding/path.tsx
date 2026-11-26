import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { FlowNav, Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { MODULES, plural, type Module } from '@/data/modules';
import { GOALS } from '@/data/onboarding';
import { useProfile } from '@/store/profile';
import { colors, palette, radius, shadow, space } from '@/theme/tokens';

const waveFrog = require('../../../assets/img/wave-frog.png');

const MODULE_COLORS: Record<string, string> = { m1: palette.lime, m2: palette.blue, m3: palette.peach };
const POSITIVE = '#2f9a52';
const count = (m: Module) => `${m.lessons.length} ${plural(m.lessons.length, 'заняття', 'заняття', 'занять')}`;

/** 10 Your path, cover variant: the first module as a cover card, the rest of the route below. */
export default function YourPath() {
  const { goals, otherGoal, onboarded, update } = useProfile();
  const [start, setStart] = useState<string | null>(null);

  // The route always starts with module 1; goals are shown as the destination rows below.
  const first = MODULES[0];
  const rest = MODULES.slice(1);

  const chosen = GOALS.filter((g) => goals.includes(g.id) && g.id !== 'other');
  const own = goals.includes('other') ? otherGoal.trim().replace(/[.!]+$/, '') : '';
  const ownLabel = own ? own.charAt(0).toUpperCase() + own.slice(1) : '';
  const phrases = chosen.map((g) => g.phrase);
  if (own) phrases.push(`«${ownLabel}»`);
  const goalRows = [...chosen.map((g) => ({ label: g.label, tag: 'Твоя мета' })), ...(own ? [{ label: ownLabel, tag: 'Своя мета' }] : [])];
  const recommended = phrases.length === 0;
  const description = recommended
    ? 'Мету не обрано, тож ми склали порядок, з якого зазвичай починають.'
    : phrases.length > 1
      ? `Твої цілі: ${phrases.join(', ')}. Ми склали маршрут, який веде до них.`
      : `Твоя мета: ${phrases[0]}. Ми склали маршрут, який веде до неї крок за кроком.`;

  // Navigate only after "onboarded" is saved, otherwise the tabs would send us back here.
  useEffect(() => {
    if (onboarded && start) {
      router.replace('/');
      router.push({ pathname: '/lesson/[id]', params: { id: start } });
    }
  }, [onboarded, start]);

  const begin = () => {
    setStart(first.lessons[0].id);
    update({ onboarded: true });
  };

  return (
    <Screen
      nav={<FlowNav total={4} done={3} />}
      bodyStyle={{ paddingTop: space.xxl }}
      footer={<Button label={`Почати з «${first.title}»`} icon="play" onPress={begin} />}
    >
      <ScreenHeader title={recommended ? 'Рекомендований шлях' : 'Твій шлях готовий'} description={description} />

      <View style={styles.cover}>
        <View style={styles.stack}>
          {rest[1] && <View style={[styles.back, { left: 24, top: 28, width: 305, backgroundColor: MODULE_COLORS[rest[1].id] }]} />}
          {rest[0] && <View style={[styles.back, { left: 12, top: 14, width: 329, backgroundColor: MODULE_COLORS[rest[0].id] }]} />}
          <View style={[styles.front, { backgroundColor: MODULE_COLORS[first.id] }]}>
            <View style={styles.coverText}>
              <View style={styles.chips}>
                <Chip label={`Модуль №${first.number}`} tone="glassLight" />
                <Chip label={count(first)} tone="glassLight" />
              </View>
              <Text variant="title1" style={{ width: 130 }}>
                {first.title}
              </Text>
              <Text variant="body" style={{ fontSize: 13, lineHeight: 18, letterSpacing: -0.08, opacity: 0.7 }}>
                Старт твого шляху
              </Text>
            </View>
            <Image source={waveFrog} contentFit="contain" style={styles.frog} />
          </View>
        </View>

        <View style={styles.list}>
          <Text variant="subheadline" color={colors.textSecondary} style={styles.listTitle}>
            Далі в маршруті
          </Text>
          {rest.map((m, i) => (
            <View key={m.id} style={[styles.row, (i < rest.length - 1 || goalRows.length > 0) && styles.divider]}>
              <View style={[styles.number, { backgroundColor: MODULE_COLORS[m.id] }]}>
                <Text variant="captionStrong" style={{ fontSize: 13, lineHeight: 18 }}>
                  {m.number}
                </Text>
              </View>
              <Text variant="body" style={{ flex: 1 }}>
                {m.title}
              </Text>
              <Text variant="subheadline" color={colors.textSecondary}>
                {count(m)}
              </Text>
            </View>
          ))}
          {goalRows.map((g, i) => (
            <View key={g.label} style={[styles.row, i < goalRows.length - 1 && styles.divider]}>
              <View style={styles.number}>
                <Icon name="flag" size={20} />
              </View>
              <Text variant="body" style={{ flex: 1 }}>
                {g.label}
              </Text>
              <Text variant="subheadlineStrong" color={POSITIVE}>
                {g.tag}
              </Text>
            </View>
          ))}
        </View>

        {own ? (
          <View style={styles.note}>
            <Text variant="subheadline">Твою мету «{ownLabel}» збережемо в профілі, щоб ти бачив(-ла) прогрес до неї.</Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cover: { paddingTop: space.xxl, gap: space.xl },
  stack: { height: 196 },
  back: { position: 'absolute', height: 168, borderRadius: 22 },
  front: { height: 168, borderRadius: 22, ...shadow.ink6 },
  coverText: { position: 'absolute', left: 20, top: 20, gap: 6 },
  chips: { flexDirection: 'row', gap: 4 },
  frog: { position: 'absolute', left: 199.44, top: 30, width: 157.56, height: 190 },
  list: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.glassStrong, paddingHorizontal: space.lg, paddingVertical: 4 },
  note: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderGlass, padding: space.md },
  listTitle: { paddingTop: space.md, paddingBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(11,16,13,0.1)' },
  number: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
