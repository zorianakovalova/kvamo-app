import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from '@/lib/insets';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { Icon } from '@/components/Icon';
import { BottomSheet, Callout } from '@/components/library/LibraryUI';
import { Cube } from '@/components/path/Cube';
import { Text } from '@/components/Text';
import { ART, type Art, type Block } from '@/data/lessons';
import { colors, radius, shadow, space } from '@/theme/tokens';

export const LESSON = {
  rightBg: '#e4f6ec',
  wrongBg: '#fcebe6',
  risk: '#7a4a06',
  message: '#2b6cb0',
  messageBg: '#eaf2fb',
  split: ['#2f9a52', colors.streakIcon, colors.ink],
  lime: '#e9f57c',
};

/** Lesson screen frame from Figma: tertiary background, close button with a segmented progress pill, body, footer and an optional feedback panel. */
export function LessonFrame({
  total,
  done,
  onClose,
  footer,
  feedback,
  children,
}: {
  total?: number;
  done?: number;
  onClose: () => void;
  footer?: ReactNode;
  feedback?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <GlassButton icon="close" label="Закрити" onPress={onClose} />
        {total ? (
          <View style={styles.progressPill} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: done ?? 0 }}>
            {Array.from({ length: total }, (_, i) => (
              <View key={i} style={[styles.segment, i < (done ?? 0) && { backgroundColor: colors.ink }]} />
            ))}
          </View>
        ) : null}
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>{footer}</View> : null}
      {feedback ? (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.scrim} />
          <View style={{ flex: 1 }} />
          {feedback}
        </View>
      ) : null}
    </View>
  );
}

/** Chips row with an optional counter on the right, then the title. */
export function Header({ chips, count, title, display, sub }: { chips?: string[]; count?: string; title?: string; display?: boolean; sub?: string }) {
  return (
    <View style={{ gap: space.lg }}>
      {chips?.length || count ? (
        <View style={styles.chips}>
          {chips?.map((c) => <LessonChip key={c} label={c} />)}
          <View style={{ flex: 1 }} />
          {count ? <LessonChip label={count} /> : null}
        </View>
      ) : null}
      {title ? (
        <View style={{ paddingHorizontal: 4, gap: 4 }}>
          <Text variant={display ? 'displaySmall' : 'title2'} accessibilityRole="header">
            {title}
          </Text>
          {sub ? (
            <Text variant="body" color={colors.textSecondary}>
              {sub}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function LessonChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text variant="subheadline">{label}</Text>
    </View>
  );
}

export function ArtImage({ art }: { art: Art }) {
  const a = ART[art];
  return <Image source={a.src} style={{ width: '100%', aspectRatio: a.ratio, borderRadius: radius.lg }} contentFit="cover" accessibilityIgnoresInvertColors />;
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.t) {
    case 'text':
      return (
        <Text variant="body" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
          {b.text}
        </Text>
      );
    case 'title':
      return <Header title={b.text} />;
    case 'note':
      return (
        <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
          {b.text}
        </Text>
      );
    case 'helper':
      return (
        <View style={styles.helper}>
          <Image source={require('../../../assets/img/lesson/helper.png')} style={styles.helperAvatar} contentFit="cover" />
          <View style={styles.bubble}>
            <Text variant="subheadline">{b.text}</Text>
          </View>
        </View>
      );
    case 'table':
      return <DataTable title={b.title} rows={b.rows} total={b.total} />;
    case 'stats':
      return <Stats items={b.items} dim={b.dim} />;
    case 'callout':
      return <Callout text={b.text} tone={b.tone} />;
    case 'message':
      return <Message text={b.text} />;
    case 'list':
      return (
        <View style={[styles.card, { paddingVertical: space.sm }]}>
          {b.items.map(([title, text], i) => (
            <View key={title} style={styles.listItem}>
              <View style={[styles.num, { backgroundColor: LESSON.lime }]}>
                <Text variant="footnote" style={{ fontWeight: '600' }}>
                  {i + 1}
                </Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="headline">{title}</Text>
                <Text variant="subheadline" color={colors.textSecondary}>
                  {text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      );
    case 'steps':
      return (
        <View style={[styles.card, { paddingVertical: space.sm }]}>
          {b.title ? (
            <Text variant="footnote" color={colors.textSecondary} style={{ paddingTop: space.sm }}>
              {b.title}
            </Text>
          ) : null}
          {b.items.map(([label, value], i) => (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.num, { backgroundColor: 'rgba(118,138,126,0.12)' }]}>
                <Text variant="footnote" style={{ fontWeight: '600' }}>
                  {i + 1}
                </Text>
              </View>
              <Text variant="subheadline" style={{ flex: 1 }}>
                {label}
              </Text>
              {value ? <Text variant="subheadlineStrong">{value}</Text> : null}
            </View>
          ))}
        </View>
      );
    case 'split':
      return <Split items={b.items} />;
    case 'checks':
      return (
        <View style={[styles.card, { paddingVertical: space.sm }]}>
          {b.items.map((it) => (
            <View key={it} style={styles.stepItem}>
              <View style={[styles.num, { backgroundColor: LESSON.rightBg }]}>
                <Icon name="check" size={14} color={colors.brand} strokeWidth={2.5} />
              </View>
              <Text variant="body" style={{ flex: 1 }}>
                {it}
              </Text>
            </View>
          ))}
        </View>
      );
    case 'choose':
      return <Choose items={b.items} />;
    case 'chips':
      return <ChoiceChips items={b.items} value={b.value} onChange={() => {}} />;
    case 'compare':
      return (
        <View style={[styles.card, { paddingVertical: space.sm }]}>
          {[['', ...b.cols] as [string, string, string], ...b.rows].map(([label, a, c], i, all) => (
            <View key={label || 'head'} style={[styles.compareRow, i > 0 && i < all.length - 1 && styles.divider, i === 0 && styles.divider]}>
              <Text variant="caption" color={colors.textSecondary} style={{ flex: 0.8 }}>
                {label}
              </Text>
              {[a, c].map((v, k) => (
                <Text key={k} variant={i === 0 ? 'caption' : 'footnote'} color={colors.textPrimary} style={[{ flex: 1 }, i === 0 && { fontWeight: '600' }]}>
                  {v}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
  }
}

function Choose({ items }: { items: [string, string][] }) {
  const [value, setValue] = useState(0);
  return (
    <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
      {items.map(([label, sub], i) => (
        <Option key={label} label={label} sub={sub} state={i === value ? 'selected' : 'idle'} onPress={() => setValue(i)} />
      ))}
    </View>
  );
}

export function DataTable({ title, rows, total, onRowPress }: { title?: string; rows: [string, string][]; total?: boolean; onRowPress?: (i: number) => void }) {
  return (
    <View style={styles.card}>
      {title ? (
        <Text variant="footnote" color={colors.textSecondary} style={{ paddingTop: space.lg, paddingBottom: 2 }}>
          {title}
        </Text>
      ) : null}
      {rows.map(([label, value], i) => {
        const last = i === rows.length - 1;
        const strong = total && last;
        return (
          <Pressable
            key={label + i}
            disabled={!onRowPress}
            onPress={() => onRowPress?.(i)}
            accessibilityRole={onRowPress ? 'button' : undefined}
            style={({ pressed }) => [styles.row, !last && styles.divider, pressed && { opacity: 0.7 }]}
          >
            <Text variant={strong ? 'headline' : 'body'} style={{ flex: 1 }}>
              {label}
            </Text>
            <Text variant={strong ? 'headline' : 'body'} style={{ textAlign: 'right', maxWidth: '55%' }}>
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Web ignores adjustsFontSizeToFit, so long amounts get a smaller size up front. */
const fit = (v: string) => (v.length > 12 ? { fontSize: Math.floor((40 * 12) / v.length), lineHeight: 46 } : undefined);

export function Stats({ items, dim }: { items: [string, string][]; dim?: number[] }) {
  return (
    <View style={[styles.card, { paddingVertical: space.xs }]}>
      {items.map(([value, caption], i) => (
        <View key={value} style={[{ paddingVertical: space.md, gap: 2 }, i < items.length - 1 && styles.divider]}>
          <Text variant="displayLarge" color={dim?.includes(i) ? colors.textSecondary : colors.textPrimary} adjustsFontSizeToFit numberOfLines={1} style={fit(value)}>
            {value}
          </Text>
          <Text variant="subheadline" color={colors.textSecondary}>
            {caption}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function Message({ text }: { text: string }) {
  return (
    <View style={styles.message}>
      <Text variant="subheadline" color={LESSON.message}>
        {text}
      </Text>
    </View>
  );
}

export function Split({ items }: { items: { label: string; value: string; share: number }[] }) {
  return (
    <View style={[styles.card, { padding: space.lg, gap: space.md }]}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {items.map((it, i) => (
          <View key={it.label} style={{ flex: it.share, height: 8, borderRadius: 4, backgroundColor: LESSON.split[i] }} />
        ))}
      </View>
      {items.map((it, i) => (
        <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: LESSON.split[i] }} />
          <Text variant="subheadline" style={{ flex: 1 }}>
            {it.label}
          </Text>
          <Text variant="subheadlineStrong">{it.value}</Text>
        </View>
      ))}
    </View>
  );
}

export type OptionState = 'idle' | 'selected' | 'right' | 'wrong';

/** Answer option: radio or checkbox, with an optional amount on the right. */
export function Option({
  label,
  sub,
  value,
  state,
  checkbox,
  disabled,
  onPress,
}: {
  label: string;
  sub?: string;
  value?: string;
  state: OptionState;
  checkbox?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const ink = state === 'selected';
  const shape = checkbox ? { borderRadius: 6 } : { borderRadius: 12 };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={checkbox ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: state !== 'idle', disabled }}
      accessibilityLabel={state === 'right' ? `${label}, правильна відповідь` : state === 'wrong' ? `${label}, неправильна відповідь` : label}
      style={({ pressed }) => [styles.option, ink && styles.optionInk, state === 'right' && styles.optionRight, state === 'wrong' && styles.optionWrong, pressed && { opacity: 0.85 }]}
    >
      {state === 'idle' ? (
        <View style={[styles.control, shape, styles.controlIdle]} />
      ) : (
        <View style={[styles.control, shape, { backgroundColor: ink ? colors.surface : state === 'right' ? colors.brand : colors.error }]}>
          <Icon name={state === 'wrong' ? 'close' : 'check'} size={14} color={ink ? colors.ink : '#fff'} strokeWidth={2.5} />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyMedium" color={ink ? colors.textInverse : colors.textPrimary}>
          {label}
        </Text>
        {sub ? (
          <Text variant="subheadline" color={ink ? 'rgba(247,249,247,0.7)' : colors.textSecondary}>
            {sub}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="subheadlineMedium" color={ink ? colors.textInverse : colors.textPrimary}>
          {value}
        </Text>
      ) : null}
    </Pressable>
  );
}

export type Tone = 'right' | 'wrong' | 'risk';

const AVATAR = {
  right: require('../../../assets/img/lib/fb-right.png'),
  wrong: require('../../../assets/img/lib/fb-wrong.png'),
  risk: require('../../../assets/img/lesson/fb-risk.png'),
};

/** Answer feedback panel: Unbounded title in the tone colour, mascot on the top right, actions below. */
export function FeedbackPanel({ tone, title, text, children }: { tone: Tone; title: string; text: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const color = tone === 'right' ? colors.brand : tone === 'wrong' ? colors.error : LESSON.risk;
  return (
    <View style={[styles.feedback, { paddingBottom: insets.bottom + space.sm }]} accessibilityLiveRegion="polite">
      <View style={{ gap: space.sm }}>
        <View style={styles.feedbackHeader}>
          <Text variant="title1" color={color} style={{ flex: 1, paddingRight: 96 }} accessibilityRole="header">
            {title}
          </Text>
          <Image source={AVATAR[tone]} style={styles.avatar} contentFit="cover" />
        </View>
        <Text variant="subheadline" color={colors.textSecondary}>
          {text}
        </Text>
      </View>
      <View style={{ gap: space.sm }}>{children}</View>
    </View>
  );
}

/** Top of a finished lesson: done cube with stars, title and the streak line. */
export function DoneHeader({ title, stars, streak, sub }: { title: string; stars?: number; streak?: boolean; sub?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: space.sm }}>
      <Cube state="done" stars={stars ?? 3} />
      <Text variant="title1" accessibilityRole="header" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {sub ? (
        <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
          {sub}
        </Text>
      ) : null}
      {streak ? <StreakLine /> : null}
    </View>
  );
}

export function StreakLine() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 32 }}>
      <Image source={require('../../../assets/img/flame.png')} style={{ width: 20, height: 20 }} contentFit="contain" />
      <Text variant="subheadline">+1 день до стрика</Text>
    </View>
  );
}

/** Lime "next lesson" card with its start button. */
export function UpNextCard({ chip, minutes, title, cta, onPress }: { chip: string; minutes: number; title: string; cta: string; onPress: () => void }) {
  return (
    <LinearGradient colors={['#f6fbb0', LESSON.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.upNext}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="subheadline" color={colors.textSecondary}>
          {chip}
        </Text>
        <Text variant="subheadline" color={colors.textSecondary}>
          {minutes} хв
        </Text>
      </View>
      <Text variant="numberSmall">{title}</Text>
      <Button label={cta} onPress={onPress} style={{ marginTop: space.sm }} />
    </LinearGradient>
  );
}

/** Pill chips for a single choice (proportions, categories). */
export function ChoiceChips({ items, value, onChange, label, small }: { items: string[]; value: number; onChange: (i: number) => void; label?: string; small?: boolean }) {
  return (
    <View style={{ gap: space.sm }}>
      {label ? (
        <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4, fontWeight: '600' }}>
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }} accessibilityRole="radiogroup">
        {items.map((it, i) => {
          const on = i === value;
          return (
            <Pressable
              key={it}
              onPress={() => onChange(i)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={({ pressed }) => [styles.choice, small && styles.choiceSmall, on && { backgroundColor: colors.ink, borderColor: colors.ink }, pressed && { opacity: 0.85 }]}
            >
              <Text variant={small ? 'footnote' : 'subheadlineMedium'} color={on ? colors.textInverse : colors.textPrimary} style={small ? { fontWeight: '500' } : undefined}>
                {it}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** "Вийти з тесту?" style confirmation: primary keeps going, link leaves. */
export function LeaveSheet({ visible, title, text, stay, leave, onStay, onLeave }: { visible: boolean; title: string; text: string; stay: string; leave: string; onStay: () => void; onLeave: () => void }) {
  return (
    <BottomSheet visible={visible} onClose={onStay}>
      <View style={{ gap: space.sm, marginTop: space.xl, paddingHorizontal: 4 }}>
        <Text variant="title1" accessibilityRole="header">
          {title}
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          {text}
        </Text>
      </View>
      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <Button label={stay} onPress={onStay} />
        <Button label={leave} variant="link" onPress={onLeave} />
      </View>
    </BottomSheet>
  );
}

export const fmt = (n: number) => `${n.toLocaleString('uk-UA').replace(/\s/g, ' ')} грн`;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  progressPill: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  segment: { flex: 1, height: 6, borderRadius: radius.sm, backgroundColor: colors.progressTodo },
  body: { paddingTop: space.xxl, paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.lg },
  footer: { paddingTop: space.lg, paddingHorizontal: space.lg, gap: space.sm },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11,16,13,0.24)' },
  chips: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glass,
  },
  helper: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  helperAvatar: { width: 56, height: 56, borderRadius: 28 },
  bubble: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg, paddingVertical: space.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg, borderWidth: 1, borderColor: colors.glassStrong },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 47, paddingVertical: space.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth * 2, borderBottomColor: 'rgba(11,16,13,0.1)' },
  listItem: { flexDirection: 'row', gap: space.md, paddingVertical: space.md },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  num: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  message: { backgroundColor: LESSON.messageBg, borderWidth: 1, borderColor: LESSON.message, borderRadius: radius.lg, paddingHorizontal: space.md, paddingVertical: space.sm },
  option: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionInk: { backgroundColor: colors.ink, borderColor: colors.ink },
  optionRight: { backgroundColor: LESSON.rightBg, borderColor: colors.brand },
  optionWrong: { backgroundColor: LESSON.wrongBg, borderColor: colors.error },
  control: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  controlIdle: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  feedback: {
    gap: space.xl,
    paddingTop: space.xxl,
    paddingHorizontal: space.xl,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    backgroundColor: colors.surface,
    ...shadow.ink6,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'flex-end', minHeight: 30 },
  avatar: { position: 'absolute', right: 0, bottom: 0, width: 90, height: 90 },
  upNext: { borderRadius: radius.xxl, padding: space.lg, gap: space.sm, borderWidth: 1, borderColor: '#f6fbb0' },
  choiceSmall: { height: 28, paddingHorizontal: space.md },
  compareRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, paddingVertical: space.sm },
  choice: { height: 36, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surface, justifyContent: 'center' },
});
