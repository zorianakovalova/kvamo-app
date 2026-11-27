import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { ProgressPill } from '@/components/ProgressPill';
import { Text } from '@/components/Text';
import { STORIES } from '@/data/library';
import { markViewed } from '@/store/saved';
import { colors, space } from '@/theme/tokens';

const CARD_W = 325;
const CARD_H = 616;
const GAP = 12;

/** Kvamo story: swipe the cards sideways, the next and previous cards peek from the edges as in Figma. */
export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const story = STORIES[id];
  const [i, setI] = useState(0);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  if (!story) {
    close();
    return null;
  }
  const side = Math.max(0, (width - CARD_W) / 2);
  const step = CARD_W + GAP;
  const last = i === story.cards.length - 1;
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const n = Math.round(e.nativeEvent.contentOffset.x / step);
    setI(Math.max(0, Math.min(story.cards.length - 1, n)));
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.nav}>
        <ProgressPill total={story.cards.length} done={i + 1} />
        <GlassButton icon="close" label="Закрити" onPress={close} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        style={styles.stage}
        contentContainerStyle={{ paddingHorizontal: side, gap: GAP }}
      >
        {story.cards.map((c, k) => (
          <Image key={k} source={c.img} style={{ width: CARD_W, height: CARD_H, borderRadius: 24 }} contentFit="contain" accessibilityLabel={c.alt} accessibilityIgnoresInvertColors />
        ))}
      </ScrollView>
      <View style={styles.foot}>
        {last ? (
          <Button
            label="Готово"
            onPress={() => {
              markViewed(id);
              close();
            }}
          />
        ) : (
          <View style={styles.hint} accessibilityElementsHidden importantForAccessibility="no">
            <Text variant="text14Strong">Гортай далі  →</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  nav: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.sm },
  stage: { flexGrow: 0, height: CARD_H, marginTop: space.md },
  foot: { paddingHorizontal: space.lg, marginTop: space.md, minHeight: 56, justifyContent: 'center' },
  hint: { alignSelf: 'center', paddingVertical: space.sm },
});
