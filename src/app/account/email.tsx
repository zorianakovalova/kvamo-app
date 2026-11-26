import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Field, inputBox, inputError } from '@/components/Field';
import { GlassButton } from '@/components/GlassButton';
import { Screen, ScreenHeader } from '@/components/Screen';
import { colors, space, type } from '@/theme/tokens';

const valid = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** 15 Email. */
export default function Email() {
  const { mode = 'save', back } = useLocalSearchParams<{ mode?: string; back?: string }>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);

  const submit = () => {
    if (!valid(email)) {
      setError(email.trim() ? 'Адреса має містити «@», наприклад name@gmail.com.' : 'Введи email, щоб отримати код.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      router.push({ pathname: '/account/code', params: { kind: 'email', to: email.trim(), mode, back } });
    }, 900);
  };

  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: 0, gap: space.xxl }}
      footer={<Button label={sending ? 'Надсилаємо код…' : 'Отримати код'} loading={sending} onPress={submit} />}
    >
      <View style={{ paddingHorizontal: space.xl }}>
        <ScreenHeader title="Твій email" description="Надішлемо 6-значний код, щоб підтвердити пошту. Пароль не потрібен." />
      </View>
      <View style={{ paddingHorizontal: space.lg }}>
        <Field label="Email" message="Використовуємо лише для входу, без розсилок" error={error}>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError(undefined);
            }}
            onBlur={() => email.trim() && !valid(email) && setError('Адреса має містити «@», наприклад name@gmail.com.')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="name@gmail.com"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Email"
            style={[inputBox, { ...type.body, paddingHorizontal: space.lg, color: colors.textPrimary }, error && inputError]}
            onSubmitEditing={submit}
          />
        </Field>
      </View>
    </Screen>
  );
}
