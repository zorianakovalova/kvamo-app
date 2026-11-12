import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * Soft green-lime backdrop of the Path screen: a vertical base gradient with
 * five coloured glows alternating left and right.
 */
const GLOWS = [
  { cx: 1.05, cy: 0.0, rx: 520, ry: 420, color: '#7ecfbe', opacity: 0.45 },
  { cx: -0.1, cy: 0.22, rx: 460, ry: 380, color: '#fffcd6', opacity: 0.9 },
  { cx: 1.1, cy: 0.48, rx: 500, ry: 420, color: '#a6e65c', opacity: 0.35 },
  { cx: -0.1, cy: 0.72, rx: 520, ry: 420, color: '#cef0aa', opacity: 0.55 },
  { cx: 1.1, cy: 0.92, rx: 520, ry: 420, color: '#7ecfbe', opacity: 0.35 },
];

export function GradientBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="base" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#eef8e3" />
            <Stop offset="0.3" stopColor="#f6fbe9" />
            <Stop offset="0.6" stopColor="#e9f6dc" />
            <Stop offset="1" stopColor="#f1f9e6" />
          </LinearGradient>
          {GLOWS.map((g, i) => (
            <RadialGradient key={i} id={`glow${i}`}>
              <Stop offset="0" stopColor={g.color} stopOpacity={g.opacity} />
              <Stop offset="0.7" stopColor={g.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#base)" />
        {GLOWS.map((g, i) => (
          <Ellipse key={i} cx={g.cx * width} cy={g.cy * height} rx={g.rx} ry={g.ry} fill={`url(#glow${i})`} />
        ))}
      </Svg>
    </View>
  );
}
