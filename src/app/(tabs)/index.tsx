import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { GradientBackground } from '@/components/GradientBackground';
import { Icon } from '@/components/Icon';
import { ModuleBanner } from '@/components/path/ModuleBanner';
import { PathModule } from '@/components/path/PathModule';
import { ProgressRing } from '@/components/ProgressRing';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { COMING_SOON, findLesson, MODULES, plural, type Module } from '@/data/modules';
import { useProgress } from '@/store/progress';
import { colors, radius, space } from '@/theme/tokens';

export default function PathScreen() {
  const insets = useSafeAreaInsets();
  const { stars, streak, currentLessonId, doneCount, ready } = useProgress();
  const [headerH, setHeaderH] = useState(0);
  const [notify, setNotify] = useState(false);
  const current = currentLessonId ? findLesson(currentLessonId) : undefined;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const moduleY = useRef<Record<string, number>>({});
  const scrolled = useRef(false);

  const subtitleFor = (m: Module, index: number) => {
    const done = doneCount(m);
    const total = m.lessons.length;
    if (done === total) return `Пройдено · бейдж «${m.badge}»`;
    if (current?.module.id === m.id) return `${done} з ${total} ${plural(total, 'заняття', 'занять', 'занять')} · зараз тут`;
    if (done > 0) return `${done} з ${total} ${plural(total, 'заняття', 'занять', 'занять')}`;
    return index === 0 ? 'Можна почати' : `Можна почати · радимо після модуля ${index}`;
  };

  const onModuleLayout = (m: Module, y: number) => {
    moduleY.current[m.id] = y;
    // Open the path on the current lesson once, like the design's first screen.
    if (!scrolled.current && ready && current && current.module.id === m.id) {
      const idx = m.lessons.findIndex((l) => l.id === current.id);
      if (idx > 2) {
        scrolled.current = true;
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: y + idx * 118 - 160, animated: false }));
      }
    }
  };

  const Header = Platform.OS === 'ios' ? BlurView : View;

  return (
    <View style={styles.screen}>
      <GradientBackground />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingTop: headerH + space.md, paddingBottom: 140 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {MODULES.map((m, i) => {
          const done = doneCount(m);
          const curIdx = current?.module.id === m.id ? m.lessons.findIndex((l) => l.id === current.id) : null;
          return (
            <View key={m.id} onLayout={(e) => onModuleLayout(m, e.nativeEvent.layout.y)} style={{ marginBottom: space.sm }}>
              <ModuleBanner module={m} done={done} currentIndex={curIdx} subtitle={subtitleFor(m, i)} />
              <PathModule module={m} stars={stars} currentLessonId={currentLessonId} />
            </View>
          );
        })}

        <View style={styles.soon}>
          <View style={styles.soonHead}>
            <Text variant="label" style={{ fontSize: 16 }}>
              Готуємо далі
            </Text>
            <Text variant="caption" color={colors.textTertiary} style={{ fontSize: 13 }}>
              {COMING_SOON.length} модулі
            </Text>
          </View>
          {COMING_SOON.map((title, i) => (
            <View key={title} style={styles.soonCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="lock" size={12} color={colors.textTertiary} strokeWidth={2.4} />
                <Text variant="overline" color={colors.textTertiary}>
                  МОДУЛЬ {MODULES.length + i + 1}
                </Text>
              </View>
              <Text variant="moduleTitle" color={colors.textSecondary} style={{ fontSize: 16, marginTop: 4 }}>
                {title}
              </Text>
            </View>
          ))}
          <Pressable style={styles.notify} accessibilityRole="button" accessibilityState={{ checked: notify }} onPress={() => setNotify((v) => !v)}>
            <View style={styles.notifyIcon}>
              <Icon name={notify ? 'check' : 'bell'} size={18} />
            </View>
            <Text variant="label" style={{ fontSize: 15 }}>
              {notify ? 'Повідомимо, щойно зʼявляться' : 'Повідомити, коли зʼявляться'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Header
        {...(Platform.OS === 'ios' ? { intensity: 40, tint: 'light' as const } : {})}
        style={[styles.header, { paddingTop: insets.top }]}
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
      >
        <View style={styles.titleRow}>
          <Text variant="screenTitle" accessibilityRole="header">
            Шлях
          </Text>
          <StreakPill days={streak} />
        </View>

        {current ? (
          <Pressable onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: current.id } })} accessibilityRole="button">
            <Card style={styles.now}>
              <ProgressRing done={doneCount(current.module)} total={current.module.lessons.length} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="overline" color={colors.brand}>
                  ЗАРАЗ · ЗАНЯТТЯ {current.module.lessons.findIndex((x) => x.id === current.id) + 1} · {current.minutes} ХВ
                </Text>
                <Text variant="title">{current.title}</Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {current.summary}
                </Text>
              </View>
              <View style={styles.play}>
                <Icon name="play" size={20} color="#fff" />
              </View>
            </Card>
          </Pressable>
        ) : (
          <Card style={styles.now}>
            <Text variant="title">Усі модулі пройдено. Нові вже готуються!</Text>
          </Card>
        )}
      </Header>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#eef8e3' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: space.md,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(244,250,236,0.6)' : 'rgba(244,250,236,0.94)',
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  now: {
    marginHorizontal: space.lg,
    marginTop: space.xs,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  play: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.accent,
  },
  soon: { marginHorizontal: space.lg, marginTop: space.sm, gap: space.sm },
  soonHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 4 },
  soonCard: {
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  notify: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    height: 56,
    paddingLeft: space.sm,
    paddingRight: space.xl,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 4,
  },
  notifyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
