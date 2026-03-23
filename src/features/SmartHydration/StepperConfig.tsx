import React from "react";
import { StepperStep } from "@/components/SettingsStepper";
import {
  Box,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import type { HealthProfile, BodyComposition, ChronicCondition } from "./types";

interface StepperConfigProps {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}

/** Helper to read the nested profile from flat widget settings. */
function getProfile(settings: Record<string, unknown>): HealthProfile {
  return (settings.profile as HealthProfile) ?? {
    weightKg: 70,
    bodyComposition: "average" as const,
    enableAltitude: true,
    isPregnant: false,
    isBreastfeeding: false,
    chronicConditions: [],
  };
}

const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "primary.main" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "primary.main",
  },
};

export const useHydrationStepperList = ({
  settings,
  onChange,
}: StepperConfigProps): StepperStep[] => {
  const profile = getProfile(settings);
  const updateProfile = (patch: Partial<HealthProfile>) => {
    onChange({ profile: { ...profile, ...patch } });
  };

  const toggleCondition = (cond: ChronicCondition) => {
    const has = profile.chronicConditions.includes(cond);
    updateProfile({
      chronicConditions: has
        ? profile.chronicConditions.filter((c) => c !== cond)
        : [...profile.chronicConditions, cond],
    });
  };

  return [
    {
      label: "Body Metrics",
      content: (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Body Weight: <strong>{profile.weightKg} kg</strong>
            </Typography>
            <Slider
              value={profile.weightKg}
              min={30}
              max={200}
              step={1}
              onChange={(_, val) => updateProfile({ weightKg: val as number })}
              valueLabelDisplay="auto"
              sx={{ color: "primary.main" }}
            />
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel id="hydration-body-comp-label">
              Body Composition
            </InputLabel>
            <Select
              labelId="hydration-body-comp-label"
              value={profile.bodyComposition}
              label="Body Composition"
              onChange={(e) =>
                updateProfile({
                  bodyComposition: e.target.value as BodyComposition,
                })
              }
            >
              <MenuItem value="average">Average</MenuItem>
              <MenuItem value="high-muscle">High Muscle Mass (+10%)</MenuItem>
              <MenuItem value="high-adipose">
                High Adipose Tissue (−5%)
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      ),
    },
    {
      label: "Environment",
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={profile.enableAltitude}
                onChange={(_, val) => updateProfile({ enableAltitude: val })}
                sx={switchSx}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                High Altitude / Low Humidity (+20%)
              </Typography>
            }
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Enable this if you live in a high-altitude or dry-climate area
            (e.g. Cochabamba, ~2,500 m). Increases your daily goal by 20% to
            compensate for insensible respiratory water loss.
          </Typography>
        </Box>
      ),
    },
    {
      label: "Maternal Health",
      content: (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={profile.isPregnant}
                onChange={(_, val) => updateProfile({ isPregnant: val })}
                sx={switchSx}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Pregnancy (+300 ml)
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={profile.isBreastfeeding}
                onChange={(_, val) => updateProfile({ isBreastfeeding: val })}
                sx={switchSx}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Breastfeeding (+750 ml)
              </Typography>
            }
          />
        </Box>
      ),
    },
    {
      label: "Conditions",
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select any chronic conditions that apply. Your daily goal and
            available options will adjust automatically.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            {(
              [
                { key: "hypertension" as const, label: "Hypertension" },
                {
                  key: "renal-insufficiency" as const,
                  label: "Renal Insufficiency",
                },
                {
                  key: "cardiac-insufficiency" as const,
                  label: "Cardiac Insufficiency",
                },
              ]
            ).map(({ key, label }) => {
              const active = profile.chronicConditions.includes(key);
              return (
                <Chip
                  key={key}
                  label={label}
                  variant={active ? "filled" : "outlined"}
                  onClick={() => toggleCondition(key)}
                  sx={{
                    borderColor: "primary.main",
                    ...(active && {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }),
                  }}
                />
              );
            })}
          </Box>
        </Box>
      ),
    },
  ];
};
