import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Callout } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import type { Art, MonthSim, SimState, SimText } from '@/data/lessons';
import type { Lesson, Module } from '@/data/modules';
import { dayKey, useProgress, type Stars } from '@/store/progress';
import { colors, radius, space } from '@/theme/tokens';
import { useAfterLesson } from './LessonFlow';
import { ArtImage, DataTable, DoneHeader, FeedbackPanel, Header, LessonChip, LessonFrame, Message, Option, Stats } from './LessonUI';

const txt = (t: SimText, s: SimState) => (typeof t === 'function' ? t(s) : t);

/** Month-by-month practice: every decision changes the cushion and the debts. */
export function MonthSimFlow({ lesson, module, sim, art }: { lesson: Lesson; module: Module; sim: MonthSim; art: Art }) {
  const { completeLesson, stars, days } = useProgress();
  const after = useAfterLesson();
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [st, setSt] = useState<SimState>(sim.init);
  const [risky, setRisky] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [meta, setMeta] = useState({ first: false, streak: false });
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const restart = () => {
    setSt(sim.init);
    setRisky(0);
    setIndex(0);
    setPicked(null);
    setPhase('intro');
  };

  if (phase === 'intro') {
    return (
      <LessonFrame onClose={close} footer={<Button label="Почати" onPress={() => setPhase('play')} />}>
        <ArtImage art={art} />
        <Header chips={sim.chips} title={sim.title} display sub={sim.text} />
        {sim.sub ? (
          <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4, marginTop: -space.sm }}>
            {sim.sub}
          </Text>
        ) : null}
        <DataTable rows={sim.intro} />
        {sim.noteStyle === 'note' ? (
          <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
            {sim.note}
          </Text>
        ) : (
          <Message text={sim.note} />
        )}
      </LessonFrame>
    );
  }

  if (phase === 'result') {
    const r = sim.result(st);
    const next = module.lessons[module.lessons.findIndex((x) => x.id === lesson.id) + 1];
    return (
      <LessonFrame
        onClose={after.leave}
        footer={
          <>
            {next ? <Button label={sim.resultCta} onPress={() => after.open(next.id, meta.first)} /> : null}
            <Button label="Пройти ще раз з іншими рішеннями" variant="secondary" onPress={restart} />
            <Button label="Завершити на сьогодні" variant="link" onPress={after.leave} />
          </>
        }
      >
        <DoneHeader title={r.title} stars={Math.max(1, 3 - risky)} streak={meta.streak} />
        <Stats items={r.stats} />
        <DataTable rows={r.rows} />
        <Callout text={r.callout} tone="example" />
      </LessonFrame>
    );
  }

  const step = sim.steps[index];
  const o = picked === null ? null : step.options[picked];
  const last = index === sim.steps.length - 1;

  const card = sim.card(st);

  const apply = () => {
    if (!o) return;
    const nextRisky = risky + (o.good ? 0 : 1);
    setSt(sim.apply(st, o, index));
    setRisky(nextRisky);
    setPicked(null);
    if (!last) return setIndex(index + 1);
    const earned = Math.max(1, 3 - nextRisky) as Stars;
    setMeta({ first: Object.keys(stars).length === 0, streak: !days.includes(dayKey(new Date())) });
    completeLesson(lesson.id, earned);
    setPhase('result');
  };

  return (
    <LessonFrame
      total={sim.steps.length}
      done={index + 1}
      onClose={close}
      feedback={
        o ? (
          <FeedbackPanel tone={o.good ? 'right' : 'risk'} title={o.fb.title} text={o.fb.text}>
            {o.good ? (
              <Button label={last ? 'До результату' : sim.next} onPress={apply} />
            ) : (
              <>
                <Button label="Обрати інакше" onPress={() => setPicked(null)} />
                {o.retry ? null : <Button label="Залишити так" variant="link" onPress={apply} />}
              </>
            )}
          </FeedbackPanel>
        ) : null
      }
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4 }}>
        {sim.steps.map((m, i) =>
          i === index ? (
            <View key={m.label} style={styles.current}>
              <Text variant="subheadline" color={colors.textInverse}>
                {m.label}
              </Text>
            </View>
          ) : (
            <View key={m.label} style={{ opacity: i < index ? 1 : 0.5 }}>
              <LessonChip label={m.label} />
            </View>
          ),
        )}
      </ScrollView>
      <View style={styles.card}>
        <Text variant="footnote" color={colors.textSecondary}>
          {card.label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm, marginTop: 2 }}>
          <Text variant="title3">{card.value}</Text>
          {card.aside ? (
            <Text variant="caption" color={colors.textSecondary} style={{ flexShrink: 1, textAlign: 'right' }}>
              {card.aside}
            </Text>
          ) : null}
        </View>
        {card.progress != null ? (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(100, card.progress * 100)}%` }]} />
          </View>
        ) : null}
        {typeof card.foot === 'string' ? (
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
            {card.foot}
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space.sm }}>
            <Text variant="body">{card.foot[0]}</Text>
            <Text variant="body">{card.foot[1]}</Text>
          </View>
        )}
      </View>
      <Header title={txt(step.text, st)} />
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {step.options.map((opt, i) => (
          <Option key={i} label={txt(opt.label, st)} value={txt(opt.amount, st)} state={i === picked ? (opt.good ? 'right' : 'wrong') : 'idle'} disabled={picked !== null} onPress={() => setPicked(i)} />
        ))}
      </View>
    </LessonFrame>
  );
}

const styles = StyleSheet.create({
  current: { borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 4, backgroundColor: colors.ink, justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.progressTodo, marginTop: space.sm, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.brand },
});
