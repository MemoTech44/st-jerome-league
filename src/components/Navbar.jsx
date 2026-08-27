import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; 
import logo from '../assets/logo.jpeg'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Executive', path: '/executive' },
    { name: 'News', path: '/news' },
    { name: 'Players', path: '/players' },
    { name: 'Fixtures', path: '/fixtures' },
    { name: 'Results', path: '/results' },
    { name: 'Table', path: '/table' },
    { name: 'Contact', path: '/contact' },
  ];

  // Close mobile nav when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .league-nav {
          position: fixed;
          top: 0; 
          left: 0; 
          width: 100%;
          z-index: 9999;
          background: rgba(6, 9, 19, 0.85); 
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(250, 204, 21, 0.4); 
          padding: 12px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .nav-logo-img {
          width: 44px; 
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #facc15;
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.3);
          transition: transform 0.3s ease;
        }

        .brand-container:hover .nav-logo-img {
          transform: scale(1.05);
        }

        .league-logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-main { 
          font-family: 'Bebas Neue', cursive;
          color: #ffffff; 
          font-size: 1.45rem; 
          letter-spacing: 1.5px; 
          line-height: 0.95;
          display: flex; 
          gap: 5px;
        }

        .logo-accent { color: #facc15; }

        .logo-sub { 
          font-family: 'Cinzel', serif;
          color: rgba(255, 255, 255, 0.75); 
          font-size: 0.55rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 2px;
          margin-top: 2px;
        }

        .nav-links-desktop { 
          display: flex; 
          gap: 16px; 
          align-items: center; 
        }

        .nav-link { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #cbd5e1; 
          text-decoration: none; 
          font-size: 0.75rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
          transition: all 0.25s ease;
          padding: 6px 4px;
          position: relative;
        }

        .nav-link:hover, .nav-link.active { 
          color: #facc15; 
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #facc15;
          border-radius: 2px;
        }

        .nav-register {
          background: rgba(15, 23, 42, 0.9);
          color: #facc15 !important;
          padding: 8px 18px;
          border-radius: 10px;
          font-weight: 800;
          border: 1px solid rgba(250, 204, 21, 0.6);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          transition: all 0.25s ease !important;
        }

        .nav-register:hover {
          background: rgba(250, 204, 21, 0.15);
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.2);
        }

        .nav-register.active::after {
          display: none;
        }

        .menu-toggle {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 6px;
          color: #facc15;
          cursor: pointer;
          z-index: 10001;
          transition: all 0.2s ease;
        }

        .menu-toggle:hover {
          background: rgba(250, 204, 21, 0.1);
        }

        /* MOBILE RESPONSIVE STYLES */
        @media (max-width: 960px) {
          .league-logo-text { 
            display: none !important; /* Hides text on mobile view */
          }
          
          .nav-links-desktop { 
            display: none; 
          }
          
          .menu-toggle { 
            display: flex; 
            align-items: center;
            justify-content: center;
          }

          .mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 9999;
          }

          .nav-links-mobile {
            position: fixed;
            top: 75px;
            right: 4%;
            width: 260px;
            background: #090e1a;
            border: 1px solid rgba(250, 204, 21, 0.3);
            border-radius: 18px;
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 4px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.8);
            z-index: 10000;
            animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slideIn {
            from { transform: translateY(-12px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }

          .nav-link-mobile {
            padding: 10px 14px;
            border-radius: 10px;
            color: #cbd5e1;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.2s ease;
          }

          .nav-link-mobile:hover, .nav-link-mobile.active {
            background: rgba(250, 204, 21, 0.1);
            color: #facc15;
          }

          .nav-register-mobile {
            margin-top: 8px;
            background: rgba(15, 23, 42, 0.9);
            color: #facc15;
            text-align: center;
            border: 1px solid #facc15;
            font-weight: 800;
          }

          .nav-register-mobile:hover {
            background: rgba(250, 204, 21, 0.2);
            color: #ffffff;
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

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          <Link to="/register" className="nav-link nav-register">Register</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        
        {/* Mobile Drawer & Overlay */}
        {isOpen && (
          <>
            <div className="mobile-backdrop" onClick={() => setIsOpen(false)} />
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
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;