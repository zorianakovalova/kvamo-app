import { useId } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * "Screen background / Path gradient" from Figma: a vertical mint → lime gradient with a lime glow at the
 * bottom right, a cream glow on the left and a mint glow at the top right. Glow positions are in a 393×852 frame.
 */
export function PathBackground() {
  const { width, height } = useWindowDimensions();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const sx = width / 393;
  const sy = height / 852;
  const glow = (cx: number, cy: number, rx: number, ry: number) => ({ cx: cx * sx, cy: cy * sy, rx: rx * sx, ry: ry * sy });
  const lime = glow(433, 664.56, 460, 380);
  const cream = glow(-45, 340.8, 420, 360);
  const mint = glow(413, -30, 420, 360);
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#cbe9dd" />
          <Stop offset="0.45" stopColor="#ddf1e5" />
          <Stop offset="1" stopColor="#f0f6d3" />
        </LinearGradient>
        <RadialGradient id={`${id}l`} cx={lime.cx} cy={lime.cy} rx={lime.rx} ry={lime.ry} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#d8f28a" stopOpacity="1" />
          <Stop offset="1" stopColor="#eaf8a8" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}c`} cx={cream.cx} cy={cream.cy} rx={cream.rx} ry={cream.ry} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#fffbe6" stopOpacity="1" />
          <Stop offset="1" stopColor="#eaf8a8" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}m`} cx={mint.cx} cy={mint.cy} rx={mint.rx} ry={mint.ry} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#7ecfbe" stopOpacity="0.45" />
          <Stop offset="1" stopColor="#eaf8a8" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill={`url(#${id}b)`} />
      <Rect width={width} height={height} fill={`url(#${id}l)`} opacity={0.55} />
      <Rect width={width} height={height} fill={`url(#${id}c)`} />
      <Rect width={width} height={height} fill={`url(#${id}m)`} />
    </Svg>
  );
}
