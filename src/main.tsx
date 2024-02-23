import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./components/Router.tsx";
import { StyledEngineProvider } from "@mui/material/styles";
const queryClient = new QueryClient();

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("../server/server.ts");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider>
          <RouterProvider router={router} />
        </StyledEngineProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
