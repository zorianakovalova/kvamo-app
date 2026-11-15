import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, space } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

type Props = { label: string; message?: string; error?: string; children: ReactNode };

/** Form field: visible label, the input row, and a help or error message under it. */
export function Field({ label, message, error, children }: Props) {
  return (
    <View style={{ gap: space.sm }}>
      <Text variant="subheadlineStrong" style={styles.pad}>
        {label}
      </Text>
      {children}
      {error ? (
        <View style={[styles.pad, styles.row]} accessibilityLiveRegion="polite">
          <Icon name="alert" size={18} color={colors.danger} />
          <Text variant="subheadline" color={colors.danger} style={{ flex: 1 }}>
            {error}
          </Text>
        </View>
      ) : message ? (
        <Text variant="subheadline" color={colors.textSecondary} style={styles.pad}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

export const inputBox = {
  height: 56,
  borderRadius: 16,
  backgroundColor: colors.glassStrong,
  borderWidth: 1,
  borderColor: colors.borderGlass,
} as const;

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.sm },
  row: { flexDirection: 'row', gap: 4, alignItems: 'flex-start' },
});
