import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/theme/tokens';
import { Text } from './Text';

const SIZE = 56;
const R = 23;
const C = 2 * Math.PI * R;
const GAP = 4;

/** Ring with done lessons in ink and the current lesson as a green segment. */
export function ProgressRing({ done, total }: { done: number; total: number }) {
  const seg = C / total;
  const doneLen = Math.max(seg * done - GAP, 0);
  const curStart = seg * done + (done > 0 ? GAP / 2 : 0);
  return (
    <View style={styles.wrap} accessibilityLabel={`Пройдено ${done} з ${total}`}>
      <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={28} cy={28} r={R} stroke={colors.border} strokeWidth={6} fill="none" />
        {done > 0 && (
          <Circle cx={28} cy={28} r={R} stroke={colors.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${doneLen} ${C}`} />
        )}
        {done < total && (
          <Circle
            cx={28}
            cy={28}
            r={R}
            stroke={colors.progress}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`0 ${curStart} ${seg - GAP} ${C}`}
          />
        )}
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <Text variant="label" style={styles.label}>
          {done}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE },
  label: { fontFamily: 'Unbounded_600SemiBold', textAlign: 'center', lineHeight: SIZE },
});
