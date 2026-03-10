import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export const M3TextField: React.FC<TextFieldProps> = (props) => {
  return <TextField variant="outlined" fullWidth {...props} />;
};
