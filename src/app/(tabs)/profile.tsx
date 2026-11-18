import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { BadgeNotebook, BadgeSheet, ConfirmSheet, isEarned, ModuleProgressRow, Rows, SettingsRow, StatCards, WeekCard } from '@/components/profile/ProfileUI';
import { StreakPill } from '@/components/StreakPill';
import { Text } from '@/components/Text';
import { BADGES, type Badge } from '@/data/badges';
import { ALL_LESSONS, MODULES, plural } from '@/data/modules';
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
  const lessonsDone = ALL_LESSONS.filter((l) => stars[l.id]).length;
  const openStreak = () => router.push('/profile/streak');

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundTertiary }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 110 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.title}>
          <Text variant="screenTitle" accessibilityRole="header">
            Профіль
          </Text>
        </View>

        <View style={styles.body}>
          {account ? (
            <View style={styles.identity}>
              <Pressable onPress={() => router.push('/profile/settings')} accessibilityRole="button" accessibilityLabel="Налаштування акаунта" style={styles.who}>
                <View style={styles.avatar}>
                  <Text variant="number24">{initial(profile)}</Text>
                </View>
                <View style={{ flexShrink: 1, gap: 2 }}>
                  <Text variant="text20Strong" numberOfLines={1}>
                    {displayName(profile)}
                  </Text>
                  {account.contact ? (
                    <Text variant="text14" numberOfLines={1}>
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

          <StatCards
            items={[
              { value: String(streak), label: `${plural(streak, 'день', 'дні', 'днів')} стрику`, onPress: openStreak },
              { value: `${lessonsDone} з ${ALL_LESSONS.length}`, label: 'заняття', onPress: () => router.navigate('/') },
              { value: `${earned} з ${BADGES.length}`, label: plural(BADGES.length, 'бейджа', 'бейджів', 'бейджів'), onPress: () => router.push('/profile/badges') },
            ]}
          />

          <View style={styles.pad}>
            <WeekCard onPress={openStreak} />
          </View>

          <View style={{ gap: space.md }}>
            <Section title="Прогрес навчання" />
            <View style={[styles.pad, { gap: space.sm }]}>
              {MODULES.map((m) => (
                <ModuleProgressRow key={m.id} module={m} done={doneCount(m)} onPress={() => router.navigate('/')} />
              ))}
            </View>
          </View>

          <View style={{ gap: space.md }}>
            <Section title="Бейджі" />
            <View style={styles.pad}>
              <BadgeNotebook badges={BADGES} onPress={setBadge} onOpenAll={() => router.push('/profile/badges')} />
            </View>
          </View>

          <View style={{ gap: space.md }}>
            <Section title="Навчання" />
            <View style={styles.pad}>
              <Rows>
                <SettingsRow label="Мета" value={goalLabel(profile)} onPress={() => router.push('/profile/goal')} />
                <SettingsRow label="Час на день" value={minutes ? `${minutes} хв` : 'Не обрано'} onPress={() => router.push('/profile/time')} />
                <SettingsRow label="Нагадування" value={remindersLabel(reminders)} onPress={() => router.push({ pathname: '/account/reminders', params: { edit: '1' } })} />
              </Rows>
            </View>
          </View>

          <View style={{ gap: space.md }}>
            <Section title="Акаунт" />
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

function Section({ title }: { title: string }) {
  return (
    <Text variant="display16" accessibilityRole="header" style={{ paddingHorizontal: space.xl }}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { height: 64, justifyContent: 'center', paddingHorizontal: space.xl },
  body: { paddingTop: space.sm, paddingBottom: space.xxxl, gap: space.xxl },
  pad: { paddingHorizontal: space.lg },
  identity: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, paddingHorizontal: space.lg },
  who: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexShrink: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.glassStrong, borderRadius: radius.lg },
  noAccount: { padding: space.lg, gap: space.lg },
});
