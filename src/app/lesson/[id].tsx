import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GradientBackground } from '@/components/GradientBackground';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { findLesson, lessonMeta } from '@/data/modules';
import { useProgress, type Stars } from '@/store/progress';
import { colors, space } from '@/theme/tokens';

/**
 * Lesson placeholder. Real lesson cards (theory, questions, simulations) come next;
 * for now the learner can finish with a result so the Path, stars and streak can be tried.
 */
export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { completeLesson, stars } = useProgress();
  const lesson = findLesson(id);

  if (!lesson) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + space.xl }]}>
        <Text variant="title">Заняття не знайдено</Text>
        <Button label="Повернутися на Шлях" onPress={() => router.back()} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  const index = lesson.module.lessons.findIndex((x) => x.id === lesson.id) + 1;
  const best = stars[lesson.id];
  const finish = (result: Stars) => {
    completeLesson(lesson.id, result);
    router.back();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.lg }]}>
      <GradientBackground />
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Закрити" style={styles.close} hitSlop={12}>
        <Icon name="close" size={24} />
      </Pressable>

      <View style={{ flex: 1, justifyContent: 'center', gap: space.md }}>
        <Text variant="overline" color={colors.brand}>
          МОДУЛЬ {lesson.module.number} · ЗАНЯТТЯ {index} · {lessonMeta(lesson).toUpperCase()}
        </Text>
        <Text variant="screenTitle" style={{ fontSize: 24, lineHeight: 30 }}>
          {lesson.title}
        </Text>
        <Text variant="body" color={colors.textSecondary} style={{ fontSize: 16, lineHeight: 22 }}>
          {lesson.summary}
        </Text>
        <Card style={{ padding: space.lg, marginTop: space.md }}>
          <Text variant="label">Картки заняття ще в роботі</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Поки можна завершити заняття з результатом, щоб побачити зірки на Шляху і серію днів.
            {best ? ` Твій найкращий результат: ${best} з 3.` : ''}
          </Text>
        </Card>
      </View>

      <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: space.sm }}>
        Завершити з результатом
      </Text>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {([1, 2, 3] as const).map((n) => (
          <Button key={n} label={'★'.repeat(n)} variant={n === 3 ? 'primary' : 'secondary'} onPress={() => finish(n)} style={{ flex: 1, paddingHorizontal: 0 }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: space.xl, backgroundColor: '#eef8e3' },
  close: { alignSelf: 'flex-start', padding: 4 },
});
