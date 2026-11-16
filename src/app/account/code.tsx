import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useProfile } from '@/store/profile';
import { colors, radius, space } from '@/theme/tokens';

const LEN = 6;
const RESEND = 60;

/** 14 / 16 Six-digit code from SMS or email. There is no server yet, so any 6 digits are accepted. */
export default function Code() {
  const { kind = 'phone', to = '', mode = 'save', back } = useLocalSearchParams<{ kind?: string; to?: string; mode?: string; back?: string }>();
  const { update, onboarded } = useProfile();
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(RESEND);
  const [done, setDone] = useState(false);
  const input = useRef<TextInputInstance>(null);
  const phone = kind === 'phone';

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  useEffect(() => {
    if (code.length < LEN || done) return;
    setDone(true);
    update({ account: { method: phone ? 'phone' : 'email', contact: to }, accountOffered: true, ...(mode === 'login' ? { onboarded: true } : {}) });
    if (mode === 'profile') router.dismissTo((back ?? '/profile') as '/profile');
    else if (mode !== 'login') router.replace('/account/reminders');
  }, [code]);

  // Login: wait until "onboarded" is saved before opening the Path.
  useEffect(() => {
    if (done && mode === 'login' && onboarded) router.replace('/');
  }, [done, onboarded]);

  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ gap: space.xxl }}
      footer={<Button label={phone ? 'Змінити номер' : 'Змінити email'} variant="link" onPress={() => router.back()} />}
    >
      <ScreenHeader title={phone ? 'Код з SMS' : 'Код з листа'} description={`Надіслали 6 цифр на ${to}`} />

      <Pressable onPress={() => input.current?.focus()} style={styles.boxes} accessibilityLabel={`Код, введено ${code.length} з ${LEN} цифр`}>
        {Array.from({ length: LEN }, (_, i) => (
          <View key={i} style={[styles.box, i === code.length && styles.boxActive]}>
            <Text variant="title1">{code[i] ?? ''}</Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={input}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, LEN))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={phone ? 'sms-otp' : 'one-time-code'}
        autoFocus
        maxLength={LEN}
        style={styles.hidden}
        accessibilityLabel="Код підтвердження"
      />

      <View style={{ gap: space.sm, alignItems: 'center' }}>
        {left > 0 ? (
          <Text variant="subheadline" color={colors.textSecondary}>
            Надіслати ще раз через 0:{String(left).padStart(2, '0')}
          </Text>
        ) : (
          <Button label="Надіслати код ще раз" variant="link" onPress={() => setLeft(RESEND)} />
        )}
        <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
          Демоверсія: справжній {phone ? 'SMS' : 'лист'} не надсилається, підійде будь-який код з 6 цифр.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: space.sm, justifyContent: 'center' },
  box: {
    flex: 1,
    maxWidth: 52,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: colors.ink, borderWidth: 2 },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
