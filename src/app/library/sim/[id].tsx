import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from '@/lib/insets';

import { Button } from '@/components/Button';
import { FactsTable, InfoChip, NavPill } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import { SIMULATIONS, findMaterial } from '@/data/library';
import { colors, radius, space } from '@/theme/tokens';

/** Simulation intro from the Library. "Почати симуляцію" opens the practice lesson on the Path. */
export default function SimulationIntroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const sim = SIMULATIONS[id];
  const m = findMaterial(id);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  if (!sim || !m) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <NavPill icon="close" label="Закрити" onPress={close} />
        <Text variant="title3" style={{ padding: space.xl }}>
          Симуляцію не знайдено
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <NavPill icon="close" label="Закрити" onPress={close} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Image source={sim.hero} style={styles.hero} contentFit="cover" />
        <View style={{ paddingHorizontal: space.lg }}>
          <View style={styles.chips}>
            <InfoChip label="Симуляція" />
            <InfoChip label={sim.chapter} />
          </View>
          <Text variant="largeTitle" accessibilityRole="header" style={{ marginTop: space.md }}>
            {m.title}
          </Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: space.md }}>
            {sim.description}
          </Text>
        </View>
        <FactsTable
          rows={[
            ['Рішень', sim.decisions],
            ['Час', `≈ ${sim.minutes} хв`],
          ]}
        />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        <Button label="Почати симуляцію" onPress={() => router.replace({ pathname: '/lesson/[id]', params: { id: sim.lessonId } })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  body: { paddingVertical: space.xxl, gap: space.lg },
  hero: { marginHorizontal: space.lg, aspectRatio: 361 / 163, borderRadius: radius.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  footer: { paddingTop: space.lg, paddingHorizontal: space.lg },
});
