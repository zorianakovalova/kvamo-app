import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

export type IconName =
  | 'route'
  | 'book'
  | 'user'
  | 'flame'
  | 'wallet'
  | 'coins'
  | 'trend'
  | 'lock'
  | 'bell'
  | 'trophy'
  | 'play'
  | 'close'
  | 'check';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

/** Lucide-style line icons used across the Kvamo designs. */
export function Icon({ name, size = 24, color = colors.textPrimary, strokeWidth = 2 }: Props) {
  if (name === 'play') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M7 4.5v15l12-7.5z" fill={color} />
      </Svg>
    );
  }
  const p = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'route' && (
        <>
          <Circle cx={6} cy={19} r={3} {...p} />
          <Path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" {...p} />
          <Circle cx={18} cy={5} r={3} {...p} />
        </>
      )}
      {name === 'book' && (
        <>
          <Path d="M12 7v14" {...p} />
          <Path
            d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
            {...p}
          />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx={12} cy={8} r={4} {...p} />
          <Path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" {...p} />
        </>
      )}
      {name === 'flame' && (
        <Path d="M12 22c4 0 7-2.7 7-6.6 0-3.4-2.4-5.4-3.6-8.4-.9 1.8-2 2.6-3 2.8C12.6 6.5 11 4 8.6 2.5 9 6.2 5 8.8 5 15.4 5 19.3 8 22 12 22Z" {...p} />
      )}
      {name === 'wallet' && (
        <>
          <Rect x={3} y={6} width={18} height={14} rx={3} {...p} />
          <Path d="M3 10h18M16 15h2" {...p} />
        </>
      )}
      {name === 'coins' && (
        <>
          <Circle cx={9} cy={9} r={6} {...p} />
          <Path d="M15.5 9.5a6 6 0 1 1-6 6" {...p} />
        </>
      )}
      {name === 'trend' && <Path d="m3 17 6-6 4 4 8-8M15 7h6v6" {...p} />}
      {name === 'lock' && (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...p} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...p} />
        </>
      )}
      {name === 'bell' && <Path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2ZM10 21h4" {...p} />}
      {name === 'trophy' && <Path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 21h8M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6 6 18" {...p} />}
      {name === 'check' && <Path d="m5 12 5 5 9-10" {...p} />}
    </Svg>
  );
}
