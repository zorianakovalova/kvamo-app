import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { GlassCard } from '@/components/GlassCard';
import { GradientBackground } from '@/components/GradientBackground';
import { LessonFlow } from '@/components/lesson/LessonFlow';
import { MonthSimFlow } from '@/components/lesson/MonthSimFlow';
import { SimFlow } from '@/components/lesson/SimFlow';
import { TestFlow } from '@/components/lesson/TestFlow';
import { Text } from '@/components/Text';
import { lessonContent, monthSim, simulation, testContent } from '@/data/lessons';
import { findLesson, lessonMeta } from '@/data/modules';
import { useProfile } from '@/store/profile';
import { useProgress, type Stars } from '@/store/progress';
import { colors, space } from '@/theme/tokens';

/** Lesson screens from Figma; lessons whose content is not built yet keep the placeholder. */
export default function LessonScreen() {
  const { id, short } = useLocalSearchParams<{ id: string; short?: string }>();
  const lesson = findLesson(id);
  const content = lessonContent(id);
  const sim = simulation(id);
  const test = testContent(id);
  const month = monthSim(id);
  if (lesson && content) return <LessonFlow key={id} lesson={lesson} module={lesson.module} content={content} short={short === '1'} />;
  if (lesson && sim) return <SimFlow key={id} lesson={lesson} module={lesson.module} sim={sim} />;
  if (lesson && month) return <MonthSimFlow key={id} lesson={lesson} module={lesson.module} sim={month.sim} art={month.art} />;
  if (lesson && test) return <TestFlow key={id} lesson={lesson} module={lesson.module} test={test} />;
  return <Placeholder id={id} />;
}

/** Placeholder for lessons still in progress: finish with a result so the Path, stars and streak can be tried. */
function Placeholder({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const { completeLesson, stars } = useProgress();
  const { accountOffered } = useProfile();
  const lesson = findLesson(id);

  if (!lesson) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + space.xl }]}>
        <Text variant="title3">Заняття не знайдено</Text>
        <Button label="Повернутися на Шлях" onPress={() => router.back()} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  const index = lesson.module.lessons.findIndex((x) => x.id === lesson.id) + 1;
  const best = stars[lesson.id];
  const first = Object.keys(stars).length === 0;
  const finish = (result: Stars) => {
    completeLesson(lesson.id, result);
    // After the very first lesson: streak celebration, then the offer to save progress.
    if (first || !accountOffered) router.replace('/account/streak');
    else router.back();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + space.lg }]}>
      <GradientBackground />
      <GlassButton icon="close" label="Закрити" onPress={() => router.back()} />

      <View style={{ flex: 1, justifyContent: 'center', gap: space.md }}>
        <Text variant="caption2" color={colors.brand}>
          МОДУЛЬ {lesson.module.number} · ЗАНЯТТЯ {index} · {lessonMeta(lesson).toUpperCase()}
        </Text>
        <Text variant="largeTitle" style={{ fontSize: 24, lineHeight: 30 }}>
          {lesson.title}
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          {lesson.summary}
        </Text>
        <GlassCard style={{ padding: space.lg, marginTop: space.md, gap: 4 }}>
          <Text variant="headline">Картки заняття ще в роботі</Text>
          <Text variant="subheadline" color={colors.textSecondary}>
            Поки можна завершити заняття з результатом, щоб побачити зірки на Шляху і стрик.
            {best ? ` Твій найкращий результат: ${best} з 3.` : ''}
          </Text>
        </GlassCard>
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
  screen: { flex: 1, paddingHorizontal: space.lg },
});
