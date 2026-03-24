import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AddIcon from '@mui/icons-material/Add';
import { BaseCard } from '@/components/common';
import { useHydration } from './useHydration';

const PRESETS = [
  { label: '150 ml', value: 150 },
  { label: '250 ml', value: 250 },
  { label: '500 ml', value: 500 },
] as const;

const ProgressRing: React.FC<{ progress: number; effectiveMl: number; goalMl: number }> = ({ progress, effectiveMl, goalMl }) => {
  const pct = Math.round(progress * 100);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
      <CircularProgress variant="determinate" value={100} size={140} thickness={4} sx={{ color: 'rgba(64, 6, 188, 0.1)' }} />
      <CircularProgress variant="determinate" value={pct} size={140} thickness={4} sx={{
        color: '#4006BC', position: 'absolute', left: 0,
        '& .MuiCircularProgress-circle': { strokeLinecap: 'round', transition: 'stroke-dashoffset 0.6s ease-in-out' },
      }} />
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="#1A1A1A">{effectiveMl}</Typography>
        <Typography variant="caption" color="#666666">/ {goalMl} ml</Typography>
      </Box>
    </Box>
  );
};

const CompactView: React.FC = () => {
  const { dailyGoal, effectiveIntake, progress, logIntake } = useHydration();

  return (
    <BaseCard title="Smart Hydration" icon={<WaterDropIcon />}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ProgressRing progress={progress} effectiveMl={effectiveIntake} goalMl={dailyGoal} />
      </Box>

      <Box sx={{ backgroundColor: '#F9FAF9', borderLeft: '4px solid #4006BC', borderRadius: 2, p: 2.5, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AddIcon sx={{ color: '#4006BC', fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight="bold" color="#1A1A1A">Quick Log</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <Button
              key={p.value} variant="outlined" size="small"
              onClick={() => logIntake(p.value, false)}
              sx={{
                borderColor: '#4006BC', color: '#4006BC', borderRadius: 3, textTransform: 'none', fontWeight: 600,
                '&:hover': { backgroundColor: 'rgba(64, 6, 188, 0.06)', borderColor: '#4006BC' },
              }}
            >
              {p.label}
            </Button>
          ))}
        </Box>
      </Box>
    </BaseCard>
  );
};

export default CompactView;
