import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const { status, loginWithGoogle } = useAuth();

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="landing-hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>Smart Scheduling Made Simple</span>
          </div>
          
          <h1 className="hero-title">
            Scheduling that just <span className="gradient-text">works</span>
          </h1>
          
          <p className="hero-description">
            Connect your Google Calendar and start sharing availability in seconds. 
            No back-and-forth emails, just seamless scheduling.
          </p>
          
          <div className="hero-cta">
            {status === "authenticated" ? (
              <Link className="cta-primary" to="/dashboard">
                Go to Dashboard
                <ArrowRight size={20} />
              </Link>
            ) : (
              <button className="cta-primary" onClick={loginWithGoogle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            )}
            <a href="#features" className="cta-secondary">
              Learn More
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="hero-stats">
            <div className="stat-item">
              <CheckCircle size={20} />
              <span>No credit card required</span>
            </div>
            <div className="stat-item">
              <CheckCircle size={20} />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">
              <Calendar size={24} />
            </div>
            <div className="card-content">
              <h4>Team Meeting</h4>
              <p>Today, 2:00 PM</p>
            </div>
          </div>
          
          <div className="floating-card card-2">
            <div className="card-icon">
              <Clock size={24} />
            </div>
            <div className="card-content">
              <h4>30 min slots</h4>
              <p>Available this week</p>
            </div>
          </div>
          
          <div className="floating-card card-3">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <h4>5 Meetings</h4>
              <p>Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section">
        <div className="features-header">
          <h2>Everything you need to schedule better</h2>
          <p>Powerful features to help you manage your time efficiently</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Calendar size={32} />
            </div>
            <h3>Smart Scheduling</h3>
            <p>Automatically sync with your Google Calendar and find the perfect time slots</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Clock size={32} />
            </div>
            <h3>Flexible Availability</h3>
            <p>Set your working hours and let others book time that works for both of you</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3>Team Collaboration</h3>
            <p>Manage multiple calendars and coordinate with your entire team seamlessly</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Instant Updates</h3>
            <p>Get real-time notifications for new bookings and schedule changes</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to simplify your scheduling?</h2>
          <p>Join thousands of professionals who trust Slotify for their scheduling needs</p>
          {status === "authenticated" ? (
            <Link className="cta-primary" to="/dashboard">
              Go to Dashboard
              <ArrowRight size={20} />
            </Link>
          ) : (
            <button className="cta-primary" onClick={loginWithGoogle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Get Started Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
