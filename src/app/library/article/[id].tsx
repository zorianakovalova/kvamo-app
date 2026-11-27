import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavPill } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import { ARTICLES, KIND_LABEL, findMaterial } from '@/data/library';
import { colors, radius, space } from '@/theme/tokens';

/** Library article, from the Figma "Стаття" screens. */
export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
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

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <NavPill icon="chevronLeft" label="Назад" onPress={back} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxxl }]} showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.lg }}>
          <View style={styles.chips}>
            {[KIND_LABEL[material.kind], article.chapter, `${material.minutes} хв`].map((c) => (
              <View key={c} style={styles.chip}>
                <Text variant="text14">{c}</Text>
              </View>
            ))}
          </View>
          <Text variant="screenTitle" accessibilityRole="header" style={styles.padText}>
            {material.title}
          </Text>
        </View>
        <Image source={article.hero} style={styles.hero} contentFit="cover" accessibilityIgnoresInvertColors />

        <Text variant="text16" style={styles.padText}>
          {article.intro}
        </Text>
        <Text variant="display16" accessibilityRole="header" style={[styles.padText, { fontSize: 22, lineHeight: 32 }]}>
          {article.heading}
        </Text>
        {article.visuals.map((v, i) => (
          <Image key={i} source={v.src} style={[styles.visual, { aspectRatio: v.ratio }]} contentFit="contain" accessibilityLabel={v.alt} />
        ))}
        <View style={[styles.padText, { gap: space.lg }]}>
          {article.text.split('\n\n').map((para, i) => {
            const [lead, ...rest] = para.split('\n');
            return rest.length ? (
              <Text key={i} variant="text16">
                <Text variant="text16Strong">{lead}</Text>
                {'\n' + rest.join('\n')}
              </Text>
            ) : (
              <Text key={i} variant="text16">
                {para}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  body: { paddingTop: space.xxl, gap: space.xl },
  padText: { paddingHorizontal: space.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingHorizontal: space.lg },
  chip: { paddingHorizontal: space.sm, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.glass },
  hero: { marginHorizontal: space.lg, aspectRatio: 1083 / 489 },
  visual: { marginHorizontal: space.lg, width: undefined, alignSelf: 'stretch' },
});
