import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { PathBackground } from '@/components/PathBackground';
import { BadgeGrid, BadgeSheet, ConfirmSheet, isEarned, ModuleRingCard, Rows, SectionTitle, SettingsRow, WeekCard } from '@/components/profile/ProfileUI';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { BADGES, type Badge } from '@/data/badges';
import { MODULES } from '@/data/modules';
import { displayName, goalLabel, initial, remindersLabel } from '@/data/profile';
import { useProfile } from '@/store/profile';
import { useProgress } from '@/store/progress';
import { colors, radius, space } from '@/theme/tokens';

/** 03 Profile with an account / 04 without one. */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const profile = useProfile();
  const { streak, stars, doneCount } = useProgress();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [askLogout, setAskLogout] = useState(false);
  const { account, minutes, reminders, update } = profile;
  const earned = BADGES.filter((b) => isEarned(b, stars)).length;
  const openStreak = () => router.push('/profile/streak');

  return (
    <View style={{ flex: 1 }}>
      <PathBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.title}>
          <Text variant="largeTitle" accessibilityRole="header">
            Профіль
          </Text>
        </View>

        <View style={styles.body}>
          {account ? (
            <View style={styles.identity}>
              <Pressable onPress={() => router.push('/profile/settings')} accessibilityRole="button" accessibilityLabel="Налаштування акаунта" style={styles.who}>
                <View style={styles.avatar}>
                  <Text variant="title1">{initial(profile)}</Text>
                </View>
                <View style={{ flexShrink: 1, gap: 2 }}>
                  <Text variant="title3" numberOfLines={1}>
                    {displayName(profile)}
                  </Text>
                  {account.contact ? (
                    <Text variant="subheadline" numberOfLines={1}>
                      {account.contact}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
              <Pressable onPress={openStreak} accessibilityRole="button" accessibilityLabel="Деталі стрику">
                <StreakPill days={streak} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.pad}>
              <View style={[styles.card, styles.noAccount]}>
                <View style={{ gap: 4 }}>
                  <Text variant="headline" style={{ textAlign: 'center' }}>
                    Прогрес є лише на цьому телефоні
                  </Text>
                  <Text variant="subheadline" color={colors.textSecondary} style={{ textAlign: 'center' }}>
                    Створи акаунт, щоб не втратити стрик
                  </Text>
                </View>
                <Button label="Створити акаунт" onPress={() => router.push({ pathname: '/account/save', params: { from: 'profile' } })} />
              </View>
            </View>
          )}

          <View style={styles.pad}>
            <WeekCard onPress={openStreak} />
          </View>

          <View style={{ gap: space.md }}>
            <View style={styles.padTitle}>
              <SectionTitle title="Прогрес навчання" />
            </View>
            <View style={[styles.pad, { flexDirection: 'row', gap: space.sm }]}>
              {MODULES.map((m, i) => (
                <ModuleRingCard key={m.id} n={i + 1} done={doneCount(m)} total={m.lessons.length} onPress={() => router.navigate('/')} />
              ))}
            </View>
          </View>

          <View style={{ gap: space.md }}>
            <View style={styles.padTitle}>
              <SectionTitle title="Бейджі" meta={`${earned} з ${BADGES.length}`} onPress={() => router.push('/profile/badges')} />
            </View>
            <View style={styles.pad}>
              <BadgeGrid badges={BADGES} onPress={setBadge} />
            </View>
          </View>

          <View style={{ gap: space.md }}>
            <View style={styles.padTitle}>
              <SectionTitle title="Навчання" />
            </View>
            <View style={styles.pad}>
              <Rows>
                <SettingsRow label="Мета" value={goalLabel(profile)} onPress={() => router.push('/profile/goal')} />
                <SettingsRow label="Час на день" value={minutes ? `${minutes} хв` : 'Не обрано'} onPress={() => router.push('/profile/time')} />
                <SettingsRow label="Нагадування" value={remindersLabel(reminders)} onPress={() => router.push({ pathname: '/account/reminders', params: { edit: '1' } })} />
              </Rows>
            </View>
          </View>

          <View style={{ gap: space.md }}>
            <View style={styles.padTitle}>
              <SectionTitle title="Акаунт" />
            </View>
            <View style={styles.pad}>
              <Rows>
                <SettingsRow label="Налаштування" onPress={() => router.push('/profile/settings')} />
                <SettingsRow label="Допомога й зворотний звʼязок" onPress={() => router.push('/profile/help')} />
                <SettingsRow label="Про застосунок і джерела" onPress={() => router.push('/profile/about')} />
                {account ? <SettingsRow label="Вийти" danger chevron={false} onPress={() => setAskLogout(true)} /> : null}
              </Rows>
            </View>
          </View>
        </View>
      </ScrollView>

      <BadgeSheet badge={badge} onClose={() => setBadge(null)} />
      <ConfirmSheet
        visible={askLogout}
        title="Вийти з акаунта?"
        text="Прогрес збережено в акаунті. Увійди знову, щоб продовжити з того самого місця."
        action="Вийти"
        onConfirm={() => {
          setAskLogout(false);
          update({ account: null });
        }}
        onClose={() => setAskLogout(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { paddingLeft: space.xl, paddingRight: space.lg, paddingVertical: space.md },
  body: { paddingTop: space.sm, paddingBottom: space.xxxl, gap: space.xxl },
  pad: { paddingHorizontal: space.lg },
  padTitle: { paddingHorizontal: space.lg },
  identity: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, paddingHorizontal: space.lg },
  who: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexShrink: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.glassStrong, borderRadius: radius.lg },
  noAccount: { padding: space.lg, gap: space.lg },
});
