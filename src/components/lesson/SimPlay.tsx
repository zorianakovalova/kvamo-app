import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { applyOpt, initialSimState, SIM_ICONS, simResult, type SimDef, type SimResult, type SimState } from '@/data/sims';
import { saveSimResult } from '@/store/sims';
import { colors, radius, space } from '@/theme/tokens';
import { FeedbackPanel, LessonFrame, Option } from './LessonUI';

const HERO = require('../../../assets/img/sim/hero.png');
const STARS = require('../../../assets/img/sim/stars.png');
const STAT = [require('../../../assets/img/sim/st-ok.png'), require('../../../assets/img/sim/st-pay.png')];

/** Tile with an icon, a big value and a caption (Figma "Плитка"). */
function Tile({ icon, value, sub, small }: { icon: keyof typeof SIM_ICONS; value: string; sub: string; small?: boolean }) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${value}, ${sub}`}>
      <Image source={SIM_ICONS[icon]} style={small ? styles.iconSmall : styles.icon} contentFit="contain" />
      <Text variant="number24" adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center' }}>
        {value}
      </Text>
      <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
        {sub}
      </Text>
    </View>
  );
}

/** Intro card tile: small icon on the left of the text. */
function IntroTile({ icon, label, value }: { icon: keyof typeof SIM_ICONS; label: string; value: string }) {
  return (
    <View style={styles.introTile} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.introIcon}>
        <Image source={SIM_ICONS[icon]} style={{ width: 36, height: 36 }} contentFit="contain" />
      </View>
      <Text variant="text14" color={colors.textSecondary}>
        {label}
      </Text>
      <Text variant="number24" style={{ fontSize: 20, lineHeight: 26 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Stat({ index, value, caption }: { index: 0 | 1; value: string; caption: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${caption}`}>
      <Image source={STAT[index]} style={{ width: 36, height: 36 }} contentFit="contain" />
      <View style={{ flex: 1 }}>
        <Text variant="number24" style={{ fontSize: 16, lineHeight: 20 }} adjustsFontSizeToFit numberOfLines={1}>
          {value}
        </Text>
        <Text variant="caption" color={colors.textSecondary}>
          {caption}
        </Text>
      </View>
    </View>
  );
}

function ResultView({ result, onAgain }: { result: SimResult; onAgain: () => void }) {
  const toLibrary = () => (router.canGoBack() ? router.back() : router.replace('/library'));
  return (
    <LessonFrame
      onClose={toLibrary}
      footer={
        <>
          <Button label="Пройти ще раз" onPress={onAgain} />
          <Button label="До Бібліотеки" variant="secondary" onPress={toLibrary} />
          <Button label="Завершити на сьогодні" variant="link" onPress={() => router.replace('/')} />
        </>
      }
    >
      <View style={{ alignItems: 'center', paddingTop: space.lg }}>
        <Image source={STARS} style={{ width: 225, aspectRatio: 675 / 341 }} contentFit="contain" accessibilityLabel="Три зірки" />
      </View>
      <View style={{ gap: space.sm }}>
        <View style={styles.row}>
          <Tile icon={result.icons[0]} value={result.t1[0]} sub={result.t1[1]} />
          <Tile icon={result.icons[1]} value={result.t2[0]} sub={result.t2[1]} />
        </View>
        <View style={styles.row}>
          <Stat index={0} value={result.chips[0][0]} caption={result.chips[0][1]} />
          <Stat index={1} value={result.chips[1][0]} caption={result.chips[1][1]} />
        </View>
      </View>
    </LessonFrame>
  );
}

/** Library simulation: intro, one decision per step with a risk sheet, then the result. */
export function SimPlay({ def, show }: { def: SimDef; show?: SimResult }) {
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>(show ? 'result' : 'intro');
  const [state, setState] = useState<SimState>(() => initialSimState(def));
  const [result, setResult] = useState<SimResult | undefined>(show);
  const [picked, setPicked] = useState<number | null>(null);
  const [risk, setRisk] = useState<{ title: string; text: string } | null>(null);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/library'));
  const total = def.steps.length;
  const step = def.steps[Math.min(risk ? state.n - 1 : state.n, total - 1)];

  const restart = () => {
    setState(initialSimState(def));
    setPicked(null);
    setRisk(null);
    setPhase('intro');
  };

  const advance = (next: SimState) => {
    if (next.n >= total) {
      const r = simResult(def, next);
      saveSimResult(def.id, r);
      setResult(r);
      setPhase('result');
    }
  };

  const choose = () => {
    if (picked === null) return;
    const o = step.opts[picked];
    const next = applyOpt(def, state, o);
    setState(next);
    setPicked(null);
    if (o.risk) setRisk(o.risk);
    else advance(next);
  };

  if (phase === 'result' && result) return <ResultView result={result} onAgain={restart} />;

  if (phase === 'intro') {
    return (
      <LessonFrame onClose={close} footer={<Button label={def.cta} onPress={() => setPhase('play')} />}>
        <Image source={HERO} style={styles.hero} contentFit="contain" accessibilityIgnoresInvertColors />
        <View style={{ gap: space.sm }}>
          <Text variant="title1" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
            {def.title}
          </Text>
          <Text variant="text16" color={colors.textSecondary} style={{ paddingHorizontal: 4 }}>
            {def.intro}
          </Text>
        </View>
        <View style={{ gap: space.sm }}>
          <View style={styles.row}>
            <IntroTile icon={def.icons[0]} label={def.introTiles[0][0]} value={def.introTiles[0][1]} />
            <IntroTile icon={def.icons[1]} label={def.introTiles[1][0]} value={def.introTiles[1][1]} />
          </View>
          <View style={styles.stepsCard}>
            <Text variant="text14Medium">{def.stepsLabel}</Text>
            <View style={styles.stepsRow}>
              {def.steps.map((_, i) => (
                <View key={i} style={styles.stepDot}>
                  <Text variant="text14Medium">{i + 1}</Text>
                </View>
              ))}
              <Text variant="text16">→</Text>
              <View style={[styles.stepDot, { backgroundColor: colors.accent }]}>
                <Icon name="flag" size={18} color={colors.ink} />
              </View>
            </View>
          </View>
        </View>
      </LessonFrame>
    );
  }

  const [t1v, t1s] = def.tile1(state, false);
  const [t2v, t2s] = def.tile2(state, false);
  const title = typeof step.title === 'function' ? step.title(state) : step.title;
  const shown = risk ? Math.min(state.n, total) : state.n + 1;

  return (
    <LessonFrame
      total={total}
      done={Math.min(shown, total)}
      onClose={close}
      footer={<Button label="Обрати" disabled={picked === null} onPress={choose} />}
      feedback={
        risk ? (
          <FeedbackPanel tone="risk" title={risk.title} text={risk.text}>
            <Button
              label="Далі"
              onPress={() => {
                setRisk(null);
                advance(state);
              }}
            />
          </FeedbackPanel>
        ) : null
      }
    >
      <View style={{ gap: space.sm }}>
        <View style={styles.row}>
          <Tile icon={def.icons[0]} value={t1v} sub={t1s} />
          <Tile icon={def.icons[1]} value={t2v} sub={t2s} />
        </View>
        <Image source={step.scene} style={{ width: '100%', aspectRatio: 361 / step.height }} contentFit="contain" accessibilityIgnoresInvertColors />
        <Text variant="text20Strong" accessibilityRole="header" style={{ paddingHorizontal: 4 }}>
          {title}
        </Text>
        <View style={{ gap: space.sm }}>
          {step.opts.map((o, i) => (
            <Option key={o.label} label={o.label} value={o.value} state={picked === i ? 'selected' : 'idle'} disabled={!!risk} onPress={() => setPicked(i)} />
          ))}
        </View>
      </View>
    </LessonFrame>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  tile: { flex: 1, minHeight: 141, backgroundColor: colors.surface, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: 4, padding: space.md },
  icon: { width: 66, height: 66 },
  iconSmall: { width: 48, height: 48 },
  hero: { width: '100%', aspectRatio: 1064 / 396 },
  introTile: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, gap: 2 },
  introIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.backgroundTertiary, alignItems: 'center', justifyContent: 'center', marginBottom: space.xs },
  stepsCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, gap: space.md },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.backgroundTertiary, alignItems: 'center', justifyContent: 'center' },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md },
});
