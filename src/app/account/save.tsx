import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { SignInOptions } from '@/components/SignInOptions';
import { Text } from '@/components/Text';
import { useProfile } from '@/store/profile';
import { colors, radius, space } from '@/theme/tokens';

const card = require('../../../assets/img/save-card.png');

/** 12 Save progress: offered after the first lesson. */
export default function SaveProgress() {
  const { update } = useProfile();
  const [askSkip, setAskSkip] = useState(false);

  return (
    <Screen
      nav={<GlassButton icon="close" label="Закрити" onPress={() => setAskSkip(true)} />}
      bodyStyle={{ paddingHorizontal: space.xxl, gap: space.lg }}
      footer={
        <View style={{ paddingHorizontal: space.sm, gap: space.sm }}>
          <SignInOptions
            verb="Продовжити з"
            mode="save"
            onSignedIn={(method) => {
              update({ account: { method } });
              router.replace('/account/reminders');
            }}
          />
          <Button label="Пропустити" variant="link" onPress={() => setAskSkip(true)} />
          <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            Продовжуючи, ти погоджуєшся з <Text variant="caption" color={colors.textSecondary} style={{ textDecorationLine: 'underline' }}>Умовами</Text> та{' '}
            <Text variant="caption" color={colors.textSecondary} style={{ textDecorationLine: 'underline' }}>
              Політикою конфіденційності
            </Text>
          </Text>
        </View>
      }
    >
      <View style={{ borderRadius: radius.xxl, overflow: 'hidden', width: '100%', aspectRatio: 345 / 163 }}>
        <Image source={card} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel="1 урок пройдено, 1 день стрику" />
      </View>
      <ScreenHeader title="Збережи свій прогрес" description="Щоб не втратити стрик і пройдені уроки, навіть на новому телефоні." />

      <Sheet
        visible={askSkip}
        onClose={() => setAskSkip(false)}
        title="Не зберігати прогрес?"
        description="Без акаунта стрик і пройдені уроки залишаться лише на цьому телефоні. Якщо видалиш застосунок, вони зникнуть."
      >
        <View style={{ gap: space.sm }}>
          <Button label="Зберегти прогрес" onPress={() => setAskSkip(false)} />
          <Button
            label="Не зберігати"
            variant="link"
            onPress={() => {
              setAskSkip(false);
              router.replace('/account/reminders');
            }}
          />
        </View>
      </Sheet>
    </Screen>
  );
}
