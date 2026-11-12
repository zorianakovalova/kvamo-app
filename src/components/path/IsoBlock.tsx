import { G, Path, Polygon, Text as SvgText } from 'react-native-svg';

import { fonts } from '@/theme/tokens';

type BlockProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  top: string;
  left: string;
  right: string;
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
};

/** Isometric block: (x, y) is the centre of the top face, t is the side height. */
export function IsoBlock({ x, y, w, h, t, top, left, right, stroke, strokeOpacity = 1, strokeWidth = 1 }: BlockProps) {
  const a = w / 2;
  const b = h / 2;
  return (
    <G>
      <Polygon points={`${x - a},${y} ${x},${y + b} ${x},${y + b + t} ${x - a},${y + t}`} fill={left} />
      <Polygon points={`${x},${y + b} ${x + a},${y} ${x + a},${y + t} ${x},${y + b + t}`} fill={right} />
      <Polygon
        points={`${x},${y - b} ${x + a},${y} ${x},${y + b} ${x - a},${y}`}
        fill={top}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={stroke ? strokeWidth : 0}
      />
    </G>
  );
}

const STAR = 'M0 -10 L2.9 -3.9 L9.5 -3.1 L4.6 1.5 L5.9 8.1 L0 4.8 L-5.9 8.1 L-4.6 1.5 L-9.5 -3.1 L-2.9 -3.9 Z';

function Star({ x, y, s, on, gradientId }: { x: number; y: number; s: number; on: boolean; gradientId: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {on && <Path d={STAR} fill="#1a5c36" fillOpacity={0.35} transform="translate(0 1.6)" />}
      <Path
        d={STAR}
        fill={on ? `url(#${gradientId})` : '#ffffff'}
        fillOpacity={on ? 1 : 0.22}
        stroke="#ffffff"
        strokeOpacity={on ? 1 : 0.85}
        strokeWidth={on ? 1.6 : 1.3}
        strokeLinejoin="round"
      />
    </G>
  );
}

/** Three stars on the top face of a completed cube; the centre one is raised like a podium. */
export function CubeStars({ x, y, stars, gradientId }: { x: number; y: number; stars: number; gradientId: string }) {
  return (
    <G>
      <Star x={x - 23} y={y + 2} s={1.05} on={stars >= 1} gradientId={gradientId} />
      <Star x={x + 23} y={y + 2} s={1.05} on={stars >= 3} gradientId={gradientId} />
      <Star x={x} y={y - 4} s={1.3} on={stars >= 2} gradientId={gradientId} />
    </G>
  );
}

/** Lesson number painted onto the top face, squashed to sit in the isometric plane. */
export function CubeNumber({ x, y, n, color }: { x: number; y: number; n: number; color: string }) {
  return (
    <SvgText
      x={x}
      y={(y + 5) / 0.65}
      textAnchor="middle"
      fontFamily={fonts.display}
      fontSize={15}
      fill={color}
      transform="scale(1 0.65)"
    >
      {n}
    </SvgText>
  );
}
