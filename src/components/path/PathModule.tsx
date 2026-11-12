import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, RadialGradient, Stop } from 'react-native-svg';

import { lessonMeta, type Module } from '@/data/modules';
import type { Stars } from '@/store/progress';
import { colors, moduleColors, type } from '@/theme/tokens';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { CubeNumber, CubeStars, IsoBlock } from './IsoBlock';

/** Positions follow the Figma frame (393 pt wide) and are scaled to the device width. */
const DESIGN_W = 393;
const XS = [100, 154, 208, 262, 208, 154, 100, 150];
const PITCH = 118;
const TOP = 48;
const CUBE = { w: 104, h: 52, t: 44 };
const CURRENT = { w: 120, h: 60, t: 46 };
const TEST = { w: 150, h: 75, t: 28 };

const frog = require('../../../assets/frog.png');

type Props = {
  module: Module;
  stars: Record<string, Stars>;
  /** Lesson id the learner is on now (only one across the whole path). */
  currentLessonId: string | null;
};

export function PathModule({ module, stars, currentLessonId }: Props) {
  const { width } = useWindowDimensions();
  const sx = width / DESIGN_W;
  const n = module.lessons.length;
  const ys = module.lessons.map((_, i) => TOP + i * PITCH + (i === n - 1 ? 14 : 0));
  const height = ys[n - 1] + 112;
  const xs = XS.map((x) => x * sx);
  const id = module.id;
  const theme = moduleColors[module.theme];

  const guide = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x} ${ys[i]}`).join(' ');

  return (
    <View style={{ height }}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`${id}upTop`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#fff" stopOpacity={0.92} />
            <Stop offset="1" stopColor="#fff" stopOpacity={0.55} />
          </LinearGradient>
          <LinearGradient id={`${id}upL`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.sideL[0]} stopOpacity={0.85} />
            <Stop offset="1" stopColor={theme.sideL[1]} stopOpacity={0.55} />
          </LinearGradient>
          <LinearGradient id={`${id}upR`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.sideR[0]} stopOpacity={0.9} />
            <Stop offset="1" stopColor={theme.sideR[1]} stopOpacity={0.55} />
          </LinearGradient>
          <LinearGradient id={`${id}doneTop`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#a6e07a" />
            <Stop offset="0.55" stopColor="#5fc35a" />
            <Stop offset="1" stopColor="#3db769" />
          </LinearGradient>
          <LinearGradient id={`${id}doneL`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#2f9a52" />
            <Stop offset="1" stopColor="#2f9a52" stopOpacity={0.75} />
          </LinearGradient>
          <LinearGradient id={`${id}doneR`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4fb764" />
            <Stop offset="1" stopColor="#4fb764" stopOpacity={0.75} />
          </LinearGradient>
          <LinearGradient id={`${id}nowTop`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#f4fbb6" />
            <Stop offset="0.5" stopColor="#d8f28a" />
            <Stop offset="1" stopColor="#c6eb7a" />
          </LinearGradient>
          <LinearGradient id={`${id}nowL`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#a9d25a" />
            <Stop offset="1" stopColor="#9fc556" />
          </LinearGradient>
          <LinearGradient id={`${id}nowR`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#c3e573" />
            <Stop offset="1" stopColor="#b2d968" />
          </LinearGradient>
          <LinearGradient id={`${id}testTop`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2f8553" />
            <Stop offset="1" stopColor="#1f6b3f" />
          </LinearGradient>
          <LinearGradient id={`${id}star`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffe27a" />
            <Stop offset="1" stopColor="#ffb21e" />
          </LinearGradient>
          <RadialGradient id={`${id}sun`}>
            <Stop offset="0" stopColor="#ffc75a" stopOpacity={0.75} />
            <Stop offset="0.45" stopColor="#ffe58f" stopOpacity={0.55} />
            <Stop offset="0.75" stopColor="#eaf8a8" stopOpacity={0.35} />
            <Stop offset="1" stopColor="#eaf8a8" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Path d={guide} fill="none" stroke="rgba(31,107,63,0.35)" strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />

        {module.lessons.map((lesson, i) => {
          const x = xs[i];
          const y = ys[i];
          const result = stars[lesson.id];
          if (lesson.kind === 'test') {
            return (
              <IsoBlock key={lesson.id} x={x} y={y} {...TEST} top={`url(#${id}testTop)`} left="#154a2b" right="#1a5c36" />
            );
          }
          if (lesson.id === currentLessonId) {
            return [
              <Circle key="sun" cx={x} cy={y + 10} r={150} fill={`url(#${id}sun)`} />,
              <IsoBlock
                key={lesson.id}
                x={x}
                y={y}
                {...CURRENT}
                top={`url(#${id}nowTop)`}
                left={`url(#${id}nowL)`}
                right={`url(#${id}nowR)`}
                stroke="#fff"
                strokeOpacity={0.8}
                strokeWidth={1.5}
              />,
            ];
          }
          if (result) {
            return [
              <IsoBlock
                key={lesson.id}
                x={x}
                y={y}
                {...CUBE}
                top={`url(#${id}doneTop)`}
                left={`url(#${id}doneL)`}
                right={`url(#${id}doneR)`}
                stroke="#fff"
                strokeOpacity={0.55}
              />,
              <CubeStars key="stars" x={x} y={y} stars={result} gradientId={`${id}star`} />,
            ];
          }
          return [
            <IsoBlock
              key={lesson.id}
              x={x}
              y={y}
              {...CUBE}
              top={`url(#${id}upTop)`}
              left={`url(#${id}upL)`}
              right={`url(#${id}upR)`}
              stroke="#fff"
              strokeWidth={1.5}
            />,
            <CubeNumber key="n" x={x} y={y} n={i + 1} color={colors.textTertiary} />,
          ];
        })}
      </Svg>

      {module.lessons.map((lesson, i) => {
        const x = xs[i];
        const y = ys[i];
        const result = stars[lesson.id];
        const isCurrent = lesson.id === currentLessonId;
        const isTest = lesson.kind === 'test';
        const size = isTest ? TEST : isCurrent ? CURRENT : CUBE;
        const onPress = () => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });

        // Label sits to the right of cubes on the left half, otherwise to the left.
        const right = XS[i] <= 175;
        const gap = (isCurrent ? 70 : 60) * sx;
        const labelStyle = isTest
          ? { left: x + 84 * sx, width: width - x - 100 * sx, top: y - 14, alignItems: 'flex-start' as const }
          : right
            ? { left: x + gap, width: width - (x + gap) - 16, top: y - (isCurrent ? 36 : 18), alignItems: 'flex-start' as const }
            : { left: 16, width: x - gap - 16, top: y - (isCurrent ? 36 : 18), alignItems: 'flex-end' as const };
        const textAlign = !isTest && !right ? 'right' : 'left';

        return (
          <View key={lesson.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {isTest && (
              <View style={[styles.trophy, { left: x - 24, top: y - 58 }]}>
                <TrophyHex />
              </View>
            )}
            {isCurrent && (
              <Image
                source={frog}
                contentFit="contain"
                style={[styles.frog, { left: right ? x - 84 * sx : x + 20 * sx, top: y - 58 }]}
              />
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${lesson.title}. ${result ? `Пройдено, ${result} з 3 зірок` : isCurrent ? 'Зараз' : lessonMeta(lesson)}`}
              onPress={onPress}
              style={{ position: 'absolute', left: x - size.w / 2, top: y - size.h / 2, width: size.w, height: size.h + size.t }}
            />
            <Pressable onPress={onPress} style={[styles.label, labelStyle]}>
              {isCurrent && (
                <View style={styles.nowChip}>
                  <Text variant="overline" color={colors.accent} style={{ letterSpacing: 0 }}>
                    ЗАРАЗ
                  </Text>
                </View>
              )}
              <Text
                variant={isCurrent ? 'title' : 'label'}
                color={result ? colors.textSecondary : isCurrent ? colors.textPrimary : '#28312c'}
                style={[{ textAlign }, !isCurrent && { fontFamily: 'Onest_500Medium' }, isCurrent && { fontFamily: 'Onest_600SemiBold' }]}
              >
                {lesson.title}
              </Text>
              {result ? (
                <Text variant="caption" color="#4f5a54" style={{ textAlign }}>
                  Пройдено ·{' '}
                  <Text variant="caption" color={colors.brand} style={{ fontFamily: 'Onest_600SemiBold' }}>
                    {result} з 3 <Text style={[type.caption, { color: colors.star }]}>★</Text>
                  </Text>
                </Text>
              ) : (
                <Text variant="caption" color="#4f5a54" style={{ textAlign }}>
                  {lessonMeta(lesson)}
                </Text>
              )}
              {result && (
                <View style={styles.repeat}>
                  <Text variant="caption" style={{ fontFamily: 'Onest_600SemiBold' }}>
                    {result === 3 ? 'Повторити' : 'Покращити'}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function TrophyHex() {
  return (
    <View>
      <Svg width={48} height={48} viewBox="0 0 32 32">
        <Polygon points="9,3.5 23,3.5 30,16 23,28.5 9,28.5 2,16" fill="#2a332e" stroke={colors.accent} strokeWidth={1.5} />
      </Svg>
      <View style={styles.trophyIcon}>
        <Icon name="trophy" size={22} color={colors.accent} strokeWidth={2.2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { position: 'absolute', gap: 2 },
  nowChip: { backgroundColor: colors.ink, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4 },
  repeat: { backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  frog: { position: 'absolute', width: 64, height: 64 },
  trophy: { position: 'absolute' },
  trophyIcon: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
