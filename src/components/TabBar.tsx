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

/** Floating white tab bar from Figma; the active tab is an ink pill with a white icon. */
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
              <Icon name={tab.icon} size={24} color={focused ? '#fff' : colors.textPrimary} strokeWidth={focused ? 1.8 : 1.6} />
              <Text variant={focused ? 'captionStrong' : 'caption'} color={focused ? colors.textInverse : colors.textPrimary}>
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
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 16 },
  bar: {
    width: '100%',
    maxWidth: 361,
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    ...shadow.tabBar,
  },
  tab: { flex: 1, height: 61, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: radius.xxxl },
  tabActive: { backgroundColor: colors.ink },
});
