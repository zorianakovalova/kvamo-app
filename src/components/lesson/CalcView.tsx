import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Switch } from '@/components/profile/ProfileUI';
import { Text } from '@/components/Text';
import type { CalcState, CalcStep } from '@/data/lessons';
import { colors, radius, space, type } from '@/theme/tokens';
import { Blocks, ChoiceChips, DataTable, fmt, Header, LessonFrame, Option, Stats } from './LessonUI';

type Props = { step: CalcStep; total: number; done: number; onNext: () => void; onClose: () => void };

/** Calculator practice: editable amounts, toggles and chips, then a result computed from them. */
export function CalcView({ step, total, done, onNext, onClose }: Props) {
  const [s, setS] = useState<CalcState>({
    values: step.fields?.map((f) => f.value) ?? [],
    to: step.fields?.map((f) => f.to ?? 0) ?? [],
    text: step.textField?.value ?? '',
    on: step.toggles?.map((t) => t.on) ?? [],
    choice: step.choice?.value ?? 0,
    flag: step.flag?.value ?? false,
  });
  const [shown, setShown] = useState(false);

  if (shown) {
    const r = step.result(s);
    return (
      <LessonFrame total={total} done={done + 1} onClose={onClose} footer={<Button label={r.cta ?? 'Далі'} onPress={onNext} />}>
        <Header chips={step.chips} />
        {r.title ? <Header title={r.title} /> : null}
        {r.text ? <Blocks blocks={[{ t: 'text', text: r.text }]} /> : null}
        <Blocks blocks={r.blocks} />
      </LessonFrame>
    );
  }

  const setAt = (key: 'values' | 'to', i: number, v: string) => {
    const n = Number(v.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const next = [...s[key]];
    next[i] = n;
    setS({ ...s, [key]: next });
  };
  const sum = step.toggles?.reduce((acc, t, i) => acc + (s.on[i] ? t.amount : 0), 0) ?? 0;
  const live = step.live?.(s);

  return (
    <LessonFrame total={total} done={done} onClose={onClose} footer={<Button label={step.cta} onPress={() => setShown(true)} />}>
      <Header chips={step.chips} />
      <Header title={step.title} />
      {step.text ? (
        <Text variant="subheadline" color={colors.textSecondary} style={{ paddingHorizontal: 4, marginTop: -space.sm }}>
          {step.text}
        </Text>
      ) : null}
      {step.toggles ? (
        <View style={{ gap: space.sm }}>
          {step.toggles.map((t, i) => (
            <Option
              key={t.label}
              checkbox
              label={t.label}
              sub={t.sub}
              value={fmt(t.amount)}
              state={s.on[i] ? 'selected' : 'idle'}
              onPress={() => setS({ ...s, on: s.on.map((x, k) => (k === i ? !x : x)) })}
            />
          ))}
        </View>
      ) : null}
      {step.totalLabel ? <DataTable rows={[[step.totalLabel, fmt(sum)]]} total /> : null}
      {step.fields || step.textField ? (
        <View style={styles.card}>
          {step.fieldsTitle ? (
            <Text variant="footnote" color={colors.textSecondary} style={{ paddingTop: space.lg, paddingBottom: 2 }}>
              {step.fieldsTitle}
            </Text>
          ) : null}
          {step.textField ? (
            <View style={[styles.row, step.fields?.length ? styles.divider : null]}>
              <Text variant="body">{step.textField.label}</Text>
              <TextInput
                value={s.text}
                onChangeText={(text) => setS({ ...s, text })}
                accessibilityLabel={step.textField.label}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
          ) : null}
          {step.fields?.map((f, i, all) => (
            <View key={f.label} style={[styles.row, i < all.length - 1 && styles.divider]}>
              <Text variant="body" style={{ flex: 1 }}>
                {f.label}
              </Text>
              <NumberInput value={s.values[i]} onChange={(v) => setAt('values', i, v)} label={f.label} />
              {f.to != null ? (
                <>
                  <Text variant="body">→</Text>
                  <NumberInput value={s.to[i]} onChange={(v) => setAt('to', i, v)} label={`${f.label}, зараз`} />
                </>
              ) : null}
              <Text variant="body">{f.unit ?? 'грн'}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {step.choice ? <ChoiceChips label={step.choice.label} items={step.choice.items} value={s.choice} onChange={(choice) => setS({ ...s, choice })} /> : null}
      {step.flag ? (
        <View style={[styles.card, styles.row]}>
          <Text variant="body" style={{ flex: 1 }}>
            {step.flag.label}
          </Text>
          <Switch value={s.flag} onChange={(flag) => setS({ ...s, flag })} label={step.flag.label} />
        </View>
      ) : null}
      {live ? <Stats items={[live]} /> : null}
      {step.note ? (
        <Text variant="footnote" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
          {step.note}
        </Text>
      ) : null}
    </LessonFrame>
  );
}

function NumberInput({ value, onChange, label }: { value: number; onChange: (v: string) => void; label: string }) {
  return (
    <TextInput
      value={value ? String(value) : ''}
      onChangeText={onChange}
      keyboardType="numeric"
      inputMode="decimal"
      accessibilityLabel={label}
      placeholder="0"
      style={[styles.input, { minWidth: 44, maxWidth: 96 }]}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 47, paddingVertical: space.sm },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(11,16,13,0.1)' },
  input: { ...type.body, color: colors.textPrimary, textAlign: 'right', paddingVertical: 4, paddingHorizontal: 0 },
});
