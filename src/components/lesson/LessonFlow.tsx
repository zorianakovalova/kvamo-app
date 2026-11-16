import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Callout } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import type { CheckListStep, ContentStep, LessonContent, PlanStep, QuestionStep, RecordStep, SituationStep, SortStep, Step } from '@/data/lessons';
import { plural, type Lesson, type Module } from '@/data/modules';
import { useProfile } from '@/store/profile';
import { dayKey, useProgress, type Stars as StarCount } from '@/store/progress';
import { colors, radius, space } from '@/theme/tokens';
import { ArtImage, Blocks, ChoiceChips, DoneHeader, FeedbackPanel, fmt, Header, LessonFrame, Option, Split, Stats, UpNextCard, type OptionState } from './LessonUI';

type Next = (mistake?: boolean) => void;
type StepProps<S> = { step: S; total: number; done: number; onNext: Next; onClose: () => void };

/** After the lesson: the first lesson ever and a not yet offered account go through the streak screen and the save-progress offer. */
export function useAfterLesson() {
  const { accountOffered } = useProfile();
  return {
    leave: () => (accountOffered ? router.back() : router.replace('/account/streak')),
    open: (id: string, first: boolean, short?: boolean) =>
      first && !accountOffered ? router.replace('/account/streak') : router.replace({ pathname: '/lesson/[id]', params: short ? { id, short: '1' } : { id } }),
  };
}

const SHORT_KINDS: Step['kind'][] = ['question', 'situation'];

export function LessonFlow({ lesson, module, content, short }: { lesson: Lesson; module: Module; content: LessonContent; short?: boolean }) {
  const { completeLesson, stars, days } = useProgress();
  const steps = short ? content.steps.filter((s) => SHORT_KINDS.includes(s.kind)) : content.steps;
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<{ stars: StarCount; first: boolean; streak: boolean } | null>(null);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const next: Next = (mistake) => {
    const m = mistakes + (mistake ? 1 : 0);
    if (mistake) setMistakes(m);
    if (index < steps.length - 1) return setIndex(index + 1);
    const earned = Math.max(1, 3 - m) as StarCount;
    setResult({ stars: earned, first: Object.keys(stars).length === 0, streak: !days.includes(dayKey(new Date())) });
    completeLesson(lesson.id, earned);
  };

  if (result) return <DoneView lesson={lesson} module={module} content={content} result={result} short={short} />;

  const step = steps[index];
  const props = { total: steps.length, done: index + 1, onNext: next, onClose: close };
  switch (step.kind) {
    case 'content':
      return <ContentView key={index} step={step} {...props} />;
    case 'question':
      return <QuestionView key={index} step={step} {...props} />;
    case 'situation':
      return <SituationView key={index} step={step} {...props} />;
    case 'sort':
      return <SortView key={index} step={step} {...props} />;
    case 'plan':
      return <PlanView key={index} step={step} {...props} />;
    case 'record':
      return <RecordView key={index} step={step} {...props} />;
    case 'checklist':
      return <CheckListView key={index} step={step} {...props} />;
  }
}

function ContentView({ step, total, done, onNext, onClose }: StepProps<ContentStep>) {
  return (
    <LessonFrame
      total={total}
      done={done}
      onClose={onClose}
      footer={
        <>
          <Button label={step.cta ?? 'Далі'} onPress={() => onNext()} />
          {step.link ? <Button label={step.link} variant="link" onPress={() => onNext()} /> : null}
        </>
      }
    >
      {step.chips ? <Header chips={step.chips} count={step.count} /> : null}
      {step.art ? <ArtImage art={step.art} /> : null}
      <Header title={step.title} display={step.display} />
      <Blocks blocks={step.blocks} />
    </LessonFrame>
  );
}

function QuestionView({ step, total, done, onNext, onClose }: StepProps<QuestionStep>) {
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const right = picked === step.correct;
  const retry = checked && !right && !!step.wrong && attempt === 0 && !revealed;
  const mistake = !!step.graded && (attempt > 0 || (checked && !right));

  const state = (i: number): OptionState => {
    if (!checked) return i === picked ? 'selected' : 'idle';
    if (i === picked) return right ? 'right' : 'wrong';
    if (i === step.correct && !retry) return 'right';
    return 'idle';
  };

  let feedback = null;
  if (checked) {
    if (right) {
      feedback = (
        <FeedbackPanel tone="right" title={attempt > 0 ? 'Так, з другої\nспроби!' : step.right.title} text={step.right.text}>
          <Button label="Далі" onPress={() => onNext(mistake)} />
        </FeedbackPanel>
      );
    } else if (retry) {
      feedback = (
        <FeedbackPanel tone="wrong" title={step.wrong!.title} text={step.wrong!.text}>
          <Button
            label="Спробувати ще раз"
            onPress={() => {
              setAttempt(1);
              setPicked(null);
              setChecked(false);
            }}
          />
          <Button label="Показати відповідь" variant="link" onPress={() => setRevealed(true)} />
        </FeedbackPanel>
      );
    } else {
      feedback = (
        <FeedbackPanel tone="wrong" title="Не зовсім" text={`Правильно: «${step.options[step.correct]}».\n${step.right.text}`}>
          <Button label="Далі" onPress={() => onNext(mistake)} />
        </FeedbackPanel>
      );
    }
  }

  return (
    <LessonFrame
      total={total}
      done={done}
      onClose={onClose}
      footer={<Button label="Перевірити" disabled={picked === null} onPress={() => setChecked(true)} />}
      feedback={feedback}
    >
      <Header chips={step.chips} count={step.count} />
      {step.art ? <ArtImage art={step.art} /> : null}
      <Header title={step.q} sub={step.sub} />
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {step.options.map((o, i) => (
          <Option key={o} label={o} state={state(i)} disabled={checked} onPress={() => setPicked(i)} />
        ))}
      </View>
      {step.note ? (
        <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
          {step.note}
        </Text>
      ) : null}
    </LessonFrame>
  );
}

function SituationView({ step, total, done, onNext, onClose }: StepProps<SituationStep>) {
  const [picked, setPicked] = useState<number | null>(null);
  const option = picked === null ? null : step.options[picked];
  let feedback = null;
  if (option?.good) {
    feedback = (
      <FeedbackPanel tone="right" title={option.fb.title} text={option.fb.text}>
        <Button label="Далі" onPress={() => onNext()} />
      </FeedbackPanel>
    );
  } else if (option) {
    feedback = (
      <FeedbackPanel tone="risk" title={option.fb.title} text={option.fb.text}>
        {step.row ? (
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button label="Обрати інакше" onPress={() => setPicked(null)} style={{ flex: 1 }} />
            <Button label="Далі" variant="outline" onPress={() => onNext()} style={{ flex: 1 }} />
          </View>
        ) : (
          <>
            <Button label="Обрати інакше" onPress={() => setPicked(null)} />
            <Button label="Далі" variant="link" onPress={() => onNext()} />
          </>
        )}
      </FeedbackPanel>
    );
  }
  return (
    <LessonFrame total={total} done={done} onClose={onClose} feedback={feedback}>
      <Header chips={step.chips} />
      {step.art ? <ArtImage art={step.art} /> : null}
      <Header title={step.q} />
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {step.options.map((o, i) => (
          <Option key={o.label} label={o.label} state={i === picked ? (o.good ? 'right' : 'wrong') : 'idle'} disabled={picked !== null} onPress={() => setPicked(i)} />
        ))}
      </View>
    </LessonFrame>
  );
}

function SortView({ step, total, done, onNext, onClose }: StepProps<SortStep>) {
  const [placed, setPlaced] = useState<boolean[]>([]);
  const [checked, setChecked] = useState(false);
  const current = step.queue[placed.length];
  const right = placed.every((need, i) => need === step.queue[i].need);
  const basket = (need: boolean) => [
    ...(need ? step.needs : step.wants),
    ...step.queue.filter((_, i) => placed[i] === need).map((q) => [q.label, q.amount] as [string, number]),
  ];
  const put = (need: boolean) => current && setPlaced([...placed, need]);

  const feedback = checked ? (
    right ? (
      <FeedbackPanel tone="right" title={step.right.title} text={step.right.text}>
        <Button label="Далі" onPress={() => onNext()} />
      </FeedbackPanel>
    ) : (
      <FeedbackPanel tone="wrong" title={step.wrong.title} text={step.wrong.text}>
        <Button
          label="Спробувати ще раз"
          onPress={() => {
            setPlaced([]);
            setChecked(false);
          }}
        />
      </FeedbackPanel>
    )
  ) : null;

  return (
    <LessonFrame total={total} done={done} onClose={onClose} footer={<Button label="Перевірити" disabled={!!current} onPress={() => setChecked(true)} />} feedback={feedback}>
      <Header chips={step.chips} />
      <Header title={step.title} />
      <Blocks blocks={[{ t: 'text', text: step.text }]} />
      {current ? <Option label={current.label} value={fmt(current.amount)} state="selected" /> : null}
      {[true, false].map((need) => (
        <Pressable
          key={String(need)}
          onPress={() => put(need)}
          disabled={!current}
          accessibilityRole="button"
          accessibilityLabel={`${need ? 'Потреби' : 'Бажання'}: покласти сюди`}
          style={({ pressed }) => [styles.basket, pressed && { opacity: 0.85 }]}
        >
          <Text variant="footnote" color={colors.textSecondary} style={{ paddingTop: space.lg, paddingBottom: 2 }}>
            {need ? 'Потреби' : 'Бажання'}
          </Text>
          {basket(need).map(([label, amount], i, all) => (
            <View key={label} style={[styles.basketRow, i < all.length - 1 && styles.divider]}>
              <Text variant="body" style={{ flex: 1 }}>
                {label}
              </Text>
              <Text variant="body">{fmt(amount)}</Text>
            </View>
          ))}
        </Pressable>
      ))}
    </LessonFrame>
  );
}

function PlanView({ step, total, done, onNext, onClose }: StepProps<PlanStep>) {
  const [preset, setPreset] = useState(0);
  const p = step.presets[preset];
  const labels = ['Потреби', 'Бажання', 'Заощадження'];
  return (
    <LessonFrame total={total} done={done} onClose={onClose} footer={<Button label={step.cta} onPress={() => onNext()} />}>
      <Header chips={step.chips} />
      <Header title={step.title} />
      <ChoiceChips label="Пропорції" items={step.presets.map((x) => x.join('/'))} value={preset} onChange={setPreset} />
      <Split items={p.map((share, i) => ({ label: `${labels[i]} · ${share}%`, value: fmt((step.income * share) / 100), share }))} />
      <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
        {step.note}
      </Text>
    </LessonFrame>
  );
}

function RecordView({ step, total, done, onNext, onClose }: StepProps<RecordStep>) {
  const [category, setCategory] = useState(1);
  const [kind, setKind] = useState(1);
  return (
    <LessonFrame total={total} done={done} onClose={onClose} footer={<Button label={step.cta} onPress={() => onNext()} />}>
      <Header chips={step.chips} />
      <Header title={step.title} />
      <Stats items={[[step.amount, step.caption]]} />
      <ChoiceChips label="Категорія" items={step.categories} value={category} onChange={setCategory} />
      <ChoiceChips label="Це" items={['Потреба', 'Бажання']} value={kind} onChange={setKind} />
    </LessonFrame>
  );
}

function CheckListView({ step, total, done, onNext, onClose }: StepProps<CheckListStep>) {
  const [checked, setChecked] = useState(step.checked);
  const sum = checked.reduce((s, i) => s + step.items[i][1], 0);
  const n = checked.length;
  const toggle = (i: number) => setChecked(checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i].sort());
  return (
    <LessonFrame
      total={total}
      done={done}
      onClose={onClose}
      footer={<Button label={n ? `Скасувати ${n} ${plural(n, 'підписку', 'підписки', 'підписок')}` : 'Далі'} onPress={() => onNext()} />}
    >
      <Header chips={step.chips} />
      <Header title={step.title} />
      <View style={{ gap: space.sm }}>
        {step.items.map(([label, amount], i) => (
          <Option key={label} checkbox label={label} value={fmt(amount)} state={checked.includes(i) ? 'selected' : 'idle'} onPress={() => toggle(i)} />
        ))}
      </View>
      <Stats items={[[fmt(sum), step.caption]]} />
    </LessonFrame>
  );
}

function DoneView({ lesson, module, content, result, short }: { lesson: Lesson; module: Module; content: LessonContent; result: { stars: StarCount; first: boolean; streak: boolean }; short?: boolean }) {
  const { done } = content;
  const after = useAfterLesson();
  const next = module.lessons[module.lessons.findIndex((x) => x.id === lesson.id) + 1];
  const practice = next && next.kind !== 'lesson' && next.kind !== 'test';
  return (
    <LessonFrame
      onClose={after.leave}
      footer={
        <>
          {next ? (
            <UpNextCard
              chip={done.nextChip ?? (practice ? 'Практика' : 'Наступне заняття')}
              minutes={next.minutes}
              title={done.nextTitle ?? next.title}
              cta={done.nextCta ?? (practice ? 'Розпочати практику' : 'Розпочати урок')}
              onPress={() => after.open(next.id, result.first, short)}
            />
          ) : null}
          {done.short && next ? <Button label="Стислий режим" variant="secondary" onPress={() => after.open(next.id, result.first, true)} /> : null}
          <Button label="Завершити на сьогодні" variant="link" onPress={after.leave} />
        </>
      }
    >
      <DoneHeader title={done.title ?? 'Заняття пройдено'} stars={result.stars} streak={result.streak} />
      <Callout text={done.key} />
      {done.task ? <Callout text={done.task} tone="example" /> : null}
    </LessonFrame>
  );
}

const styles = StyleSheet.create({
  basket: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg, paddingBottom: space.xs },
  basketRow: { flexDirection: 'row', alignItems: 'center', minHeight: 47, paddingVertical: space.md },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(11,16,13,0.1)' },
});
