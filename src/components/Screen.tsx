import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from '@/lib/insets';

import { router } from 'expo-router';

import { colors, space } from '@/theme/tokens';
import { GlassButton } from './GlassButton';
import { ProgressPill } from './ProgressPill';
import { PathBackground } from './PathBackground';
import { Text } from './Text';

type Props = {
  background?: 'gradient' | 'tertiary';
  /** Nav bar row (back/close button, progress). */
  nav?: ReactNode;
  children: ReactNode;
  /** Bottom action panel: main button and optional link. */
  footer?: ReactNode;
  scroll?: boolean;
  bodyStyle?: ViewStyle;
  /** Decorations drawn behind the body (illustrations that bleed off the edges). */
  behind?: ReactNode;
  footerStyle?: ViewStyle;
};

/** Onboarding / account screen frame from Figma: status bar, 52 px nav bar, body, footer, home indicator. */
export function Screen({ background = 'tertiary', nav, children, footer, scroll = true, bodyStyle, behind, footerStyle }: Props) {
  const insets = useSafeAreaInsets();
  const Body = scroll ? ScrollView : View;
  return (
    <View style={[styles.screen, background === 'tertiary' && { backgroundColor: colors.backgroundTertiary }]}>
      {background === 'gradient' && <PathBackground />}
      {behind}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ height: insets.top }} />
        {nav ? <View style={styles.nav}>{nav}</View> : null}
        <Body
          style={{ flex: 1 }}
          {...(scroll
            ? { contentContainerStyle: [styles.body, bodyStyle], keyboardShouldPersistTaps: 'handled' as const, showsVerticalScrollIndicator: false }
            : { style: [{ flex: 1 }, styles.body, bodyStyle] })}
        >
          {children}
        </Body>
        {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.lg) }, footerStyle]}>{footer}</View> : <View style={{ height: insets.bottom }} />}
      </KeyboardAvoidingView>
    </View>
  );
}

/** Nav for the onboarding flow: progress pill and a close button that leaves to the welcome screen. */
export function FlowNav({ total, done }: { total: number; done: number }) {
  return (
    <>
      <ProgressPill total={total} done={done} />
      <GlassButton icon="close" label="Закрити" onPress={() => router.dismissTo('/onboarding/welcome')} />
    </>
  );
}

/** Nav with only a close button on the right (save progress, reminders). */
export function CloseNav({ onPress }: { onPress: () => void }) {
  return (
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <GlassButton icon="close" label="Закрити" onPress={onPress} />
    </View>
  );
}

/** Heading (Unbounded 32/40) with a 16/24 description below. */
export function ScreenHeader({ title, description, align = 'left' }: { title: string; description?: string; align?: 'left' | 'center' }) {
  const textAlign = align;
  return (
    <View style={{ gap: space.sm }}>
      <Text variant="screenTitle" accessibilityRole="header" style={{ textAlign }}>
        {title}
      </Text>
      {description ? (
        <Text variant="text16" style={{ textAlign }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  body: { paddingTop: space.xxl, paddingHorizontal: space.xl, paddingBottom: space.lg },
  footer: { paddingTop: space.lg, paddingHorizontal: space.lg, gap: space.sm },
});
