import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Integrations", to: "/integration" },
  { label: "Notifications", to: "/notification" },
];

const Navbar = () => {
  const { user, status, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const handleHelpClick = () => {
    navigate("/settings");
  };

  const handleAuthClick = () => {
    if (status === "authenticated") {
      logout();
    } else {
      loginWithGoogle();
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <div className="logo-icon">
          <div className="monitor-frame">
            <div className="white-inner-border">
              <div className="screen-bezel">
                <div className="screen-content" />
              </div>
              <div className="power-indicator" />
            </div>
          </div>
        </div>
        <div className="logo-text">SLOTIFY</div>
      </div>

      <div className="nav-section">
        <nav className="nav-links">
          {status === "authenticated" &&
            navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        <div className="user-section">
          <button className="help-icon" onClick={handleHelpClick}>
            ?
          </button>
          <button className="auth-button" onClick={handleAuthClick}>
            {status === "authenticated" ? "Logout" : "Sign in"}
          </button>
          {status === "authenticated" && (
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || "User avatar"} />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
