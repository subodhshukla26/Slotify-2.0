import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { status, initialised } = useAuth();
  const location = useLocation();

  if (!initialised || status === "loading" || status === "idle") {
    return (
      <div className="route-guard-message">
        <p>Checking your session...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

