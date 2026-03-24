import React from 'react';
import { Box, Typography } from '@mui/material';
import WavesIcon from '@mui/icons-material/Waves';
import { BaseCard } from '@/components/common';

export const ExpandedView: React.FC = () => {
  return (
    <BaseCard
      title={<Typography variant="h4" fontWeight="bold" color="#1A1A1A">Ambient Noise</Typography>}
      description="Expanded immersive soundscapes coming soon..."
      icon={<WavesIcon fontSize="large" />}
      sx={{ minHeight: '100%', pt: 4, pb: 8, px: { xs: 2, md: 6 } }}
    >
      <Box sx={{ mt: 4, p: 4, bgcolor: '#F9FAF9', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary.main">
          Detailed mixer and volume controls will be available here.
        </Typography>
      </Box>
    </BaseCard>
  );
};

export default ExpandedView;
