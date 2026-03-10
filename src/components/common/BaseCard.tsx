import React from "react";
import { Card, CardProps, CardContent, Typography, Box } from "@mui/material";

export interface BaseCardProps extends Omit<CardProps, "title"> {
  title?: React.ReactNode;
  action?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  action,
  children,
  sx,
  ...props
}) => {
  return (
    <Card sx={{ ...sx }} {...props}>
      {(title || action) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 3,
            pb: 1,
          }}
        >
          {typeof title === "string" ? (
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
          ) : (
            title
          )}
          {action && <Box>{action}</Box>}
        </Box>
      )}
      <CardContent sx={{ px: 3, pb: "24px !important" }}>
        {children}
      </CardContent>
    </Card>
  );
};
