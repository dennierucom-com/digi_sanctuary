import React, { Suspense } from "react";
import { Box, Typography, Stack, Container } from "@mui/material";
import { useDashboardStore } from "@/store";
import { WIDGET_REGISTRY, APP_STRINGS } from "@/constants";
import { BaseCard, ThemeToggle } from "./common";

export const Dashboard: React.FC = () => {
  const widgetOrder = useDashboardStore((state) => state.widgetOrder);

  // Filter registry based on user's active set
  const activeWidgets = widgetOrder
    .map((id) => WIDGET_REGISTRY.find((entry) => entry.id === id))
    .filter(Boolean) as typeof WIDGET_REGISTRY;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -4, position: 'relative', zIndex: 1 }}>
        <ThemeToggle />
      </Box>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        align="center"
        color="primary"
        sx={{ mb: 1 }}
      >
        {APP_STRINGS.APP_NAME}
      </Typography>
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
          const WidgetComponent = React.lazy(widget.component);

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
                <WidgetComponent />
              </Suspense>
            </Box>
          );
        })}
      </Stack>
    </Container>
  );
};

export default Dashboard;
