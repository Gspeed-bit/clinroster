import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DefaultErrorFallback } from "./components/DefaultErrorFallback";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
