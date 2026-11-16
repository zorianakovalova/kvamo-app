import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { ConfirmSheet, InfoSheet, Rows, SectionTitle, SettingsRow, ToggleRow } from '@/components/profile/ProfileUI';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { cancelReminders } from '@/lib/reminders';
import { useProfile } from '@/store/profile';
import { useProgress } from '@/store/progress';
import { colors, radius, space, type } from '@/theme/tokens';

const VIA: Record<string, string> = { google: 'Через Google', apple: 'Через Apple' };

/** 11 Settings; 12 delete-account confirmation. */
export default function Settings() {
  const { account, name, sounds, haptics, update, resetProfile } = useProfile();
  const { resetProgress } = useProgress();
  const [ask, setAsk] = useState<'delete' | 'reset' | 'lang' | 'name' | null>(null);
  const [draft, setDraft] = useState(name);
  const email = account?.method === 'email' ? account.contact : account && VIA[account.method];
  const phone = account?.method === 'phone' ? account.contact : undefined;
  const changeContact = (path: '/account/email' | '/account/phone') => router.push({ pathname: path, params: { mode: 'profile', back: '/profile/settings' } });

  return (
    <Screen background="gradient" nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />} bodyStyle={{ paddingHorizontal: space.lg, gap: space.xxl }}>
      <View style={{ paddingHorizontal: 4 }}>
        <ScreenHeader title="Налаштування" description="Акаунт, звуки й дані застосунку" />
      </View>

      {account ? (
        <View style={styles.section}>
          <SectionTitle title="Акаунт" />
          <Rows>
            <SettingsRow label="Імʼя" value={name.trim() || 'Додати'} onPress={() => (setDraft(name), setAsk('name'))} />
            <SettingsRow label="Email" value={email || 'Додати'} onPress={() => changeContact('/account/email')} />
            <SettingsRow label="Телефон" value={phone || 'Додати'} onPress={() => changeContact('/account/phone')} />
          </Rows>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionTitle title="Застосунок" />
        <Rows>
          <ToggleRow label="Звуки" description="Після правильної відповіді й завершення уроку" value={sounds} onChange={(v) => update({ sounds: v })} />
          <ToggleRow label="Вібрація" value={haptics} onChange={(v) => update({ haptics: v })} />
          <SettingsRow label="Мова" value="Українська" onPress={() => setAsk('lang')} />
        </Rows>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Дані" />
        <Rows>
          <SettingsRow label="Скинути прогрес" onPress={() => setAsk('reset')} />
          {account ? <SettingsRow label="Видалити акаунт" danger onPress={() => setAsk('delete')} /> : null}
        </Rows>
      </View>

      <ConfirmSheet
        visible={ask === 'delete'}
        title="Видалити акаунт?"
        text="Прогрес, стрик і бейджі зникнуть назавжди. Цю дію не можна скасувати."
        action="Видалити акаунт"
        danger
        onClose={() => setAsk(null)}
        onConfirm={() => {
          setAsk(null);
          cancelReminders();
          resetProgress();
          resetProfile();
          router.dismissAll();
          router.replace('/onboarding');
        }}
      />
      <ConfirmSheet
        visible={ask === 'reset'}
        title="Скинути прогрес?"
        text="Пройдені заняття, стрик і бейджі обнуляться. Акаунт і налаштування залишаться."
        action="Скинути прогрес"
        danger
        onClose={() => setAsk(null)}
        onConfirm={() => {
          setAsk(null);
          resetProgress();
        }}
      />
      <InfoSheet info={ask === 'lang' ? { title: 'Мова', text: 'Поки Квамо доступний лише українською. Інші мови додамо згодом.' } : null} onClose={() => setAsk(null)} />
      <Sheet visible={ask === 'name'} onClose={() => setAsk(null)} title="Як до тебе звертатися?" titleVariant="title1">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Імʼя"
          placeholderTextColor={colors.textTertiary}
          autoFocus
          maxLength={40}
          style={styles.input}
          accessibilityLabel="Імʼя"
          onSubmitEditing={() => (update({ name: draft.trim() }), setAsk(null))}
        />
        <Button label="Зберегти" style={{ marginTop: space.lg }} onPress={() => (update({ name: draft.trim() }), setAsk(null))} />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md },
  input: { ...type.body, color: colors.textPrimary, height: 56, borderRadius: radius.lg, paddingHorizontal: space.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});
