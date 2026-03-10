import React, { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { BaseCard } from "@/components/common";
import { SettingsStepper } from "@/components/SettingsStepper";
import { useAudioPlayer } from "./hooks";
import { useAmbientStepperList } from "./StepperConfig";
import { useDashboardStore } from "@/store";
import { WIDGET_IDS } from "@/constants";

export const AmbientNoise: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settings = useDashboardStore(
    (state) => state.widgetSettings[WIDGET_IDS.AMBIENT_NOISE] || {},
  );
  const updateSettings = useDashboardStore(
    (state) => state.updateWidgetSettings,
  );

  const { isLoaded, error } = useAudioPlayer({
    activeSound: (settings.activeSound as string) || "rain",
    volume: (settings.volume as number) || 0.5,
    isPlaying,
  });

  const steps = useAmbientStepperList({
    settings,
    onChange: (patch) => updateSettings(WIDGET_IDS.AMBIENT_NOISE, patch),
  });

  const soundNameMap: Record<string, string> = {
    rain: "Soft Rain",
    forest: "Forest Birds",
    white: "White Noise",
  };

  return (
    <BaseCard
      title="Ambient Noise"
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: isPlaying
                ? "secondary.light"
                : "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isPlaying
                ? "0 8px 32px rgba(168, 196, 162, 0.4)"
                : "none",
              transition: "all 0.4s ease",
              mb: 4,
            }}
          >
            <GraphicEqIcon
              sx={{
                fontSize: 60,
                color: isPlaying ? "secondary.dark" : "text.disabled",
                animation: isPlaying ? "pulse 2s infinite" : "none",
                "@keyframes pulse": {
                  "0%": { opacity: 0.6, transform: "scale(0.95)" },
                  "50%": { opacity: 1, transform: "scale(1.05)" },
                  "100%": { opacity: 0.6, transform: "scale(0.95)" },
                },
              }}
            />
          </Box>

          <Typography variant="h5" color="text.secondary" gutterBottom>
            {soundNameMap[settings.activeSound as string] || "Soft Rain"}
          </Typography>

          {error ? (
            <Typography variant="body2" color="error" sx={{ mb: 3 }}>
              Unable to load audio
            </Typography>
          ) : !isLoaded && isPlaying ? (
            <CircularProgress size={24} sx={{ mb: 3 }} />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Volume: {Math.round(((settings.volume as number) || 0.5) * 100)}%
            </Typography>
          )}

          <IconButton
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!isLoaded && !isPlaying && !error}
            sx={{
              width: 64,
              height: 64,
              backgroundColor: "secondary.main",
              color: "white",
              "&:hover": { backgroundColor: "secondary.dark" },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            {isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </IconButton>
        </Box>
      )}
    </BaseCard>
  );
};

export default AmbientNoise;
