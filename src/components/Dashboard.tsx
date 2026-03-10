import React, { Suspense } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import { useDashboardStore } from "@/store";
import { WIDGET_REGISTRY, APP_STRINGS } from "@/constants";
import { BaseCard } from "./common";

export const Dashboard: React.FC = () => {
  const widgetOrder = useDashboardStore((state) => state.widgetOrder);

  // Filter registry based on user's active set
  const activeWidgets = widgetOrder
    .map((id) => WIDGET_REGISTRY.find((entry) => entry.id === id))
    .filter(Boolean) as typeof WIDGET_REGISTRY;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        align="center"
        color="primary.dark"
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

      <Grid container spacing={4} justifyContent="center">
        {activeWidgets.map((widget) => {
          const WidgetComponent = React.lazy(widget.component);

          return (
            <Grid item xs={12} md={6} key={widget.id}>
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
                {/* 
                  The generic dashboard container wraps each dynamic widget 
                  The widget manages its own state and settings through its config
                */}
                <WidgetComponent />
              </Suspense>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Dashboard;
