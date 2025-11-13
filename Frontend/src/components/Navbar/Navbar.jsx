import React, {useState} from 'react'
import './Navbar.css'
const Navbar = () => {
    const [activeLink, setActiveLink] = useState('null');

    const handleNavClick = (linkName) => {
        setActiveLink(linkName);
        console.log(`Navigated to: ${linkName}`);
    }

    const handleUserClick = () => {
        alert('User menu clicked!');
    }

    const handleHelpClick = () => {
        alert('Help center opened!');
    }

  return (
    <>
      <nav className="navbar">
        <div className="logo-section">
            <div className="logo-icon">
                <div className="monitor-frame">
                    <div className="white-inner-border">
                    <div className="screen-bezel">
                        <div className="screen-content"></div>
                    </div>
                    <div className="power-indicator"></div>
                </div>
                </div>
        </div>
        <div className="logo-text">SLOTIFY</div>
        </div>

        <div className="nav-section">
            <nav className="nav-links">
               <a
                href="#"
                className={`nav-link ${activeLink === 'Dashboard' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Dashboard');
                }}
               >
                Dashboard
                </a> 
                 <a 
              href="#" 
              className={`nav-link ${activeLink === 'Integrations' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Integrations');
              }}
            >
               Integrations
            </a>
            <a 
              href="#" 
              className={`nav-link ${activeLink === 'Help' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Help');
              }}
            >
               Help
            </a>
            </nav>

            <div className="user-section">
                <div className="help-icon" onClick={handleHelpClick}> 
                  ?
                </div>
                <div className="user-avatar" onClick={handleUserClick}>
                   S
                </div>
            </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
