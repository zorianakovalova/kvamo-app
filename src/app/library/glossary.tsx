import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavPill, SearchField, TermRow, openTerm } from '@/components/library/LibraryUI';
import { PathBackground } from '@/components/PathBackground';
import { Text } from '@/components/Text';
import { TERMS, searchTerms, termsLabel, type Term } from '@/data/library';
import { colors, radius, space } from '@/theme/tokens';

const firstLetter = (t: Term) => t.title[0].toLocaleUpperCase('uk');

function groupByLetter(list: Term[]) {
  const groups: { letter: string; terms: Term[] }[] = [];
  for (const t of list) {
    const l = firstLetter(t);
    const g = groups[groups.length - 1];
    if (g?.letter === l) g.terms.push(t);
    else groups.push({ letter: l, terms: [t] });
  }
  return groups;
}

const LETTERS = groupByLetter(TERMS).map((g) => g.letter);

export default function GlossaryScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);
  const groupY = useRef<Record<string, number>>({});
  const groups = groupByLetter(searchTerms(query));

  const jump = (letter: string) => {
    setActive(letter);
    const y = groupY.current[letter];
    if (y != null) scroll.current?.scrollTo({ y, animated: true });
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <PathBackground />
      <NavPill icon="chevronLeft" label="Назад" title="Словник" meta={termsLabel(TERMS.length)} onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))} />
      <View style={styles.header}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Знайти термін" style={{ marginHorizontal: space.lg }} />
        {!query ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.letters}>
            {LETTERS.map((l) => (
              <Pressable key={l} onPress={() => jump(l)} accessibilityRole="button" accessibilityLabel={`Літера ${l}`} accessibilityState={{ selected: active === l }} style={[styles.letter, active === l && styles.letterOn]}>
                <Text variant="subheadlineStrong" color={active === l ? colors.textInverse : colors.textPrimary}>
                  {l}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.lg }}>
          {groups.length ? (
            groups.map((g) => (
              <View key={g.letter} style={{ gap: space.sm }} onLayout={(e) => (groupY.current[g.letter] = e.nativeEvent.layout.y)}>
                <Text variant="numberSmall" accessibilityRole="header" style={{ paddingHorizontal: space.xl }}>
                  {g.letter}
                </Text>
                <View style={{ gap: space.sm, paddingHorizontal: space.lg }}>
                  {g.terms.map((t) => (
                    <TermRow key={t.id} title={t.title} subtitle={t.short} onPress={() => openTerm(t.id)} />
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Text variant="subheadline" color={colors.textSecondary} style={{ paddingHorizontal: space.xl }}>
              Такого терміна поки немає. Спробуй інше слово.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: space.sm, paddingBottom: space.lg, gap: space.lg },
  body: {},
  letters: { gap: 4, paddingHorizontal: space.lg },
  letter: { width: 28, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  letterOn: { backgroundColor: colors.ink },
});
