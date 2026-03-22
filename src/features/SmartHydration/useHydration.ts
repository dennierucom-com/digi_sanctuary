import { useMemo, useCallback, useRef } from 'react';
import { useDashboardStore } from '@/store';
import { WIDGET_IDS } from '@/constants';
import type {
  HealthProfile,
  HydrationSettings,
  IntakeLog,
} from './types';
import { DEFAULT_HYDRATION_SETTINGS } from './types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Base formula: 35-40 ml/kg — we use the midpoint. */
const ML_PER_KG = 37.5;

/** Phenotype modifiers (multiplied onto base). */
const PHENOTYPE_FACTOR: Record<string, number> = {
  'average': 1.0,
  'high-muscle': 1.10,   // +10 %
  'high-adipose': 0.95,  // −5 %
};

/** Additional ml for altitude / low-humidity environments. */
const ALTITUDE_FACTOR = 1.20; // +20 %

/** Fixed maternal additions (ml). */
const PREGNANCY_BONUS_ML = 300;
const BREASTFEEDING_BONUS_ML = 750; // midpoint of 700-800

/** Hard cap when renal or cardiac insufficiency is active (ml). */
const RESTRICTED_CAP_ML = 1500;

/** Osmotic bonus multiplier when natural additives are used. */
const ADDITIVE_MULTIPLIER = 1.20; // +20 % via SGLT1 activation

/** Medical disclaimer shown for restricted profiles. */
const RESTRICTION_DISCLAIMER =
  'This recommendation is not a substitute for professional medical advice. ' +
  'Patients with renal or cardiac insufficiency should consult their physician ' +
  'before adjusting fluid intake.';

/* ------------------------------------------------------------------ */
/*  Notification Tone (Web Audio API)                                  */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;

function playIntakeTone() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);          // A5
    osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.08); // up to E6

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.25);
  } catch {
    // Silently ignore — browser may block audio before user gesture.
  }
}

/* ------------------------------------------------------------------ */
/*  Today helper                                                       */
/* ------------------------------------------------------------------ */

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useHydration() {
  const raw = useDashboardStore(
    (state) => (state.widgetSettings[WIDGET_IDS.SMART_HYDRATION] ?? DEFAULT_HYDRATION_SETTINGS) as HydrationSettings,
  );
  const updateSettings = useDashboardStore((state) => state.updateWidgetSettings);

  // Auto-reset logs on a new day
  const settings = useMemo<HydrationSettings>(() => {
    const today = todayISO();
    if (raw.lastActiveDate !== today) {
      return { ...raw, logs: [], lastActiveDate: today };
    }
    return raw;
  }, [raw]);

  const { profile, logs } = settings;

  /* ---- Derived booleans ---- */

  const hasHypertension = profile.chronicConditions.includes('hypertension');
  const isRestricted =
    profile.chronicConditions.includes('renal-insufficiency') ||
    profile.chronicConditions.includes('cardiac-insufficiency');

  /* ---- Daily goal calculation ---- */

  const dailyGoal = useMemo(() => {
    let goal = profile.weightKg * ML_PER_KG;

    // Phenotype
    goal *= PHENOTYPE_FACTOR[profile.bodyComposition] ?? 1;

    // Altitude / climate
    if (profile.enableAltitude) goal *= ALTITUDE_FACTOR;

    // Maternal
    if (profile.isPregnant) goal += PREGNANCY_BONUS_ML;
    if (profile.isBreastfeeding) goal += BREASTFEEDING_BONUS_ML;

    // Restriction cap
    if (isRestricted) goal = Math.min(goal, RESTRICTED_CAP_ML);

    return Math.round(goal);
  }, [profile, isRestricted]);

  /* ---- Intake totals ---- */

  const totalIntake = useMemo(
    () => logs.reduce((sum, l) => sum + l.amountMl, 0),
    [logs],
  );

  const effectiveIntake = useMemo(
    () => logs.reduce((sum, l) => sum + l.effectiveMl, 0),
    [logs],
  );

  const progress = dailyGoal > 0 ? Math.min(effectiveIntake / dailyGoal, 1) : 0;

  /* ---- Actions ---- */

  /** Used to guard against double-taps within 300 ms. */
  const lastLogRef = useRef(0);

  const persist = useCallback(
    (patch: Partial<HydrationSettings>) => {
      updateSettings(WIDGET_IDS.SMART_HYDRATION, { ...settings, ...patch });
    },
    [settings, updateSettings],
  );

  const logIntake = useCallback(
    (amountMl: number, withAdditives: boolean) => {
      // Debounce rapid taps
      const now = Date.now();
      if (now - lastLogRef.current < 300) return;
      lastLogRef.current = now;

      const effectiveMl = Math.round(
        withAdditives ? amountMl * ADDITIVE_MULTIPLIER : amountMl,
      );

      const entry: IntakeLog = {
        timestamp: new Date().toISOString(),
        amountMl,
        withAdditives,
        effectiveMl,
      };

      persist({
        logs: [...settings.logs, entry],
        lastActiveDate: todayISO(),
      });

      playIntakeTone();
    },
    [settings.logs, persist],
  );

  const updateProfile = useCallback(
    (patch: Partial<HealthProfile>) => {
      persist({ profile: { ...profile, ...patch } });
    },
    [profile, persist],
  );

  return {
    profile,
    logs,
    dailyGoal,
    totalIntake,
    effectiveIntake,
    progress,
    logIntake,
    updateProfile,

    /** True when hypertension is active — disable sodium additives. */
    isSodiumWarning: hasHypertension,

    /** True when renal/cardiac insufficiency is active — show restriction UI. */
    isRestricted,

    /** Disclaimer text for restricted profiles. */
    disclaimerText: RESTRICTION_DISCLAIMER,
  } as const;
}
