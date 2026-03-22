import React from "react";
import { Card, CardProps, CardContent, Typography, Box } from "@mui/material";

export interface BaseCardProps extends Omit<CardProps, "title"> {
  title?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  icon,
  action,
  children,
  sx,
  ...props
}) => {
  return (
    <Card sx={{ p: 2.5, ...sx }} {...props}>
      {(title || action || icon || description) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            pb: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, width: "100%" }}>
            {icon && (
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1px solid #4006BC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4006BC",
                }}
              >
                {icon}
              </Box>
            )}
            <Box>
              {typeof title === "string" ? (
                <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "#1A1A1A" }}>
                  {title}
                </Typography>
              ) : (
                title
              )}
              {description && (
                <Typography variant="body2" sx={{ color: "#666666", mt: 1 }}>
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
          {action && <Box sx={{ ml: 2, flexShrink: 0 }}>{action}</Box>}
        </Box>
      )}
      <CardContent sx={{ p: "0 !important" }}>{children}</CardContent>
    </Card>
  );
};
