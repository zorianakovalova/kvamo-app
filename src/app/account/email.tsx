import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Field, inputBox } from '@/components/Field';
import { GlassButton } from '@/components/GlassButton';
import { Screen, ScreenHeader } from '@/components/Screen';
import { colors, space, type } from '@/theme/tokens';

const valid = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** 15 Email. */
export default function Email() {
  const { mode = 'save', back } = useLocalSearchParams<{ mode?: string; back?: string }>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    if (!valid(email)) {
      setError(email.trim() ? 'Перевір адресу: схоже, в ній помилка' : 'Введи email');
      return;
    }
    router.push({ pathname: '/account/code', params: { kind: 'email', to: email.trim(), mode , back } });
  };

  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: 0, gap: space.xxl }}
      footer={<Button label="Отримати код" onPress={submit} />}
    >
      <View style={{ paddingHorizontal: space.xl }}>
        <ScreenHeader title="Твій email" description="Надішлемо лист з кодом, щоб підтвердити адресу. Пароль не потрібен." />
      </View>
      <View style={{ paddingHorizontal: space.lg }}>
        <Field label="Email" message="Не надсилатимемо розсилок без твоєї згоди." error={error}>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError(undefined);
            }}
            onBlur={() => email.trim() && !valid(email) && setError('Перевір адресу: схоже, в ній помилка')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="name@gmail.com"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Email"
            style={[inputBox, { ...type.body, paddingHorizontal: space.lg, color: colors.textPrimary }, error && { borderColor: colors.danger }]}
            onSubmitEditing={submit}
          />
        </Field>
      </View>
    </Screen>
  );
}
