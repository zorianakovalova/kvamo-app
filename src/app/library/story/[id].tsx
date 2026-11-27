import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View, useWindowDimensions } from 'react-native';
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

/** Kvamo story: the cards follow the finger like a gallery and settle on the next or previous one; the neighbours peek from the edges as in Figma. */
export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const story = STORIES[id];
  const [i, setI] = useState(0);
  const [pos] = useState(() => new Animated.Value(0));
  const count = story?.cards.length ?? 0;
  const step = CARD_W + GAP;
  const close = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => pos.stopAnimation(),
        onPanResponderMove: (_, g) => {
          const atEdge = (i === 0 && g.dx > 0) || (i === count - 1 && g.dx < 0);
          pos.setValue(-i * step + (atEdge ? g.dx / 3 : g.dx));
        },
        onPanResponderRelease: (_, g) => {
          let to = i;
          if ((g.dx < -step / 4 || g.vx < -0.4) && i < count - 1) to = i + 1;
          else if ((g.dx > step / 4 || g.vx > 0.4) && i > 0) to = i - 1;
          Animated.spring(pos, { toValue: -to * step, velocity: g.vx, bounciness: 0, speed: 16, useNativeDriver: false }).start();
          setI(to);
        },
        onPanResponderTerminate: () => Animated.spring(pos, { toValue: -i * step, useNativeDriver: false }).start(),
      }),
    [i, count, step, pos],
  );
  useEffect(() => {
    pos.setValue(-i * step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!story) {
    close();
    return null;
  }
  const side = Math.max(0, (width - CARD_W) / 2);
  const last = i === count - 1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.nav}>
        <ProgressPill total={story.cards.length} done={i + 1} />
        <GlassButton icon="close" label="Закрити" onPress={close} />
      </View>
      <View style={styles.stage} {...responder.panHandlers}>
        <Animated.View pointerEvents="none" style={{ flexDirection: 'row', gap: GAP, paddingLeft: side, transform: [{ translateX: pos }] }}>
          {story.cards.map((c, k) => (
            <Image key={k} source={c.img} style={{ width: CARD_W, height: CARD_H, borderRadius: 24 }} contentFit="contain" accessibilityLabel={c.alt} accessibilityIgnoresInvertColors />
          ))}
        </Animated.View>
      </View>
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
  stage: { height: CARD_H, marginTop: space.md, overflow: 'hidden' },
  foot: { paddingHorizontal: space.lg, marginTop: space.md, minHeight: 56, justifyContent: 'center' },
  hint: { alignSelf: 'center', paddingVertical: space.sm },
});
