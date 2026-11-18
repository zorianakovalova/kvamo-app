import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';

import { colors } from '@/theme/tokens';
import { COVERS } from './covers';

export type BookState = 'done' | 'current' | 'locked';

/** Back cover / spine and front cover colours per module and state, from the Figma "Lesson book" component. */
const PALETTE: Record<string, Record<BookState, [string, string]>> = {
  m1: { done: ['#2f8553', '#4fb764'], current: ['#c7d64a', '#e6f46a'], locked: ['#93bfa5', '#a3d8ae'] },
  m2: { done: ['#3b74c2', '#5d9de6'], current: ['#5fb4f2', '#8fd3ff'], locked: ['#99b7dd', '#aacbef'] },
  m3: { done: ['#e5a532', '#ecc768'], current: ['#edb520', '#ffd54a'], locked: ['#eecf95', '#f2e0b0'] },
};

const STAR = 'M47.22 16.66L41.91 17.29C40.64 17.44 40.13 19.01 41.07 19.88L44.99 23.51C45.38 23.86 45.55 24.39 45.45 24.9L44.4 30.14C44.16 31.39 45.49 32.36 46.61 31.74L51.27 29.13C51.72 28.88 52.28 28.88 52.73 29.13L57.39 31.74C58.51 32.36 59.84 31.39 59.6 30.14L58.55 24.9C58.45 24.39 58.62 23.86 59.01 23.51L62.93 19.88C63.87 19.01 63.36 17.44 62.09 17.29L56.78 16.66C56.27 16.6 55.82 16.27 55.6 15.8L53.36 10.95C52.83 9.79 51.17 9.79 50.64 10.95L48.4 15.8C48.18 16.27 47.73 16.6 47.22 16.66Z';
/** Left, centre and right star in the 48×21 "Stars" frame: size, x, y. */
const STAR_POS = [
  [14, 1, 6],
  [18, 15, 0],
  [14, 33, 6],
] as const;

/** Status badges exported from Figma (34 px circle with a 3 px outside stroke, so 40 px). */
const ring = (fill: string, stroke: string) =>
  `<rect x="1.5" y="1.5" width="37" height="37" rx="18.5" fill="${fill}"/><rect x="1.5" y="1.5" width="37" height="37" rx="18.5" stroke="${stroke}" stroke-width="3"/>`;
const svg = (body: string) => `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const STATUS: Record<BookState, string> = {
  done: svg(ring('#2F9A52', 'white') + '<path d="M14 20.5L17.875 24.375L26 15.875" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  current: svg(ring('black', 'white') + '<path d="M17.2 15.2L25.2 20L17.2 24.8V15.2Z" fill="white" stroke="white" stroke-width="1.6" stroke-linejoin="round"/>'),
  locked: svg(
    ring('white', '#EDF1EE') +
      '<path d="M16.25 18.75V16.5C16.25 15.5054 16.6451 14.5516 17.3483 13.8483C18.0516 13.1451 19.0054 12.75 20 12.75C20.9946 12.75 21.9484 13.1451 22.6517 13.8483C23.3549 14.5516 23.75 15.5054 23.75 16.5V18.75" stroke="#0B100D" stroke-width="1.4" stroke-linecap="round"/><path d="M23.75 18.25H16.25C14.8693 18.25 13.75 19.3693 13.75 20.75V25.25C13.75 26.6307 14.8693 27.75 16.25 27.75H23.75C25.1307 27.75 26.25 26.6307 26.25 25.25V20.75C26.25 19.3693 25.1307 18.25 23.75 18.25Z" fill="#0B100D"/>',
  ),
};

type Props = {
  moduleId: string;
  index: number;
  state: BookState;
  stars?: number;
  /** 1 = the 130×152 path book; the profile list uses 0.4. */
  scale?: number;
  badge?: boolean;
};

/** Lesson book from Figma: back cover, pages, cover with spine, cover art, stars and a status badge. */
export function LessonBook({ moduleId, index, state, stars = 0, scale = 1, badge = true }: Props) {
  const s = (n: number) => n * scale;
  const [back, cover] = (PALETTE[moduleId] ?? PALETTE.m1)[state];
  const art = (COVERS[moduleId] ?? COVERS.m1)[index];
  return (
    <View style={{ width: s(130), height: s(152) }} pointerEvents="none">
      <View style={{ position: 'absolute', left: s(4), top: s(18), width: s(120), height: s(132), borderRadius: s(14), backgroundColor: back }} />
      <View
        style={{
          position: 'absolute',
          left: s(9),
          top: s(110),
          width: s(111),
          height: s(30),
          backgroundColor: '#fff',
          borderTopLeftRadius: s(4),
          borderTopRightRadius: s(4),
          borderBottomLeftRadius: s(8),
          borderBottomRightRadius: s(8),
        }}
      />
      <View style={{ position: 'absolute', left: 0, top: s(10), width: s(120), height: s(126), borderRadius: s(14), backgroundColor: cover }} />
      <View style={{ position: 'absolute', left: 0, top: s(10), width: s(14), height: s(126), borderTopLeftRadius: s(14), borderBottomLeftRadius: s(14), backgroundColor: back }} />
      <View style={{ position: 'absolute', left: s(19), top: s(20), width: s(96), height: s(86), borderRadius: s(10), overflow: 'hidden' }}>
        {art ? <Image source={art} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
        {state === 'locked' ? <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.58)' }]} /> : null}
      </View>
      {state === 'done' && badge ? (
        <View style={{ position: 'absolute', left: s(40), top: s(110), width: s(48), height: s(21) }}>
          {STAR_POS.map(([size, x, y], i) => (
            <Svg key={i} width={s(size)} height={s(size)} viewBox="39.6 9.6 24.8 23.2" style={{ position: 'absolute', left: s(x), top: s(y) }}>
              <Path d={STAR} fill={i < stars ? colors.star : 'rgba(255,255,255,0.65)'} stroke="rgba(255,255,255,0.65)" strokeWidth={1.2} strokeLinejoin="round" />
            </Svg>
          ))}
        </View>
      ) : null}
      {badge ? <SvgXml xml={STATUS[state]} width={s(40)} height={s(40)} style={{ position: 'absolute', left: s(93), top: s(-3) }} /> : null}
    </View>
  );
}
