import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterChip, MaterialRow, NavPill, useMaterialOpener } from '@/components/library/LibraryUI';
import { PathBackground } from '@/components/PathBackground';
import { Text } from '@/components/Text';
import { KIND_LABEL, moduleMaterials, plural, type MaterialKind } from '@/data/library';
import { MODULES } from '@/data/modules';
import { useLibraryState } from '@/store/saved';
import { colors, radius, space } from '@/theme/tokens';

const FILTERS: { id: 'all' | MaterialKind; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'article', label: 'Статті' },
  { id: 'quiz', label: 'Квізи' },
  { id: 'sim', label: 'Симуляції' },
  { id: 'source', label: 'Джерела' },
  { id: 'checklist', label: 'Чеклісти' },
];

export default function ModuleMaterialsScreen() {
  const { n } = useLocalSearchParams<{ n: string }>();
  const num = Number(n);
  const insets = useSafeAreaInsets();
  const { viewed } = useLibraryState();
  const [filter, setFilter] = useState<'all' | MaterialKind>('all');
  const { open, overlay } = useMaterialOpener(insets.bottom + space.lg);
  const all = moduleMaterials(num);
  const module = MODULES[num - 1];
  const seen = all.filter((m) => viewed.includes(m.id)).length;
  const left = all.length - seen;
  const chips = FILTERS.filter((f) => f.id === 'all' || all.some((m) => m.kind === f.id));
  const list = filter === 'all' ? all : all.filter((m) => m.kind === filter);

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <PathBackground />
      <NavPill icon="close" label="Закрити" title={module ? `Модуль ${num} “${module.title}”` : `Модуль ${num}`} onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]} showsVerticalScrollIndicator={false}>
        <View style={styles.progress} accessible accessibilityLabel={`Переглянуто ${seen} з ${all.length}`}>
          <View style={styles.progressTop}>
            <Text variant="subheadlineStrong">
              Переглянуто {seen} з {all.length}
            </Text>
            <Text variant="caption" color={colors.textSecondary}>
              {left} {plural(left, 'залишився', 'залишилось', 'залишилось')}
            </Text>
          </View>
          <View style={styles.segments}>
            {all.map((m, i) => (
              <View key={m.id} style={[styles.segment, i < seen && { backgroundColor: colors.ink }]} />
            ))}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg }}>
          {chips.map((f) => (
            <FilterChip key={f.id} label={f.label} selected={filter === f.id} onPress={() => setFilter(f.id)} />
          ))}
        </ScrollView>
        <View style={{ gap: space.sm, paddingHorizontal: space.lg }}>
          {list.map((m) => (
            <MaterialRow key={m.id} material={m} title={m.title} subtitle={KIND_LABEL[m.kind]} trailing={m.site ? 'external' : 'chevron'} onPress={() => open(m)} />
          ))}
        </View>
      </ScrollView>
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: space.xxl, gap: space.lg },
  progress: { marginHorizontal: space.lg, padding: space.lg, gap: 10, borderRadius: radius.lg, backgroundColor: colors.surface },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  segments: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.progressTodo },
});
