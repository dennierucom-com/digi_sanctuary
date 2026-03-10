import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import { BaseCard } from "@/components/common";
import { SettingsStepper } from "@/components/SettingsStepper";
import { useBreathingCycle, BreathingPattern } from "./hooks";
import { useBreathingStepperList } from "./StepperConfig";
import { useDashboardStore } from "@/store";
import { WIDGET_IDS } from "@/constants";

export const BreathingTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settings = useDashboardStore(
    (state) => state.widgetSettings[WIDGET_IDS.BREATHING_TOOL] || {},
  );
  const updateSettings = useDashboardStore(
    (state) => state.updateWidgetSettings,
  );

  const { phase, timeLeft, progress } = useBreathingCycle({
    pattern: (settings.pattern as BreathingPattern) || "4-7-8",
    speedMultiplier: (settings.speed as number) || 1,
    isActive,
  });

  const steps = useBreathingStepperList({
    settings,
    onChange: (patch) => updateSettings(WIDGET_IDS.BREATHING_TOOL, patch),
  });

  const getVisualScale = () => {
    if (!isActive) return 1;
    if (phase === "inhale") return 1 + progress * 0.5; // grows from 1 to 1.5
    if (phase === "exhale") return 1.5 - progress * 0.5; // shrinks from 1.5 to 1
    if (phase === "hold-in") return 1.5;
    return 1;
  };

  const getPhaseText = () => {
    if (!isActive) return "Ready";
    if (phase === "inhale") return "Breathe In";
    if (phase === "exhale") return "Breathe Out";
    return "Hold";
  };

  return (
    <BaseCard
      title="Breathing Tool"
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
              width: 150,
              height: 150,
              borderRadius: settings.visualStyle === "square" ? "16px" : "50%",
              backgroundColor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${getVisualScale()})`,
              transition: "transform 0.1s linear, border-radius 0.3s ease",
              boxShadow: "0 8px 32px rgba(196, 181, 224, 0.4)",
              mb: 6,
            }}
          >
            <Typography
              variant="h3"
              color="primary.contrastText"
              sx={{ zIndex: 1 }}
            >
              {isActive ? Math.ceil(timeLeft) : "---"}
            </Typography>
          </Box>

          <Typography variant="h5" color="text.secondary" gutterBottom>
            {getPhaseText()}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Pattern: {settings.pattern || "4-7-8"}
          </Typography>

          <IconButton
            onClick={() => setIsActive(!isActive)}
            color="primary"
            sx={{
              width: 64,
              height: 64,
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            {isActive ? (
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

export default BreathingTool;
