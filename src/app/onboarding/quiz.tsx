import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { GlassButton } from '@/components/GlassButton';
import { OptionCard } from '@/components/OptionCard';
import { ProgressPill } from '@/components/ProgressPill';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { QUIZ } from '@/data/onboarding';
import { useProfile } from '@/store/profile';
import { colors, space } from '@/theme/tokens';

/** 04–06 Three questions to see what the learner already knows. */
export default function Quiz() {
  const { update } = useProfile();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(QUIZ.map(() => null));
  const q = QUIZ[step];
  const chosen = answers[step];
  const last = step === QUIZ.length - 1;

  const back = () => (step > 0 ? setStep(step - 1) : router.back());
  const next = () => {
    if (chosen == null) return;
    if (!last) return setStep(step + 1);
    update({ quiz: answers as number[] });
    router.push('/onboarding/result');
  };
  const skip = () => {
    update({ quiz: null });
    router.push('/onboarding/result');
  };

  return (
    <Screen
      nav={
        <>
          <GlassButton icon="chevronLeft" label="Назад" onPress={back} />
          <ProgressPill total={QUIZ.length} done={step + 1} />
        </>
      }
      bodyStyle={{ gap: space.lg }}
      footer={
        <>
          {chosen == null && (
            <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              Обери відповідь, щоб продовжити
            </Text>
          )}
          <Button label={last ? 'Дізнатися результат' : 'Далі'} disabled={chosen == null} onPress={next} />
          <Button label="Пропустити тест" variant="link" onPress={skip} />
        </>
      }
    >
      <View style={{ gap: space.md }}>
        <Chip label={`Питання ${step + 1} з ${QUIZ.length}`} size="md" />
        <Text variant="title3" accessibilityRole="header">
          {q.question}
        </Text>
      </View>
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {q.options.map((option, i) => (
          <OptionCard
            key={option}
            label={option}
            selected={chosen === i}
            onPress={() => setAnswers((a) => a.map((v, k) => (k === step ? i : v)))}
          />
        ))}
      </View>
    </Screen>
  );
}
