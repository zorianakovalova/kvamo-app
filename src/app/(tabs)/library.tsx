import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { BottomSheet, FilterChip, MaterialRow, SearchField, SectionHeader, openTerm, useMaterialOpener } from '@/components/library/LibraryUI';
import { PathBackground } from '@/components/PathBackground';
import { Text } from '@/components/Text';
import { FOR_YOU, HOME_MODULE_ROWS, HOME_TERMS, KIND_LABEL, MATERIALS, SOON, TERMS, UP_NEXT_ID, findMaterial, findTerm, moduleMaterials, plural, termsLabel, type Material, type MaterialKind } from '@/data/library';
import { setNotify, toggleSaved, useLibraryState, useSaved } from '@/store/saved';
import { colors, radius, shadow, space } from '@/theme/tokens';

type Filter = 'all' | 'sim' | 'article' | 'quiz' | 'source' | 'terms' | 'saved';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'sim', label: 'Симуляції' },
  { id: 'article', label: 'Статті' },
  { id: 'quiz', label: 'Квізи' },
  { id: 'source', label: 'Джерела' },
  { id: 'terms', label: 'Словник' },
  { id: 'saved', label: 'Збережене' },
];

const COUNT: Record<Exclude<Filter, 'all' | 'saved'>, [string, string, string]> = {
  sim: ['симуляція', 'симуляції', 'симуляцій'],
  article: ['стаття', 'статті', 'статей'],
  quiz: ['квіз', 'квізи', 'квізів'],
  source: ['джерело', 'джерела', 'джерел'],
  terms: ['термін', 'терміни', 'термінів'],
};

const countLabel = (n: number, forms: [string, string, string]) => `${n} ${plural(n, ...forms)}`;

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const { open, soon, overlay } = useMaterialOpener(insets.bottom + 92);
  const [soonModule, setSoonModule] = useState<(typeof SOON)[number] | null>(null);
  const params = useLocalSearchParams<{ filter?: string }>();
  const chipsRef = useRef<ScrollViewInstance>(null);
  const chipX = useRef<Partial<Record<Filter, number>>>({});

  const select = (f: Filter) => {
    setFilter(f);
    const x = chipX.current[f] ?? 0;
    chipsRef.current?.scrollTo({ x: Math.max(0, x - 80), animated: true });
  };

  useEffect(() => {
    if (params.filter && FILTERS.some((f) => f.id === params.filter)) {
      select(params.filter as Filter);
      router.setParams({ filter: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.filter]);

  return (
    <View style={{ flex: 1 }}>
      <PathBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 130 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <Text variant="largeTitle" accessibilityRole="header" style={styles.title}>
          Бібліотека
        </Text>
        <SearchField onPress={() => router.push('/library/search')} style={{ marginHorizontal: space.lg }} />
        <ScrollView
          ref={chipsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: filter === 'all' ? space.sm : space.lg, flexGrow: 0 }}
          contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg }}
        >
          {FILTERS.map((f) => (
            <FilterChip key={f.id} label={f.label} selected={filter === f.id} onPress={() => select(f.id)} onLayout={(x) => (chipX.current[f.id] = x)} />
          ))}
        </ScrollView>

        {filter === 'all' ? <Home open={open} soon={soon} openSoon={setSoonModule} /> : <FilteredList filter={filter} open={open} goArticles={() => select('article')} />}
      </ScrollView>
      {overlay}
      <SoonSheet item={soonModule} onClose={() => setSoonModule(null)} />
    </View>
  );
}

function SoonSheet({ item, onClose }: { item: (typeof SOON)[number] | null; onClose: () => void }) {
  const { notify } = useLibraryState();
  const on = !!item && notify.includes(item.module);
  return (
    <BottomSheet visible={!!item} onClose={onClose}>
      {item ? (
        <>
          <View style={{ paddingHorizontal: 4, marginTop: space.lg }}>
            <Image source={require('../../../assets/img/lib/soon-module.png')} style={styles.soonArt} contentFit="cover" />
            <Text variant="title1" accessibilityRole="header" style={{ marginTop: 28 }}>
              Модуль {item.module} “{item.title}”
            </Text>
            <Text variant="body" style={{ marginTop: space.md }}>
              {item.about} Модуль ще готується. Повідомимо, щойно він з’явиться.
            </Text>
          </View>
          <View style={{ marginTop: space.xxl, gap: space.sm }}>
            <Button label={on ? 'Повідомимо, коли вийде' : 'Повідомити мене'} icon={on ? 'check' : 'bell'} disabled={on} onPress={() => setNotify(item.module)} />
            <Button label="Закрити" variant="link" onPress={onClose} />
          </View>
        </>
      ) : null}
    </BottomSheet>
  );
}

type Actions = { open: (m: Material) => void };

function Home({ open, soon, openSoon }: Actions & { soon: () => void; openSoon: (s: (typeof SOON)[number]) => void }) {
  const upNext = findMaterial(UP_NEXT_ID)!;
  return (
    <View style={{ gap: space.xxl, marginTop: space.xxl }}>
      <View style={styles.section}>
        <SectionHeader title="До наступного уроку" onPress={() => open(upNext)} />
        <Pressable onPress={() => open(upNext)} accessibilityRole="button" accessibilityLabel={`${KIND_LABEL[upNext.kind]}: ${upNext.title}`} style={styles.pad}>
          <LinearGradient colors={['#F6FBB0', '#E9F57C']} locations={[0.14, 0.86]} start={{ x: 0.65, y: 0 }} end={{ x: 0.35, y: 1 }} style={styles.upNext}>
            <View style={styles.upNextTop}>
              <Text variant="subheadline" color={colors.textSecondary}>
                {KIND_LABEL[upNext.kind]}
              </Text>
              <Text variant="subheadline" color={colors.textSecondary}>
                {upNext.minutes} хв
              </Text>
            </View>
            <View style={styles.upNextBottom}>
              <Text variant="numberSmall" style={{ flex: 1, maxWidth: 232 }}>
                {upNext.title}
              </Text>
              <View style={styles.play}>
                <Icon name="play" size={20} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Для тебе" onPress={soon} />
        <View style={[styles.pad, { gap: space.sm }]}>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {FOR_YOU.map(({ id, cover }) => {
              const m = findMaterial(id)!;
              return (
                <Pressable key={id} onPress={() => open(m)} accessibilityRole="button" style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
                  <Image source={cover} style={styles.cover} contentFit="cover" />
                  <View style={{ paddingHorizontal: 4, gap: 2 }}>
                    <View style={styles.cardMeta}>
                      <Text variant="caption" color={colors.textSecondary}>
                        {KIND_LABEL[m.kind]}
                      </Text>
                      <Text variant="caption" color={colors.textSecondary}>
                        {m.minutes} хв
                      </Text>
                    </View>
                    <Text variant="subheadlineStrong">{m.title}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.note}>
            <Icon name="compass" size={20} strokeWidth={1.5} />
            <Text variant="subheadline" style={{ flex: 1 }}>
              Матеріали про інвестиції навчальні, а не інвестиційна порада.
            </Text>
          </View>
        </View>
      </View>

      {([1, 2, 3] as const).map((n) => {
        const all = moduleMaterials(n);
        const toModule = () => router.push({ pathname: '/library/module/[n]', params: { n: String(n) } });
        return (
          <View key={n} style={styles.section}>
            <SectionHeader title={`Модуль ${n}`} meta={countLabel(all.length, ['матеріал', 'матеріали', 'матеріалів'])} onPress={toModule} />
            <View style={[styles.pad, { gap: space.sm }]}>
              {HOME_MODULE_ROWS[n].map((id) => {
                const m = findMaterial(id)!;
                return <MaterialRow key={m.id} material={m} title={m.title} subtitle={m.subtitle} trailing={m.site ? 'external' : 'chevron'} onPress={() => open(m)} />;
              })}
              <Button label="Усі матеріали модуля" variant="link" onPress={toModule} />
            </View>
          </View>
        );
      })}

      <View style={styles.section}>
        <SectionHeader title="Словник" meta={termsLabel(TERMS.length)} onPress={() => router.push('/library/glossary')} />
        <View style={[styles.pad, styles.wrap]}>
          {HOME_TERMS.map((id) => (
            <FilterChip key={id} label={findTerm(id)!.title} onPress={() => openTerm(id)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Скоро" style={{ paddingLeft: space.lg }} />
        <View style={[styles.pad, { gap: space.sm }]}>
          {SOON.map((s) => (
            <Pressable key={s.module} onPress={() => openSoon(s)} style={({ pressed }) => [styles.soon, pressed && { opacity: 0.85 }]} accessibilityRole="button" accessibilityLabel={`Модуль ${s.module}, ${s.title}, після MVP`}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="lock" size={12} color={colors.textSecondary} />
                <Text variant="caption2" color={colors.textSecondary}>
                  МОДУЛЬ {s.module} · ПІСЛЯ MVP
                </Text>
              </View>
              <Text variant="numberSmall" color={colors.textSecondary}>
                {s.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const KIND_OF: Partial<Record<Filter, MaterialKind>> = { sim: 'sim', article: 'article', quiz: 'quiz', source: 'source' };

function FilteredList({ filter, open, goArticles }: Actions & { filter: Filter; goArticles: () => void }) {
  const saved = useSaved();

  if (filter === 'saved') {
    const items = saved
      .map((id) => findMaterial(id) ?? TERMS.find((t) => t.id === id))
      .filter((x): x is NonNullable<typeof x> => !!x);
    if (!items.length) {
      return (
        <View style={styles.empty}>
          <Image source={require('../../../assets/img/lib/empty-saved.png')} style={{ width: 150, height: 150 }} contentFit="contain" />
          <View style={{ gap: space.sm }}>
            <Text variant="title1" style={{ textAlign: 'center' }} accessibilityRole="header">
              Тут поки порожньо
            </Text>
            <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              Натисни на закладку в статті чи терміні, і вони з’являться тут.
            </Text>
          </View>
          <Button label="Перейти до статей" variant="secondary" onPress={goArticles} style={{ alignSelf: 'stretch', marginTop: space.sm }} />
        </View>
      );
    }
    return (
      <List count={`${items.length} збережено`}>
        {items.map((it) =>
          'kind' in it ? (
            <MaterialRow key={it.id} material={it} title={it.title} subtitle={KIND_LABEL[it.kind]} trailing="bookmark" onPress={() => open(it)} onTrailingPress={() => toggleSaved(it.id)} />
          ) : (
            <MaterialRow key={it.id} title={it.title} subtitle="Термін" trailing="bookmark" onPress={() => openTerm(it.id)} onTrailingPress={() => toggleSaved(it.id)} />
          ),
        )}
      </List>
    );
  }

  if (filter === 'terms') {
    return (
      <List count={countLabel(TERMS.length, COUNT.terms)}>
        {TERMS.map((t) => (
          <MaterialRow key={t.id} title={t.title} subtitle={t.short} onPress={() => openTerm(t.id)} />
        ))}
      </List>
    );
  }

  const kind = KIND_OF[filter]!;
  const items = MATERIALS.filter((m) => m.kind === kind);
  const subtitle = (m: Material) =>
    kind === 'sim' ? `Модуль ${m.module}` : kind === 'source' ? `Модуль ${m.module} · Зовнішній сайт` : kind === 'article' ? m.subtitle : undefined;
  return (
    <List count={countLabel(items.length, COUNT[filter as keyof typeof COUNT])}>
      {items.map((m) => (
        <MaterialRow key={m.id} material={m} title={m.title} subtitle={subtitle(m)} trailing={m.site ? 'external' : 'chevron'} onPress={() => open(m)} />
      ))}
    </List>
  );
}

function List({ count, children }: { count: string; children: ReactNode }) {
  return (
    <View style={{ marginTop: space.lg, gap: space.lg }}>
      <Text variant="subheadline" color={colors.textSecondary} style={{ paddingHorizontal: space.xl }}>
        {count}
      </Text>
      <View style={[styles.pad, { gap: space.sm }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { paddingTop: space.md, paddingHorizontal: space.xl, paddingBottom: space.lg },
  section: { gap: space.md },
  pad: { paddingHorizontal: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  upNext: { borderRadius: radius.xxl, padding: space.lg, gap: space.sm, borderWidth: 1, borderColor: '#F6FBB0', ...shadow.ink6 },
  upNextTop: { flexDirection: 'row', justifyContent: 'space-between' },
  upNextBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  play: { width: 48, height: 48, borderRadius: 26, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  card: {
    flex: 1,
    padding: space.sm,
    paddingBottom: space.md,
    gap: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassStrong,
  },
  cover: { width: '100%', height: 84, borderRadius: radius.md },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    ...shadow.ink6,
  },
  soon: { padding: space.lg, gap: 4, borderRadius: radius.xl, backgroundColor: colors.surface },
  soonArt: { width: 120, height: 120, borderRadius: radius.xl },
  empty: { alignItems: 'center', gap: space.lg, paddingHorizontal: space.lg, paddingTop: 56 },
});
