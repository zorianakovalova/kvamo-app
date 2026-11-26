import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookmarkButton, Callout, FilterChip, MaterialRow, NavPill, useMaterialOpener, useSavedToast } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import { KIND_LABEL, findMaterial, findTerm } from '@/data/library';
import { ALL_LESSONS, MODULES } from '@/data/modules';
import { toggleSaved, useSaved } from '@/store/saved';
import { colors, space } from '@/theme/tokens';

export default function TermScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const saved = useSaved();
  const [savedToast, showSaved] = useSavedToast(insets.bottom + space.lg);
  const { open, overlay } = useMaterialOpener(insets.bottom + space.lg);
  const term = findTerm(id);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/library/glossary'));

  if (!term) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <NavPill icon="chevronLeft" label="Назад" onPress={back} />
        <Text variant="title3" style={{ padding: space.xl }}>
          Термін не знайдено
        </Text>
      </View>
    );
  }

  const isSaved = saved.includes(term.id);
  const used = (term.usedIn ?? []).map(findMaterial).filter((m) => !!m);
  const related = (term.related ?? []).map(findTerm).filter((t) => !!t);
  const moduleLine = (n: number) => `Модуль ${n} “${MODULES[n - 1]?.title ?? ''}”`;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <NavPill
        icon="chevronLeft"
        label="Назад"
        onPress={back}
        right={
          <BookmarkButton
            saved={isSaved}
            onPress={() => {
              toggleSaved(term.id);
              if (!isSaved) showSaved();
            }}
          />
        }
      />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.padText, { gap: space.sm }]}>
          <Text variant="largeTitle" accessibilityRole="header">
            {term.title}
          </Text>
          <Text variant="body">{term.definition}</Text>
        </View>
        {term.example ? (
          <View style={styles.pad}>
            <Callout text={term.example} tone="example" />
          </View>
        ) : null}
        {used.length || term.where ? (
          <View style={{ gap: space.sm }}>
            <Text variant="headline" accessibilityRole="header" style={styles.padText}>
              Де зустрічається
            </Text>
            <View style={[styles.pad, { gap: space.sm }]}>
              {term.where ? (
                <MaterialRow
                  title={term.where.lesson}
                  subtitle={term.where.module}
                  onPress={() => {
                    const l = ALL_LESSONS.find((x) => x.title === term.where!.lesson);
                    if (l) router.push({ pathname: '/lesson/[id]', params: { id: l.id } });
                  }}
                />
              ) : null}
              {used.map((m) => (
                <MaterialRow key={m!.id} material={m} title={m!.title} subtitle={m!.kind === 'lesson' ? moduleLine(m!.module) : KIND_LABEL[m!.kind]} trailing={m!.site ? 'external' : 'chevron'} onPress={() => open(m!)} />
              ))}
            </View>
          </View>
        ) : null}
        {related.length ? (
          <View style={{ gap: space.md }}>
            <Text variant="headline" accessibilityRole="header" style={styles.padText}>
              Пов’язані терміни
            </Text>
            <View style={[styles.pad, styles.wrap]}>
              {related.map((t) => (
                <FilterChip key={t!.id} label={t!.title} onPress={() => router.push({ pathname: '/library/term/[id]', params: { id: t!.id } })} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
      {savedToast}
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  body: { paddingTop: space.xxl, gap: space.xl },
  pad: { paddingHorizontal: space.lg },
  padText: { paddingHorizontal: space.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
