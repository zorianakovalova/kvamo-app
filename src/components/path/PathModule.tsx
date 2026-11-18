import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { moduleMinutes, plural, type Lesson, type Module } from '@/data/modules';
import type { Stars } from '@/store/progress';
import { colors, space } from '@/theme/tokens';
import { ProgressRing } from '../ProgressRing';
import { Text } from '../Text';
import { LessonBook, type BookState } from './LessonBook';

/** Geometry of the Figma "Trail" (393 pt wide frame, 1460 pt per module). */
const DESIGN_W = 393;
export const BANNER_H = 82;
export const TRAIL_H = 1460;
export const BOOK_PITCH = 176;
const ROAD_X = 101;
const ROAD =
  'M 95 0 C 95 59 0 59 0 118 C 0 227.12 191 184.88 191 294 C 191 403.12 0 360.88 0 470 C 0 579.12 191 536.88 191 646 C 191 755.12 0 712.88 0 822 C 0 931.12 191 888.88 191 998 C 191 1107.12 0 1064.88 0 1174 C 0 1283.12 191 1240.88 191 1350';
const ROAD_END = ' C 191 1440 95 1430 95 1460';

const PROP = {
  bush: { src: require('../../../assets/img/path/prop-bush.png'), w: 44, h: 40 },
  tree: { src: require('../../../assets/img/path/prop-tree.png'), w: 44, h: 40 },
  coins: { src: require('../../../assets/img/path/prop-coins.png'), w: 44, h: 40 },
  pond: { src: require('../../../assets/img/path/prop-pond.png'), w: 64, h: 30 },
};
type PropName = keyof typeof PROP;
/** Props between the books, alternating sides, per module (first one on the left). */
const PROPS: Record<string, PropName[]> = {
  m1: ['bush', 'tree', 'bush', 'tree', 'bush', 'tree', 'bush'],
  m2: ['pond', 'bush', 'tree', 'pond', 'bush', 'tree', 'pond'],
  m3: ['coins', 'tree', 'coins', 'bush', 'coins', 'tree', 'coins'],
};

type Props = {
  module: Module;
  stars: Record<string, Stars>;
  /** Lesson id the learner is on now (only one across the whole path). */
  currentLessonId: string | null;
  done: number;
  /** Last module: the road stops at its final book instead of running on to the next banner. */
  last: boolean;
};

const open = (lesson: Lesson) => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });

export function PathModule({ module, stars, currentLessonId, done, last }: Props) {
  const { width } = useWindowDimensions();
  const ox = (width - DESIGN_W) / 2;
  const total = module.lessons.length;
  const road = ROAD + (last ? '' : ROAD_END);
  const trailH = TRAIL_H;

  return (
    <View>
      <View style={styles.banner}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="display16">{module.title}</Text>
          <View style={styles.meta}>
            <Text variant="text14">Модуль {module.number}</Text>
            <View style={styles.divider} />
            <Text variant="text14">
              {total} {plural(total, 'заняття', 'заняття', 'занять')}
            </Text>
            <View style={styles.divider} />
            <Text variant="text14">{moduleMinutes(module)} хв</Text>
          </View>
        </View>
        <ProgressRing done={done} total={total} />
      </View>

      <View style={{ height: trailH }}>
        <Svg width={DESIGN_W} height={trailH} style={{ position: 'absolute', left: ox, top: 0 }} pointerEvents="none">
          <Path d={road} transform={`translate(${ROAD_X} 0)`} stroke="rgba(255,255,255,0.9)" strokeWidth={44} strokeLinecap="round" fill="none" />
          <Path d={road} transform={`translate(${ROAD_X} 0)`} stroke="rgba(255,255,255,0.72)" strokeWidth={34} strokeLinecap="round" fill="none" />
          <Path d={road} transform={`translate(${ROAD_X} 0)`} stroke="rgba(11,16,13,0.18)" strokeWidth={2.5} strokeDasharray="8 10" strokeLinecap="round" fill="none" />
        </Svg>

        {(PROPS[module.id] ?? PROPS.m1).slice(0, total - 1).map((name, k) => {
          const p = PROP[name];
          const left = k % 2 === 0 ? 14 : name === 'pond' ? 315 : 335;
          return <Image key={k} source={p.src} style={{ position: 'absolute', left: ox + left, top: 214 + BOOK_PITCH * k, width: p.w, height: p.h }} pointerEvents="none" />;
        })}

        {module.lessons.map((lesson, i) => {
          const result = stars[lesson.id];
          const isCurrent = lesson.id === currentLessonId;
          const state: BookState = result ? 'done' : isCurrent ? 'current' : 'locked';
          const bookLeft = i % 2 === 0 ? 36 : 227;
          const top = 36 + BOOK_PITCH * i;
          const chip = lesson.kind === 'test' ? 'ТЕСТ' : lesson.kind === 'lesson' ? null : 'ПРАКТИКА';
          const meta = result ? 'Пройдено' : lesson.kind === 'test' ? lesson.summary : `${lesson.minutes} хв`;
          const label = `${lesson.title}. ${result ? `Пройдено, ${result} з 3 зірок` : isCurrent ? 'Зараз' : meta}`;
          return (
            <View key={lesson.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
              <Pressable
                onPress={() => open(lesson)}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={{ position: 'absolute', left: ox + bookLeft, top, width: 130, height: 152 }}
              >
                <LessonBook moduleId={module.id} index={i} state={state} stars={result ?? 0} />
              </Pressable>
              <View style={[styles.labelSlot, { left: ox + (i % 2 === 0 ? 172 : 15), top: top + 8 }]} pointerEvents="box-none">
                <Pressable onPress={() => open(lesson)} importantForAccessibility="no" style={styles.label}>
                  {isCurrent ? (
                    <View style={[styles.chip, { backgroundColor: colors.ink }]}>
                      <Text variant="captionStrong" color={colors.textInverse}>
                        ЗАРАЗ
                      </Text>
                    </View>
                  ) : chip && !result ? (
                    <View style={[styles.chip, styles.chipOutline]}>
                      <Text variant="captionStrong">{chip}</Text>
                    </View>
                  ) : null}
                  <Text variant={isCurrent ? 'text16Strong' : 'text14Strong'} color={result ? colors.textSecondary : colors.textPrimary} style={styles.center}>
                    {lesson.title}
                  </Text>
                  {isCurrent ? null : (
                    <Text variant="caption" color={colors.textSecondary} style={styles.center}>
                      {meta}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: space.lg,
    minHeight: BANNER_H,
    padding: space.lg,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    zIndex: 1,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  divider: { width: 1, height: 12, backgroundColor: colors.borderStrong },
  labelSlot: { position: 'absolute', width: 200, height: 152, justifyContent: 'center' },
  label: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 2, alignItems: 'center' },
  center: { textAlign: 'center' },
  chip: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 2 },
  chipOutline: { borderWidth: 1, borderColor: colors.borderStrong, paddingVertical: 3 },
});
