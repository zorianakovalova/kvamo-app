import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';

import { colors } from '@/theme/tokens';
import { Text } from '../Text';

export type CubeState = 'available' | 'current' | 'done';

/** Sizes of the Path steps in Figma: width, top-face height, side height. */
export const CUBE_SIZE = {
  available: { w: 104, top: 52, side: 44 },
  done: { w: 104, top: 52, side: 44 },
  current: { w: 120, top: 60, side: 46 },
} as const;

const COLORS = {
  available: { left: '#C6E2D3', right: '#D0E8DB', top: ['#EEF8F2', '#EEF8F2'] },
  current: { left: '#C7D64A', right: '#D9E65E', top: ['#F6FBB0', '#E6F46A'] },
  done: { left: '#319556', right: '#3DB769', top: ['#2C894F', '#42CB73'] },
} as const;

// Star outlines from the Figma done-cube (left, centre, right), drawn in a 104×52 top face.
const STARS = [
  'M22.06 24.83L18.77 25.22C17.5 25.37 16.99 26.94 17.93 27.81L20.36 30.06C20.75 30.42 20.92 30.94 20.81 31.46L20.17 34.71C19.92 35.97 21.26 36.94 22.37 36.31L25.27 34.69C25.72 34.44 26.28 34.44 26.73 34.69L29.63 36.31C30.74 36.94 32.08 35.97 31.83 34.71L31.19 31.46C31.08 30.94 31.26 30.42 31.64 30.06L34.07 27.81C35.01 26.94 34.5 25.37 33.23 25.22L29.94 24.83C29.42 24.77 28.97 24.44 28.75 23.97L27.36 20.95C26.83 19.79 25.17 19.79 24.64 20.95L23.25 23.97C23.03 24.44 22.58 24.77 22.06 24.83Z',
  'M47.22 16.66L41.91 17.29C40.64 17.44 40.13 19.01 41.07 19.88L44.99 23.51C45.38 23.86 45.55 24.39 45.45 24.9L44.4 30.14C44.16 31.39 45.49 32.36 46.61 31.74L51.27 29.13C51.72 28.88 52.28 28.88 52.73 29.13L57.39 31.74C58.51 32.36 59.84 31.39 59.6 30.14L58.55 24.9C58.45 24.39 58.62 23.86 59.01 23.51L62.93 19.88C63.87 19.01 63.36 17.44 62.09 17.29L56.78 16.66C56.27 16.6 55.82 16.27 55.6 15.8L53.36 10.95C52.83 9.79 51.17 9.79 50.64 10.95L48.4 15.8C48.18 16.27 47.73 16.6 47.22 16.66Z',
  'M74.06 24.83L70.77 25.22C69.5 25.37 68.99 26.94 69.93 27.81L72.36 30.06C72.75 30.42 72.92 30.94 72.81 31.46L72.17 34.71C71.92 35.97 73.26 36.94 74.37 36.31L77.27 34.69C77.72 34.44 78.28 34.44 78.73 34.69L81.63 36.31C82.74 36.94 84.08 35.97 83.83 34.71L83.19 31.46C83.08 30.94 83.26 30.42 83.64 30.06L86.07 27.81C87.01 26.94 86.5 25.37 85.23 25.22L81.94 24.83C81.42 24.77 80.97 24.44 80.75 23.97L79.36 20.95C78.83 19.79 77.17 19.79 76.64 20.95L75.25 23.97C75.03 24.44 74.58 24.77 74.06 24.83Z',
];
// Earned order: left, centre, right.
const STAR_ORDER = [0, 1, 2];

type Props = { state: CubeState; number?: number; stars?: number };

/** Isometric Path step drawn with the exact Figma face colours. */
export function Cube({ state, number, stars = 0 }: Props) {
  // Unique per instance: a hidden copy of the screen must not own the gradient id.
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { w, top, side } = CUBE_SIZE[state];
  const h = top + side;
  const c = COLORS[state];
  const a = w / 2;
  const b = top / 2;
  const outline = state === 'available';
  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c.top[0]} />
            <Stop offset="1" stopColor={c.top[1]} />
          </LinearGradient>
        </Defs>
        <Polygon points={`0,${b} ${a},${top} ${a},${h} 0,${h - b}`} fill={c.left} stroke={outline ? '#fff' : undefined} strokeWidth={outline ? 1 : 0} strokeLinejoin="round" />
        <Polygon points={`${a},${top} ${w},${b} ${w},${h - b} ${a},${h}`} fill={c.right} stroke={outline ? '#fff' : undefined} strokeWidth={outline ? 1 : 0} strokeLinejoin="round" />
        <Polygon points={`${a},0 ${w},${b} ${a},${top} 0,${b}`} fill={`url(#${id}t)`} stroke={outline ? '#fff' : undefined} strokeWidth={outline ? 1.4 : 0} strokeLinejoin="round" />
        {state === 'done' && <Stars stars={stars} />}
      </Svg>
      {number != null && state !== 'done' && (
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', top: state === 'current' ? 20 : 16 }]} pointerEvents="none">
          <Text variant="numberSmall" style={{ fontSize: 15 }} color={state === 'current' ? colors.brand : colors.textSecondary}>
            {number}
          </Text>
        </View>
      )}
    </View>
  );
}

/** Earned and empty stars as drawn on a done cube's 104×52 top face. */
function Stars({ stars, transform }: { stars: number; transform?: string }) {
  return (
    <G transform={transform}>
      {STAR_ORDER.map((idx, i) => {
        const on = i < stars;
        return (
          <G key={idx}>
            {on && <Path d={STARS[idx]} fill="rgba(20,90,40,0.35)" transform="translate(0 1.5)" />}
            <Path
              d={STARS[idx]}
              fill={on ? colors.star : '#fff'}
              fillOpacity={on ? 1 : 0.3}
              stroke="#fff"
              strokeOpacity={on ? 1 : 0.85}
              strokeWidth={on ? 1.5 : 1.2}
              strokeLinejoin="round"
            />
          </G>
        );
      })}
    </G>
  );
}

export const TEST_SIZE = { w: 151, h: 125.5 };

/** Passed final test: the Figma test step in done-lesson green, with its stars and no white outline. */
export function TestStepDone({ stars }: { stars: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg width={TEST_SIZE.w} height={TEST_SIZE.h} viewBox="0 0 151 125.5">
      <Defs>
        <LinearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={COLORS.done.top[0]} />
          <Stop offset="1" stopColor={COLORS.done.top[1]} />
        </LinearGradient>
      </Defs>
      <Path d="M0.5 59.5L75.5 97V125L0.5 87.5V59.5Z" fill={COLORS.done.left} />
      <Path d="M75.5 97L150.5 59.5V87.5L75.5 125V97Z" fill={COLORS.done.right} />
      <Path d="M75.5 22L150.5 59.5L75.5 97L0.5 59.5L75.5 22Z" fill={`url(#${id}t)`} />
      <Path d="M75.5 3V60.2632" stroke="#7A4A06" strokeWidth={2} strokeLinecap="round" />
      <Path d="M77.1842 4.68421H107.5L100.763 13.1053L107.5 21.5263H77.1842V4.68421Z" fill="#FFC75A" />
      {/* Cube stars scaled to the larger top face and centred on it. */}
      <Stars stars={stars} transform="translate(13.1 31.3) scale(1.2)" />
    </Svg>
  );
}
