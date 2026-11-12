import { StyleSheet, View } from 'react-native';

import { plural } from '@/data/modules';
import { colors, radius } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

export function StreakPill({ days }: { days: number }) {
  return (
    <View style={styles.pill} accessibilityLabel={`Серія: ${days} ${plural(days, 'день', 'дні', 'днів')} поспіль`}>
      <Icon name="flame" size={18} color={days > 0 ? colors.streakIcon : colors.textTertiary} />
      <Text variant="label" color={days > 0 ? colors.streakText : colors.textSecondary}>
        {days} {plural(days, 'день', 'дні', 'днів')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
});
