import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Field, inputBox } from '@/components/Field';
import { GlassButton } from '@/components/GlassButton';
import { Icon } from '@/components/Icon';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { colors, space, type } from '@/theme/tokens';

/** "67 123 45 67" while typing. */
export function formatPhone(digits: string) {
  const d = digits.slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
}

/** 13 Phone number. */
export default function Phone() {
  const { mode = 'save' } = useLocalSearchParams<{ mode?: string }>();
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    if (digits.length !== 9) {
      setError(digits.length === 0 ? 'Введи номер телефону' : 'У номері має бути 9 цифр після +380');
      return;
    }
    router.push({ pathname: '/account/code', params: { kind: 'phone', to: `+380 ${formatPhone(digits)}`, mode } });
  };

  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: 0, gap: space.xxl }}
      footer={<Button label="Отримати код" onPress={submit} />}
    >
      <View style={{ paddingHorizontal: space.xl }}>
        <ScreenHeader title="Твій номер телефону" description="Надішлемо SMS з кодом, щоб підтвердити номер. Пароль не потрібен." />
      </View>
      <View style={{ paddingHorizontal: space.lg }}>
        <Field label="Номер телефону" message="SMS безкоштовне. Номер не бачать інші користувачі." error={error}>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <View style={[inputBox, styles.country]} accessibilityLabel="Код країни: Україна, +380">
              <View style={styles.flag}>
                <View style={{ flex: 1, backgroundColor: '#0057b7' }} />
                <View style={{ flex: 1, backgroundColor: '#ffd700' }} />
              </View>
              <Text variant="headline">+380</Text>
              <Icon name="chevronDown" size={16} />
            </View>
            <TextInput
              value={formatPhone(digits)}
              onChangeText={(t) => {
                setDigits(t.replace(/\D/g, '').slice(0, 9));
                setError(undefined);
              }}
              onBlur={() => digits.length > 0 && digits.length < 9 && setError('У номері має бути 9 цифр після +380')}
              keyboardType="number-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              placeholder="67 123 45 67"
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel="Номер телефону"
              style={[inputBox, styles.input, error && { borderColor: colors.danger }]}
              onSubmitEditing={submit}
            />
          </View>
        </Field>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  country: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md },
  flag: { width: 20, height: 14, borderRadius: 4, overflow: 'hidden' },
  input: { ...type.body, flex: 1, minWidth: 0, paddingHorizontal: space.lg, color: colors.textPrimary },
});
