import React from "react";
import { Button, ButtonProps } from "@mui/material";

export interface M3ButtonProps extends ButtonProps {
  /** If true, uses a subtle tonal background instead of solid. Works well for secondary actions. */
  tonal?: boolean;
}

export const M3Button: React.FC<M3ButtonProps> = ({ tonal, sx, ...props }) => {
  return (
    <Button
      disableElevation
      sx={{
        ...(tonal && {
          backgroundColor: "background.paper",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }),
        ...sx,
      }}
      {...props}
    />
  );
};
