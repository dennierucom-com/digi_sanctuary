import React from "react";
import { StepperStep } from "@/components/SettingsStepper";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
} from "@mui/material";
import { BreathingPattern } from "./hooks";

interface StepperConfigProps {
  settings: any;
  onChange: (patch: any) => void;
}

export const useBreathingStepperList = ({
  settings,
  onChange,
}: StepperConfigProps): StepperStep[] => {
  return [
    {
      label: "Pattern",
      content: (
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="pattern-select-label">Breathing Pattern</InputLabel>
          <Select
            labelId="pattern-select-label"
            value={settings?.pattern || "4-7-8"}
            label="Breathing Pattern"
            onChange={(e) =>
              onChange({ pattern: e.target.value as BreathingPattern })
            }
          >
            <MenuItem value="4-7-8">4-7-8 (Relaxation)</MenuItem>
            <MenuItem value="box">Box (Focus)</MenuItem>
            <MenuItem value="relax">4-6 (Calm)</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      label: "Speed",
      content: (
        <Box sx={{ mt: 2, px: 2 }}>
          <Typography gutterBottom>
            Cycle Speed Modifier ({settings?.speed || 1}x)
          </Typography>
          <Slider
            value={settings?.speed || 1}
            min={0.5}
            max={2}
            step={0.1}
            onChange={(_, val) => onChange({ speed: val })}
            valueLabelDisplay="auto"
            marks={[
              { value: 0.5, label: "0.5x" },
              { value: 1, label: "Normal" },
              { value: 2, label: "2x" },
            ]}
          />
        </Box>
      ),
    },
    {
      label: "Visual Style",
      content: (
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="style-select-label">Visualizer Style</InputLabel>
          <Select
            labelId="style-select-label"
            value={settings?.visualStyle || "circle"}
            label="Visualizer Style"
            onChange={(e) => onChange({ visualStyle: e.target.value })}
          >
            <MenuItem value="circle">Expanding Circle</MenuItem>
            <MenuItem value="square">Pulsing Square</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];
};
