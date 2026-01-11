import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthCallbackPage = () => {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const finalizeLogin = async () => {
      await refresh();
      navigate("/dashboard", { replace: true });
    };

    finalizeLogin();
  }, [refresh, navigate]);

  return (
    <div className="auth-callback-page">
      <h1>Signing you in...</h1>
      <p>Please wait while we finish connecting to your Slotify account.</p>
    </div>
  );
};

export default AuthCallbackPage;

