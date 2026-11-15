import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { colors, palette, radius } from '@/theme/tokens';

const frog = require('../../../assets/img/welcome-frog.png');

const STICKERS = [
  { label: 'подушка', left: 162, bottom: 265, rotate: '5deg', bg: palette.lime, color: colors.textPrimary },
  { label: 'бюджет', left: 25, bottom: 195, rotate: '-6deg', bg: palette.ink, color: colors.textInverse },
  { label: 'інвестиції', left: 197, bottom: 133, rotate: '4.58deg', bg: palette.peach, color: colors.textPrimary },
];

/** 02 Welcome: what Kvamo is and the button to start. */
export default function Welcome() {
  const { width } = useWindowDimensions();
  const ox = (width - 393) / 2;
  return (
    <Screen
      background="gradient"
      scroll={false}
      bodyStyle={{ paddingHorizontal: 0, paddingBottom: 0, paddingTop: 16 }}
      footer={
        <>
          <Button label="Почати" onPress={() => router.push('/onboarding/quiz')} />
          <Button label="Увійти в акаунт" variant="link" onPress={() => router.push('/onboarding/login')} />
        </>
      }
    >
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <View accessibilityRole="header" accessibilityLabel="Все про грошенята за 5 хвилин на день">
          <Text variant="displayLarge">Все про{'\n'}грошенята за</Text>
          <View style={styles.highlight}>
            <Text variant="displayLarge" color={colors.textInverse}>
              5 хвилин
            </Text>
          </View>
          <Text variant="displayLarge">на день</Text>
        </View>
        <Text variant="headline">Перший урок можна пройти без реєстрації</Text>
      </View>

      <View style={styles.art} pointerEvents="none">
        {STICKERS.map((s) => (
          <View key={s.label} style={[styles.sticker, { left: ox + s.left, bottom: s.bottom, backgroundColor: s.bg, transform: [{ rotate: s.rotate }] }]}>
            <Text variant="title1" color={s.color}>
              {s.label}
            </Text>
          </View>
        ))}
        <Image source={frog} contentFit="contain" style={styles.frog} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  highlight: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    marginVertical: 2,
    transform: [{ rotate: '-3deg' }],
  },
  art: { flex: 1, overflow: 'hidden' },
  sticker: { position: 'absolute', borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 8 },
  frog: { position: 'absolute', bottom: 0, alignSelf: 'center', width: 320, height: 159 },
});
