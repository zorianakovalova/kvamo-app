import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import type { AccountMethod } from '@/store/profile';
import { colors, radius, space } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Props = {
  /** "Увійти з" on Login, "Продовжити з" on Save progress. */
  verb: string;
  /** Where the phone/email flow returns to. */
  mode: 'login' | 'save' | 'profile';
  /** For mode "profile": the screen to return to after the code is entered. */
  back?: string;
  onSignedIn: (method: AccountMethod) => void;
};

/**
 * Google, Apple, Phone and Email buttons. There is no server yet, so Google and Apple
 * only show the connecting state and then sign in locally.
 */
export function SignInOptions({ verb, mode, back, onSignedIn }: Props) {
  const [busy, setBusy] = useState<AccountMethod | null>(null);

  const social = (method: 'google' | 'apple') => {
    setBusy(method);
    setTimeout(() => {
      setBusy(null);
      onSignedIn(method);
    }, 1200);
  };

  const disabled = busy !== null;
  return (
    <View style={{ gap: space.sm }}>
      <Option icon="google" label={busy === 'google' ? 'Підключаємо…' : `${verb} Google`} busy={busy === 'google'} disabled={disabled} onPress={() => social('google')} />
      <Option icon="apple" label={busy === 'apple' ? 'Підключаємо…' : `${verb} Apple`} busy={busy === 'apple'} disabled={disabled} onPress={() => social('apple')} />
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Option icon="phone" label="Телефон" disabled={disabled} onPress={() => router.push({ pathname: '/account/phone', params: { mode, back } })} style={{ flex: 1 }} />
        <Option icon="mail" label="Email" disabled={disabled} onPress={() => router.push({ pathname: '/account/email', params: { mode, back } })} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

type OptionProps = { icon: IconName; label: string; onPress: () => void; disabled?: boolean; busy?: boolean; style?: object };

function Option({ icon, label, onPress, disabled, busy, style }: OptionProps) {
  const off = disabled && !busy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!busy }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.option, style, pressed && { opacity: 0.85 }]}
    >
      <View style={{ opacity: off ? 0.35 : 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={24} color={colors.textPrimary} strokeWidth={1.6} />
        {busy && <ActivityIndicator size="small" color={colors.textPrimary} />}
        <Text variant="headline">{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
});
