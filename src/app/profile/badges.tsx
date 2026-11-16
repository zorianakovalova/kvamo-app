import { router } from 'expo-router';
import { useState } from 'react';

import { GlassButton } from '@/components/GlassButton';
import { BadgeGrid, BadgeSheet, isEarned } from '@/components/profile/ProfileUI';
import { Screen, ScreenHeader } from '@/components/Screen';
import { BADGES, type Badge } from '@/data/badges';
import { useProgress } from '@/store/progress';
import { space } from '@/theme/tokens';

/** 06 All badges; 07 the condition sheet opens on tap. */
export default function Badges() {
  const { stars } = useProgress();
  const [badge, setBadge] = useState<Badge | null>(null);
  const earned = BADGES.filter((b) => isEarned(b, stars)).length;
  return (
    <Screen
      background="gradient"
      nav={<GlassButton icon="chevronLeft" label="Назад" onPress={() => router.back()} />}
      bodyStyle={{ paddingHorizontal: space.lg, gap: space.xxl }}
    >
      <ScreenHeader title="Бейджі" description={`Отримуй бейдж за кожен пройдений модуль. Зараз ${earned} з ${BADGES.length}.`} />
      <BadgeGrid badges={BADGES} onPress={setBadge} />
      <BadgeSheet badge={badge} onClose={() => setBadge(null)} />
    </Screen>
  );
}
