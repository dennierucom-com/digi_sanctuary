/* ------------------------------------------------------------------ */
/*  Smart Hydration – Domain Types                                     */
/* ------------------------------------------------------------------ */

/** Body composition phenotype used for hydration adjustment. */
export type BodyComposition = 'average' | 'high-muscle' | 'high-adipose';

/** Chronic conditions that affect hydration recommendations. */
export type ChronicCondition =
  | 'hypertension'
  | 'renal-insufficiency'
  | 'cardiac-insufficiency';

/* ------------------------------------------------------------------ */
/*  Health Profile                                                     */
/* ------------------------------------------------------------------ */

export interface HealthProfile {
  /** Body weight in kilograms. */
  weightKg: number;

  /** Body composition phenotype. */
  bodyComposition: BodyComposition;

  /** Enable +20% altitude / low-humidity factor (e.g. Cochabamba). */
  enableAltitude: boolean;

  /** Maternal health flags. */
  isPregnant: boolean;
  isBreastfeeding: boolean;

  /** Active chronic conditions. */
  chronicConditions: ChronicCondition[];
}

/* ------------------------------------------------------------------ */
/*  Intake Logging                                                     */
/* ------------------------------------------------------------------ */

export interface IntakeLog {
  /** ISO-8601 timestamp. */
  timestamp: string;

  /** Raw amount logged in ml. */
  amountMl: number;

  /** Whether natural additives (salt + lemon) were used. */
  withAdditives: boolean;

  /** Effective ml after osmotic bonus (×1.2 if additives). */
  effectiveMl: number;
}

/* ------------------------------------------------------------------ */
/*  Persisted Widget State                                             */
/* ------------------------------------------------------------------ */

export interface HydrationSettings {
  profile: HealthProfile;

  /** Intake logs for the current day (ISO date string key is managed by the hook). */
  logs: IntakeLog[];

  /** ISO date string of the last active day — used to auto-reset logs. */
  lastActiveDate: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

export const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  weightKg: 70,
  bodyComposition: 'average',
  enableAltitude: true, // default ON for Cochabamba users
  isPregnant: false,
  isBreastfeeding: false,
  chronicConditions: [],
};

export const DEFAULT_HYDRATION_SETTINGS: HydrationSettings = {
  profile: DEFAULT_HEALTH_PROFILE,
  logs: [],
  lastActiveDate: new Date().toISOString().slice(0, 10),
};
