import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/GradientBackground';
import { Icon } from '@/components/Icon';
import { PathModule } from '@/components/path/PathModule';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { COMING_SOON, findLesson, MODULES, type Module } from '@/data/modules';
import { useProgress } from '@/store/progress';
import { colors, radius, shadow, space } from '@/theme/tokens';

const BANNER_H = 90;

export default function PathScreen() {
  const insets = useSafeAreaInsets();
  const { stars, streak, currentLessonId, doneCount, ready } = useProgress();
  const [headerH, setHeaderH] = useState(0);
  const current = currentLessonId ? findLesson(currentLessonId) : undefined;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrolled = useRef(false);

  const onModuleLayout = (m: Module, y: number) => {
    // Open the path on the current lesson once.
    if (!scrolled.current && ready && current && current.module.id === m.id) {
      const idx = m.lessons.findIndex((l) => l.id === current.id);
      if (idx > 2) {
        scrolled.current = true;
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: y + BANNER_H + idx * 118 - 120, animated: false }));
      }
    }
  };

  const Header = Platform.OS === 'ios' ? BlurView : View;
  const index = current ? current.module.lessons.findIndex((x) => x.id === current.id) + 1 : 0;

  return (
    <View style={styles.screen}>
      <GradientBackground />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingTop: headerH + space.sm, paddingBottom: 130 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {MODULES.map((m) => (
          <View key={m.id} onLayout={(e) => onModuleLayout(m, e.nativeEvent.layout.y)}>
            <PathModule module={m} stars={stars} currentLessonId={currentLessonId} done={doneCount(m)} />
          </View>
        ))}

        <View style={styles.soon}>
          <Text variant="headline" style={{ paddingHorizontal: 4 }}>
            Готуємо далі
          </Text>
          {COMING_SOON.map((title, i) => (
            <View key={title} style={styles.soonCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="lock" size={12} color={colors.textSecondary} strokeWidth={2.4} />
                <Text variant="caption2" color={colors.textSecondary}>
                  МОДУЛЬ {MODULES.length + i + 1}
                </Text>
              </View>
              <Text variant="numberSmall" color={colors.textSecondary} style={{ marginTop: 4 }}>
                {title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Header
        {...(Platform.OS === 'ios' ? { intensity: 30, tint: 'light' as const } : {})}
        style={[styles.header, { paddingTop: insets.top }]}
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
      >
        <View style={styles.titleRow}>
          <Text variant="largeTitle" accessibilityRole="header">
            Шлях
          </Text>
          <StreakPill days={streak} />
        </View>

        {current ? (
          <Pressable
            onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: current.id } })}
            accessibilityRole="button"
            accessibilityLabel={`Продовжити: заняття ${index}, ${current.title}`}
            style={styles.nowWrap}
          >
            <LinearGradient colors={['#F6FBB0', '#E9F57C']} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.now}>
              <View style={styles.nowTop}>
                <Text variant="caption" color={colors.textSecondary}>
                  Заняття {index}
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {current.minutes} хв
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.md }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="numberSmall">{current.title}</Text>
                  <Text variant="subheadline" color={colors.textSecondary}>
                    {current.summary}
                  </Text>
                </View>
                <View style={styles.play}>
                  <Icon name="play" size={20} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ) : (
          <View style={[styles.nowWrap, styles.now, { backgroundColor: colors.accent }]}>
            <Text variant="numberSmall">Усі модулі пройдено. Нові вже готуються!</Text>
          </View>
        )}
      </Header>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ddf1e5' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(221,241,229,0.55)' : 'rgba(221,241,229,0.96)',
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: space.xl,
    paddingRight: space.lg,
    paddingVertical: space.md,
  },
  nowWrap: { marginHorizontal: space.lg, marginBottom: space.md },
  now: {
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(20,35,26,0.12)',
    padding: space.lg,
    gap: 4,
    ...shadow.ink6,
  },
  nowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  play: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  soon: { marginHorizontal: space.lg, gap: space.sm },
  soonCard: {
    borderRadius: radius.xl,
    padding: space.lg,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
});
