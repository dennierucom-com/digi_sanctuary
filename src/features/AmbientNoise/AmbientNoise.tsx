import React, { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import WavesIcon from "@mui/icons-material/Waves";
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
    (state) => state.widgetSettings[WIDGET_IDS.AMBIENT_NOISE] || {}
  );
  const updateSettings = useDashboardStore(
    (state) => state.updateWidgetSettings
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
      description="Select and play soothing background sounds to enhance focus and mask distractions."
      icon={<WavesIcon />}
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
            backgroundColor: "#F9FAF9",
            borderLeft: "4px solid #4006BC", // Primary accent color
            borderRadius: 2,
            p: 2.5,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mt: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: isPlaying ? "primary.light" : "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isPlaying ? "0 4px 12px rgba(147, 115, 181, 0.4)" : "none",
                transition: "all 0.4s ease",
              }}
            >
              <GraphicEqIcon
                sx={{
                  fontSize: 32,
                  color: isPlaying ? "primary.dark" : "text.disabled",
                  animation: isPlaying ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 0.6, transform: "scale(0.95)" },
                    "50%": { opacity: 1, transform: "scale(1.05)" },
                    "100%": { opacity: 0.6, transform: "scale(0.95)" },
                  },
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                {soundNameMap[settings.activeSound as string] || "Soft Rain"}
              </Typography>

              {error ? (
                <Typography variant="body2" color="error">
                  Unable to load audio
                </Typography>
              ) : !isLoaded && isPlaying ? (
                <CircularProgress size={16} sx={{ mt: 0.5 }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Volume: {Math.round(((settings.volume as number) || 0.5) * 100)}%
                </Typography>
              )}
            </Box>
          </Box>

          <IconButton
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!isLoaded && !isPlaying && !error}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.dark" },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
              alignSelf: { xs: "flex-end", sm: "auto" },
            }}
          >
            {isPlaying ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
          </IconButton>
        </Box>
      )}
    </BaseCard>
  );
};

export default AmbientNoise;
