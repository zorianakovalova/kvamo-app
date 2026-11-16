import { Image } from 'expo-image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Linking, Modal, Pressable, StyleSheet, TextInput, View, type TextInputInstance, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Material } from '@/data/library';
import { colors, palette, radius, shadow, space, type } from '@/theme/tokens';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';

const PLACEHOLDER = 'rgba(11,16,13,0.32)';

/** Search field: tappable (opens search) or a real input. */
export function SearchField({
  value,
  onChangeText,
  onPress,
  autoFocus,
  style,
}: {
  value?: string;
  onChangeText?: (v: string) => void;
  onPress?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<TextInputInstance>(null);
  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="search" accessibilityLabel="Пошук" style={({ pressed }) => [styles.search, pressed && { opacity: 0.8 }, style]}>
        <Icon name="search" size={20} strokeWidth={1.4} color={colors.textSecondary} />
        <Text variant="subheadline" color={PLACEHOLDER} numberOfLines={1} style={{ flex: 1 }}>
          Пошук: кешбек, ОВДП, подушка…
        </Text>
      </Pressable>
    );
  }
  return (
    <View style={[styles.search, focused && { borderColor: colors.ink }, style]}>
      <Icon name="search" size={20} strokeWidth={1.4} color={colors.textSecondary} />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Кешбек, ОВДП, подушка…"
        placeholderTextColor={PLACEHOLDER}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Пошук"
        style={[type.subheadline, styles.input]}
      />
      {value ? (
        <Pressable onPress={() => { onChangeText?.(''); ref.current?.focus(); }} hitSlop={12} accessibilityRole="button" accessibilityLabel="Очистити" style={styles.clear}>
          <Icon name="close" size={12} strokeWidth={2} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Filter / term / popular-query chip: white, or ink when selected. */
export function FilterChip({ label, selected, onPress, onLayout }: { label: string; selected?: boolean; onPress?: () => void; onLayout?: (x: number) => void }) {
  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout ? (e) => onLayout(e.nativeEvent.layout.x) : undefined}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && { opacity: 0.8 }]}
    >
      <Text variant="subheadlineMedium" color={selected ? colors.textInverse : colors.textPrimary}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionHeader({ title, meta, onPress, style }: { title: string; meta?: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : 'header'} style={[styles.sectionHeader, style]}>
      <Text variant="headline" style={{ flex: 1 }}>
        {title}
      </Text>
      {meta ? (
        <Text variant="subheadline" color={colors.textSecondary}>
          {meta}
        </Text>
      ) : null}
      {onPress ? <Icon name="chevronRight" size={20} strokeWidth={1.5} color={colors.textSecondary} /> : null}
    </Pressable>
  );
}

/** 48 px "Aa" tile for glossary terms. */
export function TermTile() {
  return (
    <View style={[styles.tile, { backgroundColor: palette.gray[50], alignItems: 'center', justifyContent: 'center' }]}>
      <Text variant="numberSmall">Aa</Text>
    </View>
  );
}

type RowProps = {
  title: string;
  subtitle?: string;
  material?: Material;
  trailing?: 'chevron' | 'external' | 'bookmark';
  onPress?: () => void;
  onTrailingPress?: () => void;
  subtitleLines?: number;
};

/** White list row: 48 px tile, title, caption, trailing icon. */
export function MaterialRow({ title, subtitle, material, trailing = 'chevron', onPress, onTrailingPress, subtitleLines = 2 }: RowProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      {material ? <Image source={material.tile} style={styles.tile} contentFit="cover" /> : <TermTile />}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="subheadlineStrong">{title}</Text>
        {subtitle ? (
          <Text variant="caption" color={colors.textSecondary} numberOfLines={subtitleLines}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing === 'bookmark' ? (
        <Pressable onPress={onTrailingPress} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Прибрати із збереженого: ${title}`}>
          <Icon name="bookmark" size={24} color={colors.brand} />
        </Pressable>
      ) : (
        <Icon name={trailing === 'external' ? 'external' : 'chevronRight'} size={24} strokeWidth={1.5} color={colors.textSecondary} />
      )}
    </Pressable>
  );
}

/** Bottom sheet that confirms leaving the app for an official site. */
export function ExternalSiteSheet({ site, onClose }: { site: Material['site'] | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={!!site} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Закрити" />
        {site ? (
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 0) + 40 }]} accessibilityViewIsModal>
            <View style={styles.grabber} />
            <View style={{ gap: space.md, paddingHorizontal: 4, marginTop: space.xl }}>
              <Text variant="title1" accessibilityRole="header">
                Відкрити зовнішній сайт?
              </Text>
              <Text variant="body">Ти переходиш на офіційний сайт {site.name} у браузері. Перевір адресу:</Text>
              <View style={styles.address}>
                <Icon name="compass" size={18} strokeWidth={1.5} />
                <Text variant="subheadlineStrong">{site.host}</Text>
              </View>
            </View>
            <View style={{ marginTop: space.xxl, gap: space.sm }}>
              <Button
                label="Відкрити сайт"
                icon="external"
                onPress={() => {
                  onClose();
                  Linking.openURL(site.url).catch(() => {});
                }}
              />
              <Button label="Залишитись у застосунку" variant="link" onPress={onClose} />
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

/** Short message above the tab bar for screens that arrive in the next update. */
export function useSoonToast(bottom: number): [ReactNode, (text?: string) => void] {
  const [text, setText] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const show = (t = 'Цей матеріал з’явиться в наступному оновленні') => {
    setText(t);
    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setText(null));
    }, 2200);
  };
  const node = text ? (
    <Animated.View pointerEvents="none" style={[styles.toast, { bottom, opacity }]} accessibilityLiveRegion="polite">
      <Text variant="subheadline" color={colors.textInverse} style={{ textAlign: 'center' }}>
        {text}
      </Text>
    </Animated.View>
  ) : null;
  return [node, show];
}

const styles = StyleSheet.create({
  search: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassStrong,
  },
  input: { flex: 1, minWidth: 0, color: colors.textPrimary, padding: 0, height: '100%', outlineStyle: 'none' } as never,
  clear: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(118,138,126,0.12)' },
  chip: {
    height: 36,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassStrong,
  },
  chipOn: { backgroundColor: '#121612', borderColor: '#121612' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: space.xl, paddingRight: space.lg, minHeight: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.sm,
    paddingRight: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassStrong,
  },
  tile: { width: 48, height: 48, borderRadius: radius.md, overflow: 'hidden' },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(11,16,13,0.4)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: space.sm,
    paddingHorizontal: space.lg,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: palette.gray[300] },
  address: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.control,
    backgroundColor: palette.gray[50],
  },
  toast: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    ...shadow.tabBar,
  },
});
