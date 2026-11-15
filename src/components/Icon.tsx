import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

export type IconName =
  | 'route'
  | 'book'
  | 'user'
  | 'flame'
  | 'lock'
  | 'bell'
  | 'play'
  | 'close'
  | 'check'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'phone'
  | 'mail'
  | 'clock'
  | 'flag'
  | 'google'
  | 'apple'
  | 'alert';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

/** 24×24 outline icons from the Figma design system (line 2 px unless stated). */
export function Icon({ name, size = 24, color = colors.textPrimary, strokeWidth = 2 }: Props) {
  if (name === 'google') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
        <Path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.1H2.18V16.94C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
        <Path d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z" fill="#FBBC05" />
        <Path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335" />
      </Svg>
    );
  }
  if (name === 'apple') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M16.37 0.43C16.37 1.57 15.88 2.7 15.19 3.51C14.45 4.41 13.2 5.08 12.2 5.08C12.08 5.08 11.97 5.06 11.9 5.05C11.89 4.99 11.86 4.83 11.86 4.66C11.86 3.51 12.43 2.39 13.07 1.68C13.87 0.74 15.21 0.04 16.32 0C16.35 0.13 16.37 0.28 16.37 0.43ZM20.93 16.14C20.9 16.21 20.47 17.72 19.41 19.26C18.47 20.6 17.47 21.97 15.98 21.97C14.46 21.97 14.08 21.09 12.35 21.09C10.65 21.09 10.05 22 8.68 22C7.3 22 6.35 20.74 5.25 19.2C3.96 17.38 2.93 14.57 2.93 11.92C2.93 7.64 5.73 5.37 8.48 5.37C9.93 5.37 11.16 6.32 12.08 6.32C12.95 6.32 14.3 5.31 15.98 5.31C16.59 5.31 18.87 5.37 20.35 7.5C20.22 7.59 17.97 8.87 17.97 11.69C17.97 14.95 20.82 16.11 20.93 16.14Z"
          fill={color}
        />
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
          <Path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" {...p} />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx={12} cy={8} r={4} {...p} />
          <Path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" {...p} />
        </>
      )}
      {name === 'flame' && (
        <Path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.2-3.8 2-5 .4 1.6 1.2 2.4 2 2.7C10.6 8.6 10.8 5.6 12 3Z" {...p} />
      )}
      {name === 'lock' && (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...p} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...p} />
        </>
      )}
      {name === 'bell' && <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" {...p} />}
      {name === 'play' && <Path d="M7 4.5v15l12-7.5z" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6 6 18" {...p} />}
      {name === 'check' && <Path d="M20 6 9 17l-5-5" {...p} />}
      {name === 'chevronLeft' && <Path d="m15 18-6-6 6-6" {...p} />}
      {name === 'chevronRight' && <Path d="m9 18 6-6-6-6" {...p} />}
      {name === 'chevronDown' && <Path d="m6 9 6 6 6-6" {...p} />}
      {name === 'phone' && (
        <>
          <Rect x={7} y={2} width={10} height={20} rx={2} {...p} />
          <Path d="M12 18h.01" {...p} />
        </>
      )}
      {name === 'mail' && (
        <>
          <Rect x={2} y={4} width={20} height={16} rx={2} {...p} />
          <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...p} />
        </>
      )}
      {name === 'clock' && (
        <>
          <Circle cx={12} cy={12} r={10} {...p} />
          <Path d="M12 6v6l4 2" {...p} />
        </>
      )}
      {name === 'flag' && <Path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.33 2q2 0 3.67-1.33a1 1 0 0 1 1 .2V15a1 1 0 0 1-.4.8A6 6 0 0 1 16 17c-3 0-5-2-8-2a6 6 0 0 0-4 1.53" {...p} />}
      {name === 'alert' && (
        <>
          <Circle cx={12} cy={12} r={10} {...p} />
          <Path d="M12 8v4M12 16h.01" {...p} />
        </>
      )}
    </Svg>
  );
}
