import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { BottomSheet } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import type { Badge } from '@/data/badges';
import type { Module } from '@/data/modules';
import { Sticker } from '@/components/library/Folders';
import { LessonBook } from '@/components/path/LessonBook';
import { dayKey, useProgress } from '@/store/progress';
import { colors, fonts, palette, radius, space } from '@/theme/tokens';

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

/** Section title (Headline) with an optional meta on the right, inset 4 px like in Figma. */
export function SectionTitle({ title, meta, onPress }: { title: string; meta?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : 'header'} style={styles.section}>
      <Text variant="headline" style={{ flex: 1 }}>
        {title}
      </Text>
      {meta ? (
        <Text variant="subheadline" color={colors.textSecondary}>
          {meta}
        </Text>
      ) : null}
    </Pressable>
  );
}

const STATS = [
  { color: '#d78f50', sticker: 'calendar' },
  { color: '#5ca779', sticker: 'checklist' },
  { color: '#9c7de8', sticker: 'bookmark' },
] as const;

/** Three coloured stat tiles with a sticker peeking over the top (streak, lessons, badges). */
export function StatCards({ items }: { items: { value: string; label: string; onPress?: () => void }[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg }}>
      {items.map((it, i) => (
        <Pressable key={i} onPress={it.onPress} disabled={!it.onPress} accessibilityLabel={`${it.value} ${it.label}`} style={{ flex: 1, height: 124 }}>
          <View style={[styles.stat, { backgroundColor: STATS[i].color }]}>
            <Text variant="number24" color={colors.textInverse} numberOfLines={1} adjustsFontSizeToFit style={it.value.includes(' з ') ? { fontSize: 20, lineHeight: 26 } : undefined}>
              {it.value}
            </Text>
            <Text variant="captionStrong" color={colors.textInverse}>
              {it.label}
            </Text>
          </View>
          <Sticker name={STATS[i].sticker} w={44} h={50} r={8} rotate="6deg" style={{ position: 'absolute', left: 62, top: -4 }} />
        </Pressable>
      ))}
    </View>
  );
}

const SHORT = ['Бюджет', 'Заощадження', 'Інвестування'];

/** "Прогрес навчання": one white row per module with a mini lesson book and a progress bar. */
export function ModuleProgressRow({ module, done, onPress }: { module: Module; done: number; onPress: () => void }) {
  const total = module.lessons.length;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Модуль ${module.number}: пройдено ${done} з ${total}`} style={({ pressed }) => [styles.moduleRow, pressed && { opacity: 0.85 }]}>
      <View style={{ width: 52, height: 62 }}>
        <LessonBook moduleId={module.id} index={Math.min(done, total - 1)} state={done ? 'done' : 'locked'} scale={0.4} badge={false} />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.sm }}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={colors.textSecondary}>
              Модуль {module.number}
            </Text>
            <Text variant="text16Strong" numberOfLines={1}>
              {SHORT[module.number - 1] ?? module.title}
            </Text>
          </View>
          <Text variant="captionStrong">
            {done} з {total}
          </Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${total ? (100 * done) / total : 0}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}

/** "Бейджі" binder: count with a chevron on top, a ringed white card with the badge tiles. */
export function BadgeNotebook({ badges, onPress, onOpenAll }: { badges: Badge[]; onPress: (b: Badge) => void; onOpenAll: () => void }) {
  const { stars } = useProgress();
  const earned = badges.filter((b) => isEarned(b, stars)).length;
  const rows = [badges.slice(0, 3), badges.slice(3, 6)];
  return (
    <View style={styles.notebook}>
      <Pressable onPress={onOpenAll} accessibilityRole="button" accessibilityLabel={`Усі бейджі: ${earned} з ${badges.length}`} style={styles.notebookTop}>
        <Text variant="text16Strong">
          {earned} / {badges.length}
        </Text>
        <Icon name="chevronRight" size={24} strokeWidth={1.4} />
      </Pressable>
      <View style={styles.badgesCard}>
        {rows.map((row, r) => (
          <View key={r} style={{ flexDirection: 'row', gap: space.sm }}>
            {row.map((b) => {
              const on = isEarned(b, stars);
              return (
                <Pressable key={b.id} onPress={() => onPress(b)} accessibilityRole="button" accessibilityLabel={`${b.title}: ${on ? 'отримано' : 'ще не отримано'}`} style={styles.badgeTile}>
                  <Image source={on && b.art ? b.art : b.off} style={{ width: 94, height: 104 }} contentFit="contain" />
                </Pressable>
              );
            })}
          </View>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} pointerEvents="none" style={[styles.ringSlot, { left: `${4.7 + i * 21.6}%` }]}>
            <View style={styles.ringBase} />
            <View style={styles.ring} />
          </View>
        ))}
      </View>
    </View>
  );
}

/** Settings row: white 56 px card, label left, value and chevron right. */
export function SettingsRow({ label, value, onPress, danger, chevron = true }: { label: string; value?: string; onPress: () => void; danger?: boolean; chevron?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
      style={({ pressed }) => [styles.card, styles.row, pressed && { opacity: 0.85 }]}
    >
      <Text variant="text14" color={danger ? colors.error : colors.textPrimary} style={{ flex: 1 }} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text variant="text14Strong" numberOfLines={1} style={{ flexShrink: 1, maxWidth: '62%' }}>
          {value}
        </Text>
      ) : null}
      {chevron && <Icon name="chevronRight" size={24} strokeWidth={1.4} color={colors.textSecondary} />}
    </Pressable>
  );
}

/** iOS switch 51×31 from Figma: on = Status/Positive, off = Fill/Primary. */
export function Switch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      style={[styles.switch, { backgroundColor: value ? colors.positive : 'rgba(120,120,128,0.16)' }]}
    >
      <View style={[styles.knob, { left: value ? 22 : 2 }]} />
    </Pressable>
  );
}

export function ToggleRow({ label, description, value, onChange, style }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void; style?: ViewStyle }) {
  return (
    <View style={[styles.card, styles.toggle, style]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="subheadlineMedium">{label}</Text>
        {description ? (
          <Text variant="footnote" color={colors.textSecondary}>
            {description}
          </Text>
        ) : null}
      </View>
      <Switch value={value} onChange={onChange} label={label} />
    </View>
  );
}

const FLAME =
  'M19.8947 0C24.6316 9.71429 36 15.381 36 29.9524C36 42.0952 27.4737 51 18 51C8.52632 51 0 42.9048 0 30.7619C0 22.6667 5.68421 17 9.47368 11.3333C11.3684 17 14.2105 19.4286 17.0526 20.2381C16.1053 12.9524 16.1053 6.47619 19.8947 0Z';

/** Mon..Sun of the current week as YYYY-MM-DD. */
export function thisWeek() {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return WEEKDAYS.map((_, i) => dayKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}

/** "Цей тиждень" card: a flame with a check on each day that had a lesson. */
export function WeekCard({ onPress }: { onPress: () => void }) {
  const { days } = useProgress();
  const week = thisWeek();
  const done = week.map((d) => days.includes(d));
  const count = done.filter(Boolean).length;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Цей тиждень: ${count} з 7 днів. Деталі стрику`} style={[styles.card, styles.week]}>
      <View style={{ flexDirection: 'row' }}>
        <Text variant="text14Strong" style={{ flex: 1 }}>
          Цей тиждень
        </Text>
        <Text variant="text14" color={colors.textSecondary}>
          {count} з 7 днів
        </Text>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={d} style={styles.weekDay}>
            {done[i] ? (
              <View style={{ width: 36, height: 36 }}>
                <Svg width={36} height={51} viewBox="0 0 36 51" style={{ position: 'absolute', left: 0, bottom: 0 }}>
                  <Path d={FLAME} fill={colors.streakIcon} />
                  <Path d="M23.3333 29L16 36.3333L12.6667 33" stroke="#F7F9F7" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </View>
            ) : (
              <View style={styles.dayCircle} />
            )}
            <Text variant={done[i] ? 'captionStrong' : 'caption'}>{d}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

/** Module progress card: 80 px ring, grey track and a green arc for finished lessons. */
export function ModuleRingCard({ n, done, total, onPress }: { n: number; done: number; total: number; onPress: () => void }) {
  const R = 35.6;
  const C = 2 * Math.PI * R;
  const len = total ? (C * done) / total : 0;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Модуль ${n}: пройдено ${done} з ${total}`} style={[styles.card, styles.ringCard]}>
      <Text variant="caption" color={colors.textSecondary}>
        МОДУЛЬ №{n}
      </Text>
      <View style={{ width: 80, height: 80 }}>
        <Svg width={80} height={80}>
          <Circle cx={40} cy={40} r={36.25} stroke={colors.border} strokeWidth={3.5} fill="none" />
          {done > 0 && (
            <Circle cx={40} cy={40} r={R} stroke="#3db769" strokeWidth={8.8} fill="none" strokeDasharray={`${len} ${C}`} transform="rotate(-90 40 40)" />
          )}
        </Svg>
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={styles.ringText}>
            {done}/{total}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/** Badge art: the illustration once earned, otherwise the grey hexagon with a lock. Figma size 72×80. */
export function BadgeArt({ badge, earned, size = 72 }: { badge: Badge; earned: boolean; size?: number }) {
  const h = (size * 80) / 72;
  return <Image source={earned && badge.art ? badge.art : badge.off} style={{ width: size, height: h }} contentFit="contain" />;
}

export function isEarned(badge: Badge, stars: Record<string, unknown>) {
  return !!badge.module && badge.module.lessons.every((l) => stars[l.id]);
}

/** White card with module badges, three per row. */
export function BadgeGrid({ badges, onPress }: { badges: Badge[]; onPress: (b: Badge) => void }) {
  const { stars } = useProgress();
  const rows = [badges.slice(0, 3), badges.slice(3, 6)];
  return (
    <View style={[styles.card, styles.badgeCard]}>
      {rows.map((row, r) => (
        <View key={r} style={styles.badgeRow}>
          {row.map((b) => {
            const earned = isEarned(b, stars);
            return (
              <Pressable key={b.id} onPress={() => onPress(b)} accessibilityRole="button" accessibilityLabel={`${b.title}: ${earned ? 'отримано' : 'ще не отримано'}`} style={styles.badge}>
                <BadgeArt badge={b} earned={earned} />
                <Text variant="subheadline" color={earned ? colors.textPrimary : colors.textSecondary} style={{ textAlign: 'center' }}>
                  {b.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/** 07 Badge condition sheet: what to do for the badge and the module progress. */
export function BadgeSheet({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  const { stars, doneCount } = useProgress();
  const m = badge?.module;
  const earned = badge ? isEarned(badge, stars) : false;
  const done = m ? doneCount(m) : 0;
  return (
    <BottomSheet visible={!!badge} onClose={onClose}>
      {badge ? (
        <>
          <View style={{ gap: space.md, marginTop: space.xl, paddingHorizontal: 4 }}>
            <BadgeArt badge={badge} earned={earned} size={64} />
            <Text variant="title1" accessibilityRole="header">
              {badge.title}
            </Text>
            <Text variant="body">
              {earned
                ? `Усі ${m!.lessons.length} занять модуля «${m!.title}» пройдено. Бейдж уже в твоєму профілі.`
                : m
                  ? `Пройди всі ${m.lessons.length} занять модуля «${m.title}». Бейдж зʼявиться в профілі одразу після останнього заняття.`
                  : `Модуль «${badge.topic}» ще готується. Бейдж можна буде отримати, щойно він вийде.`}
            </Text>
          </View>
          {m ? (
            <View style={{ gap: space.sm, marginTop: space.lg }}>
              <View style={{ flexDirection: 'row', paddingHorizontal: 4 }}>
                <Text variant="subheadlineStrong" style={{ flex: 1 }}>
                  Прогрес модуля
                </Text>
                <Text variant="subheadline" color={colors.textSecondary}>
                  {done} з {m.lessons.length}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {m.lessons.map((l, i) => (
                  <View key={l.id} style={[styles.segment, { backgroundColor: i < done ? colors.ink : palette.gray[100] }]} />
                ))}
              </View>
            </View>
          ) : null}
          <View style={{ marginTop: space.xxl, gap: space.sm }}>
            {m && !earned ? (
              <Button
                label="Продовжити модуль"
                onPress={() => {
                  onClose();
                  router.navigate('/');
                }}
              />
            ) : null}
            <Button label="Закрити" variant="link" onPress={onClose} />
          </View>
        </>
      ) : null}
    </BottomSheet>
  );
}

/** Confirmation bottom sheet (log out, delete account, reset progress). */
export function ConfirmSheet({
  visible,
  title,
  text,
  action,
  danger,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  title: string;
  text: string;
  action: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={{ gap: space.sm, marginTop: space.xl, paddingHorizontal: 4 }}>
        <Text variant="title1" accessibilityRole="header">
          {title}
        </Text>
        <Text variant="body">{text}</Text>
      </View>
      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <Button label={action} variant={danger ? 'danger' : 'primary'} onPress={onConfirm} />
        <Button label="Скасувати" variant="link" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

/** Simple text sheet for FAQ answers and documents. */
export function InfoSheet({ info, onClose }: { info: { title: string; text: string; action?: { label: string; onPress: () => void } } | null; onClose: () => void }) {
  return (
    <BottomSheet visible={!!info} onClose={onClose}>
      {info ? (
        <>
          <View style={{ gap: space.sm, marginTop: space.xl, paddingHorizontal: 4 }}>
            <Text variant="title1" accessibilityRole="header">
              {info.title}
            </Text>
            <Text variant="body">{info.text}</Text>
          </View>
          <View style={{ marginTop: space.lg, gap: space.sm }}>
            {info.action ? <Button label={info.action.label} onPress={info.action.onPress} /> : null}
            <Button label="Закрити" variant={info.action ? 'link' : 'primary'} onPress={onClose} />
          </View>
        </>
      ) : null}
    </BottomSheet>
  );
}

/** App icon from "14 Про застосунок": 88 px, hero gradient, Unbounded "К". */
export function AppIcon() {
  return (
    <View style={styles.appIcon}>
      <LinearGradient colors={['#f6fbb0', '#e9f57c']} locations={[0.14, 0.86]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Text variant="displayLarge">К</Text>
    </View>
  );
}

/** Stack of rows with 8 px gaps. */
export function Rows({ children }: { children: ReactNode }) {
  return <View style={{ gap: space.sm }}>{children}</View>;
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: 4 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.glassStrong, borderRadius: radius.lg },
  row: { height: 56, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingLeft: space.lg, paddingRight: space.md },
  toggle: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space.md, paddingLeft: space.lg, paddingRight: space.md, paddingVertical: space.md },
  switch: { width: 51, height: 31, borderRadius: 15.5 },
  knob: { position: 'absolute', top: 2, width: 27, height: 27, borderRadius: 13.5, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(11,16,13,0.1)' },
  week: { padding: space.lg, gap: space.md },
  weekRow: { height: 72, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  weekDay: { width: 40, alignItems: 'center', gap: 4 },
  dayCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  ringCard: { flex: 1, alignItems: 'center', gap: space.lg, padding: space.lg },
  ringText: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28, color: colors.textPrimary },
  badgeCard: { paddingVertical: space.lg, gap: space.sm },
  badgeRow: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  badge: { flex: 1, alignItems: 'center' },
  lock: { backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  stat: { position: 'absolute', left: 0, right: 0, top: 20, height: 104, borderRadius: 16, padding: 12, justifyContent: 'flex-end' },
  moduleRow: { minHeight: 82, borderRadius: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, paddingLeft: 12, paddingRight: 16 },
  bar: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3, backgroundColor: '#121612' },
  notebook: { borderRadius: 20, backgroundColor: palette.gray[50] },
  notebookTop: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 12, paddingBottom: 20 },
  badgesCard: { borderRadius: 20, backgroundColor: '#fff', paddingTop: 24, paddingHorizontal: 8, paddingBottom: 8, gap: space.sm, alignItems: 'center' },
  badgeTile: { width: 110, height: 124, borderRadius: 16, backgroundColor: palette.gray[100], paddingLeft: 7, paddingTop: 10 },
  ringSlot: { position: 'absolute', top: -8, width: 16, height: 26, alignItems: 'center' },
  ringBase: { position: 'absolute', top: 12, width: 16, height: 15, borderRadius: 8, backgroundColor: palette.gray[100] },
  ring: { width: 12, height: 22, borderRadius: 8, backgroundColor: palette.blue },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  appIcon: { width: 88, height: 88, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(11,16,13,0.1)', alignItems: 'center', justifyContent: 'center' },
});
