import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadow } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Шлях', icon: 'route' },
  library: { label: 'Бібліотека', icon: 'book' },
  profile: { label: 'Профіль', icon: 'user' },
};

/** Floating pill tab bar; the active tab is a lime pill. */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={tab.label}
              onPress={() => navigateToTab(route.key)}
              style={[styles.tab, focused && styles.tabActive]}
            >
              <Icon name={tab.icon} size={24} color={focused ? colors.textPrimary : colors.textSecondary} />
              <Text variant="tab" color={focused ? colors.textPrimary : colors.textSecondary} style={focused && { fontFamily: 'Onest_600SemiBold' }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: '#fff',
    ...shadow.tabBar,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2, paddingTop: 8, paddingBottom: 4, borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.accent },
});
