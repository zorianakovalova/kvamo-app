import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, shadow, space } from '@/theme/tokens';
import { Text } from './Text';

type Props = { visible: boolean; onClose: () => void; title: string; description?: string; children: ReactNode };

/** Centered popup over a dimmed screen. Tap outside to close. */
export function Sheet({ visible, onClose, title, description, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.wrap}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Закрити" />
        <View style={styles.card} accessibilityViewIsModal>
          <View style={{ gap: space.sm, marginBottom: space.lg }}>
            <Text variant="title3" accessibilityRole="header">
              {title}
            </Text>
            {description ? (
              <Text variant="body" color={colors.textSecondary}>
                {description}
              </Text>
            ) : null}
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: space.lg },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(11,16,13,0.4)' },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: radius.xxl,
    padding: space.xl,
    ...shadow.tabBar,
  },
});
