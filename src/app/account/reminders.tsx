import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { Button } from '@/components/Button';
import { GlassButton } from '@/components/GlassButton';
import { Icon } from '@/components/Icon';
import { Screen, ScreenHeader } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { findLesson } from '@/data/modules';
import { scheduleReminders, type PermissionResult } from '@/lib/reminders';
import { useProfile } from '@/store/profile';
import { useProgress } from '@/store/progress';
import { colors, fonts, radius, space } from '@/theme/tokens';

const appIcon = require('../../../assets/img/app-icon.png');
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const DAY_NAMES = ['понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота', 'неділя'];
const QUICK = ['08:00', '12:30', '18:00', '19:00', '20:00', '21:30'];

/** 17 Reminders: when and on which days to remind about a lesson. */
export default function RemindersScreen() {
  const { reminders, update } = useProfile();
  const { currentLessonId } = useProgress();
  const lesson = currentLessonId ? findLesson(currentLessonId) : undefined;
  const [frequency, setFrequency] = useState<'daily' | 'off'>(reminders?.frequency ?? 'daily');
  const [time, setTime] = useState(reminders?.time ?? '19:00');
  const [days, setDays] = useState<boolean[]>(reminders?.days ?? DAYS.map(() => true));
  const [sheet, setSheet] = useState<'freq' | 'time' | null>(null);
  const [hh, setHh] = useState('');
  const [mm, setMm] = useState('');
  const [customError, setCustomError] = useState<string | undefined>();
  const minutesRef = useRef<TextInputInstance>(null);
  const [result, setResult] = useState<PermissionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const off = frequency === 'off';
  const noDays = !days.some(Boolean);

  const finish = () => router.replace('/');

  const enable = async () => {
    if (off) {
      update({ reminders: { enabled: false, frequency, days, time } });
      return finish();
    }
    setBusy(true);
    const r = { enabled: true, frequency, days, time };
    const res = await scheduleReminders(r, lesson?.title ?? 'Потреби і бажання');
    setBusy(false);
    setResult(res);
    update({ reminders: { ...r, enabled: res === 'granted' } });
    if (res === 'granted') setTimeout(finish, 1200);
  };

  const openTime = () => {
    const [h, m] = time.split(':');
    setHh(h);
    setMm(m);
    setCustomError(undefined);
    setSheet('time');
  };

  const fill = (t: string) => {
    const [h, m] = t.split(':');
    setHh(h);
    setMm(m);
    setCustomError(undefined);
  };

  const saveTime = () => {
    const h = Number(hh);
    const m = Number(mm);
    if (hh === '' || mm === '' || h > 23 || m > 59) return setCustomError('Години від 00 до 23, хвилини від 00 до 59');
    setTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    setSheet(null);
  };

  const draft = hh.length && mm.length ? `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}` : '';

  return (
    <Screen
      nav={<GlassButton icon="close" label="Закрити" onPress={finish} />}
      bodyStyle={{ paddingHorizontal: 0, gap: space.xxl }}
      footer={
        <>
          {result === 'granted' ? (
            <Banner icon="check" text={`Готово! Нагадаємо о ${time}.`} />
          ) : result === 'denied' ? (
            <Banner
              icon="alert"
              danger
              text="Сповіщення вимкнені для Квамо. Увімкни їх у налаштуваннях телефону."
              action={{ label: 'Відкрити налаштування', onPress: () => Linking.openSettings() }}
            />
          ) : result === 'unsupported' ? (
            <Banner icon="alert" danger text="На цьому пристрої нагадування не працюють. Налаштування збережено." />
          ) : null}
          <Button
            label={off ? 'Зберегти' : 'Увімкнути нагадування'}
            icon={off ? undefined : 'bell'}
            loading={busy}
            disabled={!off && noDays}
            onPress={result === 'granted' || result === 'unsupported' ? finish : enable}
          />
          <Button label="Пропустити" variant="link" onPress={finish} />
        </>
      }
    >
      <View style={{ paddingHorizontal: space.lg }}>
        <View style={styles.preview} accessibilityLabel="Так виглядатиме нагадування">
          <Image source={appIcon} style={styles.appIcon} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="subheadlineStrong">Квамо</Text>
              <Text variant="caption" color={colors.textSecondary}>
                {off ? '' : time}
              </Text>
            </View>
            <Text variant="subheadline">Жабка вже чекає: 3 хвилини на урок «{lesson?.title ?? 'Потреби і бажання'}»</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: space.xl }}>
        <ScreenHeader title="Нагадувати про урок?" description="Не частіше одного разу на день, у дні й час, які обереш." />
      </View>

      <View style={styles.pickers}>
        <Picker label="Коли?" value={off ? 'Не нагадувати' : 'Щодня'} onPress={() => setSheet('freq')} small={off} />
        {!off && <Picker label="О котрій?" value={time} icon onPress={openTime} />}
      </View>

      {!off && (
        <View style={{ gap: space.sm }}>
          <Text variant="subheadlineStrong" style={{ paddingHorizontal: space.xl }}>
            У які дні нагадувати
          </Text>
          <View style={styles.days}>
            {DAYS.map((d, i) => (
              <Pressable
                key={d}
                onPress={() => setDays(days.map((v, k) => (k === i ? !v : v)))}
                accessibilityRole="button"
                accessibilityLabel={DAY_NAMES[i]}
                accessibilityState={{ selected: days[i] }}
                style={[styles.day, days[i] && styles.dayOn]}
              >
                {days[i] && <Icon name="check" size={16} color={colors.textInverse} />}
                <Text variant="subheadlineStrong" color={days[i] ? colors.textInverse : colors.textPrimary}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text variant="subheadline" color={noDays ? colors.danger : colors.textSecondary} style={{ paddingHorizontal: space.xl }}>
            {noDays ? 'Обери хоча б один день' : 'Обери дні, коли плануєш навчатися. Дні без занять не переривають стрик.'}
          </Text>
        </View>
      )}

      <Sheet visible={sheet === 'freq'} onClose={() => setSheet(null)} title="Як часто нагадувати?">
        <View style={{ gap: space.sm }}>
          {(['daily', 'off'] as const).map((f) => (
            <Row key={f} label={f === 'daily' ? 'Щодня' : 'Не нагадувати'} selected={frequency === f} onPress={() => (setFrequency(f), setSheet(null))} />
          ))}
        </View>
      </Sheet>

      <Sheet visible={sheet === 'time'} onClose={() => setSheet(null)} title="О котрій нагадувати?" titleVariant="title1">
        <Text variant="subheadlineStrong" style={{ marginBottom: space.sm }}>
          Швидкий вибір
        </Text>
        <View style={styles.quick}>
          {QUICK.map((q) => (
            <Pressable
              key={q}
              onPress={() => fill(q)}
              accessibilityRole="radio"
              accessibilityState={{ checked: draft === q }}
              style={[styles.quickItem, draft === q && styles.dayOn]}
            >
              <Text variant="numberSmall" color={draft === q ? colors.textInverse : colors.textPrimary}>
                {q}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text variant="subheadlineStrong" style={{ marginTop: space.lg, marginBottom: space.sm }}>
          Або введи свій час
        </Text>
        <View style={styles.alarm}>
          <View style={styles.alarmUnit}>
            <TextInput
              value={hh}
              onChangeText={(t) => {
                const v = t.replace(/\D/g, '').slice(0, 2);
                setHh(v);
                setCustomError(undefined);
                if (v.length === 2) minutesRef.current?.focus();
              }}
              placeholder="00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              accessibilityLabel="Години, від 00 до 23"
              style={[styles.alarmCell, customError && { borderColor: colors.danger }]}
            />
            <Text variant="caption" color={colors.textSecondary}>
              год
            </Text>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.alarmUnit}>
            <TextInput
              ref={minutesRef}
              value={mm}
              onChangeText={(t) => (setMm(t.replace(/\D/g, '').slice(0, 2)), setCustomError(undefined))}
              placeholder="00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              accessibilityLabel="Хвилини, від 00 до 59"
              style={[styles.alarmCell, customError && { borderColor: colors.danger }]}
              onSubmitEditing={saveTime}
            />
            <Text variant="caption" color={colors.textSecondary}>
              хв
            </Text>
          </View>
        </View>
        <Text variant="subheadline" color={customError ? colors.danger : colors.textSecondary} style={{ textAlign: 'center', marginTop: space.md }}>
          {customError ?? '24-годинний формат, як у будильнику'}
        </Text>
        <Button label="Зберегти час" onPress={saveTime} style={{ marginTop: space.lg }} />
      </Sheet>
    </Screen>
  );
}

function Picker({ label, value, onPress, icon, small }: { label: string; value: string; onPress: () => void; icon?: boolean; small?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label} ${value}. Змінити`} style={styles.picker}>
      {icon && <Icon name="clock" size={22} color={colors.brand} />}
      <View style={{ flex: 1 }}>
        <Text variant="subheadline" color={colors.textSecondary}>
          {label}
        </Text>
        <Text variant={small ? 'numberSmall' : 'title1'} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Icon name="chevronRight" size={24} />
    </Pressable>
  );
}

function Row({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.row, selected && styles.dayOn]}>
      <Text variant="bodyMedium" color={selected ? colors.textInverse : colors.textPrimary} style={{ flex: 1 }}>
        {label}
      </Text>
      {selected && <Icon name="check" size={20} color={colors.textInverse} />}
    </Pressable>
  );
}

function Banner({ icon, text, danger, action }: { icon: 'check' | 'alert'; text: string; danger?: boolean; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={[styles.banner, danger && { backgroundColor: colors.dangerSurface, borderColor: colors.danger }]} accessibilityLiveRegion="polite">
      <Icon name={icon} size={20} color={danger ? colors.danger : colors.brand} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="subheadline" color={danger ? colors.danger : colors.textPrimary}>
          {text}
        </Text>
        {action && (
          <Pressable onPress={action.onPress} accessibilityRole="link">
            <Text variant="subheadlineStrong" style={{ textDecorationLine: 'underline' }}>
              {action.label}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { flexDirection: 'row', gap: space.md, padding: space.md, borderRadius: radius.xl, backgroundColor: colors.surfaceSubtle },
  appIcon: { width: 40, height: 40, borderRadius: radius.md },
  pickers: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  picker: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: space.lg,
    paddingRight: space.sm,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  days: { flexDirection: 'row', gap: 4, paddingHorizontal: space.lg },
  day: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  dayOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  quickItem: {
    width: '31%',
    flexGrow: 1,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  alarm: { flexDirection: 'row', justifyContent: 'center', gap: space.sm },
  alarmUnit: { alignItems: 'center', gap: 4 },
  alarmCell: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.8,
    width: 104,
    height: 80,
    textAlign: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    color: colors.textPrimary,
    padding: 0,
  },
  colon: { fontFamily: fonts.display, fontSize: 40, lineHeight: 80, color: colors.textPrimary },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface },
  banner: { flexDirection: 'row', gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderCard },
});
