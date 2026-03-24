import React from 'react';
import { Box, Typography } from '@mui/material';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import { BaseCard } from '@/components/common';

export const ExpandedView: React.FC = () => {
  return (
    <BaseCard
      title={<Typography variant="h4" fontWeight="bold" color="#1A1A1A">Breathing Tool</Typography>}
      description="Expanded immersive breathing exercises coming soon..."
      icon={<SelfImprovementIcon fontSize="large" />}
      sx={{ minHeight: '100%', pt: 4, pb: 8, px: { xs: 2, md: 6 } }}
    >
      <Box sx={{ mt: 4, p: 4, bgcolor: '#F9FAF9', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary.main">
          Full screen breathing exercises will be available here.
        </Typography>
      </Box>
    </BaseCard>
  );
};

export default ExpandedView;
