import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Switch, FormControlLabel, Alert, CircularProgress, Stack } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { motion } from 'framer-motion';
import { BaseCard } from '@/components/common';
import { SettingsStepper } from '@/components/SettingsStepper';
import { useHydration } from './useHydration';
import { useHydrationStepperList } from './StepperConfig';
import { useDashboardStore } from '@/store';
import { WIDGET_IDS } from '@/constants';

const PRESETS = [
  { label: '150 ml', value: 150 },
  { label: '250 ml', value: 250 },
  { label: '500 ml', value: 500 },
] as const;

const ProgressRing: React.FC<{ progress: number; effectiveMl: number; goalMl: number }> = ({ progress, effectiveMl, goalMl }) => {
  const pct = Math.round(progress * 100);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
      <CircularProgress variant="determinate" value={100} size={240} thickness={4} sx={{ color: 'rgba(64, 6, 188, 0.1)' }} />
      <CircularProgress variant="determinate" value={pct} size={240} thickness={4} sx={{
        color: '#4006BC', position: 'absolute', left: 0,
        '& .MuiCircularProgress-circle': { strokeLinecap: 'round', transition: 'stroke-dashoffset 0.6s ease-in-out' },
      }} />
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color="#1A1A1A">{effectiveMl}</Typography>
        <Typography variant="subtitle1" color="#666666">/ {goalMl} ml</Typography>
      </Box>
    </Box>
  );
};

// Simulated chart component using Framer Motion
const TimelineChart: React.FC<{ logs: any[] }> = () => {
  return (
    <Box sx={{ mt: 4, mb: 2, height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', p: 2, bgcolor: '#F9FAF9', borderRadius: 2 }}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: Math.random() * 100 + 20 }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
          style={{ width: '6%', backgroundColor: '#4006BC', borderRadius: '4px 4px 0 0', opacity: 0.8 }}
        />
      ))}
    </Box>
  );
};

export const ExpandedView: React.FC = () => {
  const { dailyGoal, effectiveIntake, progress, logIntake, isSodiumWarning, isRestricted, disclaimerText, logs } = useHydration();
  const [additivesOn, setAdditivesOn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const effectiveAdditives = isSodiumWarning ? false : additivesOn;

  const settings = useDashboardStore((state) => state.widgetSettings[WIDGET_IDS.SMART_HYDRATION] || {});
  const updateSettings = useDashboardStore((state) => state.updateWidgetSettings);
  const steps = useHydrationStepperList({ settings, onChange: (patch) => updateSettings(WIDGET_IDS.SMART_HYDRATION, patch) });

  return (
    <BaseCard
      title={<Typography variant="h4" fontWeight="bold" color="#1A1A1A">Smart Hydration</Typography>}
      description="Personalized daily water goal based on your body metrics, environment, and health profile with clinical precision."
      icon={<WaterDropIcon fontSize="large" />}
      action={<IconButton onClick={() => setShowSettings(!showSettings)}><SettingsIcon /></IconButton>}
      sx={{ minHeight: '100%', pt: 4, pb: 8, px: { xs: 2, md: 6 } }}
    >
      {showSettings ? (
        <SettingsStepper steps={steps} onFinish={() => setShowSettings(false)} />
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ProgressRing progress={progress} effectiveMl={effectiveIntake} goalMl={dailyGoal} />
            </Box>
            
            <Box sx={{ flex: 1, maxWidth: 500, width: '100%' }}>
              <Box sx={{ backgroundColor: '#F9FAF9', borderLeft: '4px solid #4006BC', borderRadius: 2, p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AddIcon sx={{ color: '#4006BC', fontSize: 24 }} />
                  <Typography variant="h6" fontWeight="bold" color="#1A1A1A">Quick Log Intake</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  {PRESETS.map((p) => (
                    <Button
                      key={p.value} variant="outlined" size="medium"
                      onClick={() => logIntake(p.value, effectiveAdditives)}
                      sx={{ borderColor: '#4006BC', color: '#4006BC', borderRadius: 4, textTransform: 'none', fontWeight: 600, py: 1, px: 3, '&:hover': { backgroundColor: 'rgba(64, 6, 188, 0.06)', borderColor: '#4006BC' } }}
                    >
                      {p.label}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScienceIcon sx={{ color: '#666666' }} />
                  <FormControlLabel
                    control={<Switch checked={effectiveAdditives} onChange={(_, val) => setAdditivesOn(val)} disabled={isSodiumWarning} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4006BC' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4006BC' } }} />}
                    label={<Typography variant="body1" color="#666666">Natural Additives (Salt + Lemon) — +20% absorption</Typography>}
                  />
                </Box>
              </Box>

              {isSodiumWarning && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                  <strong>Sodium Warning:</strong> Hypertension detected in your profile. Salt additives have been disabled safely.
                </Alert>
              )}
              {isRestricted && (
                <Alert severity="error" icon={<LocalHospitalIcon />} sx={{ mb: 2, borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight="bold">Intake Restricted to {dailyGoal} ml/day</Typography>
                  <Typography variant="caption" color="text.secondary">{disclaimerText}</Typography>
                </Alert>
              )}
            </Box>
          </Stack>
          
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight="bold" color="#1A1A1A" gutterBottom>Today's Intake Pattern</Typography>
            <TimelineChart logs={logs} />
          </Box>
        </motion.div>
      )}
    </BaseCard>
  );
};

export default ExpandedView;
