import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

export const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null; // Prevents hydration mismatch
  }

  const handleToggle = () => {
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  const getTooltip = () => {
    switch (mode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      default:
        return 'System Preference';
    }
  };

  return (
    <Tooltip title={getTooltip()}>
      <IconButton onClick={handleToggle} color="inherit" aria-label="Toggle Theme">
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};
