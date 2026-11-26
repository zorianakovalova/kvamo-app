import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { BookmarkButton, BottomSheet, Callout, MaterialRow, NavPill, openTerm, useMaterialOpener, useSavedToast } from '@/components/library/LibraryUI';
import { OptionCard } from '@/components/OptionCard';
import { Text } from '@/components/Text';
import { ARTICLES, KIND_LABEL, findMaterial, findTerm, type Block } from '@/data/library';
import { markViewed, toggleSaved, useSaved } from '@/store/saved';
import { colors, palette, radius, space } from '@/theme/tokens';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const saved = useSaved();
  const [answer, setAnswer] = useState<number | null>(null);
  const [termId, setTermId] = useState<string | null>(null);
  const [savedToast, showSaved] = useSavedToast(insets.bottom + 93);
  const { open, overlay } = useMaterialOpener(insets.bottom + 93);
  const article = ARTICLES[id];
  const material = findMaterial(id);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  if (!article || !material) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <NavPill icon="chevronLeft" label="Назад" onPress={back} />
        <Text variant="title3" style={{ padding: space.xl }}>
          Статтю не знайдено
        </Text>
      </View>
    );
  }

  const isSaved = saved.includes(id);
  const toggle = () => {
    toggleSaved(id);
    if (!isSaved) showSaved();
  };
  const term = termId ? findTerm(termId) : null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <NavPill icon="chevronLeft" label="Назад" onPress={back} right={<BookmarkButton saved={isSaved} onPress={toggle} />} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.lg }}>
          <View style={styles.chips}>
            {[KIND_LABEL[material.kind], article.chapter, `${material.minutes} хв`].map((c) => (
              <View key={c} style={styles.chip}>
                <Text variant="subheadline">{c}</Text>
              </View>
            ))}
          </View>
          <Text variant="largeTitle" accessibilityRole="header" style={styles.padText}>
            {material.title}
          </Text>
        </View>
        <Image source={article.hero} style={styles.hero} contentFit="cover" accessibilityIgnoresInvertColors />

        {article.blocks.map((b, i) => (
          <BlockView key={i} block={b} afterParagraph={article.blocks[i - 1]?.type === 'p' && b.type === 'p'} onTerm={setTermId} />
        ))}

        <View style={{ gap: space.md, marginTop: space.xs }}>
          <View style={[styles.padText, { gap: space.md }]}>
            <Text variant="title1" accessibilityRole="header">
              Перевір себе
            </Text>
            <Text variant="bodyMedium">{article.check.question}</Text>
          </View>
          <View style={[styles.pad, { gap: space.md }]} accessibilityRole="radiogroup">
            {article.check.options.map((o, i) => (
              <OptionCard key={o} label={o} selected={answer === i} onPress={() => setAnswer(i)} />
            ))}
          </View>
        </View>

        <View style={{ gap: space.sm, marginTop: space.xs }}>
          <Text variant="title1" accessibilityRole="header" style={styles.padText}>
            Читай також
          </Text>
          <View style={[styles.pad, { gap: space.sm }]}>
            {article.readAlso.map((rid) => {
              const m = findMaterial(rid)!;
              return <MaterialRow key={rid} material={m} title={m.title} subtitle={KIND_LABEL[m.kind]} trailing={m.site ? 'external' : 'chevron'} onPress={() => open(m)} />;
            })}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        <Button
          label="Прочитано"
          onPress={() => {
            markViewed(id);
            back();
          }}
        />
      </View>
      {savedToast}
      {overlay}

      <BottomSheet visible={!!term} onClose={() => setTermId(null)} background={palette.inverse}>
        {term ? (
          <>
            <View style={{ gap: space.md, paddingHorizontal: 4, marginTop: space.xl }}>
              <Text variant="title1" accessibilityRole="header">
                {term.title}
              </Text>
              <Text variant="body">{term.definition}</Text>
            </View>
            <View style={{ marginTop: space.lg, gap: space.sm }}>
              <Button
                label="Відкрити у Словнику"
                variant="secondary"
                onPress={() => {
                  setTermId(null);
                  openTerm(term.id);
                }}
              />
              <Button label="Закрити" variant="link" onPress={() => setTermId(null)} />
            </View>
          </>
        ) : null}
      </BottomSheet>
    </View>
  );
}

function BlockView({ block, afterParagraph, onTerm }: { block: Block; afterParagraph: boolean; onTerm: (id: string) => void }) {
  if (block.type === 'h') {
    return (
      <Text variant="title1" accessibilityRole="header" style={[styles.padText, { marginTop: space.xs }]}>
        {block.text}
      </Text>
    );
  }
  if (block.type === 'callout') {
    return (
      <View style={[styles.pad, { marginTop: space.xs }]}>
        <Callout text={block.text} />
      </View>
    );
  }
  if (block.type === 'table') {
    return (
      <View style={styles.pad}>
        <View style={styles.table}>
          {block.rows.map((r, i) => {
            const total = r.kind === 'total';
            return (
              <View key={r.label} style={[styles.row, i < block.rows.length - 1 && styles.divider]}>
                <Text variant={total ? 'headline' : 'body'} style={{ flex: 1 }}>
                  {r.label}
                </Text>
                <Text variant={total ? 'headline' : 'bodyMedium'} color={r.kind === 'deduction' ? colors.textSecondary : colors.textPrimary}>
                  {r.value}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  return (
    <Text variant="body" style={[styles.padText, afterParagraph && { marginTop: 6 }]}>
      {block.parts.map((p, i) =>
        typeof p === 'string' ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <Text key={i} variant="body" color={colors.brand} style={styles.link} onPress={() => onTerm(p.term)} accessibilityRole="link">
            {p.text}
          </Text>
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  body: { paddingVertical: space.xxl, gap: space.lg },
  pad: { paddingHorizontal: space.lg },
  padText: { paddingHorizontal: space.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingHorizontal: space.lg },
  chip: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glass,
  },
  hero: { marginHorizontal: space.lg, aspectRatio: 361 / 163, borderRadius: radius.xl },
  table: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(11,16,13,0.1)' },
  link: { textDecorationLine: 'underline' },
  footer: { paddingTop: space.lg, paddingHorizontal: space.lg },
});
