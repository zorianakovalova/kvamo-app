import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BANNER_H, BOOK_PITCH, PathModule } from '@/components/path/PathModule';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { findLesson, MODULES, type Module } from '@/data/modules';
import { useProgress } from '@/store/progress';
import { colors, space } from '@/theme/tokens';

/** 01 Шлях · v2: title with the streak, the compact current-lesson card and a book trail per module. */
export default function PathScreen() {
  const insets = useSafeAreaInsets();
  const { stars, streak, currentLessonId, doneCount, ready } = useProgress();
  const current = currentLessonId ? findLesson(currentLessonId) : undefined;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrolled = useRef(false);
  const top = useRef(0);

  const onModuleLayout = (m: Module, y: number) => {
    // Open the path on the current lesson once.
    if (!scrolled.current && ready && current && current.module.id === m.id) {
      const idx = m.lessons.findIndex((l) => l.id === current.id);
      if (idx > 1) {
        scrolled.current = true;
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({
            y: top.current + y + BANNER_H + 36 + idx * BOOK_PITCH - 160,
            animated: false,
          }),
        );
      }
    }
  };

  const index = current ? current.module.lessons.findIndex((x) => x.id === current.id) + 1 : 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: 110 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text variant="screenTitle" accessibilityRole="header" style={{ letterSpacing: -0.64 }}>
            Шлях
          </Text>
          <StreakPill days={streak} />
        </View>

        {current ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/lesson/[id]',
                params: { id: current.id },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Продовжити: заняття ${index}, ${current.title}`}
            style={styles.now}
          >
            <View style={styles.nowTop}>
              <Text variant="caption">Заняття {index}</Text>
              <Text variant="caption">{current.minutes} хв</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text variant="display16">{current.title}</Text>
              <Text variant="text14" style={{ paddingRight: 56 }}>
                {current.summary}
              </Text>
            </View>
            <View style={styles.play}>
              <Svg width={48} height={48} viewBox="0 0 48 48">
                <Path d="M19 17L30 24L19 31V17Z" fill={colors.ink} stroke={colors.ink} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </Pressable>
        ) : (
          <View style={styles.now}>
            <Text variant="display16">Усі модулі пройдено. Нові вже готуються!</Text>
          </View>
        )}

        <View onLayout={(e) => (top.current = e.nativeEvent.layout.y)}>
          {MODULES.map((m, i) => (
            <View key={m.id} onLayout={(e) => onModuleLayout(m, e.nativeEvent.layout.y)}>
              <PathModule module={m} stars={stars} currentLessonId={currentLessonId} done={doneCount(m)} last={i === MODULES.length - 1} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  titleRow: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: space.xl,
    paddingRight: space.lg,
  },
  now: {
    marginHorizontal: space.lg,
    marginVertical: space.md,
    borderRadius: 24,
    padding: space.lg,
    backgroundColor: colors.accent,
    gap: space.sm,
  },
  nowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  play: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
});
