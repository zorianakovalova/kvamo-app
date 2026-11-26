import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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

/** Kvamo story: one card at a time, tap the right or left side (or the hint) to move. */
export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const story = STORIES[id];
  const [i, setI] = useState(0);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  if (!story) {
    close();
    return null;
  }
  const last = i === story.cards.length - 1;
  const next = () => {
    if (last) {
      markViewed(id);
      close();
    } else setI(i + 1);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.nav}>
        <ProgressPill total={story.cards.length} done={i + 1} />
        <GlassButton icon="close" label="Закрити" onPress={close} />
      </View>
      <View style={styles.stage}>
        <Image source={story.cards[i].img} style={{ width: CARD_W, height: CARD_H, borderRadius: 24 }} contentFit="contain" accessibilityLabel={story.cards[i].alt} accessibilityIgnoresInvertColors />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={styles.tapRow}>
            <Pressable style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel="Попередня картка" onPress={() => i > 0 && setI(i - 1)} />
            <Pressable style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel={last ? 'Готово' : 'Наступна картка'} onPress={next} />
          </View>
        </View>
      </View>
      <View style={styles.foot}>
        {last ? (
          <Button label="Готово" onPress={next} />
        ) : (
          <Pressable onPress={next} accessibilityRole="button" style={styles.hint}>
            <Text variant="text14Strong">Гортай далі  →</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  nav: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.sm },
  stage: { width: CARD_W, height: CARD_H, alignSelf: 'center', marginTop: space.md },
  tapRow: { flex: 1, flexDirection: 'row' },
  foot: { paddingHorizontal: space.lg, marginTop: space.md, minHeight: 56, justifyContent: 'center' },
  hint: { alignSelf: 'center', paddingVertical: space.sm },
});
