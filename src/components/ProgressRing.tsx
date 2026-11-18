import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/theme/tokens';
import { Text } from './Text';

const SIZE = 44;
const W = 4.84;
const R = (SIZE - W) / 2;
const C = 2 * Math.PI * R;

/** 44 px module ring from Figma: grey track, ink arc for done lessons, "1/8" in Unbounded 16/24. */
export function ProgressRing({ done, total }: { done: number; total: number }) {
  const len = total ? (C * done) / total : 0;
  return (
    <View style={styles.wrap} accessibilityLabel={`Пройдено ${done} з ${total}`}>
      <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.border} strokeWidth={W} fill="none" />
        {done > 0 && (
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.ink} strokeWidth={W} fill="none" strokeDasharray={`${len} ${C}`} />
        )}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text variant="display16">
          {done}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE },
  center: { alignItems: 'center', justifyContent: 'center' },
});
