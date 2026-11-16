import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { ExternalSiteSheet, FilterChip, MaterialRow, SearchField, useSoonToast } from '@/components/library/LibraryUI';
import { PathBackground } from '@/components/PathBackground';
import { Text } from '@/components/Text';
import { KIND_LABEL, POPULAR, isCryptoQuery, search, type Material } from '@/data/library';
import { colors, radius, shadow, space } from '@/theme/tokens';

const FIRST = 3;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [site, setSite] = useState<Material['site'] | null>(null);
  const [toast, soon] = useSoonToast(insets.bottom + 24);

  const change = (q: string) => {
    setQuery(q);
    setShowAll(false);
  };
  const { terms, materials } = search(query);
  const total = terms.length + materials.length;
  const shown = showAll ? materials : materials.slice(0, FIRST);
  const open = (m: Material) => (m.site ? setSite(m.site) : soon());

  const popular = (
    <View style={{ gap: space.md }}>
      <Text variant="headline" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
        Часто шукають
      </Text>
      <View style={styles.wrap}>
        {POPULAR.map((p) => (
          <FilterChip key={p} label={p} onPress={() => change(p)} />
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PathBackground />
      <View style={{ height: insets.top }} />
      <View style={styles.nav}>
        <GlassButton icon="chevronLeft" label="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))} />
        <View style={styles.titlePill}>
          <Text variant="headline" accessibilityRole="header">
            Пошук
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SearchField value={query} onChangeText={change} autoFocus />

        {!query.trim() ? (
          <View style={{ marginTop: space.xxl }}>{popular}</View>
        ) : total === 0 ? (
          <View style={{ marginTop: space.xxl, gap: space.xxl }}>
            <View style={{ alignItems: 'center', gap: space.lg }}>
              <Image source={require('../../../assets/img/lib/empty-search.png')} style={{ width: 150, height: 150, borderRadius: radius.xxl }} contentFit="cover" />
              <View style={{ gap: space.sm }}>
                <Text variant="title1" accessibilityRole="header" style={{ textAlign: 'center' }}>
                  Нічого не знайдено
                </Text>
                <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center', paddingHorizontal: space.xl }}>
                  Спробуй інше слово або подивись популярні запити.
                </Text>
              </View>
            </View>
            {popular}
            {isCryptoQuery(query) ? (
              <View style={styles.info}>
                <Text variant="subheadline" color="#2b6cb0">
                  Криптовалют у застосунку поки немає. Ми записали твій запит, щоб врахувати його в наступних модулях.
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={{ marginTop: space.lg, gap: space.lg }}>
            <Text variant="subheadline" color={colors.textSecondary} style={{ paddingHorizontal: 4 }} accessibilityLiveRegion="polite">
              Знайдено {total}
            </Text>
            {terms.length ? (
              <View style={styles.group}>
                <Text variant="headline" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
                  Словник
                </Text>
                {terms.map((t) => (
                  <MaterialRow key={t.id} title={t.title} subtitle={t.definition} onPress={soon} />
                ))}
              </View>
            ) : null}
            {materials.length ? (
              <View style={styles.group}>
                <Text variant="headline" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
                  Матеріали
                </Text>
                {shown.map((m) => (
                  <MaterialRow key={m.id} material={m} title={m.title} subtitle={KIND_LABEL[m.kind]} trailing={m.site ? 'external' : 'chevron'} onPress={() => open(m)} />
                ))}
                {materials.length > shown.length ? <Button label={`Показати ще ${materials.length - shown.length}`} variant="link" onPress={() => setShowAll(true)} /> : null}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
      {toast}
      <ExternalSiteSheet site={site} onClose={() => setSite(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  titlePill: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    ...shadow.ink6,
  },
  body: { paddingTop: space.xxl, paddingHorizontal: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  group: { gap: space.sm },
  info: { padding: space.md, borderRadius: radius.lg, backgroundColor: '#e6f1fb', borderWidth: 1, borderColor: '#2b6cb0' },
});
