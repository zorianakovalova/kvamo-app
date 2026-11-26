import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { Button } from '@/components/Button';
import { ERROR } from '@/components/Field';
import { GlassButton } from '@/components/GlassButton';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useProfile } from '@/store/profile';
import { colors, space } from '@/theme/tokens';

const LEN = 6;
const RESEND = 60;

/** 14 / 16 Six-digit code from SMS or email. There is no server yet, so any 6 digits are accepted. */
export default function Code() {
  const { kind = 'phone', to = '', mode = 'save', back } = useLocalSearchParams<{ kind?: string; to?: string; mode?: string; back?: string }>();
  const { update, onboarded } = useProfile();
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(RESEND);
  const [incomplete, setIncomplete] = useState(false);
  const [done, setDone] = useState(false);
  const input = useRef<TextInputInstance>(null);
  const phone = kind === 'phone';
  const source = phone ? 'SMS' : 'листа';

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  // Login: wait until "onboarded" is saved before opening the Path.
  useEffect(() => {
    if (done && mode === 'login' && onboarded) router.replace('/');
  }, [done, onboarded, mode]);

  const confirm = () => {
    if (code.length < LEN) {
      setIncomplete(true);
      input.current?.focus();
      return;
    }
    if (done) return;
    setDone(true);
    update({ account: { method: phone ? 'phone' : 'email', contact: to }, accountOffered: true, ...(mode === 'login' ? { onboarded: true } : {}) });
    if (mode === 'profile') router.dismissTo((back ?? '/profile') as '/profile');
    else if (mode !== 'login') router.replace('/account/reminders');
  };

  const time = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;

  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ gap: space.xxl }}
      footer={
        <View style={{ gap: space.sm }}>
          <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            Демоверсія: справжній {phone ? 'SMS' : 'лист'} не надсилається, підійде будь-який код з 6 цифр.
          </Text>
          <Button label={phone ? 'Підтвердити номер' : 'Підтвердити пошту'} onPress={confirm} />
        </View>
      }
    >
      <ScreenHeader title={phone ? 'Код з SMS' : 'Код з листа'} description={`Надіслали 6 цифр на ${to}`} />

      <View style={{ gap: space.sm }}>
        <Text variant="text14Strong" style={{ paddingHorizontal: 20 }}>
          {phone ? 'Код з SMS' : 'Код з листа'}
        </Text>
        <Pressable onPress={() => input.current?.focus()} style={styles.boxes} accessibilityLabel={`Код, введено ${code.length} з ${LEN} цифр`}>
          {Array.from({ length: LEN }, (_, i) => (
            <View key={i} style={[styles.box, i === code.length && styles.boxActive]}>
              <Text variant="number24">{code[i] ?? ''}</Text>
            </View>
          ))}
        </Pressable>
        <TextInput
          ref={input}
          value={code}
          onChangeText={(t) => {
            setCode(t.replace(/\D/g, '').slice(0, LEN));
            setIncomplete(false);
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={phone ? 'sms-otp' : 'one-time-code'}
          autoFocus
          maxLength={LEN}
          style={styles.hidden}
          accessibilityLabel="Код підтвердження"
        />
        <View style={{ paddingHorizontal: 20 }}>
          {incomplete ? (
            <Text variant="text14Medium" color={ERROR}>
              Введи всі 6 цифр з {source}.
            </Text>
          ) : left > 0 ? (
            <Text variant="text14" color={colors.textSecondary}>
              {phone ? 'Надіслати SMS ще раз можна через' : 'Надіслати новий код можна через'} {time}
            </Text>
          ) : (
            <Text variant="text14" color={colors.textSecondary}>
              {phone ? 'SMS не прийшло? Перевір номер або надішли ще раз.' : 'Лист не прийшов? Перевір пошту або надішли код ще раз.'}
            </Text>
          )}
        </View>
      </View>

      <View style={{ alignItems: 'flex-start' }}>
        {left <= 0 ? (
          <Pressable onPress={() => setLeft(RESEND)} accessibilityRole="button" style={styles.link}>
            <Text variant="text16Strong">{phone ? 'Надіслати SMS ще раз' : 'Надіслати код ще раз'}</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.link}>
          <Text variant="text16Strong">{phone ? 'Змінити номер' : 'Змінити email'}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  box: {
    flex: 1,
    maxWidth: 54,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: colors.ink },
  link: { minHeight: 44, paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
