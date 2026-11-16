import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { BottomSheet } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import type { Badge } from '@/data/badges';
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

/** Settings row: white 56 px card, label left, value and chevron right. */
export function SettingsRow({ label, value, onPress, danger, chevron = true }: { label: string; value?: string; onPress: () => void; danger?: boolean; chevron?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
      style={({ pressed }) => [styles.card, styles.row, pressed && { opacity: 0.85 }]}
    >
      <Text variant="subheadlineMedium" color={danger ? colors.error : colors.textPrimary} style={{ flex: 1 }} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text variant="subheadlineStrong" numberOfLines={1} style={{ flexShrink: 1, maxWidth: '62%' }}>
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
        <Text variant="subheadlineStrong" style={{ flex: 1 }}>
          Цей тиждень
        </Text>
        <Text variant="subheadline" color={colors.textSecondary}>
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
  if (earned && badge.art) return <Image source={badge.art} style={{ width: size, height: h }} contentFit="contain" />;
  const lock = (32 * size) / 72;
  return (
    <View style={{ width: size, height: h, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={h} viewBox="0 0 72 80" style={StyleSheet.absoluteFill}>
        <G transform="translate(4.9 4.5)">
          <Path
            d="M26.1 1.98C29.436 0.06 32.772 0.06 36.108 1.98L56.664 13.86C60 15.78 61.668 18.66 61.668 22.5V46.26C61.668 50.1 60 52.98 56.664 54.9L36.108 66.78C32.772 68.7 29.436 68.7 26.1 66.78L5.544 54.9C2.208 52.98 0.54 50.1 0.54 46.26V22.5C0.54 18.66 2.208 15.78 5.544 13.86L26.1 1.98Z"
            fill="#F7F9F7"
            strokeWidth={1.08}
            stroke="#C8D0CB"
          />
        </G>
        <G transform="translate(6.37 5.53)">
          <Path
            d="M24.948 1.35C28.068 -0.45 31.188 -0.45 34.308 1.35L54.576 13.05C57.696 14.85 59.256 17.55 59.256 21.15V44.55C59.256 48.15 57.696 50.85 54.576 52.65L34.308 64.35C31.188 66.15 28.068 66.15 24.948 64.35L4.68 52.65C1.56 50.85 0 48.15 0 44.55V21.15C0 17.55 1.56 14.85 4.68 13.05L24.948 1.35Z"
            fill="#F6F8F6"
          />
        </G>
        <G transform="translate(9.29 9.03)">
          <Path
            d="M23.58 1.44C25.668 0.24 27.756 0.24 29.844 1.44L49.788 12.96C51.852 14.16 52.884 15.96 52.884 18.36V41.4C52.884 43.8 51.852 45.6 49.788 46.8L29.844 58.32C27.756 59.52 25.668 59.52 23.58 58.32L3.636 46.8C1.572 45.6 0.54 43.8 0.54 41.4V18.36C0.54 15.96 1.572 14.16 3.636 12.96L23.58 1.44Z"
            fill="#768A7E"
            fillOpacity={0.12}
            strokeWidth={1.08}
            stroke="#C8D0CB"
          />
        </G>
      </Svg>
      <View style={[styles.lock, { width: lock, height: lock, borderRadius: lock / 2 }]}>
        <Icon name="lock" size={(16 * size) / 72} />
      </View>
    </View>
  );
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
  dayCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
  ringCard: { flex: 1, alignItems: 'center', gap: space.lg, padding: space.lg },
  ringText: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28, color: colors.textPrimary },
  badgeCard: { paddingVertical: space.lg, gap: space.sm },
  badgeRow: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  badge: { flex: 1, alignItems: 'center' },
  lock: { backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  appIcon: { width: 88, height: 88, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(11,16,13,0.1)', alignItems: 'center', justifyContent: 'center' },
});
