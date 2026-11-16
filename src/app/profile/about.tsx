import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { GlassButton } from '@/components/GlassButton';
import { AppIcon, InfoSheet, Rows, SectionTitle, SettingsRow } from '@/components/profile/ProfileUI';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { colors, radius, shadow, space } from '@/theme/tokens';

const SOURCES = [
  { label: 'Національний банк України', host: 'bank.gov.ua' },
  { label: 'Міністерство фінансів', host: 'mof.gov.ua' },
  { label: 'НКЦПФР', host: 'nssmc.gov.ua' },
  { label: 'Фонд гарантування вкладів', host: 'fg.gov.ua' },
];
const DOCS = [
  {
    title: 'Умови користування',
    text: 'Квамо — навчальний застосунок про особисті фінанси. Матеріали мають освітній характер і не є індивідуальною фінансовою, податковою чи юридичною порадою. Рішення про гроші ти ухвалюєш самостійно.',
  },
  {
    title: 'Політика конфіденційності',
    text: 'Прогрес, відповіді й налаштування зберігаються лише на цьому пристрої. Ми не передаємо їх третім особам і не показуємо рекламу. Видалення акаунта стирає всі дані з телефону.',
  },
  { title: 'Ліцензії відкритого ПЗ', text: 'Квамо створено на React Native та Expo (MIT). Шрифт Unbounded поширюється за ліцензією SIL Open Font License 1.1.' },
];

/** 14 About: version, disclaimer, official sources and documents. */
export default function About() {
  const [doc, setDoc] = useState<(typeof DOCS)[number] | null>(null);
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Screen background="gradient" nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />} bodyStyle={{ paddingHorizontal: space.lg, paddingTop: space.xl, gap: space.xxl }}>
      <View style={{ alignItems: 'center', gap: space.sm }}>
        <AppIcon />
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <Text variant="title1">Квамо</Text>
          <Text variant="footnote" color={colors.textSecondary}>
            Версія {version}
          </Text>
        </View>
      </View>
      <View style={styles.note}>
        <Text variant="subheadline">Квамо навчає основ фінансів.{'\n'}Це не індивідуальна фінансова порада.</Text>
      </View>
      <View style={{ gap: space.md }}>
        <SectionTitle title="Джерела" />
        <Rows>
          {SOURCES.map((s) => (
            <SettingsRow key={s.host} label={s.label} value={s.host} onPress={() => Linking.openURL(`https://${s.host}`).catch(() => {})} />
          ))}
        </Rows>
      </View>
      <View style={{ gap: space.md }}>
        <SectionTitle title="Документи" />
        <Rows>
          {DOCS.map((d) => (
            <SettingsRow key={d.title} label={d.title} onPress={() => setDoc(d)} />
          ))}
        </Rows>
      </View>
      <InfoSheet info={doc} onClose={() => setDoc(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { backgroundColor: colors.surface, borderRadius: radius.md, padding: space.md, ...shadow.ink6 },
});
