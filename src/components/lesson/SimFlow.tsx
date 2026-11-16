import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { Simulation } from '@/data/lessons';
import type { Lesson, Module } from '@/data/modules';
import { dayKey, useProgress, type Stars } from '@/store/progress';
import { colors, radius, space } from '@/theme/tokens';
import { useAfterLesson } from './LessonFlow';
import { ArtImage, DataTable, DoneHeader, FeedbackPanel, fmt, Header, LessonFrame, Option, Stats } from './LessonUI';

const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

type Choice = { option: number; wants: number; bank: number };

/** Practice "Тиждень після зарплати": five days, five decisions, a budget for wants and the "банка". */
export function SimFlow({ lesson, module, sim }: { lesson: Lesson; module: Module; sim: Simulation }) {
  const { completeLesson, stars, days } = useProgress();
  const after = useAfterLesson();
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [risk, setRisk] = useState(false);
  const [meta, setMeta] = useState({ first: false, streak: false });
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const last = choices[choices.length - 1];
  const wants = last?.wants ?? sim.wants;
  const bank = last?.bank ?? sim.bank;
  const day = sim.days[choices.length];

  const commit = () => {
    if (picked === null) return;
    const o = day.options[picked];
    const cost = o.cost ?? (o.from === 'bank' ? bank : 0);
    const nextChoices = [...choices, { option: picked, wants: o.from === 'bank' ? wants : wants - cost, bank: o.from === 'bank' ? bank - cost : bank }];
    setChoices(nextChoices);
    setPicked(null);
    setRisk(false);
    if (nextChoices.length === sim.days.length) finish(nextChoices);
  };

  const finish = (all: Choice[]) => {
    const risky = all.filter((c, i) => sim.days[i].options[c.option].risk).length;
    const earned = Math.max(1, 3 - risky) as Stars;
    setMeta({ first: Object.keys(stars).length === 0, streak: !days.includes(dayKey(new Date())) });
    completeLesson(lesson.id, earned);
    setPhase('result');
  };

  const choose = () => {
    if (picked === null) return;
    if (day.options[picked].risk) setRisk(true);
    else commit();
  };

  if (phase === 'intro') {
    return (
      <LessonFrame onClose={close} footer={<Button label="Почати тиждень" onPress={() => setPhase('play')} />}>
        <ArtImage art="sim1-intro" />
        <Header title={sim.title} display sub={sim.text} />
        <DataTable
          title="Твій бюджет"
          rows={[
            ['На бажання до неділі', fmt(sim.wants)],
            ['«Банка»', fmt(sim.bank)],
            ['Мета', 'Не чіпати «банку»'],
          ]}
        />
      </LessonFrame>
    );
  }

  if (phase === 'result') {
    const riskyDays = sim.days.filter((d) => d.options.some((o) => o.risk)).length;
    const safe = choices.filter((c, i) => sim.days[i].options.some((o) => o.risk) && !sim.days[i].options[c.option].risk).length;
    const next = module.lessons[module.lessons.findIndex((x) => x.id === lesson.id) + 1];
    return (
      <LessonFrame
        onClose={after.leave}
        footer={
          <>
            {next ? <Button label="Далі: підсумковий тест" onPress={() => after.open(next.id, meta.first)} /> : null}
            <Button
              label="Пройти ще раз"
              variant="secondary"
              onPress={() => {
                setChoices([]);
                setPhase('intro');
              }}
            />
            <Button label="Завершити на сьогодні" variant="link" onPress={after.leave} />
          </>
        }
      >
        <DoneHeader title="Тиждень пройдено" stars={Math.max(1, 3 - (riskyDays - safe))} streak={meta.streak} />
        <Stats
          items={[
            [fmt(wants), 'лишилося на бажання до неділі'],
            [fmt(bank), bank === sim.bank ? '«банка» ціла' : '«банка» після тижня'],
          ]}
        />
        <DataTable
          title="Твої рішення"
          rows={[
            ['Без ризику', `${safe} з ${riskyDays}`],
            ['Витрачено на бажання', fmt(sim.wants - wants)],
          ]}
        />
      </LessonFrame>
    );
  }

  const o = picked === null ? null : day.options[picked];
  return (
    <LessonFrame
      total={sim.days.length}
      done={choices.length + 1}
      onClose={close}
      footer={<Button label="Обрати" disabled={picked === null} onPress={choose} />}
      feedback={
        risk && o?.risk ? (
          <FeedbackPanel tone="risk" title={o.risk.title} text={o.risk.text}>
            <Button
              label="Обрати інакше"
              onPress={() => {
                setRisk(false);
                setPicked(null);
              }}
            />
            <Button label="Залишити як є" variant="link" onPress={commit} />
          </FeedbackPanel>
        ) : null
      }
    >
      <View style={styles.week}>
        {WEEK.map((d, i) => {
          const passed = i < choices.length;
          const today = i === choices.length;
          return (
            <View key={d} style={{ alignItems: 'center', gap: 4 }}>
              <View style={[styles.dot, passed && styles.dotDone, today && styles.dotToday]}>{passed ? <Icon name="check" size={14} color="#fff" strokeWidth={2.5} /> : null}</View>
              <Text variant="caption" color={passed || today ? colors.textPrimary : colors.textTertiary}>
                {d}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.budget}>
        <Text variant="footnote" color={colors.textSecondary}>
          На бажання до неділі
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 2 }}>
          <Text variant="title3">{fmt(wants)}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            з {sim.wants.toLocaleString('uk-UA').replace(/\s/g, ' ')}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(0, (wants / sim.wants) * 100)}%` }]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space.sm }}>
          <Text variant="body">«Банка»</Text>
          <Text variant="body">{fmt(bank)}</Text>
        </View>
      </View>
      <Header title={day.text} />
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {day.options.map((opt, i) => {
          const cost = opt.cost ?? 0;
          const value = opt.amount ?? (cost ? `−${fmt(cost)}` : '0 грн');
          return <Option key={opt.label} label={opt.label} value={value} state={i === picked ? (risk ? 'wrong' : 'selected') : 'idle'} disabled={risk} onPress={() => setPicked(i)} />;
        })}
      </View>
    </LessonFrame>
  );
}

const styles = StyleSheet.create({
  week: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  dot: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  dotToday: { backgroundColor: colors.surface, borderColor: colors.border },
  dotDone: { backgroundColor: '#c8552a', borderColor: '#c8552a' },
  budget: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.progressTodo, marginTop: space.sm, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.brand },
});
