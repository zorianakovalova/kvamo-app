import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Reminders } from '@/store/profile';

export type PermissionResult = 'granted' | 'denied' | 'unsupported';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

/** Ask for permission and schedule one local notification per chosen weekday. */
export async function scheduleReminders(r: Reminders, lessonTitle: string): Promise<PermissionResult> {
  if (Platform.OS === 'web') return 'unsupported';
  try {
    const current = await Notifications.getPermissionsAsync();
    const status = current.granted ? current : await Notifications.requestPermissionsAsync();
    if (!status.granted) return 'denied';

    await Notifications.cancelAllScheduledNotificationsAsync();
    const [hour, minute] = r.time.split(':').map(Number);
    // Expo weekday: 1 = Sunday … 7 = Saturday; ours: 0 = Monday … 6 = Sunday.
    for (let i = 0; i < 7; i++) {
      if (!r.days[i]) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Квамо', body: `Жабка вже чекає: 3 хвилини на урок «${lessonTitle}»` },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: ((i + 1) % 7) + 1, hour, minute },
      });
    }
    return 'granted';
  } catch {
    return 'unsupported';
  }
}

export async function cancelReminders() {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
