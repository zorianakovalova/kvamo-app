import { StyleSheet, View } from 'react-native';

import { plural } from '@/data/modules';
import { colors } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

export function StreakPill({ days }: { days: number }) {
  return (
    <View style={styles.pill} accessibilityLabel={`Стрик: ${days} ${plural(days, 'день', 'дні', 'днів')} поспіль`}>
      <Icon name="flame" size={20} color={days > 0 ? colors.streakIcon : colors.textTertiary} />
      <Text variant="text14Strong">
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
    height: 38,
    paddingLeft: 12,
    paddingRight: 16,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
});
