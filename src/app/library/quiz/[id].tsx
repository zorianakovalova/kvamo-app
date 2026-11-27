import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { Icon } from '@/components/Icon';
import { InfoChip } from '@/components/library/LibraryUI';
import { Sticker } from '@/components/library/Folders';
import { Text } from '@/components/Text';
import { plural } from '@/data/library';
import { MINITESTS, type MiniTest } from '@/data/minitests';
import { useSafeAreaInsets } from '@/lib/insets';
import { saveQuizScore, useLibraryState } from '@/store/saved';
import { colors, radius, space } from '@/theme/tokens';

const ERROR = { text: '#b8321a', bg: '#fcebe6' };
const RIGHT_BG = '#e4f6ec';

type Phase = { name: 'intro' } | { name: 'question'; index: number; picked: number | null; checked: boolean; answers: boolean[] } | { name: 'result'; answers: boolean[]; previous?: number };

/** Library mini-test (Figma 35–40): intro, five questions with a check step and a feedback sheet, then the result. */
export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const test = MINITESTS[id];
  const { quiz: scores } = useLibraryState();
  const [phase, setPhase] = useState<Phase>({ name: 'intro' });
  const close = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  if (!test) {
    return (
      <View style={styles.screen}>
        <Text variant="title3" style={{ padding: space.xl, paddingTop: 80 }}>
          Тест не знайдено
        </Text>
      </View>
    );
  }

  const start = () => setPhase({ name: 'question', index: 0, picked: null, checked: false, answers: [] });
  if (phase.name === 'intro') return <Intro test={test} onStart={start} onClose={close} />;
  if (phase.name === 'result') return <Result test={test} answers={phase.answers} previous={phase.previous} onAgain={start} onClose={close} />;

  const q = test.questions[phase.index];
  const last = phase.index === test.questions.length - 1;
  const check = () => phase.picked !== null && setPhase({ ...phase, checked: true, answers: [...phase.answers, phase.picked === q.correct] });
  const next = () => {
    if (!last) return setPhase({ name: 'question', index: phase.index + 1, picked: null, checked: false, answers: phase.answers });
    saveQuizScore(test.id, phase.answers.filter(Boolean).length);
    setPhase({ name: 'result', answers: phase.answers, previous: scores[test.id]?.last });
  };

  return <QuestionView test={test} index={phase.index} picked={phase.picked} checked={phase.checked} onPick={(i) => setPhase({ ...phase, picked: i })} onCheck={check} onNext={next} onClose={close} />;
}

function Intro({ test, onStart, onClose }: { test: MiniTest; onStart: () => void; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={[styles.nav, { justifyContent: 'flex-end' }]}>
        <GlassButton icon="close" label="Закрити" onPress={onClose} />
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Image source={test.hero} style={styles.hero} contentFit="contain" accessibilityIgnoresInvertColors />
        <View style={{ gap: space.sm, paddingHorizontal: 4 }}>
          <Text variant="title1" accessibilityRole="header">
            {test.title}
          </Text>
          <Text variant="text16" color={colors.textSecondary}>
            {test.intro}
          </Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text variant="text14Medium">{test.questions.length} питань</Text>
            <Text variant="text14" color={colors.textSecondary}>
              2 хв
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.chipRow}>
            {test.chips.map((c) => (
              <View key={c} style={styles.topic}>
                <Text variant="text14Medium">{c}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        <Button label="Почати тест" onPress={onStart} />
      </View>
    </View>
  );
}

type QuestionProps = { test: MiniTest; index: number; picked: number | null; checked: boolean; onPick: (i: number) => void; onCheck: () => void; onNext: () => void; onClose: () => void };

function QuestionView({ test, index, picked, checked, onPick, onCheck, onNext, onClose }: QuestionProps) {
  const insets = useSafeAreaInsets();
  const q = test.questions[index];
  const right = picked === q.correct;
  const total = test.questions.length;
  const done = index + (checked ? 1 : 0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <View style={styles.progressPill} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: done }}>
          {test.questions.map((_, i) => (
            <View key={i} style={[styles.segment, i < done && { backgroundColor: colors.brand }]} />
          ))}
        </View>
        <GlassButton icon="close" label="Закрити" onPress={onClose} />
      </View>
      <ScrollView contentContainerStyle={[styles.qBody, { paddingBottom: checked ? 300 : insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.md }}>
          <View style={[styles.chipRow, { justifyContent: 'space-between' }]}>
            <InfoChip label="Тест" />
            <InfoChip label={`Питання ${index + 1} з ${total}`} />
          </View>
          <Text variant="text20Strong" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
            {q.q}
          </Text>
        </View>
        {q.visual ? <Image source={q.visual} style={{ marginHorizontal: 4, aspectRatio: q.ratio }} contentFit="contain" accessibilityIgnoresInvertColors /> : null}
        <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
          {q.options.map((o, i) => {
            const state = checked ? (i === q.correct ? 'right' : i === picked ? 'wrong' : 'idle') : i === picked ? 'selected' : 'idle';
            return <QuizOption key={o} label={o} state={state} disabled={checked} onPress={() => onPick(i)} />;
          })}
        </View>
      </ScrollView>
      {checked ? (
        <View style={[styles.feedback, { paddingBottom: insets.bottom + space.sm }]} accessibilityLiveRegion="polite">
          <View style={{ gap: space.md }}>
            <View style={styles.feedbackHeader}>
              <Text variant="title1" color={right ? colors.brand : ERROR.text} style={{ flex: 1 }}>
                {right ? 'Правильно!' : 'Не зовсім'}
              </Text>
              <Image source={right ? require('../../../../assets/img/lib/fb-right.png') : require('../../../../assets/img/lib/fb-wrong.png')} style={styles.avatar} contentFit="cover" />
            </View>
            <Text variant="text16">{right ? q.explain : `Правильно: «${q.options[q.correct]}»\n${q.explain}`}</Text>
          </View>
          <Button label="Наступне питання" onPress={onNext} />
        </View>
      ) : (
        <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm, position: 'absolute', left: 0, right: 0, bottom: 0 }]}>
          <Button label="Перевірити" disabled={picked === null} onPress={onCheck} />
        </View>
      )}
    </View>
  );
}

function QuizOption({ label, state, disabled, onPress }: { label: string; state: 'idle' | 'selected' | 'right' | 'wrong'; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: state !== 'idle', disabled }}
      accessibilityLabel={state === 'right' ? `${label}, правильна відповідь` : state === 'wrong' ? `${label}, неправильна відповідь` : label}
      style={({ pressed }) => [styles.option, state === 'selected' && styles.optionSelected, state === 'right' && styles.optionRight, state === 'wrong' && styles.optionWrong, pressed && { opacity: 0.85 }]}
    >
      {state === 'idle' ? (
        <View style={styles.radio} />
      ) : state === 'selected' ? (
        <View style={[styles.radio, { borderColor: colors.ink, borderWidth: 7 }]} />
      ) : (
        <View style={[styles.control, { backgroundColor: state === 'right' ? colors.brand : ERROR.text }]}>
          <Icon name={state === 'right' ? 'check' : 'close'} size={14} color="#fff" strokeWidth={2.5} />
        </View>
      )}
      <Text variant="bodyMedium" style={{ flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

function Result({ test, answers, previous, onAgain, onClose }: { test: MiniTest; answers: boolean[]; previous?: number; onAgain: () => void; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const total = test.questions.length;
  const score = answers.filter(Boolean).length;
  const ratio = score / total;
  const mistakes = test.questions.map((q, i) => ({ q, i })).filter(({ i }) => !answers[i]);
  const title = ratio >= 0.8 ? 'Чудовий результат' : ratio >= 0.5 ? 'Непоганий результат' : 'Варто повторити';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={[styles.nav, { justifyContent: 'flex-end' }]}>
        <GlassButton icon="close" label="Закрити" onPress={onClose} />
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: space.sm, paddingBottom: space.lg, gap: space.xl }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', paddingHorizontal: space.xl }}>
          <View style={{ width: 176, height: 176 }}>
            <Image source={require('../../../../assets/img/lib/quiz-result.png')} style={{ width: 176, height: 176 }} contentFit="cover" />
            <View style={styles.score} accessible accessibilityLabel={`Результат ${score} з ${total}`}>
              <Text variant="numberMedium" color={colors.textInverse}>
                {score}/{total}
              </Text>
            </View>
          </View>
          <Text variant="largeTitle" accessibilityRole="header" style={{ textAlign: 'center', marginTop: space.lg }}>
            {title}
          </Text>
          {previous != null ? (
            <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: space.lg }}>
              Минулого разу було {previous}/{total}
            </Text>
          ) : null}
        </View>
        {mistakes.length ? (
          <View style={{ gap: space.sm, paddingHorizontal: space.lg }}>
            <Text variant="headline" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
              {mistakes.length} {plural(mistakes.length, 'помилка', 'помилки', 'помилок')}
            </Text>
            {mistakes.map(({ q, i }) => (
              <View key={i} style={styles.mistake} accessible accessibilityLabel={`Питання ${i + 1}: ${q.topic}. Додано в «Повтори свої помилки»`}>
                <View style={styles.mistakeIcon}>
                  <Sticker name="question-card" w={48} h={48} r={12} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="text16Medium" numberOfLines={1}>{`Питання ${i + 1}: ${q.topic}`}</Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    Додано в «Повтори свої помилки»
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <View style={[styles.footer, { gap: space.sm, paddingBottom: insets.bottom + space.sm }]}>
        <Button label="Пройти ще раз" onPress={onAgain} />
        <Button label="До Бібліотеки" variant="secondary" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  body: { paddingVertical: space.lg, paddingHorizontal: space.lg, gap: space.xl },
  hero: { width: '100%', aspectRatio: 1083 / 395 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: space.lg, gap: space.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.progressTodo },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  topic: { paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.backgroundTertiary },
  footer: { paddingTop: space.lg, paddingHorizontal: space.lg },
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, marginTop: space.sm },
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
  qBody: { paddingTop: space.lg, paddingHorizontal: space.lg, gap: space.lg },
  option: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionSelected: { borderColor: colors.ink, borderWidth: 1.5 },
  optionRight: { backgroundColor: RIGHT_BG, borderColor: colors.brand, borderWidth: 1.5 },
  optionWrong: { backgroundColor: ERROR.bg, borderColor: ERROR.text, borderWidth: 1.5 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  control: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  feedback: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: space.xl,
    paddingTop: space.xxl,
    paddingHorizontal: space.xl,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    backgroundColor: colors.surface,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'flex-end', minHeight: 30 },
  avatar: { position: 'absolute', right: 0, bottom: 0, width: 90, height: 90 },
  mistake: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, borderRadius: radius.lg, backgroundColor: colors.surface },
  mistakeIcon: { width: 48, height: 48 },
  score: { position: 'absolute', left: 136.5, top: 16, width: 88, height: 46, borderRadius: radius.lg, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});
