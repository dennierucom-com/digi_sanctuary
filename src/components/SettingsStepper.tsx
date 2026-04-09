import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { M3Button } from "./common";
import { APP_STRINGS } from "@/constants";

export interface StepperStep {
  label: string;
  content: React.ReactNode;
}

export interface SettingsStepperProps {
  steps: StepperStep[];
  onFinish?: () => void;
  onCancel?: () => void;
}

export const SettingsStepper: React.FC<SettingsStepperProps> = ({
  steps,
  onFinish,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onFinish?.();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 2 }}>{steps[activeStep]?.content}</Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <M3Button disabled={activeStep === 0} onClick={handleBack} tonal>
          {APP_STRINGS.STEPPER_BACK}
        </M3Button>
        <Box>
          {onCancel && (
            <M3Button onClick={onCancel} sx={{ mr: 1 }} tonal>
              Cancel
            </M3Button>
          )}
          <M3Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1
              ? APP_STRINGS.STEPPER_FINISH
              : APP_STRINGS.STEPPER_NEXT}
          </M3Button>
        </Box>
      </Box>
    </Box>
  );
};
