 
import { StepperStep } from "@/components/SettingsStepper";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  Slider,
} from "@mui/material";

interface StepperConfigProps {
  settings: any;
  onChange: (patch: any) => void;
}

export const useAmbientStepperList = ({
  settings,
  onChange,
}: StepperConfigProps): StepperStep[] => {
  return [
    {
      label: "Soundscape",
      content: (
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="sound-select-label">Select Ambient Sound</InputLabel>
          <Select
            labelId="sound-select-label"
            value={settings?.activeSound || "rain"}
            label="Select Ambient Sound"
            onChange={(e) => onChange({ activeSound: e.target.value })}
          >
            <MenuItem value="rain">Soft Rain</MenuItem>
            <MenuItem value="forest">Forest Birds</MenuItem>
            <MenuItem value="white">White Noise</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      label: "Volume",
      content: (
        <Box sx={{ mt: 2, px: 2 }}>
          <Typography gutterBottom>
            Volume Level ({Math.round((settings?.volume || 0.5) * 100)}%)
          </Typography>
          <Slider
            value={settings?.volume || 0.5}
            min={0}
            max={1}
            step={0.05}
            onChange={(_, val) => onChange({ volume: val })}
            valueLabelDisplay="auto"
            valueLabelFormat={(val) => Math.round(val * 100)}
          />
        </Box>
      ),
    },
  ];
};
