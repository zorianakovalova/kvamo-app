import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { COVER_ART, COVERS } from './covers';

export type BookState = 'done' | 'current' | 'locked';

/** Back cover / spine and front cover colours per module and state, from the Figma "Lesson book" component. */
const PALETTE: Record<string, Record<BookState, [string, string]>> = {
  m1: {
    done: ['#2f8553', '#4fb764'],
    current: ['#c7d64a', '#e6f46a'],
    locked: ['#93bfa5', '#a3d8ae'],
  },
  m2: {
    done: ['#3b74c2', '#5d9de6'],
    current: ['#5fb4f2', '#8fd3ff'],
    locked: ['#99b7dd', '#aacbef'],
  },
  m3: {
    done: ['#e5a532', '#ecc768'],
    current: ['#edb520', '#ffd54a'],
    locked: ['#eecf95', '#f2e0b0'],
  },
};

/** Stars frame (48×21) exported from Figma: earned stars use the gold gradient, empty ones are white at 38%. */
const STAR_PATHS = [
  'M6.22203 8.81085C6.55793 7.97438 7.74207 7.97438 8.07797 8.81085L8.76522 10.5222C8.90826 10.8784 9.24257 11.1213 9.62554 11.1473L11.4655 11.2721C12.3649 11.333 12.7308 12.4592 12.0391 13.0372L10.6238 14.2196C10.3292 14.4657 10.2015 14.8588 10.2952 15.231L10.7451 17.0195C10.965 17.8937 10.0071 18.5897 9.24364 18.1104L7.68171 17.1298C7.35661 16.9257 6.94339 16.9257 6.61829 17.1298L5.05637 18.1104C4.29295 18.5897 3.33496 17.8937 3.55487 17.0195L4.00481 15.231C4.09846 14.8588 3.97076 14.4657 3.6762 14.2196L2.26094 13.0372C1.56921 12.4592 1.93512 11.333 2.83445 11.2721L4.67446 11.1473C5.05743 11.1213 5.39174 10.8784 5.53478 10.5222L6.22203 8.81085Z',
  'M22.7937 3.0041C23.2303 1.91669 24.7697 1.91669 25.2064 3.0041L26.0494 5.10333C26.2353 5.56639 26.6699 5.88215 27.1678 5.91591L29.4248 6.06894C30.5939 6.14822 31.0696 7.61226 30.1704 8.36359L28.4344 9.81401C28.0514 10.134 27.8854 10.6449 28.0072 11.1288L28.5591 13.3226C28.845 14.459 27.5996 15.3638 26.6071 14.7408L24.6912 13.538C24.2686 13.2726 23.7314 13.2726 23.3088 13.538L21.3929 14.7408C20.4005 15.3638 19.1551 14.459 19.441 13.3226L19.9929 11.1288C20.1146 10.6449 19.9486 10.134 19.5657 9.81401L17.8297 8.36358C16.9304 7.61226 17.4061 6.14822 18.5753 6.06894L20.8323 5.91591C21.3301 5.88215 21.7647 5.56639 21.9507 5.10333L22.7937 3.0041Z',
  'M39.922 8.81085C40.2579 7.97438 41.442 7.97438 41.7779 8.81085L42.4652 10.5222C42.6082 10.8784 42.9425 11.1213 43.3255 11.1473L45.1655 11.2721C46.0648 11.333 46.4307 12.4592 45.739 13.0372L44.3238 14.2196C44.0292 14.4657 43.9015 14.8588 43.9951 15.231L44.4451 17.0195C44.665 17.8937 43.707 18.5897 42.9436 18.1104L41.3817 17.1298C41.0566 16.9257 40.6433 16.9257 40.3182 17.1298L38.7563 18.1104C37.9929 18.5897 37.0349 17.8937 37.2548 17.0195L37.7048 15.231C37.7984 14.8588 37.6707 14.4657 37.3761 14.2196L35.9609 13.0372C35.2692 12.4592 35.6351 11.333 36.5344 11.2721L38.3744 11.1473C38.7574 11.1213 39.0917 10.8784 39.2347 10.5222L39.922 8.81085Z',
];
const GOLD = [
  [7.15, 6.5, 20.8],
  [24, 0, 18.2],
  [40.85, 6.5, 20.8],
];
const starsXml = (n: number) =>
  `<svg width="48" height="21" viewBox="0 0 48 21" fill="none" xmlns="http://www.w3.org/2000/svg">${STAR_PATHS.map((d, i) =>
    i < n ? `<path d="${d}" fill="url(#g${i})" stroke="white" stroke-width="0.9"/>` : `<path d="${d}" fill="white" fill-opacity="0.38" stroke="white" stroke-opacity="0.85" stroke-width="0.65"/>`,
  ).join(
    '',
  )}<defs>${GOLD.map(([x, y1, y2], i) => `<linearGradient id="g${i}" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD95A"/><stop offset="1" stop-color="#F5AE0A"/></linearGradient>`).join('')}</defs></svg>`;

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
  const art = ((state === 'current' ? COVER_ART : COVERS)[moduleId] ?? COVERS.m1)[index];
  return (
    <View style={{ width: s(130), height: s(152) }} pointerEvents="none">
      <View
        style={{
          position: 'absolute',
          left: s(4),
          top: s(18),
          width: s(120),
          height: s(132),
          borderRadius: s(14),
          backgroundColor: back,
        }}
      />
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
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: s(10),
          width: s(120),
          height: s(126),
          borderRadius: s(14),
          backgroundColor: cover,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: s(10),
          width: s(14),
          height: s(126),
          borderTopLeftRadius: s(14),
          borderBottomLeftRadius: s(14),
          backgroundColor: back,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: s(19),
          top: s(20),
          width: s(96),
          height: s(86),
          borderRadius: s(10),
          overflow: 'hidden',
        }}
      >
        {art ? <Image source={art} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
        {state === 'locked' ? <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.58)' }]} /> : null}
      </View>
      {state === 'done' && badge ? <SvgXml xml={starsXml(stars)} width={s(48)} height={s(21)} style={{ position: 'absolute', left: s(40), top: s(110) }} /> : null}
      {badge ? <SvgXml xml={STATUS[state]} width={s(40)} height={s(40)} style={{ position: 'absolute', left: s(93), top: s(-3) }} /> : null}
    </View>
  );
}
