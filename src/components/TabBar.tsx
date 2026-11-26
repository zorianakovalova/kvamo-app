import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { colors, radius } from '@/theme/tokens';
import { Text } from './Text';

/** Tab icons exported from the Figma tab bar (24 px, 1.2 stroke, 1.6 when active). */
const ICONS: Record<string, string[]> = {
  index: [
    'M6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15',
    'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  ],
  library: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z'],
  profile: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21c0-4 3.6-7 8-7s8 3 8 7'],
};
const LABELS: Record<string, string> = { index: 'Шлях', library: 'Бібліотека', profile: 'Профіль' };

/** Floating glass tab bar from Figma (361×66); the active tab is an ink pill. */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.shadow}>
        <BlurView intensity={30} tint="light" style={styles.bar}>
          {state.routes.map((route, index) => {
            const label = LABELS[route.name];
            if (!label) return null;
            const focused = state.index === index;
            const color = focused ? colors.textInverse : '#2a322d';
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                onPress={() => navigateToTab(route.key)}
                style={[styles.tab, focused && styles.tabActive]}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  {ICONS[route.name].map((d) => (
                    <Path key={d} d={d} stroke={color} strokeWidth={focused ? 1.6 : 1.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  ))}
                </Svg>
                <Text variant={focused ? 'captionStrong' : 'caption'} color={color}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 16 },
  shadow: { width: '100%', maxWidth: 361, borderRadius: radius.pill },
  bar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  tab: { flex: 1, height: 58, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.ink },
});
