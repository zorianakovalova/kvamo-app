import { StyleSheet, View } from 'react-native';

import { moduleMinutes, plural, type Module } from '@/data/modules';
import { colors, moduleColors, radius, space } from '@/theme/tokens';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { Text } from '../Text';

type Props = { module: Module; done: number; currentIndex: number | null; subtitle: string };

export function ModuleBanner({ module, done, currentIndex, subtitle }: Props) {
  const total = module.lessons.length;
  return (
    <Card tone="soft" style={styles.card}>
      <View style={[styles.icon, { backgroundColor: moduleColors[module.theme].accent }]}>
        <Icon name={module.icon} size={24} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="overline" color="#4f5a54">
          МОДУЛЬ {module.number} · {total} {plural(total, 'ЗАНЯТТЯ', 'ЗАНЯТТЯ', 'ЗАНЯТЬ')} · {moduleMinutes(module)} ХВ
        </Text>
        <Text variant="moduleTitle" style={{ marginTop: 2 }}>
          {module.title}
        </Text>
        <Text variant="caption" color="#4f5a54" style={{ marginTop: 4 }}>
          {subtitle}
        </Text>
        <View style={styles.bar} accessibilityLabel={`Пройдено ${done} з ${total}`}>
          {module.lessons.map((l, i) => (
            <View
              key={l.id}
              style={[styles.seg, i < done && { backgroundColor: colors.ink }, i === currentIndex && { backgroundColor: colors.progress }]}
            />
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: space.lg,
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  icon: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  bar: { flexDirection: 'row', gap: 3, marginTop: space.sm },
  seg: { width: 18, height: 4, borderRadius: 9, backgroundColor: colors.track },
});
