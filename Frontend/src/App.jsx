import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AppointmentPage from "./pages/AppointmentPage";
import NotificationPage from "./pages/NotificationPage";
import SettingsPage from "./pages/SettingsPage";
import IntegrationPage from "./pages/IntegrationPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import BookingPage from "./pages/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VideoRoom from "./components/VideoCall/VideoRoom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/book/:eventId" element={<BookingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videocall"
          element={
            <ProtectedRoute>
              <VideoRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <AppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/integration"
          element={
            <ProtectedRoute>
              <IntegrationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
