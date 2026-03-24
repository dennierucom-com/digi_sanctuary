import React, { Suspense } from "react";
import {
  Box,
  Typography,
  Stack,
  Container,
  IconButton,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useDashboardStore } from "@/store";
import { WidgetContext } from "@/contexts/WidgetContext";
import { WIDGET_REGISTRY, APP_STRINGS } from "@/constants";
import { BaseCard } from "./common";

export const Dashboard: React.FC = () => {
  const widgetOrder = useDashboardStore((state) => state.widgetOrder);
  const expandedWidgetId = useDashboardStore((state) => state.expandedWidgetId);
  const setExpandedWidget = useDashboardStore(
    (state) => state.setExpandedWidget,
  );

  // Manage body scroll and Escape key logic
  React.useEffect(() => {
    if (expandedWidgetId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedWidgetId) {
        setExpandedWidget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedWidgetId, setExpandedWidget]);

  // Filter registry based on user's active set
  const activeWidgets = widgetOrder
    .map((id) => WIDGET_REGISTRY.find((entry) => entry.id === id))
    .filter(Boolean) as typeof WIDGET_REGISTRY;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        id="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "background.paper",
          borderRadius: "50px",
          p: 1,
          pl: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          mb: 4,
          mt: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <DashboardIcon sx={{ color: "text.primary", fontSize: 28 }} />
          <Typography
            variant="h6"
            component="h1"
            fontWeight={800}
            color="text.primary"
            sx={{ letterSpacing: "-0.5px" }}
          >
            {APP_STRINGS.APP_NAME}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ display: "flex" }}>
          {[
            { label: "All", icon: <WidgetsOutlinedIcon fontSize="small" /> },
            {
              label: "Recommended",
              icon: <ReceiptOutlinedIcon fontSize="small" />,
            },
            {
              label: "Favourites",
              icon: <StarBorderOutlinedIcon fontSize="small" />,
            },
          ].map((item) => (
            <Button
              key={item.label}
              variant="text"
              sx={{
                color: "text.primary",
                bgcolor: "background.default",
                borderRadius: "20px",
                px: { xs: 0, md: 2 },
                py: { xs: 1, md: 0.5 },
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                minWidth: { xs: "40px", md: "auto" },
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {item.icon}
              <Box
                component="span"
                sx={{ display: { xs: "none", md: "inline" }, ml: 1 }}
              >
                {item.label}
              </Box>
            </Button>
          ))}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "#d4ed31",
              color: "#000",
              borderRadius: "20px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              display: { xs: "none", sm: "block" },
              "&:hover": { bgcolor: "#c0d62a" },
            }}
          >
            Donate $$
          </Button>
          <IconButton
            size="large"
            aria-label="settings"
            sx={{
              bgcolor: "#000",
              color: "#fff",
              width: 48,
              height: 48,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Stack>
      </Box>
      <Typography
        variant="subtitle1"
        component="p"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        {APP_STRINGS.TAGLINE}
      </Typography>

      <Stack spacing={2} sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
        {activeWidgets.map((widget) => {
          const WidgetComponent = React.lazy(
            expandedWidgetId === widget.id ? widget.expanded : widget.compact
          );

          return (
            <Box key={widget.id}>
              <Suspense
                fallback={
                  <BaseCard
                    sx={{
                      minHeight: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      Loading {widget.title}...
                    </Typography>
                  </BaseCard>
                }
              >
                <WidgetContext.Provider value={widget.id}>
                  <WidgetComponent />
                </WidgetContext.Provider>
              </Suspense>
            </Box>
          );
        })}
      </Stack>
    </Container>
  );
};

export default Dashboard;
