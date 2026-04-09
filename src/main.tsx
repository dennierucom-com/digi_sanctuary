import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Auto-update service worker polling every 60 minutes
registerSW({
  onNeedRefresh() {
    // We could show a prompt here, but vite-plugin-pwa is set to autoUpdate
  },
  onOfflineReady() {
    console.log("App is ready to work offline");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
