import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { BaseCard } from '@/components/common';
import { SettingsStepper } from '@/components/SettingsStepper';
import { useHydration } from './useHydration';
import { useHydrationStepperList } from './StepperConfig';
import { useDashboardStore } from '@/store';
import { WIDGET_IDS } from '@/constants';

/* ------------------------------------------------------------------ */
/*  Preset amounts                                                     */
/* ------------------------------------------------------------------ */

const PRESETS = [
  { label: '150 ml', value: 150 },
  { label: '250 ml', value: 250 },
  { label: '500 ml', value: 500 },
] as const;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Circular progress ring with center text. */
const ProgressRing: React.FC<{
  progress: number;
  effectiveMl: number;
  goalMl: number;
}> = ({ progress, effectiveMl, goalMl }) => {
  const pct = Math.round(progress * 100);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
      {/* Background track */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={140}
        thickness={4}
        sx={{ color: 'rgba(64, 6, 188, 0.1)' }}
      />
      {/* Foreground */}
      <CircularProgress
        variant="determinate"
        value={pct}
        size={140}
        thickness={4}
        sx={{
          color: '#4006BC',
          position: 'absolute',
          left: 0,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
            transition: 'stroke-dashoffset 0.6s ease-in-out',
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#1A1A1A">
          {effectiveMl}
        </Typography>
        <Typography variant="caption" color="#666666">
          / {goalMl} ml
        </Typography>
      </Box>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Widget                                                        */
/* ------------------------------------------------------------------ */

const HydrationWidget: React.FC = () => {
  const {
    dailyGoal,
    effectiveIntake,
    progress,
    logIntake,
    isSodiumWarning,
    isRestricted,
    disclaimerText,
  } = useHydration();

  const [additivesOn, setAdditivesOn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Force additives off when hypertension is active
  const effectiveAdditives = isSodiumWarning ? false : additivesOn;

  // Stepper config — reads profile from Zustand settings, same as other widgets
  const settings = useDashboardStore(
    (state) => state.widgetSettings[WIDGET_IDS.SMART_HYDRATION] || {},
  );
  const updateSettings = useDashboardStore(
    (state) => state.updateWidgetSettings,
  );

  const steps = useHydrationStepperList({
    settings,
    onChange: (patch) => updateSettings(WIDGET_IDS.SMART_HYDRATION, patch),
  });

  return (
    <BaseCard
      title="Smart Hydration"
      description="Personalized daily water goal based on your body metrics, environment, and health profile."
      icon={<WaterDropIcon />}
      action={
        <IconButton
          onClick={() => setShowSettings(!showSettings)}
          aria-label="settings"
        >
          <SettingsIcon />
        </IconButton>
      }
    >
      {showSettings ? (
        <SettingsStepper
          steps={steps}
          onFinish={() => setShowSettings(false)}
        />
      ) : (
        <>
          {/* ── Progress Ring ────────────────────────────── */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ProgressRing
              progress={progress}
              effectiveMl={effectiveIntake}
              goalMl={dailyGoal}
            />
          </Box>

          {/* ── Quick Log Action Card ────────────────────── */}
          <Box
            sx={{
              backgroundColor: '#F9FAF9',
              borderLeft: '4px solid #4006BC',
              borderRadius: 2,
              p: 2.5,
              mt: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AddIcon sx={{ color: '#4006BC', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="#1A1A1A">
                Quick Log
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {PRESETS.map((p) => (
                <Button
                  key={p.value}
                  variant="outlined"
                  size="small"
                  onClick={() => logIntake(p.value, effectiveAdditives)}
                  sx={{
                    borderColor: '#4006BC',
                    color: '#4006BC',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(64, 6, 188, 0.06)',
                      borderColor: '#4006BC',
                    },
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </Box>

            {/* Additives toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon sx={{ color: '#666666', fontSize: 18 }} />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={effectiveAdditives}
                    onChange={(_, val) => setAdditivesOn(val)}
                    disabled={isSodiumWarning}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#4006BC' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4006BC',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="#666666">
                    Natural Additives (Salt + Lemon) — +20% absorption
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* ── Safety Alerts ────────────────────────────── */}
          {isSodiumWarning && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Sodium Warning:</strong> Hypertension detected in your profile.
                Salt additives have been disabled for your safety.
              </Typography>
            </Alert>
          )}

          {isRestricted && (
            <Alert
              severity="error"
              icon={<LocalHospitalIcon />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Intake Restricted to {dailyGoal} ml/day
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {disclaimerText}
              </Typography>
            </Alert>
          )}
        </>
      )}
    </BaseCard>
  );
};

export default HydrationWidget;
