import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Callout } from '@/components/library/LibraryUI';
import { TestStepDone } from '@/components/path/Cube';
import { BadgeArt } from '@/components/profile/ProfileUI';
import { Text } from '@/components/Text';
import { BADGES } from '@/data/badges';
import type { Test, TestQuestion } from '@/data/lessons';
import { findLesson, plural, type Lesson, type Module } from '@/data/modules';
import { useProgress, type Stars } from '@/store/progress';
import { colors, space } from '@/theme/tokens';
import { useAfterLesson } from './LessonFlow';
import { ArtImage, DataTable, DoneHeader, FeedbackPanel, Header, LeaveSheet, LessonChip, LessonFrame, Message, Option, type OptionState } from './LessonUI';

type Phase =
  | { name: 'intro' }
  | { name: 'question'; index: number; picked: number[]; checked: boolean }
  | { name: 'result' }
  | { name: 'review'; index: number }
  | { name: 'badge' };

const same = (a: number[], b: number[]) => a.length === b.length && a.every((x) => b.includes(x));
const openLesson = (id: string) => router.push({ pathname: '/lesson/[id]', params: { id } });

/** Final module test from Figma: intro, 10 questions, pass or fail result, mistake review, badge, second attempt. */
export function TestFlow({ lesson, module, test }: { lesson: Lesson; module: Module; test: Test }) {
  const { completeLesson, stars } = useProgress();
  const after = useAfterLesson();
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>({ name: 'intro' });
  const [answers, setAnswers] = useState<number[][]>([]);
  const [leaving, setLeaving] = useState(false);
  const [previous, setPrevious] = useState<number | null>(null);
  const copy = test.copy;
  const questions = test.attempts[attempt % test.attempts.length];
  const total = questions.length;
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const score = answers.filter((a, i) => same(a, questions[i].correct)).length;
  const mistakes = questions.map((q, i) => ({ q, i })).filter(({ i }) => answers[i] && !same(answers[i], questions[i].correct));
  const passed = score >= test.pass;

  const start = () => {
    setAnswers([]);
    setPhase({ name: 'question', index: 0, picked: [], checked: false });
  };

  if (phase.name === 'intro' && copy) {
    const topics = [...questions.reduce((m, q) => m.set(q.topic, (m.get(q.topic) ?? 0) + 1), new Map<string, number>())];
    return (
      <LessonFrame onClose={close} footer={<Button label={attempt > 0 ? `Почати спробу ${attempt + 1}` : 'Почати тест'} onPress={start} />}>
        {attempt === 0 ? <ArtImage art={test.art ?? 'test1-intro'} /> : null}
        <Header chips={attempt > 0 ? [`Спроба ${attempt + 1}`] : copy.introChips} />
        {attempt > 0 ? (
          <>
            <Header title="Нові питання, ті самі теми" sub="Минулих питань тут не буде. Більше уваги темам, де були помилки." />
            <DataTable title="Цього разу" rows={topics.map(([t, n]) => [t, `${n} ${plural(n, 'питання', 'питання', 'питань')}`])} />
            {previous != null ? <Message text={`Минула спроба: ${previous} з ${total}. Зараховується найкращий результат.`} /> : null}
          </>
        ) : (
          <>
            <Header title={copy.introTitle} sub={copy.introText} />
            <DataTable
              rows={[
                ['Питань', String(total)],
                ['Час', `≈ ${test.minutes} хв`],
                ['Щоб отримати бейдж', `від ${test.pass} з ${total}`],
              ]}
            />
            <Message text={copy.introNote} />
          </>
        )}
      </LessonFrame>
    );
  }

  if (phase.name === 'intro') {
    return (
      <LessonFrame onClose={close} footer={<Button label="Почати тест" onPress={start} />}>
        <ArtImage art={test.art ?? 'test1-intro'} />
        {attempt > 0 ? (
          <View style={{ flexDirection: 'row' }}>
            <LessonChip label={`Спроба ${attempt + 1}`} />
          </View>
        ) : null}
        <Header title="Підсумковий тест" display sub={attempt > 0 ? 'Питання інші, тема та сама. Ти вже знаєш, на що звернути увагу.' : undefined} />
        <DataTable
          rows={
            attempt > 0
              ? [
                  ['Питань', String(total)],
                  ['Щоб скласти', `від ${test.pass} з ${total}`],
                ]
              : [
                  ['Питань', String(total)],
                  ['Час', `≈ ${test.minutes} хв`],
                  ['Щоб скласти', `від ${test.pass} з ${total}`],
                ]
          }
        />
        {attempt === 0 ? <Message text="Помилки не страшні: після тесту розберемо кожну." /> : null}
      </LessonFrame>
    );
  }

  if (phase.name === 'question') {
    const q = questions[phase.index];
    const multi = q.correct.length > 1;
    const right = same(phase.picked, q.correct);
    const pick = (i: number) =>
      setPhase({ ...phase, picked: multi ? (phase.picked.includes(i) ? phase.picked.filter((x) => x !== i) : [...phase.picked, i]) : [i] });
    const state = (i: number): OptionState => {
      const on = phase.picked.includes(i);
      if (!phase.checked) return on ? 'selected' : 'idle';
      if (on) return q.correct.includes(i) ? 'right' : 'wrong';
      return q.correct.includes(i) ? 'right' : 'idle';
    };
    const next = () => {
      const all = [...answers, phase.picked];
      setAnswers(all);
      if (phase.index < total - 1) return setPhase({ name: 'question', index: phase.index + 1, picked: [], checked: false });
      const result = all.filter((a, i) => same(a, questions[i].correct)).length;
      setPrevious(result);
      if (result >= test.pass) completeLesson(lesson.id, (result === total ? 3 : result >= total - 2 ? 2 : 1) as Stars);
      setPhase({ name: 'result' });
    };
    return (
      <>
        <LessonFrame
          total={total}
          done={phase.index + 1}
          onClose={() => setLeaving(true)}
          footer={<Button label={copy ? 'Відповісти' : 'Перевірити'} disabled={!phase.picked.length} onPress={() => setPhase({ ...phase, checked: true })} />}
          feedback={
            phase.checked ? (
              <FeedbackPanel tone={right ? 'right' : 'wrong'} title={right ? 'Правильно!' : 'Не зовсім'} text={right ? q.explain : (q.wrongExplain ?? q.explain)}>
                <Button label={copy ? (phase.index === total - 1 ? 'До результату' : 'Наступне питання') : 'Далі'} onPress={next} />
                {!right ? <Button label={`Повторити заняття «${q.topic}»`} variant="link" onPress={() => openLesson(q.lesson)} /> : null}
              </FeedbackPanel>
            ) : null
          }
        >
          <Header chips={[`Питання ${phase.index + 1} з ${total}`]} />
          <Header title={q.q} />
          <View style={{ gap: space.sm }} accessibilityRole={multi ? undefined : 'radiogroup'}>
            {q.options.map((o, i) => (
              <Option key={o} label={o} checkbox={multi} state={state(i)} disabled={phase.checked} onPress={() => pick(i)} />
            ))}
          </View>
        </LessonFrame>
        <LeaveSheet
          visible={leaving}
          title="Вийти з тесту?"
          text="Відповіді цієї спроби не збережуться. Почати знову можна будь-коли."
          stay="Продовжити тест"
          leave="Вийти"
          onStay={() => setLeaving(false)}
          onLeave={() => {
            setLeaving(false);
            close();
          }}
        />
      </>
    );
  }

  if (phase.name === 'review' && copy) {
    const { q, i } = mistakes[phase.index];
    const picked = answers[i];
    return (
      <LessonFrame
        onClose={() => setPhase({ name: 'result' })}
        footer={
          <>
            <Button label={`Повторити заняття «${q.topic}»`} onPress={() => openLesson(q.lesson)} />
            <Button label="Назад до результату" variant="link" onPress={() => setPhase({ name: 'result' })} />
          </>
        }
      >
        <Header chips={['Розбір помилки']} count={`Питання ${i + 1}`} />
        <Header title={q.q} />
        <View style={{ gap: space.sm }}>
          {q.options.map((o, k) => {
            const right = q.correct.includes(k);
            const mine = picked.includes(k);
            if (!right && !mine) return null;
            return <Option key={o} label={o} sub={right ? 'Правильна відповідь' : 'Твоя відповідь'} checkbox={q.correct.length > 1} state={right ? 'right' : 'wrong'} disabled />;
          })}
        </View>
        <Callout text={q.explain} tone="example" />
      </LessonFrame>
    );
  }

  if (phase.name === 'review') {
    const { q, i } = mistakes[phase.index];
    const picked = answers[i];
    const last = phase.index === mistakes.length - 1;
    return (
      <LessonFrame
        total={mistakes.length}
        done={phase.index + 1}
        onClose={() => setPhase({ name: 'result' })}
        footer={
          <>
            <Button label="Далі" onPress={() => setPhase(last ? { name: 'result' } : { name: 'review', index: phase.index + 1 })} />
            <Button label={`Повторити заняття «${q.topic}»`} variant="link" onPress={() => openLesson(q.lesson)} />
          </>
        }
      >
        <Header chips={['Розбір помилок']} count={`${phase.index + 1} з ${mistakes.length}`} />
        <Header title={q.q} />
        <View style={{ gap: space.sm }}>
          {q.options.map((o, k) => (
            <Option key={o} label={o} checkbox={q.correct.length > 1} state={q.correct.includes(k) ? 'right' : picked.includes(k) ? 'wrong' : 'idle'} disabled />
          ))}
        </View>
        <Callout text={q.explain} tone="example" />
      </LessonFrame>
    );
  }

  if (phase.name === 'badge') {
    const badge = BADGES.find((b) => b.module?.id === module.id);
    const lessons = module.lessons.filter((x) => x.kind === 'lesson');
    const home = () => router.dismissTo('/');
    return (
      <LessonFrame
        onClose={home}
        footer={
          <>
            <Button label={copy?.nextCta ?? `До модуля ${module.number + 1}`} onPress={home} />
            <Button label="На головну" variant="link" onPress={home} />
          </>
        }
      >
        <View style={{ alignItems: 'center', gap: space.lg, paddingTop: space.sm }}>
          {badge ? <BadgeArt badge={badge} earned size={160} /> : null}
          <Text variant="subheadline" color={colors.textSecondary} accessibilityRole="header" style={{ textAlign: 'center' }}>
            {copy ? `Модуль ${module.number} «${copy.moduleTitle}» пройдено` : `Модуль ${module.number} пройдено`}
          </Text>
        </View>
        <DataTable
          rows={[
            [copy ? 'Занять' : 'Заняття', `${lessons.filter((x) => stars[x.id]).length} з ${lessons.length}`],
            [copy ? 'У тесті' : 'Підсумковий тест', `${score} з ${total}`],
          ]}
        />
        {test.nextModule ? <Message text={test.nextModule} /> : null}
      </LessonFrame>
    );
  }

  const again = () => {
    setAttempt(attempt + 1);
    setAnswers([]);
    setPhase({ name: 'intro' });
  };

  if (passed && copy) {
    return (
      <LessonFrame
        onClose={() => setPhase({ name: 'badge' })}
        footer={
          <>
            <Button label="До бейджа" onPress={() => setPhase({ name: 'badge' })} />
            <Button label="Пройти ще раз з новими питаннями" variant="secondary" onPress={again} />
          </>
        }
      >
        <DoneHeader title="Тест складено" stars={score === total ? 3 : score >= total - 2 ? 2 : 1} sub={`${score} з ${total} правильних`} />
        <Callout text={`Модуль ${module.number} пройдено. Бейдж уже в профілі.`} />
        {mistakes.length ? (
          <DataTable
            title={`${mistakes.length} ${plural(mistakes.length, 'помилка', 'помилки', 'помилок')}`}
            rows={mistakes.map(({ q, i }) => [`Питання ${i + 1}: ${q.short}`, q.topic])}
            onRowPress={(k) => setPhase({ name: 'review', index: k })}
          />
        ) : null}
      </LessonFrame>
    );
  }

  if (!passed && copy) {
    return (
      <LessonFrame
        onClose={after.leave}
        footer={
          <>
            <Button label="Пройти ще раз" onPress={again} />
            <Button label="Спершу повторити заняття" variant="secondary" onPress={() => openLesson(mistakes[0].q.lesson)} />
          </>
        }
      >
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <TestStepDone />
          <Text variant="title1" accessibilityRole="header" style={{ textAlign: 'center' }}>
            Ще трохи практики
          </Text>
          <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            {score} з {total}. Для бейджа потрібно {test.pass} з {total}.
          </Text>
        </View>
        <Callout text={copy.failCallout} />
        <DataTable title="Що варто повторити" rows={byLesson(mistakes.map((m) => m.q))} />
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: space.md }}>
          <Text variant="subheadline">{copy.failNote}</Text>
        </View>
      </LessonFrame>
    );
  }

  // Result
  if (passed) {
    return (
      <LessonFrame
        onClose={() => setPhase({ name: 'badge' })}
        footer={
          <>
            <Button label="Отримати бейдж" onPress={() => setPhase({ name: 'badge' })} />
            {mistakes.length ? <Button label="Розібрати помилки" variant="secondary" onPress={() => setPhase({ name: 'review', index: 0 })} /> : null}
          </>
        }
      >
        <DoneHeader title="Тест складено" stars={score === total ? 3 : score >= total - 2 ? 2 : 1} sub={`${score} з ${total} правильних`} />
        <Callout text={`Модуль ${module.number} пройдено. Бейдж уже в профілі.`} />
        {mistakes.length ? <DataTable title="Помилки" rows={mistakes.map(({ q, i }) => [`${i + 1}. ${q.short}`, q.topic])} /> : null}
      </LessonFrame>
    );
  }

  return (
    <LessonFrame
      onClose={after.leave}
      footer={
        <>
          {mistakes.length ? <Button label="Повторити помилки" onPress={() => setPhase({ name: 'review', index: 0 })} /> : null}
          <Button
            label="Пройти тест ще раз"
            variant="secondary"
            onPress={() => {
              setAttempt(attempt + 1);
              setAnswers([]);
              setPhase({ name: 'intro' });
            }}
          />
          <Button label="Завершити на сьогодні" variant="link" onPress={after.leave} />
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: space.sm }}>
        <TestStepDone />
        <Text variant="title1" accessibilityRole="header" style={{ textAlign: 'center' }}>
          Ще трохи практики
        </Text>
        <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
          {score} з {total} правильних. Щоб скласти, потрібно {test.pass}.
        </Text>
      </View>
      <DataTable title="Варто повторити" rows={byLesson(mistakes.map((m) => m.q))} />
    </LessonFrame>
  );
}

function byLesson(qs: TestQuestion[]): [string, string][] {
  const counts = new Map<string, number>();
  qs.forEach((q) => counts.set(q.lesson, (counts.get(q.lesson) ?? 0) + 1));
  return [...counts].map(([id, n]) => [findLesson(id)?.title ?? id, `${n} ${plural(n, 'помилка', 'помилки', 'помилок')}`]);
}
