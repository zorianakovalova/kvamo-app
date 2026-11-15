import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { Screen, ScreenHeader } from '@/components/Screen';
import { SignInOptions } from '@/components/SignInOptions';
import { useProfile } from '@/store/profile';
import { radius, space } from '@/theme/tokens';

const card = require('../../../assets/img/login-card.png');

/** 03 Login for people who already have an account. */
export default function Login() {
  const { update } = useProfile();
  return (
    <Screen
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: space.xl, gap: space.lg, paddingTop: space.lg }}
      footer={
        <>
          <SignInOptions
            verb="Увійти з"
            mode="login"
            onSignedIn={(method) => {
              update({ account: { method }, accountOffered: true, onboarded: true });
              router.replace('/');
            }}
          />
          <Button label="Почати з нуля" variant="link" onPress={() => router.replace('/onboarding/quiz')} />
        </>
      }
    >
      <View style={{ borderRadius: radius.xxl, overflow: 'hidden', aspectRatio: 353 / 239, width: '100%' }}>
        <Image source={card} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </View>
      <ScreenHeader title="З поверненням!" description={'Увійди так само, як минулого разу.\nТвій прогрес підтягнеться автоматично.'} />
    </Screen>
  );
}
