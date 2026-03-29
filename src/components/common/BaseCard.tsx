import React, { useContext } from "react";
import { Card, CardProps, CardContent, Typography, Box, IconButton } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { useDashboardStore } from "@/store";
import { WidgetContext } from "@/contexts/WidgetContext";

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
  const widgetId = useContext(WidgetContext);
  const expandedWidgetId = useDashboardStore((state) => state.expandedWidgetId);
  const setExpandedWidget = useDashboardStore((state) => state.setExpandedWidget);

  const isExpanded = widgetId !== null && expandedWidgetId === widgetId;

  const handleExpandToggle = () => {
    if (isExpanded) {
      setExpandedWidget(null);
    } else if (widgetId) {
      setExpandedWidget(widgetId);
    }
  };

  return (
    <Card
      sx={{
        p: 2.5,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        ...(isExpanded && {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1300,
          borderRadius: 0,
          overflowY: "auto",
          m: 0,
        }),
        ...sx,
      }}
      {...props}
    >
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
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexShrink: 0, gap: 1 }}>
              {action}
              {widgetId && (
                <IconButton 
                  onClick={handleExpandToggle} 
                  sx={{ color: '#4006BC' }}
                  aria-label={isExpanded ? "Collapse widget" : "Expand widget"}
                >
                  {isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </IconButton>
              )}
            </Box>
        </Box>
      )}
      <CardContent sx={{ p: "0 !important" }}>{children}</CardContent>
    </Card>
  );
};
