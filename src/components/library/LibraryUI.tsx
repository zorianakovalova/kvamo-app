import { Image } from 'expo-image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Linking, Modal, Pressable, StyleSheet, TextInput, View, type TextInputInstance, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { ARTICLES, QUIZZES, SIMULATIONS, STORIES, findMaterial, type Material } from '@/data/library';
import { useProgress } from '@/store/progress';
import { markViewed } from '@/store/saved';
import { colors, palette, radius, space, type } from '@/theme/tokens';
import { Button } from '../Button';
import { GlassButton } from '../GlassButton';
import { Icon } from '../Icon';
import { Text } from '../Text';

const PLACEHOLDER = 'rgba(11,16,13,0.32)';

/** Search field: tappable (opens search) or a real input. */
export function SearchField({
  value,
  onChangeText,
  onPress,
  autoFocus,
  placeholder = 'Кешбек, ОВДП, подушка…',
  style,
}: {
  placeholder?: string;
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
        <Text variant="text14" color={PLACEHOLDER} numberOfLines={1} style={{ flex: 1 }}>
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
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Пошук"
        style={[type.text14, styles.input]}
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

/** Bottom sheet over a scrim: grabber, content, tap outside to close. */
export function BottomSheet({ visible, onClose, children, background = colors.surface }: { visible: boolean; onClose: () => void; children: ReactNode; background?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Закрити" />
        <View style={[styles.sheet, { backgroundColor: background, paddingBottom: insets.bottom + 40 }]} accessibilityViewIsModal>
          <View style={styles.grabber} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

/** Bottom sheet that confirms leaving the app for an official site. */
export function ExternalSiteSheet({ site, onClose }: { site: Material['site'] | null; onClose: () => void }) {
  return (
    <BottomSheet visible={!!site} onClose={onClose}>
      {site ? (
        <>
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
        </>
      ) : null}
    </BottomSheet>
  );
}

/** Opens a material by its kind: article screen, lesson, external site sheet, or a "coming soon" note. */
export function useMaterialOpener(toastBottom: number) {
  const [site, setSite] = useState<Material['site'] | null>(null);
  const [rerun, setRerun] = useState<string | null>(null);
  const [toast, soon] = useSoonToast(toastBottom);
  const { stars } = useProgress();
  const open = (m: Material) => {
    const sim = SIMULATIONS[m.id];
    if (m.site) {
      markViewed(m.id);
      setSite(m.site);
    } else if (m.lessonId) router.push({ pathname: '/lesson/[id]', params: { id: m.lessonId } });
    else if (STORIES[m.id]) router.push({ pathname: '/library/story/[id]', params: { id: m.id } });
    else if (ARTICLES[m.id]) router.push({ pathname: '/library/article/[id]', params: { id: m.id } });
    else if (QUIZZES[m.id]) router.push({ pathname: '/library/quiz/[id]', params: { id: m.id } });
    else if (sim) {
      if (stars[sim.lessonId]) setRerun(m.id);
      else router.push({ pathname: '/library/sim/[id]', params: { id: m.id } });
    } else soon();
  };
  const overlay = (
    <>
      {toast}
      <ExternalSiteSheet site={site} onClose={() => setSite(null)} />
      <SimRerunSheet id={rerun} best={rerun ? stars[SIMULATIONS[rerun].lessonId] : undefined} onClose={() => setRerun(null)} />
    </>
  );
  return { open, soon, overlay };
}

/** Sheet for a simulation that was already passed: reminds the result and offers another run. */
function SimRerunSheet({ id, best, onClose }: { id: string | null; best?: number; onClose: () => void }) {
  const sim = id ? SIMULATIONS[id] : null;
  const m = id ? findMaterial(id) : null;
  const go = () => {
    onClose();
    if (sim) router.push({ pathname: '/lesson/[id]', params: { id: sim.lessonId } });
  };
  return (
    <BottomSheet visible={!!sim} onClose={onClose}>
      {sim && m ? (
        <>
          <View style={{ alignItems: 'center', gap: space.md, marginTop: space.lg, paddingHorizontal: 4 }}>
            <Image source={sim.tile} style={{ width: 120, height: 120, borderRadius: radius.xl }} contentFit="cover" />
            <Text variant="title1" accessibilityRole="header" style={{ textAlign: 'center', marginTop: space.sm }}>
              {m.title}
            </Text>
            <Text variant="body" style={{ textAlign: 'center' }}>
              Симуляцію вже пройдено: найкращий результат – {best ?? 0} з 3 зірок.
            </Text>
          </View>
          <View style={{ marginTop: space.lg, gap: space.sm }}>
            <Button label="Пройти ще раз" onPress={go} />
            <Button label="Подивитися мій результат" variant="link" onPress={go} />
          </View>
        </>
      ) : null}
    </BottomSheet>
  );
}

/** White card with label–value rows (quiz and simulation facts). */
export function FactsTable({ rows }: { rows: [string, string][] }) {
  return (
    <View style={styles.facts}>
      {rows.map(([label, value], i) => (
        <View key={label} style={[styles.factRow, i < rows.length - 1 && styles.factDivider]}>
          <Text variant="body" style={{ flex: 1 }}>
            {label}
          </Text>
          <Text variant="bodyMedium">{value}</Text>
        </View>
      ))}
    </View>
  );
}

/** Small glass chip with plain text (material kind, module name, duration). */
export function InfoChip({ label }: { label: string }) {
  return (
    <View style={styles.infoChip}>
      <Text variant="subheadline">{label}</Text>
    </View>
  );
}

export const openTerm = (id: string) => router.push({ pathname: '/library/term/[id]', params: { id } });

/** Nav bar: round glass button plus a glass title pill (centered title, or title with meta). */
export function NavPill({ icon, label, onPress, title, meta, right }: { icon: 'chevronLeft' | 'close'; label: string; onPress: () => void; title?: string; meta?: string; right?: ReactNode }) {
  return (
    <View style={styles.nav}>
      <GlassButton icon={icon} label={label} onPress={onPress} />
      {title ? (
        <View style={[styles.titlePill, meta ? { justifyContent: 'space-between', paddingHorizontal: space.lg } : null]}>
          <Text variant="headline" accessibilityRole="header" numberOfLines={1} style={{ flexShrink: 1 }}>
            {title}
          </Text>
          {meta ? (
            <Text variant="caption" color={colors.textSecondary}>
              {meta}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {right}
    </View>
  );
}

/** Round glass bookmark button for the nav bar. */
export function BookmarkButton({ saved, onPress }: { saved: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={saved ? 'Прибрати із збереженого' : 'Зберегти'} accessibilityState={{ selected: saved }} hitSlop={6} style={({ pressed }) => [styles.round, pressed && { opacity: 0.7 }]}>
      {saved ? <Icon name="bookmark" size={24} color={colors.ink} /> : <Icon name="bookmarkOutline" size={24} />}
    </Pressable>
  );
}

/** Highlighted block: lime bar for the key point, blue bar for an example. */
export function Callout({ text, tone = 'key' }: { text: string; tone?: 'key' | 'example' }) {
  return (
    <View style={styles.callout}>
      <View style={{ width: 4, backgroundColor: tone === 'key' ? palette.lime : palette.blue }} />
      <Text variant="bodyMedium" style={{ flex: 1, paddingVertical: 14 }}>
        {text}
      </Text>
    </View>
  );
}

/** Glossary list row: term and a short line, no tile. */
export function TermRow({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.termRow, pressed && { opacity: 0.85 }]}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="subheadlineStrong">{title}</Text>
        <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Icon name="chevronRight" size={24} />
    </Pressable>
  );
}

/** "Додано в «Збережене»" toast with a link to the saved list. */
export function useSavedToast(bottom: number): [ReactNode, () => void] {
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const show = () => {
    setShown(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(false), 3000);
  };
  const node = shown ? (
    <View style={[styles.savedToast, { bottom }]} accessibilityLiveRegion="polite">
      <Icon name="bookmarkOutline" size={20} />
      <Text variant="subheadlineMedium" style={{ flex: 1 }}>
        Додано в «Збережене»
      </Text>
      <Pressable onPress={() => { setShown(false); router.push({ pathname: '/library/folder/[id]', params: { id: 'saved' } }); }} hitSlop={10} accessibilityRole="link">
        <Text variant="subheadlineStrong" color={colors.brand}>
          Відкрити
        </Text>
      </Pressable>
    </View>
  ) : null;
  return [node, show];
}

/** Short message above the tab bar for screens that arrive in the next update. */
export function useSoonToast(bottom: number): [ReactNode, (text?: string) => void] {
  const [text, setText] = useState<string | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
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
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  titlePill: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  callout: { flexDirection: 'row', gap: space.md, paddingRight: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden' },
  termRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 66, borderRadius: radius.lg, backgroundColor: colors.surface },
  savedToast: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  facts: { marginHorizontal: space.lg, backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg, paddingVertical: 4 },
  factRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  factDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(11,16,13,0.1)' },
  infoChip: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glass,
  },
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
  },
});
