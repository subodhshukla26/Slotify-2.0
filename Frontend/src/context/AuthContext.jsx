import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthContext = createContext({
  user: null,
  status: "idle",
  initialised: false,
  loginWithGoogle: () => {},
  logout: () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [initialised, setInitialised] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();
      setUser(data.user);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");
    } finally {
      setInitialised(true);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const loginWithGoogle = useCallback(() => {
    window.location.assign(`${API_URL}/auth/google`);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // swallow
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      initialised,
      loginWithGoogle,
      logout,
      refresh: fetchCurrentUser,
    }),
    [user, status, initialised, loginWithGoogle, logout, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

