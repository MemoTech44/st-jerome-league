import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; 
import logo from '../assets/logo.jpeg'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'News', path: '/news' },
    { name: 'Players', path: '/players' },
    { name: 'Fixtures', path: '/fixtures' },
    { name: 'Results', path: '/results' },
    { name: 'Table', path: '/table' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <style>{`
        .league-nav {
          position: fixed;
          top: 0; left: 0; width: 100%;
          z-index: 9999;
          background: #1e40af; 
          border-bottom: 3px solid #facc15; 
          padding: 10px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .nav-logo-img {
          width: 48px; height: 48px;
          border-radius: 6px;
          object-fit: cover;
          border: 2px solid #facc15;
        }

        .logo-main { 
          color: white; 
          font-weight: 900; 
          font-size: 1.3rem; 
          letter-spacing: -0.5px; 
          line-height: 1.1;
          display: flex; gap: 6px;
        }

        .logo-accent { color: #facc15; }

        .logo-sub { 
          color: rgba(255, 255, 255, 0.85); 
          font-size: 0.65rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 1.5px;
        }

        .nav-links-desktop { 
          display: flex; 
          gap: 18px; 
          align-items: center; 
        }

        .nav-link { 
          color: white; 
          text-decoration: none; 
          font-size: 0.75rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          transition: 0.3s;
        }

        .nav-link:hover, .nav-link.active { color: #facc15; }

        .nav-register {
          background: #facc15;
          color: #1e40af !important;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 900;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          z-index: 10001;
        }

        @media (max-width: 1100px) {
          .nav-links-desktop { display: none; }
          .menu-toggle { display: block; }

          .nav-links-mobile {
            position: fixed;
            top: 80px;
            right: 5%;
            width: 250px;
            background: #1e3a8a;
            border: 2px solid #facc15;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            padding: 20px;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10000;
            /* Animation starts here */
            animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          @keyframes slideIn {
            from { transform: scale(0.8) translateY(-20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }

          .nav-link-mobile {
            padding: 12px 15px;
            border-radius: 10px;
            color: white;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9rem;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }

          .nav-link-mobile:hover {
            background: rgba(250, 204, 21, 0.1);
            color: #facc15;
          }

          .nav-register-mobile {
            margin-top: 10px;
            background: #facc15;
            color: #1e40af;
            text-align: center;
          }
        }
      `}</style>

      <nav className="league-nav">
        <Link to="/" className="brand-container">
          <img src={logo} alt="League Logo" className="nav-logo-img" />
          <div className="league-logo-text">
            <div className="logo-main">
              <span>ST.</span> 
              <span>JEROME</span> 
              <span className="logo-accent">LEAGUE</span>
            </div>
            <span className="logo-sub">Connecting Generations</span>
          </div>
        </Link>

        {/* Desktop View */}
        <div className="nav-links-desktop">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
              {item.name}
            </Link>
          ))}
          <Link to="/register" className="nav-link nav-register">Register</Link>
        </div>

        {/* Hamburger Toggle */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
        
        {/* MOBILE POP-OUT BOX - Now conditionally rendered to prevent duplicates */}
        {isOpen && (
          <div className="nav-links-mobile">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={`nav-link-mobile ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/register" 
              className="nav-link-mobile nav-register-mobile"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;