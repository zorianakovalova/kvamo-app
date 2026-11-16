import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GlassButton } from '@/components/GlassButton';
import { Icon, type IconName } from '@/components/Icon';
import { SectionTitle, WEEKDAYS } from '@/components/profile/ProfileUI';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { plural } from '@/data/modules';
import { useProfile } from '@/store/profile';
import { dayKey, useProgress } from '@/store/progress';
import { colors, fonts, radius, space } from '@/theme/tokens';

const MONTHS = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const RULES: [IconName, string][] = [
  ['check', 'Пройди хоча б один урок за день.'],
  ['clock', 'Вистачить 3–5 хвилин, навіть повторення рахується.'],
  ['bell', 'Дні поза розкладом нагадувань стрик не переривають.'],
];

/** 05 Streak details: the count, this month's calendar and how to keep the streak. */
export default function StreakDetails() {
  const { streak, days } = useProgress();
  const { reminders } = useProfile();
  const now = new Date();
  const today = dayKey(now);
  const y = now.getFullYear();
  const m = now.getMonth();
  const total = new Date(y, m + 1, 0).getDate();
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const monthPrefix = `${y}-${String(m + 1).padStart(2, '0')}-`;
  const active = days.filter((d) => d.startsWith(monthPrefix)).length;
  const offDays = reminders?.enabled ? reminders.days : null;

  return (
    <Screen
      background="gradient"
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.xxxl, gap: space.xxl }}
    >
      <View style={styles.hero}>
        <LinearGradient colors={['#f6fbb0', '#e9f57c']} locations={[0.14, 0.86]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="flame" size={24} color={colors.streakIcon} />
          <Text variant="subheadlineStrong">Твій стрик</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: space.sm }} accessibilityLabel={`${streak} ${plural(streak, 'день', 'дні', 'днів')} поспіль`}>
          <Text style={styles.big}>{streak}</Text>
          <Text variant="headline">{plural(streak, 'день', 'дні', 'днів')} поспіль</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="headline">
            {MONTHS[m]} {y}
          </Text>
          <Text variant="footnote" color={colors.textSecondary}>
            {active} {plural(active, 'день', 'дні', 'днів')} із заняттями
          </Text>
        </View>
        <View style={styles.week}>
          {WEEKDAYS.map((d) => (
            <View key={d} style={{ width: 40, alignItems: 'center' }}>
              <Text variant="caption" color={colors.textSecondary}>
                {d}
              </Text>
            </View>
          ))}
        </View>
        {weeks.map((w, wi) => (
          <View key={wi} style={styles.week}>
            {w.map((n, i) => {
              if (!n) return <View key={i} style={styles.cell} />;
              const key = `${monthPrefix}${String(n).padStart(2, '0')}`;
              const isToday = key === today;
              const done = days.includes(key);
              const future = key > today;
              const off = !done && !future && !isToday && offDays && !offDays[i];
              return (
                <View
                  key={i}
                  style={[styles.cell, done && { backgroundColor: colors.accent }, off && { backgroundColor: 'rgba(118,138,126,0.12)' }, isToday && styles.today]}
                  accessibilityLabel={`${n} ${MONTHS[m].toLowerCase()}${done ? ', заняття' : ''}${isToday ? ', сьогодні' : ''}`}
                >
                  <Text
                    variant={done || isToday ? 'subheadlineStrong' : 'subheadline'}
                    color={isToday ? colors.textInverse : done ? colors.textPrimary : future ? 'rgba(11,16,13,0.32)' : colors.textSecondary}
                  >
                    {n}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        <View style={styles.legend}>
          <Legend dot={{ backgroundColor: colors.streakIcon }} label="Заняття" />
          <Legend dot={{ backgroundColor: 'rgba(118,138,126,0.12)' }} label="Вихідний за розкладом" />
          <Legend dot={{ borderWidth: 1.5, borderColor: colors.ink }} label="Сьогодні" />
        </View>
      </View>

      <View style={{ gap: space.md }}>
        <SectionTitle title="Як не втратити стрик" />
        <View style={[styles.card, { gap: space.md }]}>
          {RULES.map(([icon, text]) => (
            <View key={icon} style={{ flexDirection: 'row', gap: space.md }}>
              <Icon name={icon} size={20} strokeWidth={1.5} />
              <Text variant="subheadline" style={{ flex: 1 }}>
                {text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function Legend({ dot, label }: { dot: object; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
      <View style={[{ width: 12, height: 12, borderRadius: 6 }, dot]} />
      <Text variant="footnote" color={colors.textSecondary}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderGlass, padding: space.lg, gap: space.md, overflow: 'hidden' },
  big: { fontFamily: fonts.display, fontSize: 64, lineHeight: 70, letterSpacing: -1.3, color: colors.textPrimary },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.glassStrong, borderRadius: radius.lg, padding: space.lg, gap: space.md },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  today: { backgroundColor: colors.ink, borderWidth: 2, borderColor: colors.ink },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.lg, rowGap: space.sm },
});
