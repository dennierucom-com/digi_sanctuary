import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
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
    (state) => state.widgetSettings[WIDGET_IDS.BREATHING_TOOL] || {}
  );
  const updateSettings = useDashboardStore(
    (state) => state.updateWidgetSettings
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
    if (phase === "inhale") return 1 + progress * 0.3; // grows from 1 to 1.3
    if (phase === "exhale") return 1.3 - progress * 0.3; // shrinks from 1.3 to 1
    if (phase === "hold-in") return 1.3;
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
      description="Guided breathing exercises to help you relax and focus. Select your preferred breathing pattern and follow along."
      icon={<SelfImprovementIcon />}
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
            borderLeft: "4px solid #6B9E6B", // Secondary accent color for differentiation
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
                borderRadius: settings.visualStyle === "square" ? "12px" : "50%",
                backgroundColor: "secondary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${getVisualScale()})`,
                transition: "transform 0.1s linear, border-radius 0.3s ease",
                boxShadow: "0 4px 12px rgba(107, 158, 107, 0.4)",
              }}
            >
              <Typography
                variant="h6"
                color="secondary.contrastText"
                sx={{ zIndex: 1, fontWeight: "bold" }}
              >
                {isActive ? Math.ceil(timeLeft) : "---"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                {getPhaseText()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${settings.pattern || "4-7-8"} Pattern`}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={() => setIsActive(!isActive)}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: "secondary.main",
              color: "white",
              "&:hover": { backgroundColor: "secondary.dark" },
              alignSelf: { xs: "flex-end", sm: "auto" },
            }}
          >
            {isActive ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
          </IconButton>
        </Box>
      )}
    </BaseCard>
  );
};

export default BreathingTool;
