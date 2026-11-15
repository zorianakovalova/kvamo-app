import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { QUIZ } from '@/data/onboarding';
import { useProfile } from '@/store/profile';
import { colors, radius, space } from '@/theme/tokens';

const mascot = require('../../../assets/img/result-mascot.png');

function verdict(score: number | null) {
  if (score === null) return { title: 'Почнемо з основ', text: 'Без тесту теж можна. Почнемо з базових тем, а складніші будуть далі на шляху.' };
  if (score === 3) return { title: 'Сильна база!', text: 'Ти добре орієнтуєшся в основах. Підберемо теми, де можна піти глибше.' };
  if (score === 2) return { title: 'Хороший старт!', text: 'Ти знаєш більше, ніж багато однолітків. Почнемо з тем, де є прогалини.' };
  return { title: 'Є з чого почати', text: 'Саме для цього Квамо. Почнемо з простого і рухатимемось крок за кроком.' };
}

/** 07 Test result: score, verdict and which topics we will study. */
export default function Result() {
  const { quiz } = useProfile();
  const score = quiz ? quiz.filter((a, i) => a === QUIZ[i].correct).length : null;
  const v = verdict(score);

  return (
    <Screen background="gradient" bodyStyle={{ gap: space.lg, paddingTop: space.xl }} footer={<Button label="Налаштувати навчання" onPress={() => router.push('/onboarding/goal')} />}>
      <View style={styles.illustration}>
        <Image source={mascot} style={styles.mascot} contentFit="contain" />
        {score !== null && (
          <View style={styles.score}>
            <Text variant="title1" color={colors.textInverse}>
              {score}/{QUIZ.length}
            </Text>
          </View>
        )}
      </View>

      <View style={{ gap: space.xxl, alignItems: 'center' }}>
        {score !== null && <Chip label={`Правильних відповідей: ${score} з ${QUIZ.length}`} size="md" style={{ alignSelf: 'center' }} />}
        <ScreenHeader title={v.title} description={v.text} align="center" />
      </View>

      {quiz && (
        <View style={styles.topics}>
          {QUIZ.map((q, i) => {
            const known = quiz[i] === q.correct;
            return (
              <View key={q.topic} style={[styles.row, i > 0 && styles.divider]}>
                <Text variant="bodyMedium" style={{ flex: 1 }}>
                  {q.topic}
                </Text>
                <View style={styles.status}>
                  <Icon name={known ? 'check' : 'flag'} size={16} color={known ? colors.brand : colors.textSecondary} />
                  <Text variant="subheadlineMedium" color={known ? colors.brand : colors.textSecondary}>
                    {known ? 'знаєш' : 'вивчимо'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  illustration: { height: 176, alignItems: 'center' },
  mascot: { width: 176, height: 176 },
  score: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: 62,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    transform: [{ rotate: '4deg' }],
  },
  topics: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg },
  row: { height: 48, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.backgroundTertiary },
  status: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
