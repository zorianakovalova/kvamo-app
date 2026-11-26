import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { colors, palette, radius } from '@/theme/tokens';

const frog = require('../../../assets/img/welcome-frog.png');

// Sticker boxes are the rotated bounding boxes from Figma; the pill inside is rotated around the box centre.
const STICKERS = [
  { label: 'подушка', box: { right: 38.65, top: 28.14, width: 175.35, height: 60.82 }, rotate: '5deg', bg: palette.lime, color: colors.textPrimary },
  { label: 'бюджет', box: { left: 2, top: 96.14, width: 160.95, height: 62.16 }, rotate: '-6deg', bg: palette.ink, color: colors.textInverse },
  { label: 'інвестиції', box: { right: -7.09, bottom: 137.6, width: 185.1, height: 60.4 }, rotate: '4.58deg', bg: palette.peach, color: colors.textPrimary },
];

/** 02 Welcome: what Kvamo is and the button to start. */
export default function Welcome() {
  return (
    <Screen
      background="gradient"
      scroll={false}
      bodyStyle={{ paddingHorizontal: 0, paddingBottom: 0, paddingTop: 16, gap: 16 }}
      footerStyle={{ paddingTop: 0 }}
      footer={
        <>
          <Button label="Почати" onPress={() => router.push('/onboarding/quiz')} />
          <Button label="Увійти в акаунт" variant="link" onPress={() => router.push('/onboarding/login')} />
        </>
      }
    >
      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        <View accessibilityRole="header" accessibilityLabel="Все про грошенята за 5 хвилин на день" style={{ gap: 4 }}>
          <Text variant="displayLarge" style={styles.title}>Все про{'\n'}грошенята за</Text>
          <View style={styles.highlight}>
            <Text variant="displayLarge" color={colors.textInverse} style={styles.title}>
              5 хвилин
            </Text>
          </View>
          <Text variant="displayLarge" style={styles.title}>на день</Text>
        </View>
        <Text variant="text16Strong" style={{ maxWidth: 290 }}>
          Перший урок можна пройти без реєстрації
        </Text>
      </View>

      <View style={styles.art} pointerEvents="none">
        <Image source={frog} contentFit="contain" style={styles.frog} />
        {STICKERS.map((s) => (
          <View key={s.label} style={[styles.stickerBox, s.box]}>
            <View style={[styles.sticker, { backgroundColor: s.bg, transform: [{ rotate: s.rotate }] }]}>
              <Text variant="number24" color={s.color}>
                {s.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { lineHeight: 48 },
  highlight: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingBottom: 4,
    marginVertical: 6.43,
    transform: [{ rotate: '-3deg' }],
  },
  art: { flex: 1, marginHorizontal: 20, overflow: 'visible' },
  stickerBox: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  sticker: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  frog: { position: 'absolute', bottom: 0, alignSelf: 'center', width: 320, height: 159 },
});
