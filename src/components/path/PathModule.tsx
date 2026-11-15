import { router } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { moduleMinutes, plural, type Lesson, type Module } from '@/data/modules';
import type { Stars } from '@/store/progress';
import { colors, radius, shadow, space } from '@/theme/tokens';
import { Chip } from '../Chip';
import { ProgressRing } from '../ProgressRing';
import { Text } from '../Text';
import { Cube, CUBE_SIZE, TestStepDone, type CubeState } from './Cube';
import { GUIDE_H, GUIDE_W, GUIDE_XML } from './guide';
import { TEST_STEP_XML } from './testStep';

/** Step positions from the Figma Path frame (393 pt wide), relative to the steps container. */
const DESIGN_W = 393;
const LEFTS = [48, 102, 156, 210, 156, 102, 48];
const PITCH = 118;
const TOP0 = 14;
const TEST = { left: 74, top: 840, w: 151, h: 125.5 };
const STEPS_H = 996;

type Props = {
  module: Module;
  stars: Record<string, Stars>;
  /** Lesson id the learner is on now (only one across the whole path). */
  currentLessonId: string | null;
  done: number;
};

const open = (lesson: Lesson) => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });

export function PathModule({ module, stars, currentLessonId, done }: Props) {
  const { width } = useWindowDimensions();
  const ox = (width - DESIGN_W) / 2;
  const total = module.lessons.length;

  return (
    <View>
      <View style={styles.banner}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="headline">{module.title}</Text>
          <View style={styles.meta}>
            <Text variant="caption" color={colors.textSecondary}>
              Модуль {module.number}
            </Text>
            <View style={styles.divider} />
            <Text variant="caption" color={colors.textSecondary}>
              {total} {plural(total, 'заняття', 'заняття', 'занять')}
            </Text>
            <View style={styles.divider} />
            <Text variant="caption" color={colors.textSecondary}>
              {moduleMinutes(module)} хв
            </Text>
          </View>
        </View>
        <ProgressRing done={done} total={total} />
      </View>

      <View style={{ height: STEPS_H }}>
        <View style={{ position: 'absolute', left: ox + 100, top: 40 }} pointerEvents="none">
          <SvgXml xml={GUIDE_XML} width={GUIDE_W} height={GUIDE_H} />
        </View>

        {module.lessons.map((lesson, i) => {
          const isTest = lesson.kind === 'test';
          const result = stars[lesson.id];
          const state: CubeState = result ? 'done' : lesson.id === currentLessonId ? 'current' : 'available';
          const size = CUBE_SIZE[state];
          const baseLeft = isTest ? TEST.left : LEFTS[i % LEFTS.length];
          const left = ox + (isTest ? TEST.left : state === 'current' ? baseLeft - 8 : baseLeft);
          const top = isTest ? TEST.top : TOP0 + i * PITCH - (state === 'current' ? 4 : 0);
          const w = isTest ? TEST.w : size.w;
          const h = isTest ? TEST.h : size.top + size.side;
          const centre = baseLeft + 52;
          const labelRight = isTest || centre <= 154;
          const chip = isTest ? 'ТЕСТ' : lesson.kind === 'practice' ? 'ПРАКТИКА' : lesson.kind === 'simulation' ? 'СИМУЛЯЦІЯ' : null;
          const isCurrent = state === 'current';
          const labelTop = isTest ? top + 44 : top + (isCurrent ? 8 : chip ? 13 : 28);
          const textAlign = labelRight ? 'left' : 'right';
          const labelBox = labelRight
            ? { left: left + w + 8, right: 16, alignItems: 'flex-start' as const }
            : { left: 16, width: left - 24, alignItems: 'flex-end' as const };
          const meta = result ? 'Пройдено' : isTest ? lesson.summary : `${lesson.minutes} хв`;

          return (
            <View key={lesson.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
              <Pressable
                onPress={() => open(lesson)}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title}. ${result ? `Пройдено, ${result} з 3 зірок` : isCurrent ? 'Зараз' : meta}`}
                style={{ position: 'absolute', left, top, width: w, height: h }}
              >
                {isTest ? (
                  result ? (
                    <TestStepDone stars={result} />
                  ) : (
                    <SvgXml xml={TEST_STEP_XML} width={TEST.w} height={TEST.h} />
                  )
                ) : (
                  <Cube state={state} number={i + 1} stars={result ?? 0} />
                )}
              </Pressable>
              <Pressable onPress={() => open(lesson)} style={[styles.label, { top: labelTop }, labelBox]} importantForAccessibility="no">
                {isCurrent ? <Chip label="ЗАРАЗ" tone="ink" style={{ alignSelf: labelRight ? 'flex-start' : 'flex-end', marginBottom: 4 }} /> : null}
                {!isCurrent && chip ? <Chip label={chip} style={{ alignSelf: labelRight ? 'flex-start' : 'flex-end', marginBottom: 4 }} /> : null}
                <Text
                  variant={isCurrent ? 'headline' : 'subheadlineStrong'}
                  color={result ? colors.textSecondary : colors.textPrimary}
                  style={{ textAlign }}
                >
                  {lesson.title}
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={{ textAlign }}>
                  {meta}
                </Text>
              </Pressable>
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
    padding: space.lg,
    borderRadius: radius.xxl,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    ...shadow.ink6,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  divider: { width: 1, height: 8, backgroundColor: colors.borderStrong },
  label: { position: 'absolute', gap: 2 },
});
