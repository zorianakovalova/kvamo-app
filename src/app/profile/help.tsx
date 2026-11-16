import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';

import { GlassButton } from '@/components/GlassButton';
import { InfoSheet, Rows, SectionTitle, SettingsRow } from '@/components/profile/ProfileUI';
import { Screen, ScreenHeader } from '@/components/Screen';
import { space } from '@/theme/tokens';

const SUPPORT = 'support@kvamo.app';
const FAQ = [
  {
    title: 'Як працює стрик?',
    text: 'Стрик росте на один день за кожен день, коли ти пройдеш хоча б одне заняття. Дні поза розкладом нагадувань його не переривають. Деталі стрику відкриваються з картки «Цей тиждень» у профілі.',
  },
  { title: 'Чи безкоштовний Квамо?', text: 'Так. Усі модулі, бібліотека й симуляції безкоштовні, без реклами і прихованих платежів.' },
  { title: 'Як змінити мету чи час на день?', text: 'У Профілі, в розділі «Навчання», натисни «Мета» або «Час на день», обери нове значення і збережи.' },
  { title: 'Як видалити акаунт?', text: 'Профіль → Налаштування → «Видалити акаунт». Прогрес, стрик і бейджі зникнуть назавжди.' },
];

/** 13 Help: FAQ answers open in a sheet, contact links open mail. */
export default function Help() {
  const [open, setOpen] = useState<(typeof FAQ)[number] | null>(null);
  const mail = (subject: string) => Linking.openURL(`mailto:${SUPPORT}?subject=${encodeURIComponent(subject)}`).catch(() => {});
  return (
    <Screen background="gradient" nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />} bodyStyle={{ paddingHorizontal: space.lg, gap: space.xxl }}>
      <View style={{ paddingHorizontal: 4 }}>
        <ScreenHeader title="Допомога" description="Відповіді на часті питання. Немає потрібної — напиши нам." />
      </View>
      <View style={{ gap: space.md }}>
        <SectionTitle title="Часті питання" />
        <Rows>
          {FAQ.map((q) => (
            <SettingsRow key={q.title} label={q.title} onPress={() => setOpen(q)} />
          ))}
        </Rows>
      </View>
      <View style={{ gap: space.md }}>
        <SectionTitle title="Звʼязатися з нами" />
        <Rows>
          <SettingsRow label="Написати нам" value={SUPPORT} onPress={() => mail('Питання про Квамо')} />
          <SettingsRow label="Повідомити про помилку" onPress={() => mail('Помилка в Квамо')} />
        </Rows>
      </View>
      <InfoSheet info={open} onClose={() => setOpen(null)} />
    </Screen>
  );
}
